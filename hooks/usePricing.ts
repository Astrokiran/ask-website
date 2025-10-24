'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { pricingService, PricingInfo } from '@/lib/pricing-service';

export const usePricing = (guidePricePerMinute: string) => {
  const { user, isAuthenticated } = useAuth();
  const [pricingInfo, setPricingInfo] = useState<PricingInfo>({
    displayPrice: isAuthenticated ? `₹${guidePricePerMinute}/min` : 'Login to see price',
    originalPrice: `₹${guidePricePerMinute}/min`,
    isFree: false,
    discountType: 'none'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPricingInfo = async () => {
      console.log('🔍 usePricing hook triggered:', { isAuthenticated, customerId: user?.customerId, guidePricePerMinute });

      if (!isAuthenticated || !user?.customerId) {
        // Show login prompt for non-authenticated users
        console.log('❌ User not authenticated, showing login prompt');
        setPricingInfo({
          displayPrice: 'Login to see price',
          originalPrice: `₹${guidePricePerMinute}/min`,
          isFree: false,
          discountType: 'none'
        });
        return;
      }

      setLoading(true);
      try {
        console.log('🔍 Fetching pricing info for customer:', user.customerId);
        const info = await pricingService.getPricingInfo(guidePricePerMinute, user.customerId);
        console.log('✅ Pricing info received:', info);
        setPricingInfo(info);
      } catch (error) {
        console.error('💥 Failed to fetch pricing info:', error);
        // Fallback to default pricing
        setPricingInfo({
          displayPrice: `₹${guidePricePerMinute}/min`,
          originalPrice: `₹${guidePricePerMinute}/min`,
          isFree: false,
          discountType: 'none'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPricingInfo();
  }, [isAuthenticated, user?.customerId, guidePricePerMinute]);

  return { pricingInfo, loading };
};