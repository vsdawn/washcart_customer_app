import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, CartSummary } from '../../types/cart';
import { LaundryService } from '../../types/service';
import { Coupon } from '../../types/coupon';
import APP_CONFIG from '../../config/appConfig';

interface CartState {
  items: CartItem[];
  coupon: Coupon | null;
}

const initialState: CartState = {
  items: [],
  coupon: null,
};

const calculateSummary = (items: CartItem[], coupon: Coupon | null): CartSummary => {
  const subtotal = items.reduce((acc, item) => acc + item.service.price * item.quantity, 0);

  let discount = 0;
  if (coupon && subtotal >= coupon.minOrderAmount) {
    if (coupon.discountType === 'PERCENTAGE') {
      discount = Math.round((subtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscount) {
        discount = Math.min(discount, coupon.maxDiscount);
      }
    } else if (coupon.discountType === 'FLAT') {
      discount = coupon.discountValue;
    }
  }

  // Delivery fee rules: free if subtotal >= 499 or if coupon code is FREEDEL
  let deliveryFee = subtotal >= APP_CONFIG.freeDeliveryThreshold || subtotal === 0 ? 0 : APP_CONFIG.defaultDeliveryFee;
  if (coupon?.code === 'FREEDEL') {
    deliveryFee = 0;
  }

  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = Math.round((taxableAmount * APP_CONFIG.taxRatePercent) / 100);
  const total = taxableAmount + deliveryFee + tax;
  const itemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return {
    subtotal,
    discount,
    deliveryFee,
    tax,
    total,
    coupon,
    itemsCount,
  };
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ service: LaundryService; quantity?: number }>) => {
      const existing = state.items.find(i => i.service.id === action.payload.service.id);
      const qtyToAdd = action.payload.quantity || action.payload.service.minQuantity || 1;

      if (existing) {
        existing.quantity += qtyToAdd;
      } else {
        state.items.push({
          service: action.payload.service,
          quantity: qtyToAdd,
        });
      }
    },
    updateQuantity: (state, action: PayloadAction<{ serviceId: string; quantity: number }>) => {
      const existing = state.items.find(i => i.service.id === action.payload.serviceId);
      if (existing) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter(i => i.service.id !== action.payload.serviceId);
        } else {
          existing.quantity = action.payload.quantity;
        }
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(i => i.service.id !== action.payload);
    },
    applyCoupon: (state, action: PayloadAction<Coupon>) => {
      state.coupon = action.payload;
    },
    removeCoupon: state => {
      state.coupon = null;
    },
    clearCart: state => {
      state.items = [];
      state.coupon = null;
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, applyCoupon, removeCoupon, clearCart } = cartSlice.actions;

export const selectCartSummary = createSelector(
  [(state: { cart: CartState }) => state.cart.items, (state: { cart: CartState }) => state.cart.coupon],
  calculateSummary
);

export default cartSlice.reducer;
