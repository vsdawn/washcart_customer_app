import { ORDER_STATUS_CONFIG, getOrderStatusProgress } from '../constants/orderStatusConfig';

describe('Order Status Lifecycle & Timeline Progress', () => {
  test('should return correct step details for ORDER_PLACED and OUT_FOR_DELIVERY', () => {
    expect(ORDER_STATUS_CONFIG.ORDER_PLACED.label).toBe('Order Placed');
    expect(ORDER_STATUS_CONFIG.OUT_FOR_DELIVERY.label).toBe('Out for Delivery');
    expect(ORDER_STATUS_CONFIG.DELIVERED.isCompleted).toBe(true);
  });

  test('should calculate correct percentage progress', () => {
    expect(getOrderStatusProgress('ORDER_PLACED')).toBe(8); // 1/12
    expect(getOrderStatusProgress('DELIVERED')).toBe(100);
    expect(getOrderStatusProgress('CANCELLED')).toBe(0);
  });
});
