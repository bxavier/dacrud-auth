import { Router, Request, Response, NextFunction } from 'express';
import IController from '@/shared/interfaces/controller.interface';
import UserService from './user.service';
import authenticationMiddleware from '@/middlewares/authenticated.middleware';
import { UnauthorizedException } from '@/core/exceptions';
import { LoggerService } from '@/core/logger';

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
  private logger = new LoggerService('UserController');

  constructor() {
    this.router = Router();
    this.userService = new UserService();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(`${this.path}`, authenticationMiddleware, this.getUser);
    // In the future, user profile update, delete account, etc. would go here
  }

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
    try {
      if (!req.user) {
        return next(new UnauthorizedException('Unauthorized'));
      }
      res.status(200).json({ user: req.user });
    } catch (error) {
      next(error);
    }
  };
}

export default UserController;
