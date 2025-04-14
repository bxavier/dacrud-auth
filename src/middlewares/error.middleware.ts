import { Request, Response, NextFunction } from 'express';
import { ApiException } from '@/utils/exceptions';
import { LoggerService } from '@/utils/logger';

const logger = new LoggerService('ErrorMiddleware');
const errorMiddleware = (error: Error, request: Request, response: Response, next: NextFunction): void => {
  if (error instanceof ApiException) {
    const status = error.status;
    const message = error.message;
    const errors = error.errors;
    const code = error.code || `ERROR_${status}`;

    logger.error(`[${code}] ${status}: ${message}`);

    response.status(status).json({
      status,
      message,
      code,
      ...(errors && { errors }),
    });
  } else {
    logger.error(`[UNHANDLED_ERROR] 500: ${error.message}`);
    logger.error(error.stack || 'No stack trace available');

    response.status(500).json({
      status: 500,
      message: 'Internal server error',
      code: 'SERVER_ERROR',
    });
  }
};

export default errorMiddleware;
