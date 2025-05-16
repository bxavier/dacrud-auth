import { Router, Request, Response, NextFunction } from 'express';
import IController from '@/shared/interfaces/controller.interface';
import AuthService from './auth.service';
import validationMiddleware from '@/middlewares/validation.middleware';
import authValidation from './auth.validation';
import { LoggerService } from '@/core/logger';

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: JWT token for authentication. Use the token from login response.
 */

class AuthController implements IController {
  public path = '/auth';
  public router: Router;
  private authService: AuthService;
  private logger = new LoggerService('AuthController');

  constructor() {
    this.router = Router();
    this.authService = new AuthService();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(`${this.path}/register`, validationMiddleware(authValidation.register), this.register);
    this.router.post(`${this.path}/login`, validationMiddleware(authValidation.login), this.login);
    this.router.post(`${this.path}/activate`, validationMiddleware(authValidation.activate), this.activate);
    this.router.post(`${this.path}/resend-activation`, validationMiddleware(authValidation.resendActivation), this.resendActivation);
    this.router.post(`${this.path}/forgot-password`, validationMiddleware(authValidation.forgotPassword), this.forgotPassword);
    this.router.post(`${this.path}/reset-password`, validationMiddleware(authValidation.resetPassword), this.resetPassword);
  }

  /**
   * @openapi
   * /auth/register:
   *   post:
   *     summary: Create user
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - email
   *               - password
   *             properties:
   *               name:
   *                 type: string
   *               email:
   *                 type: string
   *                 format: email
   *               password:
   *                 type: string
   *                 format: password
   *               role:
   *                 type: string
   *                 enum:
   *                   - user
   *                   - admin
   *     responses:
   *       201:
   *         description: User created successfully. Activation email sent.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *       400:
   *         description: Bad request
   */
  private register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, email, password, role = 'user' } = req.body;
      await this.authService.register(name, email, password, role);
      res.status(201).json({
        message: 'User registered successfully. Please check your email to activate your account.',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @openapi
   * /auth/login:
   *   post:
   *     summary: Login user
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *               password:
   *                 type: string
   *                 format: password
   *     responses:
   *       200:
   *         description: Login successful
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 token:
   *                   type: string
   *       400:
   *         description: Bad request
   */
  private login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;
      const token = await this.authService.login(email, password);
      res.status(200).json({ token });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @openapi
   * /auth/activate:
   *   post:
   *     summary: Activate user account
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - token
   *             properties:
   *               token:
   *                 type: string
   *                 description: Activation token received via email
   *     responses:
   *       200:
   *         description: Account activated successfully
   *       400:
   *         description: Bad request - Invalid token format
   *       404:
   *         description: Not found - Invalid activation token
   *       500:
   *         description: Server error - Unable to activate account
   */
  private activate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { token } = req.body;
      const user = await this.authService.activate(token);
      res.status(200).json({
        message: 'Account activated successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @openapi
   * /auth/resend-activation:
   *   post:
   *     summary: Resend activation email
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *     responses:
   *       200:
   *         description: Activation email sent successfully
   *       400:
   *         description: Bad request - Invalid email format
   *       404:
   *         description: Not found - User not found
   *       409:
   *         description: Conflict - Account already activated
   *       500:
   *         description: Server error - Unable to send activation email
   */
  private resendActivation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email } = req.body;
      await this.authService.resendActivation(email);
      res.status(200).json({
        message: 'Activation email sent successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @openapi
   * /auth/forgot-password:
   *   post:
   *     summary: Request a password reset
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *     responses:
   *       200:
   *         description: Password reset instructions sent if email exists
   *       500:
   *         description: Server error - Unable to process request
   */
  private forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email } = req.body;
      await this.authService.forgotPassword(email);

      // We always return success, even if email doesn't exist (security best practice)
      res.status(200).json({
        message: 'If your email is registered in our system, you will receive password reset instructions shortly.',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @openapi
   * /auth/reset-password:
   *   post:
   *     summary: Reset password using token
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - token
   *               - password
   *               - confirmPassword
   *             properties:
   *               token:
   *                 type: string
   *                 description: Token received via email
   *               password:
   *                 type: string
   *                 format: password
   *                 minLength: 6
   *               confirmPassword:
   *                 type: string
   *                 format: password
   *                 minLength: 6
   *     responses:
   *       200:
   *         description: Password successfully reset
   *       400:
   *         description: Bad request - Invalid token or passwords don't match
   *       500:
   *         description: Server error - Unable to reset password
   */
  private resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { token, password } = req.body;
      await this.authService.resetPassword(token, password);

      res.status(200).json({
        message: 'Password has been reset successfully. You can now log in with your new password.',
      });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
