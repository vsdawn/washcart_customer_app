import ENV from '../../config/env';
import apiClient from './apiClient';
import { Address } from '../../types/address';
import { MOCK_ADDRESSES } from '../../mocks/addresses';

let mockAddressesStore = [...MOCK_ADDRESSES];

export const addressApi = {
  async getAddresses(): Promise<Address[]> {
    if (ENV.USE_MOCK_API) {
      await new Promise<void>(res => setTimeout(res, 500));
      return [...mockAddressesStore];
    }
    return apiClient.get<Address[]>('/addresses');
  },

  async addAddress(newAddress: Omit<Address, 'id'>): Promise<Address> {
    if (ENV.USE_MOCK_API) {
      await new Promise<void>(res => setTimeout(res, 600));
      const created: Address = {
        ...newAddress,
        id: `addr_${Date.now()}`,
      };
      if (created.isDefault) {
        mockAddressesStore = mockAddressesStore.map(a => ({ ...a, isDefault: false }));
      }
      mockAddressesStore.push(created);
      return created;
    }
    return apiClient.post<Address>('/addresses', newAddress);
  },

  async updateAddress(id: string, updated: Partial<Address>): Promise<Address> {
    if (ENV.USE_MOCK_API) {
      await new Promise<void>(res => setTimeout(res, 600));
      mockAddressesStore = mockAddressesStore.map(a => {
        if (a.id === id) {
          return { ...a, ...updated };
        }
        if (updated.isDefault) {
          return { ...a, isDefault: false };
        }
        return a;
      });
      const found = mockAddressesStore.find(a => a.id === id);
      return found || { ...MOCK_ADDRESSES[0], ...updated, id };
    }
    return apiClient.put<Address>(`/addresses/${id}`, updated);
  },

  async deleteAddress(id: string): Promise<boolean> {
    if (ENV.USE_MOCK_API) {
      await new Promise<void>(res => setTimeout(res, 400));
      mockAddressesStore = mockAddressesStore.filter(a => a.id !== id);
      return true;
    }
    await apiClient.delete(`/addresses/${id}`);
    return true;
  },

  async setDefaultAddress(id: string): Promise<Address[]> {
    if (ENV.USE_MOCK_API) {
      await new Promise<void>(res => setTimeout(res, 400));
      mockAddressesStore = mockAddressesStore.map(a => ({
        ...a,
        isDefault: a.id === id,
      }));
      return [...mockAddressesStore];
    }
    return apiClient.put<Address[]>(`/addresses/${id}/default`, {});
  },
};
