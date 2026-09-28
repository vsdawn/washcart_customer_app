import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';
import {
  addToCart as addToCartAction,
  updateQuantity as updateQuantityAction,
  removeFromCart as removeFromCartAction,
  applyCoupon as applyCouponAction,
  removeCoupon as removeCouponAction,
  clearCart as clearCartAction,
  selectCartSummary,
} from '../store/slices/cartSlice';
import { LaundryService } from '../types/service';
import { Coupon } from '../types/coupon';

export const useCart = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(state => state.cart.items);
  const coupon = useAppSelector(state => state.cart.coupon);
  const summary = useAppSelector(selectCartSummary);

  const addItem = (service: LaundryService, quantity?: number) => {
    dispatch(addToCartAction({ service, quantity }));
  };

  const updateItemQuantity = (serviceId: string, quantity: number) => {
    dispatch(updateQuantityAction({ serviceId, quantity }));
  };

  const removeItem = (serviceId: string) => {
    dispatch(removeFromCartAction(serviceId));
  };

  const applyPromoCoupon = (c: Coupon) => {
    dispatch(applyCouponAction(c));
  };

  const removePromoCoupon = () => {
    dispatch(removeCouponAction());
  };

  const clear = () => {
    dispatch(clearCartAction());
  };

  const getItemQuantity = (serviceId: string): number => {
    const item = items.find(i => i.service.id === serviceId);
    return item ? item.quantity : 0;
  };

  return {
    items,
    coupon,
    summary,
    addItem,
    updateItemQuantity,
    removeItem,
    applyPromoCoupon,
    removePromoCoupon,
    clear,
    getItemQuantity,
  };
};

export default useCart;
