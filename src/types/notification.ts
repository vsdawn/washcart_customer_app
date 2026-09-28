export type NotificationCategory = 'Order' | 'Payment' | 'Offers' | 'System';

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  body: string;
  category: NotificationCategory;
  isRead: boolean;
  deepLink?: string;
  orderId?: string;
  createdAt: string;
}
