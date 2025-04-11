import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@/utils/token';
import UserModel from '@/resources/user/user.model';
import Token from '@/utils/interfaces/token.interface';
import { UnauthorizedException } from '@/utils/exceptions';
import jwt from 'jsonwebtoken';
import { LoggerService } from '@/utils/logger';

const logger = new LoggerService('authenticationMiddleware');
async function authenticationMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const bearer = req.headers.authorization;

    // Log headers for debugging
    logger.debug(`Headers: ${JSON.stringify(req.headers)}`);

    if (!bearer || !bearer.startsWith('Bearer ')) {
      logger.warn('Missing or invalid authorization header');
      throw new UnauthorizedException('No token provided or invalid token format');
    }

    const accessToken = bearer.split(' ')[1].trim();
    logger.debug('Token extracted from header');

    try {
      const payload: Token | jwt.JsonWebTokenError = await verifyToken(accessToken);

      if (payload instanceof jwt.JsonWebTokenError) {
        logger.warn(`JWT Error: ${payload.message}`);
        throw new UnauthorizedException('Unauthorized');
      }

      const user = await UserModel.findById(payload.id).select('-password').exec();

      if (!user) {
        logger.warn(`User not found with ID: ${payload.id}`);
        throw new UnauthorizedException('Unauthorized');
      }

      req.user = user;
      next();
    } catch (error) {
      logger.error(`Token verification error: ${error instanceof Error ? error.message : String(error)}`);
      throw new UnauthorizedException('Unauthorized');
    }
  } catch (error) {
    next(error);
  }
}

export default authenticationMiddleware;
