import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Order, PickupSlot, DeliverySlot } from '../../types/order';
import { PaymentMode } from '../../types/payment';

interface OrderState {
  pickupSlot: PickupSlot | null;
  deliverySlot: DeliverySlot | null;
  paymentMode: PaymentMode;
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  pickupSlot: null,
  deliverySlot: null,
  paymentMode: 'UPI',
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setPickupSlot: (state, action: PayloadAction<PickupSlot>) => {
      state.pickupSlot = action.payload;
    },
    setDeliverySlot: (state, action: PayloadAction<DeliverySlot>) => {
      state.deliverySlot = action.payload;
    },
    setPaymentMode: (state, action: PayloadAction<PaymentMode>) => {
      state.paymentMode = action.payload;
    },
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
      state.isLoading = false;
    },
    setCurrentOrder: (state, action: PayloadAction<Order>) => {
      state.currentOrder = action.payload;
    },
    addOrderSuccess: (state, action: PayloadAction<Order>) => {
      state.orders.unshift(action.payload);
      state.currentOrder = action.payload;
      // Clear checkout slots after successful order placement
      state.pickupSlot = null;
      state.deliverySlot = null;
    },
    setOrderLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    resetCheckoutSlots: state => {
      state.pickupSlot = null;
      state.deliverySlot = null;
    },
  },
});

export const {
  setPickupSlot,
  setDeliverySlot,
  setPaymentMode,
  setOrders,
  setCurrentOrder,
  addOrderSuccess,
  setOrderLoading,
  resetCheckoutSlots,
} = orderSlice.actions;

export default orderSlice.reducer;
