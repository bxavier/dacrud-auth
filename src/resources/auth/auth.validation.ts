import { z } from 'zod';

// Schema for user registration
export const register = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name cannot exceed 50 characters'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password cannot exceed 100 characters'),
    role: z.enum(['user', 'admin']).default('user'),
  }),
});

// Schema for user login
export const login = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password cannot exceed 100 characters'),
  }),
});

// Schema for account activation
export const activate = z.object({
  body: z.object({
    token: z.string(),
  }),
});

// Schema for resending activation email
export const resendActivation = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
  }),
});

// Schema for forgot password
export const forgotPassword = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
  }),
});

// Schema for password reset
export const resetPassword = z.object({
  body: z
    .object({
      token: z.string(),
      password: z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password cannot exceed 100 characters'),
      confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    }),
});

export default { register, login, activate, resendActivation, forgotPassword, resetPassword };
