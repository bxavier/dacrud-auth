import mongoose from 'mongoose';
import { LoggerService } from './logger';
import config from './config';

const logger = new LoggerService('Database');

/**
 * Initialize database connection
 */
export const connectDatabase = (): void => {
  const missingConfigs = [];

  if (!config.MONGO_PATH) missingConfigs.push('MONGO_PATH');
  if (!config.MONGO_DATABASE) missingConfigs.push('MONGO_DATABASE');
  if (!config.MONGO_USER) missingConfigs.push('MONGO_USER');
  if (!config.MONGO_PASSWORD) missingConfigs.push('MONGO_PASSWORD');

  if (missingConfigs.length > 0) {
    logger.error(`Missing required database configuration: ${missingConfigs.join(', ')}`);
    process.exit(1);
  }

  const mongoURI = config.getMongoURI();

  const connectWithRetry = (retries = 5, delay = 5000) => {
    logger.info('Attempting MongoDB connection...');
    mongoose
      .connect(mongoURI, {
        authSource: 'admin',
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 10000,
        maxPoolSize: 10,
        family: 4,
      })
      .catch((err) => {
        if (retries === 0) {
          logger.error(`Failed to connect to MongoDB: ${err.message}`);
          process.exit(1);
        }
        logger.warn(`Connection failed, retrying in ${delay / 1000}s... (${retries} attempts remaining)`);
        setTimeout(() => connectWithRetry(retries - 1, delay), delay);
      });
  };

  connectWithRetry();

  mongoose.connection.on('connected', () => {
    logger.info(`Connected to database ${config.MONGO_DATABASE} successfully`);
  });

  mongoose.connection.on('error', (error) => {
    logger.error(`Database connection error: ${error.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('Database disconnected');
  });

  process.on('SIGINT', () => {
    mongoose.connection.close().then(() => {
      logger.info('Database connection closed due to app termination');
      process.exit(0);
    });
  });
};

export default connectDatabase;
