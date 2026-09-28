/**
 * Environment configuration loader
 * Reads values from environment with fallback defaults for WashKart
 */

// The React Native TS config ships no Node types, so declare the bit of `process` used here.
declare const process: { env: Record<string, string | undefined> };

export const ENV = {
  APP_ENV: process.env.APP_ENV || 'development',
  USE_MOCK_API: process.env.USE_MOCK_API === undefined ? true : process.env.USE_MOCK_API === 'true',
  API_BASE_URL: process.env.API_BASE_URL || 'https://api-dev.washkart.com/v1',
  GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY || 'AIzaSyDevMockKey_WashKart_2026',
  PAYMENT_GATEWAY_KEY: process.env.PAYMENT_GATEWAY_KEY || 'rzp_test_washkart_mock_123',
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || 'washkart-dev-app',
};

export default ENV;
