export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  billingCycle: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
  pickupsPerMonth: number;
  freeDelivery: boolean;
  discountPercentage: number;
  priorityProcessing: boolean;
  maxKgPerPickup: number;
  features: string[];
  isPopular?: boolean;
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  planName: string;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  remainingPickups: number;
  autoRenew: boolean;
  createdAt: string;
}
