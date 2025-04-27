import { cleanEnv, str, port, bool } from 'envalid';

/**
 * Configuration service that loads and validates environment variables
 */
class Config {
  public NODE_ENV: string;
  public PORT: number;
  public MONGO_PATH: string;
  public MONGO_USER: string;
  public MONGO_PASSWORD: string;
  public MONGO_DATABASE: string;
  public JWT_SECRET: string;
  public JWT_EXPIRES_IN: string;
  public APP_URL: string;
  public SMTP_HOST: string;
  public SMTP_PORT: number;
  public SMTP_SECURE: boolean;
  public SMTP_USER: string;
  public SMTP_PASSWORD: string;
  public EMAIL_FROM: string;

  constructor() {
    const env = cleanEnv(process.env, {
      NODE_ENV: str({ choices: ['development', 'production'], default: 'development' }),
      PORT: port({ default: 3000 }),
      MONGO_PATH: str(),
      MONGO_USER: str(),
      MONGO_PASSWORD: str(),
      MONGO_DATABASE: str(),
      JWT_SECRET: str(),
      JWT_EXPIRES_IN: str(),
      APP_URL: str({ default: 'http://localhost:3000' }),
      SMTP_HOST: str({ default: 'smtp.ethereal.email' }),
      SMTP_PORT: port({ default: 587 }),
      SMTP_SECURE: bool({ default: false }),
      SMTP_USER: str({ default: '' }),
      SMTP_PASSWORD: str({ default: '' }),
      EMAIL_FROM: str({ default: 'noreply@example.com' }),
    });

    this.NODE_ENV = env.NODE_ENV;
    this.PORT = env.PORT;
    this.MONGO_PATH = env.MONGO_PATH;
    this.MONGO_USER = env.MONGO_USER;
    this.MONGO_PASSWORD = env.MONGO_PASSWORD;
    this.MONGO_DATABASE = env.MONGO_DATABASE;
    this.JWT_SECRET = env.JWT_SECRET;
    this.JWT_EXPIRES_IN = env.JWT_EXPIRES_IN;
    this.APP_URL = env.APP_URL;
    this.SMTP_HOST = env.SMTP_HOST;
    this.SMTP_PORT = env.SMTP_PORT;
    this.SMTP_SECURE = env.SMTP_SECURE;
    this.SMTP_USER = env.SMTP_USER;
    this.SMTP_PASSWORD = env.SMTP_PASSWORD;
    this.EMAIL_FROM = env.EMAIL_FROM;
  }

  /**
   * Get MongoDB connection string
   */
  public getMongoURI(): string {
    return `mongodb://${this.MONGO_USER}:${this.MONGO_PASSWORD}@${this.MONGO_PATH}/${this.MONGO_DATABASE}`;
  }

  /**
   * Check if the app is running in production mode
   */
  public isProduction(): boolean {
    return this.NODE_ENV === 'production';
  }
}

export default new Config();
