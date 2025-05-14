import { z } from 'zod';

export const register = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name cannot exceed 50 characters'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password cannot exceed 100 characters'),
    role: z.enum(['user', 'admin']).default('user'),
  }),
});

export const login = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password cannot exceed 100 characters'),
  }),
});

export const activate = z.object({
  body: z.object({
    token: z.string(),
  }),
});

export const resendActivation = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
  }),
});

export const forgotPassword = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
  }),
});

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
