import { Document } from 'mongoose';

export interface User extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  isActive: boolean;
  activationToken: string | null;
  isValidPassword: (password: string) => Promise<Error | boolean>;
}
