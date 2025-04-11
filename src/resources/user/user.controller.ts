import { Router, Request, Response, NextFunction } from 'express';
import IController from '@/utils/interfaces/controller.interface';
import UserService from './user.service';
import validationMiddleware from '@/middlewares/validation.middleware';
import userValidation, { user } from './user.validation';
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
  }

  private initializeRoutes(): void {
    this.router.post(`${this.path}/register`, validationMiddleware(userValidation.user), this.register);
    this.router.post(`${this.path}/login`, validationMiddleware(userValidation.login), this.login);
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
   *         description: User created successfully
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
  private register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, email, password, role = 'user' } = req.body;
      const token = await this.userService.register(name, email, password, role);
      res.status(201).json({ token });
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
}

export default UserController;
