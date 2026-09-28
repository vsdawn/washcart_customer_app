import { NavigatorScreenParams } from '@react-navigation/native';
import { LaundryService } from './service';
import { Address } from './address';
import { Order } from './order';
import { Coupon } from './coupon';

export type AuthStackParamList = {
  Welcome: undefined;
  MobileNumber: undefined;
  OTPVerification: { mobileNumber: string };
  ProfileSetup: { mobileNumber: string };
};

export type MainTabParamList = {
  Home: undefined;
  Pricing: undefined;
  Orders: undefined;
  Offers: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Splash: undefined;
  AuthStack: NavigatorScreenParams<AuthStackParamList>;
  MainTab: NavigatorScreenParams<MainTabParamList>;

  // Service Screens
  CategoryDetails: { categorySlug: string; categoryName: string };
  ServiceDetails: { service: LaundryService };

  // Cart & Checkout
  Cart: undefined;
  AddressSelection: { isCheckoutFlow?: boolean };
  AddAddress: { addressToEdit?: Address };
  PickupSlot: undefined;
  DeliverySlot: undefined;
  OrderReview: undefined;
  Payment: undefined;
  OrderSuccess: { orderId: string };

  // Pricing & Pickup Scheduling
  PricingDetails: { serviceId: string };
  SchedulePickup: { scheduleId?: string; serviceName?: string; fromCart?: boolean };
  ScheduleDetails: { scheduleId: string; justBooked?: boolean };
  CancelSchedule: { scheduleId: string };

  // Orders
  OrderDetails: { orderId: string };
  OrderTracking: { orderId: string };

  // Offers & Subscriptions
  CouponList: { isSelectionMode?: boolean };
  SubscriptionPlans: undefined;
  SubscriptionDetails: { planId: string };

  // Profile & Support
  EditProfile: undefined;
  SavedAddresses: undefined;
  PaymentMethods: undefined;
  Notifications: undefined;
  Referral: undefined;
  Reviews: { orderId?: string };
  Support: undefined;
  Complaint: { orderId?: string };
  FAQ: undefined;
  Terms: undefined;
  PrivacyPolicy: undefined;
};
