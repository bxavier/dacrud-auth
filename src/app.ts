import express, { Application } from 'express';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import Controller from '@/utils/interfaces/controller.interface';
import ErrorMiddleware from '@/middlewares/error.middleware';
import helmet from 'helmet';
import connectDatabase from '@/utils/database';
import { LoggerService } from '@/utils/logger';
import config from '@/utils/config';
import { setupSwagger } from '@/utils/swagger';

class App {
  public express: Application;
  public port: number;
  private logger = new LoggerService('App');

  constructor(controllers: Controller[]) {
    this.express = express();
    this.port = config.PORT;

    this.initializeDatabaseConnection();
    this.initializeMiddleware();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
    this.initializeSwagger();
  }

  private initializeMiddleware(): void {
    this.express.use(helmet());
    this.express.use(cors());

    morgan.token('timestamp', () => {
      const now = new Date();
      const datePart = now.toISOString().replace('T', ' ').replace('Z', '').split('.')[0];
      const ms = String(now.getMilliseconds()).padStart(4, '0');
      return datePart + ':' + ms;
    });

    // Custom morgan format to match winston style with colored http label (magenta)
    const morganFormat = '[:timestamp] [\x1b[35mhttp\x1b[0m] -> :method :url :status - :response-time ms';

    this.express.use(morgan(morganFormat));
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: false }));
    this.express.use(compression());
  }

  private initializeControllers(controllers: Controller[]): void {
    controllers.forEach((controller) => {
      this.express.use('/api/v1', controller.router);
    });
  }

  private initializeErrorHandling(): void {
    this.express.use(ErrorMiddleware);
  }

  private initializeDatabaseConnection(): void {
    connectDatabase();
  }

  private initializeSwagger(): void {
    setupSwagger(this.express);
  }

  public listen(): void {
    this.express.listen(this.port, () => {
      this.logger.info(`App listening on port ${this.port}`);
    });
  }
}

export default App;
