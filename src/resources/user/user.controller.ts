import { Router, Request, Response, NextFunction } from 'express';
import IController from '@/utils/interfaces/controller.interface';
import UserService from './user.service';
import validationMiddleware from '@/middlewares/validation.middleware';
import userValidation from './user.validation';
import authenticationMiddleware from '@/middlewares/authenticated.middleware';
import { UnauthorizedException } from '@/utils/exceptions';

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: JWT token for authentication. Use the token from login or register response.
 */

class UserController implements IController {
  public path = '/users';
  public router: Router;
  private userService: UserService;

  constructor() {
    this.router = Router();
    this.userService = new UserService();
    this.initializeRoutes();
    0;
  }

  private initializeRoutes(): void {
    this.router.post(`${this.path}/register`, validationMiddleware(userValidation.user), this.register);
    this.router.post(`${this.path}/login`, validationMiddleware(userValidation.login), this.login);
    this.router.post(`${this.path}/activate`, validationMiddleware(userValidation.activate), this.activate);
    this.router.post(`${this.path}/resend-activation`, validationMiddleware(userValidation.resendActivation), this.resendActivation);
    this.router.get(`${this.path}`, authenticationMiddleware, this.getUser);
  }

  /**
   * @openapi
   * /users/register:
   *   post:
   *     summary: Create user
   *     tags: [Users]
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
      await this.userService.register(name, email, password, role);
      res.status(201).json({
        message: 'User registered successfully. Please check your email to activate your account.',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @openapi
   * /users/login:
   *   post:
   *     summary: Login user
   *     tags: [Users]
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
      const token = await this.userService.login(email, password);
      res.status(200).json({ token });
    } catch (error) {
      next(error);
    }
  };

  /**
   * @openapi
   * /users:
   *   get:
   *     summary: Get authenticated user information
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: User information retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 user:
   *                   type: object
   *                   properties:
   *                     _id:
   *                       type: string
   *                     name:
   *                       type: string
   *                     email:
   *                       type: string
   *                     role:
   *                       type: string
   *                     createdAt:
   *                       type: string
   *                     updatedAt:
   *                       type: string
   *       401:
   *         description: Unauthorized - Invalid or missing token
   *       403:
   *         description: Forbidden - Valid token but insufficient permissions
   */
  private getUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      return next(new UnauthorizedException('Unauthorized'));
    }
    res.status(200).json({ user: req.user });
  };

  /**
   * @openapi
   * /users/activate:
   *   post:
   *     summary: Activate user account
   *     tags: [Users]
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
      const user = await this.userService.activate(token);
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
   * /users/resend-activation:
   *   post:
   *     summary: Resend activation email
   *     tags: [Users]
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
      await this.userService.resendActivation(email);
      res.status(200).json({
        message: 'Activation email sent successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}

export default UserController;
