import { CallbackError, Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import { IUser } from '@/shared/interfaces/user.interface';
import { LoggerService } from '@/core/logger';

const logger = new LoggerService('UserModel');

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      required: true,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    activationToken: {
      type: String,
      default: null,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    logger.error(`Error hashing password: ${error}`);
    next(error as CallbackError);
  }
});

UserSchema.methods.isValidPassword = async function (password: string): Promise<Error | boolean> {
  return await bcrypt.compare(password, this.password);
};

export default model<IUser>('User', UserSchema);
