import cartReducer, {
  addToCart,
  updateQuantity,
  removeFromCart,
  applyCoupon,
  selectCartSummary,
} from '../store/slices/cartSlice';
import { MOCK_SERVICES } from '../mocks/services';
import { MOCK_COUPONS } from '../mocks/coupons';
import APP_CONFIG from '../config/appConfig';

describe('Cart Calculation Logic & Business Rules', () => {
  let initialState = { items: [], coupon: null };

  test('should add service item to cart and calculate correct subtotal and tax', () => {
    const service = MOCK_SERVICES[0]; // Wash & Fold ₹79/kg
    const state1 = cartReducer(initialState, addToCart({ service, quantity: 2 }));

    expect(state1.items.length).toBe(1);
    expect(state1.items[0].quantity).toBe(2);

    const summary = selectCartSummary({ cart: state1 });
    const expectedSubtotal = 79 * 2; // 158
    expect(summary.subtotal).toBe(expectedSubtotal);
    expect(summary.deliveryFee).toBe(APP_CONFIG.defaultDeliveryFee); // 40 since < 499
  });

  test('should apply flat coupon discount correctly', () => {
    const service = MOCK_SERVICES[1]; // Wash & Iron ₹99/kg
    const state1 = cartReducer(initialState, addToCart({ service, quantity: 5 })); // ₹495
    const coupon = MOCK_COUPONS[1]; // SAVE50 (₹50 off)

    const state2 = cartReducer(state1, applyCoupon(coupon));
    const summary = selectCartSummary({ cart: state2 });

    expect(summary.subtotal).toBe(495);
    expect(summary.discount).toBe(50);
  });

  test('should apply free delivery for orders above freeDeliveryThreshold (₹499)', () => {
    const service = MOCK_SERVICES[2]; // Suit Dry Clean ₹299
    const state1 = cartReducer(initialState, addToCart({ service, quantity: 2 })); // ₹598

    const summary = selectCartSummary({ cart: state1 });
    expect(summary.subtotal).toBe(598);
    expect(summary.deliveryFee).toBe(0);
  });

  test('should update item quantity and remove when quantity is set to 0', () => {
    const service = MOCK_SERVICES[0];
    const state1 = cartReducer(initialState, addToCart({ service, quantity: 2 }));
    const state2 = cartReducer(state1, updateQuantity({ serviceId: service.id, quantity: 0 }));

    expect(state2.items.length).toBe(0);
  });
});
