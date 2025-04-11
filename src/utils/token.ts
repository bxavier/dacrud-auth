import jwt from 'jsonwebtoken';
import Token from './interfaces/token.interface';
import config from './config';
import { User } from '@/resources/user/user.interface';

export const createToken = async (user: User): Promise<string> => {
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

export default { createToken, verifyToken };
