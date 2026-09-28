import ENV from '../../config/env';
import apiClient from './apiClient';
import { Coupon } from '../../types/coupon';
import { MOCK_COUPONS } from '../../mocks/coupons';

export const couponApi = {
  async getCoupons(): Promise<Coupon[]> {
    if (ENV.USE_MOCK_API) {
      await new Promise<void>(res => setTimeout(res, 400));
      return MOCK_COUPONS;
    }
    return apiClient.get<Coupon[]>('/coupons');
  },

  async validateCoupon(code: string, subtotal: number): Promise<{ valid: boolean; coupon?: Coupon; error?: string }> {
    if (ENV.USE_MOCK_API) {
      await new Promise<void>(res => setTimeout(res, 500));
      const coupon = MOCK_COUPONS.find(c => c.code.toUpperCase() === code.toUpperCase());

      if (!coupon) {
        return { valid: false, error: 'Invalid promo coupon code.' };
      }
      if (coupon.isExpired) {
        return { valid: false, error: 'This promo coupon has expired.' };
      }
      if (subtotal < coupon.minOrderAmount) {
        return {
          valid: false,
          error: `Minimum order amount of ₹${coupon.minOrderAmount} required for ${coupon.code}`,
        };
      }

      return { valid: true, coupon };
    }

    return apiClient.post<{ valid: boolean; coupon?: Coupon; error?: string }>('/coupons/validate', {
      code,
      subtotal,
    });
  },
};
