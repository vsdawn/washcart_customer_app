export type DiscountType = 'FLAT' | 'PERCENTAGE';

export interface Coupon {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  maxDiscount?: number;
  minOrderAmount: number;
  validUntil: string;
  isExpired?: boolean;
  isUsed?: boolean;
  terms?: string[];
}
