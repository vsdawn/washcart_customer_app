import { z } from 'zod';
import { isValidEmail } from '../utils/validators';

export const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z
    .string()
    .min(1, 'Email is required')
    .refine((val: string) => isValidEmail(val), {
      message: 'Please enter a valid email address',
    }),
  dateOfBirth: z.string().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
