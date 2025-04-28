import { Request, Response, NextFunction } from 'express';
import { ApiException } from '@/utils/exceptions';
import { LoggerService } from '@/utils/logger';
import mongoose from 'mongoose';
import config from '@/utils/config';

const logger = new LoggerService('ErrorMiddleware');
const errorMiddleware = (error: Error, request: Request, response: Response, next: NextFunction): void => {
  // Handle API exceptions (custom errors)
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
    return;
  }

  // Handle Mongoose validation errors
  if (error instanceof mongoose.Error.ValidationError) {
    const errors = Object.keys(error.errors).reduce(
      (acc, key) => ({
        ...acc,
        [key]: error.errors[key].message,
      }),
      {}
    );

    logger.error(`[VALIDATION_ERROR] 400: ${error.message}`);

    response.status(400).json({
      status: 400,
      message: 'Validation error',
      code: 'VALIDATION_ERROR',
      errors,
    });
    return;
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (error instanceof mongoose.Error.CastError) {
    logger.error(`[INVALID_ID] 400: ${error.message}`);

    response.status(400).json({
      status: 400,
      message: `Invalid ${error.path}: ${error.value}`,
      code: 'INVALID_ID',
    });
    return;
  }

  // Handle duplicate key errors from MongoDB
  if (error.name === 'MongoServerError' && (error as any).code === 11000) {
    const keyValue = (error as any).keyValue;
    const field = Object.keys(keyValue)[0];
    const value = keyValue[field];

    logger.error(`[DUPLICATE_KEY] 400: Duplicate ${field}`);

    response.status(400).json({
      status: 400,
      message: `${field} "${value}" already exists`,
      code: 'DUPLICATE_KEY',
    });
    return;
  }

  // Handle all other errors
  logger.error(`[UNHANDLED_ERROR] 500: ${error.message}`);
  logger.error(error.stack || 'No stack trace available');

  response.status(500).json({
    status: 500,
    message: 'Internal server error',
    code: 'SERVER_ERROR',
    // Include error details in non-production environments
    ...(config.isProduction() ? {} : { error: error.message, stack: error.stack }),
  });
};

export default errorMiddleware;
