/**
 * Interface representing a user within the auth context
 */
export interface IUser {
  _id: string;
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
