import { z } from 'zod';

// Schema for retrieving a user
export const getUser = z.object({
  params: z.object({
    id: z.string().optional(),
  }),
});

// Schema for updating user profile
export const updateUser = z.object({
  body: z
    .object({
      name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name cannot exceed 50 characters').optional(),
      email: z.string().email('Invalid email format').optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided for update',
    }),
});

export default { getUser, updateUser };
