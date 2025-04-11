import winston from 'winston';

// Type for log levels
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
    // Define log levels
    const levels = {
      error: 0,
      warn: 1,
      info: 2,
      http: 3,
      debug: 4,
    };

    // Define level based on environment
    const level = () => {
      const env = process.env.NODE_ENV || 'development';
      return env === 'development' ? 'debug' : 'warn';
    };

    // Define colors for each level
    const colors = {
      error: 'red',
      warn: 'yellow',
      info: 'green',
      http: 'magenta',
      debug: 'blue',
    };

    // Add colors to Winston
    winston.addColors(colors);

    // Define the format
    const format = winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
      winston.format.colorize({ all: false }),
      winston.format.printf((info) => {
        // Make only the message white while preserving level colors
        const source = info.source ? `[${info.source}]` : '';
        return `[${info.timestamp}] [${info.level}]${source} -> \x1b[37m${info.message}\x1b[0m`;
      })
    );

    // Define transports
    const transports = [
      new winston.transports.Console(),
      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
      }),
      new winston.transports.File({ filename: 'logs/all.log' }),
    ];

    // Create and return the logger
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
