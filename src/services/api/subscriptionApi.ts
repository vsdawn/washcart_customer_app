import ENV from '../../config/env';
import apiClient from './apiClient';
import { SubscriptionPlan, UserSubscription } from '../../types/subscription';
import { MOCK_SUBSCRIPTION_PLANS, MOCK_USER_SUBSCRIPTION } from '../../mocks/subscriptions';

export const subscriptionApi = {
  async getPlans(): Promise<SubscriptionPlan[]> {
    if (ENV.USE_MOCK_API) {
      await new Promise<void>(res => setTimeout(res, 400));
      return MOCK_SUBSCRIPTION_PLANS;
    }
    return apiClient.get<SubscriptionPlan[]>('/subscriptions/plans');
  },

  async getUserSubscription(): Promise<UserSubscription | null> {
    if (ENV.USE_MOCK_API) {
      await new Promise<void>(res => setTimeout(res, 400));
      return MOCK_USER_SUBSCRIPTION;
    }
    return apiClient.get<UserSubscription | null>('/subscriptions/my-subscription');
  },

  async subscribe(planId: string): Promise<UserSubscription> {
    if (ENV.USE_MOCK_API) {
      await new Promise<void>(res => setTimeout(res, 800));
      const plan = MOCK_SUBSCRIPTION_PLANS.find(p => p.id === planId) || MOCK_SUBSCRIPTION_PLANS[0];
      const today = new Date();
      const endDate = new Date(today);
      endDate.setMonth(today.getMonth() + 1);

      return {
        id: `sub_${Date.now()}`,
        userId: 'usr_101',
        planId: plan.id,
        planName: plan.name,
        startDate: today.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        status: 'ACTIVE',
        remainingPickups: plan.pickupsPerMonth,
        autoRenew: true,
        createdAt: today.toISOString(),
      };
    }
    return apiClient.post<UserSubscription>('/subscriptions/subscribe', { planId });
  },
};
