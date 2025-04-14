import UserModel from './user.model';
import { User } from './user.interface';
import { ConflictException, NotFoundException, ServerException, UnauthorizedException } from '@/utils/exceptions';
import token from '@/utils/token';
import { LoggerService } from '@/utils/logger';

class UserService {
  logger = new LoggerService('UserService');
  /**
   * Register a new user
   */
  public async register(name: string, email: string, password: string, role: string): Promise<string> {
    try {
      const user = await UserModel.create({ name, email, password, role });
      const accessToken = await token.createToken(user);

      return accessToken;
    } catch (error: any) {
      if (error.code === 11000) {
        throw new ConflictException('User with this email already exists');
      }
      throw new ServerException('Unable to create user');
    }
  }

  /**
   * Login a user
   */
  public async login(email: string, password: string): Promise<string> {
    try {
      if (!email || !password) {
        throw new UnauthorizedException('Email and password are required');
      }

      const user = await UserModel.findOne({ email });

      if (!user) {
        this.logger.warn(`Login attempt failed: User with email ${email} not found`);
        throw new UnauthorizedException('Invalid email or password');
      }

      const isPasswordValid = await user.isValidPassword(password);

      if (!isPasswordValid) {
        this.logger.warn(`Login attempt failed: Invalid password for user ${email}`);
        throw new UnauthorizedException('Invalid email or password');
      }

      return await token.createToken(user);
    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }

      this.logger.error(`Login error: ${error instanceof Error ? error.message : String(error)}`);
      this.logger.error(`Stack trace: ${error instanceof Error ? error.stack : 'No stack trace'}`);

      throw new ServerException('Unable to login');
    }
  }
}

export default UserService;
