import { z } from 'zod';

// Schema for creating a user
export const user = z.object({
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

export default { user, login };
