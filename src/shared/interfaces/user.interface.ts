import { Document } from 'mongoose';

/**
 * Interface representing a user in the system
 */
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  isActive: boolean;
  activationToken: string | null;
  resetPasswordToken: string | null;
  resetPasswordExpires: Date | null;
  isValidPassword: (password: string) => Promise<Error | boolean>;
}
