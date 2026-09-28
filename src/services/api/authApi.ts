import ENV from '../../config/env';
import apiClient from './apiClient';
import { User } from '../../types/user';
import { MOCK_USER } from '../../mocks/user';
import secureStorage from '../../utils/secureStorage';

export const authApi = {
  async sendOTP(mobileNumber: string): Promise<{ success: boolean; message: string }> {
    if (ENV.USE_MOCK_API) {
      await new Promise<void>(res => setTimeout(res, 800));
      return {
        success: true,
        message: `OTP sent successfully to +91 ${mobileNumber}`,
      };
    }
    return apiClient.post('/auth/send-otp', { mobileNumber });
  },

  async verifyOTP(mobileNumber: string, otp: string): Promise<{ user: User; token: string; isNewUser: boolean }> {
    if (ENV.USE_MOCK_API) {
      await new Promise<void>(res => setTimeout(res, 900));
      if (otp !== '123456' && otp !== '000000') {
        // Accept any 6 digit except testing failure if desired, but 123456 is standard mock OTP
      }
      const token = 'mock_jwt_token_washkart_2026_xyz999';
      await secureStorage.setAuthToken(token);
      return {
        user: { ...MOCK_USER, mobileNumber },
        token,
        isNewUser: false,
      };
    }
    const response = await apiClient.post<{ user: User; token: string; isNewUser: boolean }>('/auth/verify-otp', {
      mobileNumber,
      otp,
    });
    await secureStorage.setAuthToken(response.token);
    return response;
  },

  async completeProfile(data: { firstName: string; lastName: string; email: string; mobileNumber: string }): Promise<User> {
    if (ENV.USE_MOCK_API) {
      await new Promise<void>(res => setTimeout(res, 700));
      return {
        ...MOCK_USER,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        mobileNumber: data.mobileNumber,
        isProfileComplete: true,
      };
    }
    return apiClient.post<User>('/auth/complete-profile', data);
  },

  async logout(): Promise<void> {
    if (ENV.USE_MOCK_API) {
      await secureStorage.clearAllTokens();
      return;
    }
    try {
      await apiClient.post('/auth/logout');
    } finally {
      await secureStorage.clearAllTokens();
    }
  },
};
