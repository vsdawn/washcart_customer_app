import ENV from '../../config/env';
import apiClient from './apiClient';
import { Order, OrderItem, PickupSlot, DeliverySlot } from '../../types/order';
import { Address } from '../../types/address';
import { PaymentMode } from '../../types/payment';
import { MOCK_ORDERS } from '../../mocks/orders';

let mockOrdersStore = [...MOCK_ORDERS];

export interface CreateOrderInput {
  items: OrderItem[];
  pickupAddress: Address;
  pickupSlot: PickupSlot;
  deliverySlot: DeliverySlot;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  tax: number;
  total: number;
  paymentMode: PaymentMode;
  couponCodeApplied?: string;
}

export const orderApi = {
  async getOrders(filter?: 'Active' | 'Completed' | 'Cancelled'): Promise<Order[]> {
    if (ENV.USE_MOCK_API) {
      await new Promise<void>(res => setTimeout(res, 600));
      if (!filter) return mockOrdersStore;

      if (filter === 'Active') {
        return mockOrdersStore.filter(o => o.status !== 'DELIVERED' && o.status !== 'CANCELLED');
      }
      if (filter === 'Completed') {
        return mockOrdersStore.filter(o => o.status === 'DELIVERED');
      }
      if (filter === 'Cancelled') {
        return mockOrdersStore.filter(o => o.status === 'CANCELLED');
      }
      return mockOrdersStore;
    }
    return apiClient.get<Order[]>(`/orders${filter ? `?filter=${filter}` : ''}`);
  },

  async getOrderById(orderId: string): Promise<Order> {
    if (ENV.USE_MOCK_API) {
      await new Promise<void>(res => setTimeout(res, 500));
      const found = mockOrdersStore.find(o => o.id === orderId || o.orderNumber === orderId);
      if (!found) {
        throw new Error('Order not found');
      }
      return found;
    }
    return apiClient.get<Order>(`/orders/${orderId}`);
  },

  async createOrder(input: CreateOrderInput): Promise<Order> {
    if (ENV.USE_MOCK_API) {
      await new Promise<void>(res => setTimeout(res, 1000));
      const nowStr = new Date().toISOString();
      const randomOrderNum = Math.floor(100000 + Math.random() * 900000);
      const newOrder: Order = {
        id: `ord_${Date.now()}`,
        orderNumber: `LND-20260927-${randomOrderNum}`,
        userId: 'usr_101',
        items: input.items,
        pickupAddress: input.pickupAddress,
        pickupSlot: input.pickupSlot,
        deliverySlot: input.deliverySlot,
        subtotal: input.subtotal,
        discount: input.discount,
        deliveryFee: input.deliveryFee,
        tax: input.tax,
        total: input.total,
        status: 'ORDER_PLACED',
        paymentStatus: input.paymentMode === 'COD' ? 'PENDING' : 'SUCCESS',
        paymentMode: input.paymentMode,
        couponCodeApplied: input.couponCodeApplied,
        garmentsSummary: {
          totalItemsReceived: input.items.reduce((acc, it) => acc + it.quantity, 0),
          breakdown: input.items.map(it => ({
            name: it.serviceName,
            count: it.quantity,
            category: 'Garments',
          })),
        },
        laundryPartner: {
          id: 'partner_01',
          name: 'WashKart Express Facility #104',
          rating: 4.9,
          address: 'Indiranagar Hub, Bengaluru',
        },
        createdAt: nowStr,
        updatedAt: nowStr,
      };

      mockOrdersStore.unshift(newOrder);
      return newOrder;
    }
    return apiClient.post<Order>('/orders', input);
  },

  async cancelOrder(orderId: string, reason: string): Promise<Order> {
    if (ENV.USE_MOCK_API) {
      await new Promise<void>(res => setTimeout(res, 800));
      const targetIndex = mockOrdersStore.findIndex(o => o.id === orderId);
      if (targetIndex === -1) {
        throw new Error('Order not found');
      }

      const target = mockOrdersStore[targetIndex];
      // Business rule check: delivered orders cannot be cancelled
      if (target.status === 'DELIVERED') {
        throw new Error('Delivered orders cannot be cancelled.');
      }
      if (target.status === 'CANCELLED') {
        throw new Error('Order is already cancelled.');
      }

      const cancelledOrder: Order = {
        ...target,
        status: 'CANCELLED',
        cancellationReason: reason,
        paymentStatus: target.paymentStatus === 'SUCCESS' ? 'REFUNDED' : target.paymentStatus,
        updatedAt: new Date().toISOString(),
      };

      mockOrdersStore[targetIndex] = cancelledOrder;
      return cancelledOrder;
    }
    return apiClient.post<Order>(`/orders/${orderId}/cancel`, { reason });
  },
};
