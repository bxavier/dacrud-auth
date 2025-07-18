import { User } from '@/resources/user/user.interface';

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}
