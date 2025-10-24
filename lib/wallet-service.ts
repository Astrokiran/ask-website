import { authService } from '@/lib/auth-service';

interface WalletBalance {
  user_id: number;
  real_cash: string;
  virtual_cash: string;
  cumulative_sum: string;
  recharge_count: number;
}

interface PaymentOrder {
  status?: string;
  transaction_id?: number;
  order_id?: number | string;
  amount?: string;
  gateway_order_id?: string;
  message?: string;
  razorpay_key_id?: string;
  user_email?: string;
  user_name?: string;
  qr_code_id?: string;
  payment_url?: string;
  image_url?: string;
  expires_at?: string;
}

class WalletService {
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_CUSTOMER_API_URL || 'http://localhost:8082';
  }

  async getWalletBalance(): Promise<WalletBalance> {
    const headers = authService.getAuthHeaders();

    const userInfo = authService.getUserInfo();
    if (!userInfo) throw new Error('User not authenticated');

    // Use customerId if available, otherwise fallback to userId
    const customerId = userInfo.customerId || userInfo.userId;
    console.log('💰 Getting wallet balance for customerId:', customerId);
    console.log('👤 Full userInfo:', userInfo);

    if (!customerId) {
      throw new Error('No customer ID available - please complete customer profile creation');
    }

    const response = await fetch(`${this.baseURL}/${customerId}/wallet/balance`, {
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch wallet balance: ${response.statusText}`);
    }

    return response.json();
  }

  async createPaymentOrder(amount: number, paymentMethod: string = 'razorpay'): Promise<PaymentOrder> {
    const headers = authService.getAuthHeaders();

    const userInfo = authService.getUserInfo();
    if (!userInfo) throw new Error('User not authenticated');

    // Use customerId if available, otherwise fallback to userId
    const customerId = userInfo.customerId || userInfo.userId;

    if (!customerId) {
      throw new Error('No customer ID available - please complete customer profile creation');
    }

    // Note: API expects amount in paise, but backend handles conversion
    // Send amount in rupees as string (backend will convert to paise)
    const response = await fetch(`${this.baseURL}/${customerId}/wallet/payment-orders/`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        amount: amount.toString(),
        payment_method: paymentMethod.toUpperCase(),
        description: `Wallet Recharge - ₹${amount}`,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to create payment order: ${response.statusText}`);
    }

    return response.json();
  }

  async createQROrder(amount: number): Promise<PaymentOrder> {
    const headers = authService.getAuthHeaders();

    const userInfo = authService.getUserInfo();
    if (!userInfo) throw new Error('User not authenticated');

    // Use customerId if available, otherwise fallback to userId
    const customerId = userInfo.customerId || userInfo.userId;

    if (!customerId) {
      throw new Error('No customer ID available - please complete customer profile creation');
    }

    // For QR codes, use amount directly in rupees (not converted to paise)
    const response = await fetch(`${this.baseURL}/${customerId}/wallet/payment-orders/qr-code`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        amount: amount.toString(),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to create QR order: ${response.statusText}`);
    }

    return response.json();
  }

  // async verifyPayment(orderId: string, paymentId: string, signature: string): Promise<void> {
  //   const headers = authService.getAuthHeaders();

  //   const userInfo = authService.getUserInfo();
  //   if (!userInfo) throw new Error('User not authenticated');

  //   // Use customerId if available, otherwise fallback to userId
  //   const customerId = userInfo.customerId || userInfo.userId;

  //   if (!customerId) {
  //     throw new Error('No customer ID available - please complete customer profile creation');
  //   }

  //   const response = await fetch(`${this.baseURL}/${customerId}/wallet/payment-orders/verify-signature`, {
  //     method: 'POST',
  //     headers,
  //     body: JSON.stringify({
  //       order_id: orderId,
  //       payment_id: paymentId,
  //       signature,
  //     }),
  //   });

  //   if (!response.ok) {
  //     const errorData = await response.json().catch(() => ({}));
  //     throw new Error(errorData.message || `Payment verification failed: ${response.statusText}`);
  //   }
  // }

  async getTransactionHistory(): Promise<any[]> {
    const headers = authService.getAuthHeaders();

    const userInfo = authService.getUserInfo();
    if (!userInfo) throw new Error('User not authenticated');

    // Use customerId if available, otherwise fallback to userId
    const customerId = userInfo.customerId || userInfo.userId;

    if (!customerId) {
      throw new Error('No customer ID available - please complete customer profile creation');
    }

    const response = await fetch(`${this.baseURL}/${customerId}/wallet/transactions`, {
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch transactions: ${response.statusText}`);
    }

    const data = await response.json();
    return data.transactions || [];
  }
}

export const walletService = new WalletService();






