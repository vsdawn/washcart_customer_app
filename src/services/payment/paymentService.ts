import { PaymentMode, PaymentMethodOption, PaymentResult } from '../../types/payment';
import ENV from '../../config/env';

export class PaymentService {
  public static getAvailablePaymentMethods(): PaymentMethodOption[] {
    return [
      {
        id: 'UPI',
        name: 'UPI (Google Pay, PhonePe, Paytm)',
        description: 'Pay instantly using any UPI app',
        iconName: 'qr-code-outline',
        isEnabled: true,
      },
      {
        id: 'CARD',
        name: 'Credit / Debit Card',
        description: 'Visa, Mastercard, RuPay, Amex',
        iconName: 'card-outline',
        isEnabled: true,
      },
      {
        id: 'NET_BANKING',
        name: 'Net Banking',
        description: 'All major Indian banks supported',
        iconName: 'account-balance-outline',
        isEnabled: true,
      },
      {
        id: 'WALLET',
        name: 'Mobile Wallets',
        description: 'Paytm Wallet, Amazon Pay, Mobikwik',
        iconName: 'wallet-outline',
        isEnabled: true,
      },
      {
        id: 'COD',
        name: 'Cash / Pay on Pickup',
        description: 'Pay via cash or UPI to delivery partner during pickup',
        iconName: 'cash-outline',
        isEnabled: true,
      },
    ];
  }

  public static async createPaymentOrder(
    amount: number,
    mode: PaymentMode,
    orderReference: string,
  ): Promise<{ paymentId: string; gatewayOptions?: any }> {
    // Abstraction point for Razorpay / Cashfree / Stripe SDK creation
    if (ENV.USE_MOCK_API) {
      await new Promise<void>(res => setTimeout(res, 500));
      return {
        paymentId: `pay_order_${Date.now()}`,
        gatewayOptions: {
          key: ENV.PAYMENT_GATEWAY_KEY,
          amount: amount * 100, // paise
          currency: 'INR',
          name: 'WashKart',
          description: `Payment for Order #${orderReference}`,
        },
      };
    }
    // Real Gateway SDK initiation call
    return { paymentId: `pay_real_${Date.now()}` };
  }

  public static async processPayment(
    amount: number,
    mode: PaymentMode,
    orderReference: string,
  ): Promise<PaymentResult> {
    if (mode === 'COD') {
      return {
        success: true,
        paymentMode: 'COD',
        transactionId: `COD_${Date.now()}`,
      };
    }

    // Mock payment processing delay & response
    await new Promise<void>(res => setTimeout(res, 1200));

    // Simulate 95% success rate for interactive testing
    const isSuccess = true;

    if (isSuccess) {
      return {
        success: true,
        transactionId: `TXN_${mode}_${Math.floor(10000000 + Math.random() * 90000000)}`,
        paymentMode: mode,
      };
    } else {
      return {
        success: false,
        paymentMode: mode,
        errorMessage: 'Payment transaction failed or was cancelled by user.',
      };
    }
  }

  public static async verifyPayment(transactionId: string): Promise<boolean> {
    await new Promise<void>(res => setTimeout(res, 400));
    return true;
  }

  public static handlePaymentFailure(error: any): string {
    if (typeof error === 'string') return error;
    return error?.message || 'Payment processing failed. Please try again.';
  }
}

export default PaymentService;
