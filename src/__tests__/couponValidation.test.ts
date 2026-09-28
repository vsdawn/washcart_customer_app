import { couponApi } from '../services/api/couponApi';

describe('Coupon Validation Service Rules', () => {
  test('should validate valid coupon code WASH20 when order meets minimum value', async () => {
    const res = await couponApi.validateCoupon('WASH20', 350);
    expect(res.valid).toBe(true);
    expect(res.coupon?.code).toBe('WASH20');
  });

  test('should reject coupon code when order subtotal is below minimum order requirement', async () => {
    const res = await couponApi.validateCoupon('SAVE50', 100);
    expect(res.valid).toBe(false);
    expect(res.error).toContain('Minimum order amount');
  });

  test('should reject invalid promo codes', async () => {
    const res = await couponApi.validateCoupon('INVALID99', 500);
    expect(res.valid).toBe(false);
    expect(res.error).toBe('Invalid promo coupon code.');
  });
});
