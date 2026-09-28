export type AnalyticsEvent =
  | 'app_open'
  | 'login_started'
  | 'login_completed'
  | 'home_viewed'
  | 'service_viewed'
  | 'service_added_to_cart'
  | 'cart_viewed'
  | 'checkout_started'
  | 'coupon_applied'
  | 'payment_started'
  | 'payment_success'
  | 'payment_failed'
  | 'order_created'
  | 'order_cancelled'
  | 'order_delivered'
  | 'review_submitted'
  | 'subscription_viewed'
  | 'subscription_started'
  | 'support_created';

export class AnalyticsService {
  public static logEvent(event: AnalyticsEvent, params?: Record<string, any>): void {
    if (__DEV__) {
      // Clean silent debug tracking in dev mode
      // console.log(`[Analytics Event]: ${event}`, params || '');
    }
    // Production integration with Firebase Analytics / Mixpanel / Amplitude
  }

  public static setUserContext(userId: string, userProperties?: Record<string, any>): void {
    // Set analytics user id & properties
  }
}

export default AnalyticsService;
