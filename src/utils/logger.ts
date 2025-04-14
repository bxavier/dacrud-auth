import winston from 'winston';

export type LogLevel = 'error' | 'warn' | 'info' | 'http' | 'debug';

/**
 * Logger service
 */
export class LoggerService {
  private source: string;
  private logger: winston.Logger;

  constructor(source: string) {
    this.source = source;
    this.logger = this.createLogger();
  }

  private createLogger(): winston.Logger {
    const levels = {
      error: 0,
      warn: 1,
      info: 2,
      http: 3,
      debug: 4,
    };

    const level = () => {
      const env = process.env.NODE_ENV || 'development';
      return env === 'development' ? 'debug' : 'warn';
    };

    const colors = {
      error: 'red',
      warn: 'yellow',
      info: 'green',
      http: 'magenta',
      debug: 'blue',
    };

    winston.addColors(colors);

    const format = winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
      winston.format.colorize({ all: false }),
      winston.format.printf((info) => {
        const source = info.source ? `[${info.source}]` : '';
        return `[${info.timestamp}] [${info.level}]${source} -> \x1b[37m${info.message}\x1b[0m`;
      })
    );

    const transports = [
      new winston.transports.Console(),
      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
      }),
      new winston.transports.File({ filename: 'logs/all.log' }),
    ];

    return winston.createLogger({
      level: level(),
      levels,
      format,
      transports,
    });
  }

  private logWithSource(level: LogLevel, message: string): void {
    this.logger.log({
      level,
      message,
      source: this.source,
    });
  }

  info(message: string): void {
    this.logWithSource('info', message);
  }

  error(message: string): void {
    this.logWithSource('error', message);
  }

  warn(message: string): void {
    this.logWithSource('warn', message);
  }

  http(message: string): void {
    this.logWithSource('http', message);
  }

  debug(message: string): void {
    this.logWithSource('debug', message);
  }
}
