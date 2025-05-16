import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@/auth/token';
import UserModel from '@/shared/models/user.model';
import Token from '@/shared/interfaces/token.interface';
import { UnauthorizedException } from '@/core/exceptions';
import jwt from 'jsonwebtoken';
import { LoggerService } from '@/core/logger';

const logger = new LoggerService('authenticationMiddleware');
async function authenticationMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const bearer = req.headers.authorization;

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
