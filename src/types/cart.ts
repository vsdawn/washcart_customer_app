import { LaundryService } from './service';
import { Coupon } from './coupon';

export interface CartItem {
  service: LaundryService;
  quantity: number;
}

export interface CartSummary {
  subtotal: number;
  discount: number;
  deliveryFee: number;
  tax: number;
  total: number;
  coupon: Coupon | null;
  itemsCount: number;
}
