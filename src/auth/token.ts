import jwt from 'jsonwebtoken';
import Token from '@/shared/interfaces/token.interface';
import config from '@/core/config';
import { IUser } from '@/shared/interfaces/user.interface';
import crypto from 'crypto';

export const createToken = async (user: IUser): Promise<string> => {
  return jwt.sign({ id: user._id }, config.JWT_SECRET as jwt.Secret, { expiresIn: config.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] });
};

export const verifyToken = async (token: string): Promise<jwt.VerifyErrors | Token> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.JWT_SECRET as jwt.Secret, (err, payload) => {
      if (err) return reject(err);
      resolve(payload as Token);
    });
  });
};

export const generateActivationToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

export default { createToken, verifyToken, generateActivationToken };
