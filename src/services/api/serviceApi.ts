import ENV from '../../config/env';
import apiClient from './apiClient';
import { ServiceCategory, LaundryService } from '../../types/service';
import { MOCK_CATEGORIES } from '../../mocks/categories';
import { MOCK_SERVICES } from '../../mocks/services';

export const serviceApi = {
  async getCategories(): Promise<ServiceCategory[]> {
    if (ENV.USE_MOCK_API) {
      await new Promise<void>(res => setTimeout(res, 400));
      return MOCK_CATEGORIES;
    }
    return apiClient.get<ServiceCategory[]>('/services/categories');
  },

  async getPopularServices(): Promise<LaundryService[]> {
    if (ENV.USE_MOCK_API) {
      await new Promise<void>(res => setTimeout(res, 400));
      return MOCK_SERVICES.filter(s => s.isPopular);
    }
    return apiClient.get<LaundryService[]>('/services/popular');
  },

  async getServicesByCategory(categorySlug: string): Promise<LaundryService[]> {
    if (ENV.USE_MOCK_API) {
      await new Promise<void>(res => setTimeout(res, 400));
      return MOCK_SERVICES.filter(s => s.categorySlug === categorySlug);
    }
    return apiClient.get<LaundryService[]>(`/services/category/${categorySlug}`);
  },

  async searchServices(query: string): Promise<LaundryService[]> {
    if (ENV.USE_MOCK_API) {
      await new Promise<void>(res => setTimeout(res, 300));
      const q = query.toLowerCase().trim();
      if (!q) return [];
      return MOCK_SERVICES.filter(
        s => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
      );
    }
    return apiClient.get<LaundryService[]>(`/services/search?q=${encodeURIComponent(query)}`);
  },
};
