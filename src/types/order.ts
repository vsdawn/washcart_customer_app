import { Address } from './address';
import { LaundryService } from './service';
import { OrderStatusType } from '../constants/orderStatusConfig';
import { PaymentMode, PaymentStatus } from './payment';

export interface PickupSlot {
  date: string; // ISO or YYYY-MM-DD
  timeRange: string; // e.g. "07:00 AM - 09:00 AM"
  isAvailable?: boolean;
}

export interface DeliverySlot {
  date: string;
  timeRange: string;
  isAvailable?: boolean;
}

export interface OrderItem {
  serviceId: string;
  serviceName: string;
  unitPrice: number;
  quantity: number;
  unit: string;
  totalPrice: number;
  serviceDetails?: LaundryService;
}

export interface Garment {
  name: string;
  count: number;
  category: string;
}

export interface GarmentsSummary {
  totalItemsReceived: number;
  breakdown: Garment[];
  receivedAtFacilityTime?: string;
}

export interface LaundryPartnerSummary {
  id: string;
  name: string;
  rating: number;
  address: string;
}

export interface DeliveryPartnerSummary {
  id: string;
  name: string;
  phone: string;
  photoUrl?: string;
  vehicleNumber?: string;
  rating?: number;
  etaMinutes?: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  pickupAddress: Address;
  pickupSlot: PickupSlot;
  deliverySlot: DeliverySlot;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  tax: number;
  total: number;
  status: OrderStatusType;
  paymentStatus: PaymentStatus;
  paymentMode: PaymentMode;
  couponCodeApplied?: string;
  garmentsSummary?: GarmentsSummary;
  laundryPartner?: LaundryPartnerSummary;
  deliveryPartner?: DeliveryPartnerSummary;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}
