interface CreateServiceOrderRequest {
  consultant_id: number;
  service_type: string;
  is_quick_connect_order: boolean;
  coupon_code?: string;
}

interface CreateServiceOrderResponse {
  message: string;
  order: ServiceOrder;
}

interface ServiceOrder {
  order_id: number;
  user_id: number;
  consultant_id: number;
  service_type: string;
  status: string;
  price_per_minute: string;
  minutes_ordered?: number;
  seconds_ordered?: number;
  max_duration_minutes: number;
  max_duration_seconds: number;
  total_mrp: string;
  discount?: string;
  final_amount: string;
  consultant_share_percent?: string;
  consultant_share?: string;
  consultant_paid: boolean;
  consultant_payment_date?: string;
  payout_id?: number;
  created_at: string;
  completed_at?: string;
  metadata?: Record<string, any>;
}

interface StartOrderResponse {
  max_duration: {
    minutes: number;
    seconds: number;
  };
  message: string;
  order_id: number;
  status: string;
}

class ServiceOrderService {
  private baseURL: string;

  constructor() {
    this.baseURL = (process.env as any).NEXT_PUBLIC_AUTH_GATEWAY_URL;
  }

  /**
   * Create a service order with optional coupon code
   */
  async createServiceOrder(
    customerId: number,
    consultantId: number,
    serviceType: string = 'CHAT',
    isQuickConnect: boolean = false,
    couponCode?: string
  ): Promise<CreateServiceOrderResponse> {
    const authHeaders = this.getAuthHeaders();

    const requestBody: CreateServiceOrderRequest = {
      consultant_id: consultantId,
      service_type: serviceType,
      is_quick_connect_order: isQuickConnect,
      ...(couponCode && { coupon_code: couponCode })
    };

    console.log('🔍 Creating service order:', {
      customerId,
      consultantId,
      serviceType,
      isQuickConnect,
      couponCode,
      requestBody
    });

    try {
      const response = await fetch(`${this.baseURL}/api/v1/customers/${customerId}/orders`, {
        method: 'POST',
        headers: authHeaders,
        mode: 'cors',
        credentials: 'omit',
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ Failed to create service order:', response.status, errorData);

        // Try to parse error response for better error messages
        try {
          const errorJson = JSON.parse(errorData);
          throw new Error(errorJson.error || errorJson.message || `Failed to create service order: ${response.status}`);
        } catch {
          throw new Error(`Failed to create service order: ${response.status} - ${errorData}`);
        }
      }

      const data = await response.json();
      console.log('✅ Service order created successfully:', data);
      return data;
    } catch (error) {
      console.error('💥 Error creating service order:', error);
      throw error;
    }
  }

  /**
   * Confirm rates for a service order
   */
  async confirmOrderRates(customerId: number, orderId: number): Promise<{
    message: string;
    order_id: number;
    status: string;
  }> {
    const authHeaders = this.getAuthHeaders();

    try {
      const response = await fetch(`${this.baseURL}/api/v1/customers/${customerId}/orders/${orderId}/confirm-rates`, {
        method: 'POST',
        headers: authHeaders,
        mode: 'cors',
        credentials: 'omit',
        body: JSON.stringify({})
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ Failed to confirm order rates:', response.status, errorData);
        throw new Error(`Failed to confirm order rates: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Order rates confirmed successfully:', data);
      return data;
    } catch (error) {
      console.error('💥 Error confirming order rates:', error);
      throw error;
    }
  }

  /**
   * Start a service order
   */
  async startOrder(customerId: number, orderId: number): Promise<StartOrderResponse> {
    const authHeaders = this.getAuthHeaders();

    try {
      const response = await fetch(`${this.baseURL}/api/v1/customers/${customerId}/orders/${orderId}/start`, {
        method: 'POST',
        headers: authHeaders,
        mode: 'cors',
        credentials: 'omit',
        body: JSON.stringify({})
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ Failed to start order:', response.status, errorData);
        throw new Error(`Failed to start order: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Order started successfully:', data);
      return data;
    } catch (error) {
      console.error('💥 Error starting order:', error);
      throw error;
    }
  }

  /**
   * Check consultation feasibility before creating order
   */
  async checkConsultationFeasibility(
    customerId: number,
    consultantId: number,
    serviceType: string = 'CHAT',
    isQuickConnect: boolean = false,
    couponCode?: string
  ): Promise<{
    feasible: boolean;
    message: string;
  }> {
    const authHeaders = this.getAuthHeaders();

    try {
      // Build query parameters
      const queryParams = new URLSearchParams({
        mode: serviceType.toLowerCase(),
        check_type: isQuickConnect ? 'quick_connect' : 'order'
      });

      if (couponCode) {
        queryParams.append('coupon_code', couponCode);
      }

      const response = await fetch(
        `${this.baseURL}/api/v1/customers/${customerId}/wallet/consultants/${consultantId}/feasibility-check?${queryParams}`,
        {
          method: 'GET',
          headers: authHeaders,
          mode: 'cors',
          credentials: 'omit'
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ Failed to check consultation feasibility:', response.status, errorData);

        // Parse error response for better error messages
        try {
          const errorJson = JSON.parse(errorData);
          return {
            feasible: false,
            message: errorJson.error || errorJson.message || 'Feasibility check failed'
          };
        } catch {
          return {
            feasible: false,
            message: `Feasibility check failed: ${response.status}`
          };
        }
      }

      const data = await response.json();
      console.log('✅ Consultation feasibility check:', data);
      return data;
    } catch (error) {
      console.error('💥 Error checking consultation feasibility:', error);
      return {
        feasible: false,
        message: error instanceof Error ? error.message : 'Feasibility check failed'
      };
    }
  }

  /**
   * Complete a service order
   */
  async completeOrder(
    customerId: number,
    orderId: number,
    minutesSpent: number,
    secondsSpent: number = 0
  ): Promise<{
    message: string;
    order: any;
  }> {
    const authHeaders = this.getAuthHeaders();

    try {
      const response = await fetch(`${this.baseURL}/api/v1/customers/${customerId}/orders/${orderId}/complete`, {
        method: 'POST',
        headers: authHeaders,
        mode: 'cors',
        credentials: 'omit',
        body: JSON.stringify({
          minutes_spent: minutesSpent,
          seconds_spent: secondsSpent
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ Failed to complete order:', response.status, errorData);
        throw new Error(`Failed to complete order: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Order completed successfully:', data);
      return data;
    } catch (error) {
      console.error('💥 Error completing order:', error);
      throw error;
    }
  }

  /**
   * Get authentication headers for API requests
   */
  private getAuthHeaders(): Record<string, string> {
    const tokens = typeof window !== 'undefined'
      ? localStorage.getItem('auth_tokens')
      : null;

    if (!tokens) {
      throw new Error('User not authenticated');
    }

    try {
      const parsedTokens = JSON.parse(tokens);
      return {
        'Authorization': `Bearer ${parsedTokens.access_token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };
    } catch (error) {
      console.error('Failed to parse auth tokens:', error);
      throw new Error('Invalid authentication tokens');
    }
  }

  /**
   * Get customer ID from tokens
   */
  private getCustomerIdFromTokens(): number {
    const tokens = typeof window !== 'undefined'
      ? localStorage.getItem('auth_tokens')
      : null;

    if (!tokens) {
      throw new Error('User not authenticated');
    }

    try {
      const parsedTokens = JSON.parse(tokens);
      if (!parsedTokens.customer_id) {
        throw new Error('Customer ID not found');
      }
      return parsedTokens.customer_id;
    } catch (error) {
      console.error('Failed to get customer ID from tokens:', error);
      throw new Error('Customer profile not found');
    }
  }
}

export const serviceOrderService = new ServiceOrderService();
export type {
  CreateServiceOrderRequest,
  CreateServiceOrderResponse,
  ServiceOrder,
  StartOrderResponse
};