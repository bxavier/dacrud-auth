import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/shared/interfaces/controller.interface';
import HealthService from './health.service';

/**
 * @openapi
 * tags:
 *   name: Health
 *   description: API health check
 */
class HealthController implements Controller {
  public path = '/health';
  public router: Router;
  private healthService = new HealthService();

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(this.path, this.healthCheck);
  }

  /**
   * @openapi
   * /health:
   *   get:
   *     summary: Check API health
   *     tags: [Health]
   *     responses:
   *       200:
   *         description: Health information
   */
  private healthCheck = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const healthData = await this.healthService.getHealth();
      res.status(200).json(healthData);
    } catch (error) {
      next(error);
    }
  };
}

export default HealthController;
