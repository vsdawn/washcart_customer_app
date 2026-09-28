import { z } from 'zod';
import { isValidIndianMobile, isValidOTP } from '../utils/validators';

export const mobileSchema = z.object({
  mobileNumber: z
    .string()
    .min(10, 'Mobile number must be at least 10 digits')
    .refine((val: string) => isValidIndianMobile(val), {
      message: 'Please enter a valid 10-digit Indian mobile number starting with 6-9',
    }),
});

export type MobileFormData = z.infer<typeof mobileSchema>;

export const otpSchema = z.object({
  otp: z
    .string()
    .length(6, 'OTP must be exactly 6 digits')
    .refine((val: string) => isValidOTP(val), {
      message: 'OTP must contain numbers only',
    }),
});

export type OTPFormData = z.infer<typeof otpSchema>;
