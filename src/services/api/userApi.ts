import ENV from '../../config/env';
import apiClient from './apiClient';
import { User } from '../../types/user';
import { MOCK_USER } from '../../mocks/user';

export const userApi = {
  async getProfile(): Promise<User> {
    if (ENV.USE_MOCK_API) {
      await new Promise<void>(res => setTimeout(res, 500));
      return MOCK_USER;
    }
    return apiClient.get<User>('/user/profile');
  },

  async updateProfile(updatedData: Partial<User>): Promise<User> {
    if (ENV.USE_MOCK_API) {
      await new Promise<void>(res => setTimeout(res, 800));
      return { ...MOCK_USER, ...updatedData, updatedAt: new Date().toISOString() };
    }
    return apiClient.put<User>('/user/profile', updatedData);
  },
};
