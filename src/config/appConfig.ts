/**
 * Brand & Application Configuration for WashKart
 */

export const APP_CONFIG = {
  name: 'WashKart',
  tagline: 'Fresh clothes. Delivered.',
  version: '1.0.0',
  currencySymbol: '₹',
  currencyCode: 'INR',
  supportPhone: '+91 80009 88888',
  supportEmail: 'support@washkart.com',
  whatsappSupportNumber: '+919876543210',

  // Business Rules
  minOrderAmount: 199, // INR
  freeDeliveryThreshold: 499, // INR
  defaultDeliveryFee: 40, // INR
  taxRatePercent: 18, // GST 18%
  minProcessingTimeHours: 24,

  // Deep linking scheme
  deepLinkScheme: 'washkart',
};

export default APP_CONFIG;
