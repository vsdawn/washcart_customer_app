import { mobileSchema, otpSchema } from '../validation/authSchemas';

describe('Auth Validation Schemas', () => {
  test('should validate valid Indian mobile numbers starting with 6-9', () => {
    expect(mobileSchema.safeParse({ mobileNumber: '9876543210' }).success).toBe(true);
    expect(mobileSchema.safeParse({ mobileNumber: '8123456789' }).success).toBe(true);
    expect(mobileSchema.safeParse({ mobileNumber: '5123456789' }).success).toBe(false); // 5 is invalid
    expect(mobileSchema.safeParse({ mobileNumber: '98765' }).success).toBe(false); // short
  });

  test('should validate 6-digit OTP codes', () => {
    expect(otpSchema.safeParse({ otp: '123456' }).success).toBe(true);
    expect(otpSchema.safeParse({ otp: '12345' }).success).toBe(false);
    expect(otpSchema.safeParse({ otp: 'abc123' }).success).toBe(false);
  });
});
