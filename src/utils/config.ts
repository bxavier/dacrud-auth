import { cleanEnv, str, port } from 'envalid';

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
    });

    this.NODE_ENV = env.NODE_ENV;
    this.PORT = env.PORT;
    this.MONGO_PATH = env.MONGO_PATH;
    this.MONGO_USER = env.MONGO_USER;
    this.MONGO_PASSWORD = env.MONGO_PASSWORD;
    this.MONGO_DATABASE = env.MONGO_DATABASE;
    this.JWT_SECRET = env.JWT_SECRET;
    this.JWT_EXPIRES_IN = env.JWT_EXPIRES_IN;
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
