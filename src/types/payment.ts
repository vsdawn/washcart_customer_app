export type PaymentMode = 'UPI' | 'CARD' | 'NET_BANKING' | 'WALLET' | 'COD';
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';

export interface PaymentMethodOption {
  id: PaymentMode;
  name: string;
  description: string;
  iconName: string;
  isEnabled: boolean;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  paymentMode: PaymentMode;
  errorMessage?: string;
}
