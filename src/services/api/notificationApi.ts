import ENV from '../../config/env';
import apiClient from './apiClient';
import { AppNotification } from '../../types/notification';
import { MOCK_NOTIFICATIONS } from '../../mocks/notifications';

let mockNotifs = [...MOCK_NOTIFICATIONS];

export const notificationApi = {
  async getNotifications(): Promise<AppNotification[]> {
    if (ENV.USE_MOCK_API) {
      await new Promise<void>(res => setTimeout(res, 400));
      return mockNotifs;
    }
    return apiClient.get<AppNotification[]>('/notifications');
  },

  async markAsRead(id: string): Promise<boolean> {
    if (ENV.USE_MOCK_API) {
      mockNotifs = mockNotifs.map(n => (n.id === id ? { ...n, isRead: true } : n));
      return true;
    }
    await apiClient.put(`/notifications/${id}/read`, {});
    return true;
  },

  async markAllAsRead(): Promise<boolean> {
    if (ENV.USE_MOCK_API) {
      mockNotifs = mockNotifs.map(n => ({ ...n, isRead: true }));
      return true;
    }
    await apiClient.put('/notifications/read-all', {});
    return true;
  },
};
