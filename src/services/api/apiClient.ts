import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import ENV from '../../config/env';
import secureStorage from '../../utils/secureStorage';

class ApiClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: ENV.API_BASE_URL,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    // Request Interceptor: Attach bearer token
    this.instance.interceptors.request.use(
      async config => {
        const token = await secureStorage.getAuthToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => Promise.reject(error),
    );

    // Response Interceptor: Normalize errors
    this.instance.interceptors.response.use(
      response => response,
      async error => {
        if (error.response?.status === 401) {
          await secureStorage.clearAllTokens();
        }
        return Promise.reject(this.normalizeError(error));
      },
    );
  }

  private normalizeError(error: any): { message: string; code?: string; status?: number } {
    if (error.response?.data?.message) {
      return {
        message: error.response.data.message,
        code: error.response.data.code || 'API_ERROR',
        status: error.response.status,
      };
    }
    if (error.message === 'Network Error') {
      return {
        message: 'Unable to connect to WashKart servers. Please check your internet connection.',
        code: 'NETWORK_ERROR',
      };
    }
    return {
      message: 'An unexpected error occurred. Please try again later.',
      code: 'UNKNOWN_ERROR',
    };
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.get(url, config);
    return response.data;
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.post(url, data, config);
    return response.data;
  }

  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.put(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.delete(url, config);
    return response.data;
  }
}

export const apiClient = new ApiClient();
export default apiClient;
