import { colors } from '../theme/colors';

export type OrderStatusType =
  | 'ORDER_PLACED'
  | 'PICKUP_ASSIGNED'
  | 'PICKED_UP'
  | 'RECEIVED'
  | 'SORTING'
  | 'WASHING'
  | 'DRYING'
  | 'IRONING'
  | 'QUALITY_CHECK'
  | 'PACKED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export interface OrderStatusDetails {
  key: OrderStatusType;
  label: string;
  subtext: string;
  color: string;
  badgeBg: string;
  stepIndex: number;
  isCompleted: boolean;
  isCancelled?: boolean;
}

export const ORDER_STATUS_TIMELINE_STEPS: OrderStatusType[] = [
  'ORDER_PLACED',
  'PICKUP_ASSIGNED',
  'PICKED_UP',
  'RECEIVED',
  'SORTING',
  'WASHING',
  'DRYING',
  'IRONING',
  'QUALITY_CHECK',
  'PACKED',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
];

export const ORDER_STATUS_CONFIG: Record<OrderStatusType, OrderStatusDetails> = {
  ORDER_PLACED: {
    key: 'ORDER_PLACED',
    label: 'Order Placed',
    subtext: 'We have received your order request.',
    color: colors.primary,
    badgeBg: colors.primaryBg,
    stepIndex: 1,
    isCompleted: false,
  },
  PICKUP_ASSIGNED: {
    key: 'PICKUP_ASSIGNED',
    label: 'Pickup Assigned',
    subtext: 'Valet assigned to pick up your clothes.',
    color: colors.primary,
    badgeBg: colors.primaryBg,
    stepIndex: 2,
    isCompleted: false,
  },
  PICKED_UP: {
    key: 'PICKED_UP',
    label: 'Picked Up',
    subtext: 'Clothes picked up from your address.',
    color: colors.info,
    badgeBg: colors.infoBg,
    stepIndex: 3,
    isCompleted: false,
  },
  RECEIVED: {
    key: 'RECEIVED',
    label: 'Received at Facility',
    subtext: 'Items received at cleaning center.',
    color: colors.info,
    badgeBg: colors.infoBg,
    stepIndex: 4,
    isCompleted: false,
  },
  SORTING: {
    key: 'SORTING',
    label: 'Sorting & Tagging',
    subtext: 'Categorizing garments by fabric type.',
    color: colors.secondary,
    badgeBg: colors.secondaryBg,
    stepIndex: 5,
    isCompleted: false,
  },
  WASHING: {
    key: 'WASHING',
    label: 'Washing & Cleaning',
    subtext: 'Garments undergoing eco-friendly washing.',
    color: colors.secondary,
    badgeBg: colors.secondaryBg,
    stepIndex: 6,
    isCompleted: false,
  },
  DRYING: {
    key: 'DRYING',
    label: 'Drying',
    subtext: 'Gentle temperature controlled drying.',
    color: colors.secondary,
    badgeBg: colors.secondaryBg,
    stepIndex: 7,
    isCompleted: false,
  },
  IRONING: {
    key: 'IRONING',
    label: 'Steam Ironing',
    subtext: 'Professional crisp steam ironing.',
    color: colors.accent,
    badgeBg: colors.accentBg,
    stepIndex: 8,
    isCompleted: false,
  },
  QUALITY_CHECK: {
    key: 'QUALITY_CHECK',
    label: 'Quality Check',
    subtext: 'Inspecting garments for freshness & stains.',
    color: colors.warning,
    badgeBg: colors.warningBg,
    stepIndex: 9,
    isCompleted: false,
  },
  PACKED: {
    key: 'PACKED',
    label: 'Hanger / Fold Packed',
    subtext: 'Sanitized & packed ready for delivery.',
    color: colors.info,
    badgeBg: colors.infoBg,
    stepIndex: 10,
    isCompleted: false,
  },
  OUT_FOR_DELIVERY: {
    key: 'OUT_FOR_DELIVERY',
    label: 'Out for Delivery',
    subtext: 'Delivery partner is on the way to you.',
    color: colors.primaryDark,
    badgeBg: colors.primaryBg,
    stepIndex: 11,
    isCompleted: false,
  },
  DELIVERED: {
    key: 'DELIVERED',
    label: 'Delivered',
    subtext: 'Order successfully delivered to you.',
    color: colors.success,
    badgeBg: colors.successBg,
    stepIndex: 12,
    isCompleted: true,
  },
  CANCELLED: {
    key: 'CANCELLED',
    label: 'Cancelled',
    subtext: 'This order was cancelled.',
    color: colors.error,
    badgeBg: colors.errorBg,
    stepIndex: 0,
    isCompleted: false,
    isCancelled: true,
  },
};

export const getOrderStatusProgress = (status: OrderStatusType): number => {
  if (status === 'CANCELLED') return 0;
  const currentStep = ORDER_STATUS_CONFIG[status]?.stepIndex || 1;
  const totalSteps = ORDER_STATUS_TIMELINE_STEPS.length;
  return Math.min(100, Math.round((currentStep / totalSteps) * 100));
};
