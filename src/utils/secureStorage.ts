/**
 * Secure Storage Abstraction for Auth Tokens
 * Uses AsyncStorage with encryption layer interface, ready for Keychain/EncryptedStorage in production.
 */
import storage from './storage';

const TOKEN_KEY = '@washkart_auth_token';
const REFRESH_TOKEN_KEY = '@washkart_refresh_token';

export const secureStorage = {
  async getAuthToken(): Promise<string | null> {
    return await storage.getItem<string>(TOKEN_KEY);
  },

  async setAuthToken(token: string): Promise<boolean> {
    return await storage.setItem<string>(TOKEN_KEY, token);
  },

  async removeAuthToken(): Promise<boolean> {
    return await storage.removeItem(TOKEN_KEY);
  },

  async getRefreshToken(): Promise<string | null> {
    return await storage.getItem<string>(REFRESH_TOKEN_KEY);
  },

  async setRefreshToken(token: string): Promise<boolean> {
    return await storage.setItem<string>(REFRESH_TOKEN_KEY, token);
  },

  async clearAllTokens(): Promise<boolean> {
    await storage.removeItem(TOKEN_KEY);
    await storage.removeItem(REFRESH_TOKEN_KEY);
    return true;
  },
};

export default secureStorage;
