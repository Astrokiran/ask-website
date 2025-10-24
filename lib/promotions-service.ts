interface Promotion {
  rule_id: number;
  name: string;
  user_types: string[];
  min_recharge_amount: string;
  max_recharge_amount: string;
  virtual_cash_percentage: string;
  is_active: boolean;
}

interface Coupon {
  id: string;
  code: string;
  title: string;
  description: string;
  coupon_type: string;
  discount: string;
  value: string;
  message: string;
  start_date: string;
  end_date: string;
  min_order_amount: number | null;
  max_usage_limit: number;
  usage_count: number;
  is_applicable: boolean;
  applicable_services: string[];
  reason_not_applicable: string | null;
}

interface PromotionsResponse {
  items: Promotion[];
  pagination: {
    page: number;
    per_page: number;
    total_items: number;
    total_pages: number;
  };
  user_type: string;
  first_recharge_coupon: Coupon;
}

interface CouponsResponse {
  coupons: Coupon[];
  total_count: number;
  success: boolean;
  message?: string;
}

class PromotionsService {
  private baseURL: string;

  constructor() {
    // Use the auth-gateway base URL since promotions are handled through customer service
    this.baseURL = (process.env as any).NEXT_PUBLIC_AUTH_GATEWAY_URL;
  }

  /**
   * Get all available promotions for the authenticated customer
   */
  async getPromotions(): Promise<PromotionsResponse> {
    const authHeaders = this.getAuthHeaders();
    const customerId = this.getCustomerIdFromTokens();

    try {
      const response = await fetch(`${this.baseURL}/api/v1/customers/promotions?user_id=${customerId}`, {
        method: 'GET',
        headers: authHeaders,
        mode: 'cors',
        credentials: 'omit',
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ Failed to fetch promotions:', response.status, errorData);
        throw new Error(`Failed to fetch promotions: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Promotions fetched successfully:', data);

      // Validate response structure
      if (!data || !data.items || !Array.isArray(data.items)) {
        console.error('❌ Invalid promotions response structure:', data);
        return {
          items: [],
          pagination: { page: 0, per_page: 0, total_items: 0, total_pages: 0 },
          user_type: '',
          first_recharge_coupon: {} as Coupon
        };
      }

      return data;
    } catch (error) {
      console.error('💥 Error fetching promotions:', error);
      throw error;
    }
  }

  /**
   * Get available coupons for a specific customer
   */
  async getCustomerCoupons(customerId: number): Promise<CouponsResponse> {
    const authHeaders = this.getAuthHeaders();

    try {
      const response = await fetch(`${this.baseURL}/api/v1/customers/${customerId}/wallet/coupons`, {
        method: 'GET',
        headers: authHeaders,
        mode: 'cors',
        credentials: 'omit',
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ Failed to fetch customer coupons:', response.status, errorData);
        throw new Error(`Failed to fetch customer coupons: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Customer coupons fetched successfully:', data);

      // Transform the nested response structure to match expected format
      let transformedCoupons: Coupon[] = [];

      if (data && data.data && data.data.promotions && Array.isArray(data.data.promotions)) {
        transformedCoupons = data.data.promotions.map((promo: any) => ({
          id: promo.couponInstanceId || promo.couponCode,
          code: promo.couponCode,
          title: promo.description || 'Special Coupon',
          description: promo.description,
          coupon_type: promo.couponType,
          discount: promo.couponType === 'FREE_MINUTES' ? `${promo.value} FREE Minutes` : `₹${promo.value} Bonus`,
          value: promo.value,
          message: promo.description || 'Special offer coupon',
          start_date: promo.grantedAt || new Date().toISOString().split('T')[0],
          end_date: promo.expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          min_order_amount: null,
          max_usage_limit: 1,
          usage_count: 0,
          is_applicable: true,
          applicable_services: ['chat', 'call'],
          reason_not_applicable: null
        }));
      }

      return {
        coupons: transformedCoupons,
        total_count: transformedCoupons.length,
        success: true,
        message: 'Coupons fetched successfully'
      };
    } catch (error) {
      console.error('💥 Error fetching customer coupons:', error);
      throw error;
    }
  }

  /**
   * Get applicable coupons for a specific customer (filtered for current usage)
   */
  async getApplicableCoupons(customerId: number): Promise<CouponsResponse> {
    const authHeaders = this.getAuthHeaders();

    try {
      const response = await fetch(`${this.baseURL}/api/v1/customers/${customerId}/wallet/applicable-coupons`, {
        method: 'GET',
        headers: authHeaders,
        mode: 'cors',
        credentials: 'omit',
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ Failed to fetch applicable coupons:', response.status, errorData);
        throw new Error(`Failed to fetch applicable coupons: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Applicable coupons fetched successfully:', data);

      // Transform the nested response structure to match expected format
      let transformedCoupons: Coupon[] = [];

      if (data && data.data && data.data.promotions && Array.isArray(data.data.promotions)) {
        transformedCoupons = data.data.promotions.map((promo: any) => ({
          id: promo.couponInstanceId || promo.couponCode,
          code: promo.couponCode,
          title: promo.description || 'Special Coupon',
          description: promo.description,
          coupon_type: promo.couponType,
          discount: promo.couponType === 'FREE_MINUTES' ? `${promo.value} FREE Minutes` : `₹${promo.value} Bonus`,
          value: promo.value,
          message: promo.description || 'Special offer coupon',
          start_date: promo.grantedAt || new Date().toISOString().split('T')[0],
          end_date: promo.expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          min_order_amount: null,
          max_usage_limit: 1,
          usage_count: 0,
          is_applicable: true,
          applicable_services: ['chat', 'call'],
          reason_not_applicable: null
        }));
      }

      return {
        coupons: transformedCoupons,
        total_count: transformedCoupons.length,
        success: true,
        message: 'Applicable coupons fetched successfully'
      };
    } catch (error) {
      console.error('💥 Error fetching applicable coupons:', error);
      throw error;
    }
  }

  /**
   * Check if user is eligible for first recharge bonus
   */
  async checkFirstRechargeEligibility(customerId: number): Promise<{
    is_eligible: boolean;
    promotion?: Promotion;
    coupon?: Coupon;
    message: string;
  }> {
    try {
      const promotionsResponse = await this.getPromotions();

      // Check if user is first_time and has first recharge coupon
      if (promotionsResponse.user_type === 'first_time' && promotionsResponse.first_recharge_coupon) {
        // Look for ₹1 recharge promotion for first time users
        const firstRechargePromotion = promotionsResponse.items.find(
          promo => promo.min_recharge_amount === "1.00" && promo.user_types.includes('first_time') && promo.is_active
        );

        // Transform the coupon data to match our interface
        const transformedCoupon: Coupon = {
          id: promotionsResponse.first_recharge_coupon.couponCode || 'first-recharge',
          code: promotionsResponse.first_recharge_coupon.couponCode || 'WELCOME5',
          title: 'Welcome Bonus',
          description: promotionsResponse.first_recharge_coupon.description || 'First recharge free minutes',
          coupon_type: promotionsResponse.first_recharge_coupon.coupon_type || 'FREE_MINUTES',
          discount: promotionsResponse.first_recharge_coupon.coupon_type === 'FREE_MINUTES'
            ? `${promotionsResponse.first_recharge_coupon.value} FREE Minutes`
            : `₹${promotionsResponse.first_recharge_coupon.value} Bonus`,
          value: promotionsResponse.first_recharge_coupon.value,
          message: promotionsResponse.first_recharge_coupon.message || 'Special welcome offer',
          start_date: new Date().toISOString().split('T')[0],
          end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          min_order_amount: null,
          max_usage_limit: 1,
          usage_count: 0,
          is_applicable: true,
          applicable_services: ['chat', 'call'],
          reason_not_applicable: null
        };

        return {
          is_eligible: true,
          promotion: firstRechargePromotion,
          coupon: transformedCoupon,
          message: `🎉 Congratulations! You're eligible for 5 FREE minutes on your first recharge`
        };
      }

      return {
        is_eligible: false,
        message: promotionsResponse.user_type === 'regular'
          ? 'This offer is only available for new users'
          : 'No first recharge promotions available'
      };
    } catch (error) {
      console.error('💥 Error checking first recharge eligibility:', error);
      return {
        is_eligible: false,
        message: 'Unable to verify eligibility'
      };
    }
  }

  /**
   * Get promotions specifically for wallet recharge flow
   */
  async getWalletRechargePromotions(customerId: number, rechargeAmount: number): Promise<{
    applicable_promotions: Promotion[];
    applicable_coupons: Coupon[];
    total_benefits: number;
    recommended_promotion?: Promotion;
  }> {
    try {
      const [promotionsResponse, couponsResponse] = await Promise.all([
        this.getPromotions(),
        this.getApplicableCoupons(customerId)
      ]);

      // Filter promotions applicable for the recharge amount
      const applicablePromotions = promotionsResponse.items.filter(promo => {
        if (!promo.is_active) return false;
        const minAmount = parseFloat(promo.min_recharge_amount);
        const maxAmount = parseFloat(promo.max_recharge_amount);
        return rechargeAmount >= minAmount && rechargeAmount <= maxAmount;
      });

      // Calculate total benefits
      let totalBenefits = 0;
      let recommendedPromotion: Promotion | undefined;

      applicablePromotions.forEach(promo => {
        const vcashPercentage = parseFloat(promo.virtual_cash_percentage);
        const benefitAmount = (rechargeAmount * vcashPercentage) / 100;
        totalBenefits += benefitAmount;

        // Recommend the promotion with highest benefit
        if (!recommendedPromotion || vcashPercentage > parseFloat(recommendedPromotion.virtual_cash_percentage)) {
          recommendedPromotion = promo;
        }
      });

      return {
        applicable_promotions: applicablePromotions,
        applicable_coupons: couponsResponse.coupons || [],
        total_benefits: totalBenefits,
        recommended_promotion: recommendedPromotion
      };
    } catch (error) {
      console.error('💥 Error fetching wallet recharge promotions:', error);
      return {
        applicable_promotions: [],
        applicable_coupons: [],
        total_benefits: 0
      };
    }
  }

  /**
   * Get authentication headers for API requests
   */
  private getAuthHeaders(): Record<string, string> {
    // Get tokens from localStorage or auth service
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
   * Get user ID from tokens
   */
  private getUserIdFromTokens(): number {
    const tokens = typeof window !== 'undefined'
      ? localStorage.getItem('auth_tokens')
      : null;

    if (!tokens) {
      throw new Error('User not authenticated');
    }

    try {
      const parsedTokens = JSON.parse(tokens);
      return parsedTokens.auth_user_id;
    } catch (error) {
      console.error('Failed to get user ID from tokens:', error);
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
        throw new Error('Customer ID not found. Please complete customer profile creation.');
      }
      return parsedTokens.customer_id;
    } catch (error) {
      console.error('Failed to get customer ID from tokens:', error);
      throw new Error('Customer profile not found. Please complete registration first.');
    }
  }

  /**
   * Format promotion for display
   */
  static formatPromotionForDisplay(promotion: Promotion): {
    title: string;
    description: string;
    benefit: string;
    terms?: string;
  } {
    const vcashPercentage = parseFloat(promotion.virtual_cash_percentage);
    let benefit = '';

    if (vcashPercentage > 0) {
      benefit = `💰 Get ${vcashPercentage}% Virtual Cash Bonus`;
    }

    return {
      title: promotion.name,
      description: `Get ${vcashPercentage}% bonus on recharge`,
      benefit,
      terms: `Valid for recharge amounts: ₹${promotion.min_recharge_amount} - ₹${promotion.max_recharge_amount}`
    };
  }

  /**
   * Format coupon for display
   */
  static formatCouponForDisplay(coupon: Coupon): {
    code: string;
    title: string;
    description: string;
    discount: string;
    value: string;
    message: string;
  } {
    return {
      code: coupon.code,
      title: coupon.title,
      description: coupon.description,
      discount: coupon.discount,
      value: coupon.value,
      message: coupon.message
    };
  }
}

export const promotionsService = new PromotionsService();
export type { Promotion, Coupon, PromotionsResponse, CouponsResponse };