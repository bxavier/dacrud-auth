import UserModel from './models/user.model';
import { IUser } from '@/shared/interfaces/user.interface';
import { ConflictException, NotFoundException, ServerException, UnauthorizedException, BadRequestException } from '@/utils/exceptions';
import token from '@/utils/token';
import { LoggerService } from '@/utils/logger';
import emailService from '@/utils/email';

class AuthService {
  private logger = new LoggerService('AuthService');
  private readonly RESET_TOKEN_EXPIRES_MINUTES = 30;

  /**
   * Register a new user
   */
  public async register(name: string, email: string, password: string, role: string): Promise<void> {
    try {
      const activationToken = token.generateActivationToken();

      const user = await UserModel.create({
        name,
        email,
        password,
        role,
        activationToken,
        isActive: false,
      });

      await emailService.sendActivationEmail(email, name, activationToken);

      this.logger.info(`User ${email} registered successfully. Activation email sent.`);
    } catch (error: any) {
      if (error.code === 11000) {
        throw new ConflictException('User with this email already exists');
      }
      this.logger.error(`Register error: ${error instanceof Error ? error.message : String(error)}`);
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

      if (!user.isActive) {
        this.logger.warn(`Login attempt failed: User ${email} is not activated`);
        throw new UnauthorizedException('Please activate your account first. Check your email for activation instructions.');
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

  /**
   * Activate a user account
   * @param activationToken The token sent to the user's email
   */
  public async activate(activationToken: string): Promise<IUser> {
    try {
      // Find user with the provided activation token
      const user = await UserModel.findOne({ activationToken });

      if (!user) {
        this.logger.warn(`Activation failed: Invalid token ${activationToken}`);
        throw new NotFoundException('Invalid activation token');
      }

      // Activate the user
      user.isActive = true;
      user.activationToken = null; // Clear the token for security
      await user.save();

      this.logger.info(`User ${user.email} activated successfully`);
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.logger.error(`Activation error: ${error instanceof Error ? error.message : String(error)}`);
      throw new ServerException('Unable to activate account');
    }
  }

  /**
   * Resend activation email
   * @param email The user's email
   */
  public async resendActivation(email: string): Promise<void> {
    try {
      const user = await UserModel.findOne({ email });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (user.isActive) {
        throw new ConflictException('Account is already activated');
      }

      // Generate new activation token
      const activationToken = token.generateActivationToken();
      user.activationToken = activationToken;
      await user.save();

      // Send new activation email
      await emailService.sendActivationEmail(user.email, user.name, activationToken);

      this.logger.info(`Activation email resent to ${email}`);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }

      this.logger.error(`Resend activation error: ${error instanceof Error ? error.message : String(error)}`);
      throw new ServerException('Unable to resend activation email');
    }
  }

  /**
   * Initiate the forgot password process
   * @param email User's email address
   */
  public async forgotPassword(email: string): Promise<void> {
    try {
      // Find user with the provided email
      const user = await UserModel.findOne({ email });

      if (!user) {
        // We don't want to reveal if an email exists in our database for security
        this.logger.warn(`Forgot password requested for non-existent email: ${email}`);
        return; // Return silently to prevent user enumeration attacks
      }

      // Generate reset token
      const resetToken = token.generateActivationToken();

      // Set token expiration (30 minutes from now)
      const resetTokenExpires = new Date();
      resetTokenExpires.setMinutes(resetTokenExpires.getMinutes() + this.RESET_TOKEN_EXPIRES_MINUTES);

      // Save token and expiration to user
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = resetTokenExpires;
      await user.save();

      // Send reset email
      await emailService.sendPasswordResetEmail(user.email, user.name, resetToken, this.RESET_TOKEN_EXPIRES_MINUTES);

      this.logger.info(`Password reset email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Forgot password error: ${error instanceof Error ? error.message : String(error)}`);
      throw new ServerException('Unable to process forgot password request');
    }
  }

  /**
   * Reset a user's password with the provided token
   * @param token Reset password token
   * @param newPassword New password
   */
  public async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      // Find user with the provided token and check if it's expired
      const user = await UserModel.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: new Date() }, // Only valid if expiration is after current time
      });

      if (!user) {
        this.logger.warn(`Password reset failed: Invalid or expired token ${token}`);
        throw new BadRequestException('Password reset token is invalid or has expired');
      }

      // Update password and clear reset token fields
      user.password = newPassword;
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;

      await user.save();

      this.logger.info(`Password reset successful for user ${user.email}`);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      this.logger.error(`Reset password error: ${error instanceof Error ? error.message : String(error)}`);
      throw new ServerException('Unable to reset password');
    }
  }
}

export default AuthService;
