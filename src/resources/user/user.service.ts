import UserModel from '@/shared/models/user.model';
import { IUser } from '@/shared/interfaces/user.interface';
import { NotFoundException, ServerException, UnauthorizedException } from '@/core/exceptions';
import { LoggerService } from '@/core/logger';

class UserService {
  logger = new LoggerService('UserService');

  /**
   * Get user by ID
   * @param userId User ID to retrieve
   */
  public async getUserById(userId: string): Promise<IUser> {
    try {
      const user = await UserModel.findById(userId);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.logger.error(`Get user error: ${error instanceof Error ? error.message : String(error)}`);
      throw new ServerException('Unable to retrieve user information');
    }
  }

  /**
   * Get user by email
   * @param email User email to retrieve
   */
  public async getUserByEmail(email: string): Promise<IUser> {
    try {
      const user = await UserModel.findOne({ email });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.logger.error(`Get user by email error: ${error instanceof Error ? error.message : String(error)}`);
      throw new ServerException('Unable to retrieve user information');
    }
  }
}

export default UserService;
