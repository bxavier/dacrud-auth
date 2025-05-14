import { cleanEnv, str, port, bool, num } from 'envalid';
import path from 'path';
import fs from 'fs';

class Config {
  public NODE_ENV: string;
  public PORT: number;
  public MONGO_PATH: string;
  public MONGO_USER: string;
  public MONGO_PASSWORD: string;
  public MONGO_DATABASE: string;
  public JWT_SECRET: string;
  public JWT_EXPIRES_IN: string;
  public JWT_REFRESH_EXPIRES_IN: string;
  public APP_URL: string;
  public SMTP_HOST: string;
  public SMTP_PORT: number;
  public SMTP_SECURE: boolean;
  public SMTP_USER: string;
  public SMTP_PASSWORD: string;
  public EMAIL_FROM: string;
  public RATE_LIMIT_WINDOW: number;
  public RATE_LIMIT_MAX: number;
  public AUTH_RATE_LIMIT_WINDOW: number;
  public AUTH_RATE_LIMIT_MAX: number;
  public LOG_LEVEL: string;

  constructor() {
    this.loadEnvFile();

    const env = cleanEnv(process.env, {
      NODE_ENV: str({ choices: ['development', 'test', 'production'], default: 'development' }),
      PORT: port({ default: 3000 }),
      MONGO_PATH: str(),
      MONGO_USER: str(),
      MONGO_PASSWORD: str(),
      MONGO_DATABASE: str(),
      JWT_SECRET: str(),
      JWT_EXPIRES_IN: str({ default: '1h' }),
      JWT_REFRESH_EXPIRES_IN: str({ default: '7d' }),
      APP_URL: str({ default: 'http://localhost:3000' }),
      SMTP_HOST: str({ default: 'smtp.ethereal.email' }),
      SMTP_PORT: port({ default: 587 }),
      SMTP_SECURE: bool({ default: false }),
      SMTP_USER: str({ default: '' }),
      SMTP_PASSWORD: str({ default: '' }),
      EMAIL_FROM: str({ default: 'noreply@example.com' }),
      RATE_LIMIT_WINDOW: num({ default: 15 * 60 * 1000 }), // 15 minutes in milliseconds
      RATE_LIMIT_MAX: num({ default: 100 }), // 100 requests per window
      AUTH_RATE_LIMIT_WINDOW: num({ default: 60 * 60 * 1000 }), // 1 hour in milliseconds
      AUTH_RATE_LIMIT_MAX: num({ default: 10 }), // 10 requests per window
      LOG_LEVEL: str({ choices: ['error', 'warn', 'info', 'http', 'debug'], default: 'info' }),
    });

    this.NODE_ENV = env.NODE_ENV;
    this.PORT = env.PORT;
    this.MONGO_PATH = env.MONGO_PATH;
    this.MONGO_USER = env.MONGO_USER;
    this.MONGO_PASSWORD = env.MONGO_PASSWORD;
    this.MONGO_DATABASE = env.MONGO_DATABASE;
    this.JWT_SECRET = env.JWT_SECRET;
    this.JWT_EXPIRES_IN = env.JWT_EXPIRES_IN;
    this.JWT_REFRESH_EXPIRES_IN = env.JWT_REFRESH_EXPIRES_IN;
    this.APP_URL = env.APP_URL;
    this.SMTP_HOST = env.SMTP_HOST;
    this.SMTP_PORT = env.SMTP_PORT;
    this.SMTP_SECURE = env.SMTP_SECURE;
    this.SMTP_USER = env.SMTP_USER;
    this.SMTP_PASSWORD = env.SMTP_PASSWORD;
    this.EMAIL_FROM = env.EMAIL_FROM;
    this.RATE_LIMIT_WINDOW = env.RATE_LIMIT_WINDOW;
    this.RATE_LIMIT_MAX = env.RATE_LIMIT_MAX;
    this.AUTH_RATE_LIMIT_WINDOW = env.AUTH_RATE_LIMIT_WINDOW;
    this.AUTH_RATE_LIMIT_MAX = env.AUTH_RATE_LIMIT_MAX;
    this.LOG_LEVEL = env.LOG_LEVEL;
  }

  private loadEnvFile(): void {
    const nodeEnv = process.env.NODE_ENV || 'development';
    const envFiles = [
      path.resolve(process.cwd(), '.env'),
      path.resolve(process.cwd(), `.env.${nodeEnv}`),
      path.resolve(process.cwd(), `.env.${nodeEnv}.local`),
    ];

    // Load env files in order (later files override earlier ones)
    envFiles.forEach((filePath) => {
      if (fs.existsSync(filePath)) {
        require('dotenv').config({ path: filePath });
      }
    });
  }

  public getMongoURI(): string {
    return `mongodb://${this.MONGO_USER}:${this.MONGO_PASSWORD}@${this.MONGO_PATH}/${this.MONGO_DATABASE}`;
  }

  public isProduction(): boolean {
    return this.NODE_ENV === 'production';
  }

  public isTest(): boolean {
    return this.NODE_ENV === 'test';
  }

  public isDevelopment(): boolean {
    return this.NODE_ENV === 'development';
  }

  public getEnvironment(): string {
    return this.NODE_ENV;
  }
}

export default new Config();
