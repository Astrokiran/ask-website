import { promotionsService, Coupon } from './promotions-service';
import { useAuth } from '@/contexts/AuthContext';

export interface PricingInfo {
  displayPrice: string;
  originalPrice: string;
  isFree: boolean;
  discountType: 'free_minutes' | 'percentage_discount' | 'none';
  offerDescription?: string;
  remainingFreeMinutes?: number;
  discountedPrice?: string;
}

class PricingService {
  private baseURL: string;

  constructor() {
    this.baseURL = (process.env as any).NEXT_PUBLIC_AUTH_GATEWAY_URL;
  }

  /**
   * Get pricing information for a guide based on user's offers and eligibility
   */
  async getPricingInfo(guidePricePerMinute: string, customerId?: number): Promise<PricingInfo> {
    console.log('🔍 getPricingInfo called:', { guidePricePerMinute, customerId });

    const defaultPricing: PricingInfo = {
      displayPrice: `₹${guidePricePerMinute}/min`,
      originalPrice: `₹${guidePricePerMinute}/min`,
      isFree: false,
      discountType: 'none'
    };

    // If no customer ID, return default pricing
    if (!customerId) {
      console.log('❌ No customer ID provided, returning default pricing');
      return defaultPricing;
    }

    try {
      console.log('🔍 Checking first recharge eligibility...');
      // Check for first recharge eligibility
      const firstRechargeEligibility = await promotionsService.checkFirstRechargeEligibility(customerId);
      console.log('✅ First recharge eligibility:', firstRechargeEligibility);

      console.log('🔍 Getting applicable coupons...');
      // Check for applicable coupons
      const couponsResponse = await promotionsService.getApplicableCoupons(customerId);
      const applicableCoupons = couponsResponse.coupons || [];
      console.log('✅ Applicable coupons received:', applicableCoupons);

      // Priority 1: First recharge free minutes
      if (firstRechargeEligibility.is_eligible && firstRechargeEligibility.coupon) {
        const coupon = firstRechargeEligibility.coupon;
        console.log('🎉 Found first recharge eligibility:', coupon);
        if (coupon.coupon_type === 'FREE_MINUTES') {
          const result = {
            displayPrice: 'FREE',
            originalPrice: `₹${guidePricePerMinute}/min`,
            isFree: true,
            discountType: 'free_minutes' as const,
            offerDescription: `${coupon.value} free minutes on first recharge`,
            remainingFreeMinutes: parseInt(coupon.value)
          };
          console.log('✅ Returning FREE pricing for first recharge:', result);
          return result;
        }
      }

      // Priority 2: Applicable free minutes coupons
      const freeMinutesCoupon = applicableCoupons.find(coupon =>
        coupon.coupon_type === 'FREE_MINUTES' && coupon.is_applicable
      );

      if (freeMinutesCoupon) {
        console.log('🎉 Found applicable free minutes coupon:', freeMinutesCoupon);
        const result = {
          displayPrice: 'FREE',
          originalPrice: `₹${guidePricePerMinute}/min`,
          isFree: true,
          discountType: 'free_minutes' as const,
          offerDescription: `${freeMinutesCoupon.value} free minutes available`,
          remainingFreeMinutes: parseInt(freeMinutesCoupon.value)
        };
        console.log('✅ Returning FREE pricing for applicable coupon:', result);
        return result;
      }

      // Priority 3: Percentage discount coupons
      const discountCoupon = applicableCoupons.find(coupon =>
        coupon.is_applicable &&
        coupon.coupon_type !== 'FREE_MINUTES' &&
        coupon.discount.includes('%')
      );

      if (discountCoupon) {
        // Extract percentage from discount string
        const percentageMatch = discountCoupon.discount.match(/(\d+)%/);
        if (percentageMatch) {
          const discountPercentage = parseInt(percentageMatch[1]);
          const originalPrice = parseFloat(guidePricePerMinute);
          const discountedPrice = originalPrice * (1 - discountPercentage / 100);

          return {
            displayPrice: `₹${discountedPrice.toFixed(2)}/min`,
            originalPrice: `₹${guidePricePerMinute}/min`,
            isFree: false,
            discountType: 'percentage_discount',
            offerDescription: `${discountPercentage}% discount applied`,
            discountedPrice: `₹${discountedPrice.toFixed(2)}`
          };
        }
      }

      // Priority 4: Fixed amount discounts
      const fixedDiscountCoupon = applicableCoupons.find(coupon =>
        coupon.is_applicable &&
        coupon.coupon_type !== 'FREE_MINUTES' &&
        coupon.discount.includes('₹')
      );

      if (fixedDiscountCoupon) {
        // Extract fixed amount from discount string
        const amountMatch = fixedDiscountCoupon.discount.match(/₹(\d+(?:\.\d+)?)/);
        if (amountMatch) {
          const discountAmount = parseFloat(amountMatch[1]);
          const originalPrice = parseFloat(guidePricePerMinute);
          const discountedPrice = Math.max(0, originalPrice - discountAmount);

          return {
            displayPrice: `₹${discountedPrice.toFixed(2)}/min`,
            originalPrice: `₹${guidePricePerMinute}/min`,
            isFree: false,
            discountType: 'percentage_discount',
            offerDescription: `₹${discountAmount} discount applied`,
            discountedPrice: `₹${discountedPrice.toFixed(2)}`
          };
        }
      }

      console.log('🎯 No offers found, returning default pricing');
      return defaultPricing;

    } catch (error) {
      console.error('💥 Error getting pricing info:', error);
      return defaultPricing;
    }
  }

  /**
   * Get cached pricing info (synchronous version for immediate display)
   */
  getCachedPricingInfo(guidePricePerMinute: string): PricingInfo {
    // For immediate display, we'll return basic pricing
    // This can be enhanced with local storage caching later
    return {
      displayPrice: `₹${guidePricePerMinute}/min`,
      originalPrice: `₹${guidePricePerMinute}/min`,
      isFree: false,
      discountType: 'none'
    };
  }

  /**
   * Check if user has any active offers that affect pricing
   */
  async hasActiveOffers(customerId: number): Promise<boolean> {
    try {
      const [eligibilityResponse, couponsResponse] = await Promise.all([
        promotionsService.checkFirstRechargeEligibility(customerId),
        promotionsService.getApplicableCoupons(customerId)
      ]);

      return eligibilityResponse.is_eligible ||
             (couponsResponse.coupons && couponsResponse.coupons.length > 0);
    } catch (error) {
      console.error('💥 Error checking active offers:', error);
      return false;
    }
  }
}

export const pricingService = new PricingService();
export type { PricingInfo };