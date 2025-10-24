'use client';

import React, { useState, useEffect } from 'react';
import { promotionsService, Promotion, Coupon } from '@/lib/promotions-service';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Gift, Star, Clock, Zap } from 'lucide-react';

interface PromotionsBannerProps {
  onPromotionSelect?: (promotion: Promotion) => void;
  onCouponSelect?: (coupon: Coupon) => void;
  rechargeAmount?: number;
  className?: string;
}

export default function PromotionsBanner({
  onPromotionSelect,
  onCouponSelect,
  rechargeAmount,
  className = ''
}: PromotionsBannerProps) {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [firstRechargeOffer, setFirstRechargeOffer] = useState<Promotion | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user?.customerId) {
      setLoading(false);
      return;
    }

    fetchPromotions();
  }, [isAuthenticated, user?.customerId, rechargeAmount]);

  const fetchPromotions = async () => {
    if (!user?.customerId) return;

    setLoading(true);
    setError(null);

    try {
      const [promotionsResponse, eligibilityResponse] = await Promise.all([
        rechargeAmount
          ? promotionsService.getWalletRechargePromotions(user.customerId, rechargeAmount)
          : promotionsService.getPromotions(),
        promotionsService.checkFirstRechargeEligibility(user.customerId)
      ]);

      if (rechargeAmount) {
        // Wallet recharge flow
        setPromotions(promotionsResponse.applicable_promotions);
        setCoupons(promotionsResponse.applicable_coupons);
      } else {
        // General promotions
        setPromotions(promotionsResponse.promotions);
      }

      // Set first recharge offer if eligible
      if (eligibilityResponse.is_eligible && eligibilityResponse.promotion) {
        setFirstRechargeOffer(eligibilityResponse.promotion);
      }
    } catch (error) {
      console.error('Failed to fetch promotions:', error);
      setError('Failed to load available offers');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-lg p-4">
          <div className="h-6 bg-orange-200 rounded mb-2"></div>
          <div className="h-4 bg-orange-150 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (error || (!firstRechargeOffer && promotions.length === 0 && coupons.length === 0)) {
    return null; // Don't show anything if no promotions available
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* First Recharge Special Offer Banner */}
      {firstRechargeOffer && (
        <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Gift className="h-6 w-6 text-green-600" />
              <CardTitle className="text-lg text-green-800">
                🎉 Special Offer for New Users!
              </CardTitle>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Limited Time
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="text-2xl font-bold text-green-700">
                {firstRechargeOffer.coupon
                  ? `Get ${firstRechargeOffer.coupon.value} FREE Minutes`
                  : firstRechargeOffer.promotion
                    ? `Get ${firstRechargeOffer.promotion.virtual_cash_percentage}% Bonus`
                    : 'Special Welcome Bonus'
                }
              </div>
              <CardDescription className="text-green-600">
                {firstRechargeOffer.coupon?.description || 'Special offer for new users'}
              </CardDescription>

              {firstRechargeOffer.promotion && (
                <p className="text-sm text-green-600">
                  Recharge: ₹{firstRechargeOffer.promotion.min_recharge_amount} - ₹{firstRechargeOffer.promotion.max_recharge_amount}
                </p>
              )}

              {firstRechargeOffer.coupon?.message && (
                <p className="text-xs text-green-500 italic">
                  {firstRechargeOffer.coupon.message}
                </p>
              )}

              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => onPromotionSelect?.(firstRechargeOffer.promotion || {} as Promotion)}
              >
                <Zap className="h-4 w-4 mr-2" />
                Claim This Offer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* General Promotions */}
      {promotions.length > 0 && !rechargeAmount && (
        <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-orange-600" />
              <CardTitle className="text-lg text-orange-800">
                Available Offers
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {promotions.slice(0, 3).map((promotion) => (
                <div
                  key={promotion.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-orange-800">
                      {promotion.title}
                    </h4>
                    <p className="text-sm text-orange-600">
                      {promotion.description}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-orange-300 text-orange-700 hover:bg-orange-50"
                    onClick={() => onPromotionSelect?.(promotion)}
                  >
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recharge-specific Promotions */}
      {rechargeAmount && promotions.length > 0 && (
        <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg text-blue-800">
                Offers for ₹{rechargeAmount} Recharge
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {promotions.map((promotion) => (
                <div
                  key={promotion.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-blue-800">
                      {promotion.free_minutes
                        ? `${promotion.free_minutes} FREE Minutes`
                        : promotion.discount_value
                          ? `₹${promotion.discount_value} Bonus`
                          : promotion.title
                      }
                    </h4>
                    <p className="text-sm text-blue-600">
                      {promotion.description}
                    </p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">
                    Applicable
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Coupons */}
      {coupons.length > 0 && (
        <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Badge className="h-5 w-5 text-purple-600" />
              <CardTitle className="text-lg text-purple-800">
                Available Coupon Codes
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {coupons.slice(0, 3).map((coupon) => (
                <div
                  key={coupon.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-purple-200"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-purple-800">
                        {coupon.code}
                      </h4>
                      <Badge variant="outline" className="text-purple-600 border-purple-300">
                        {coupon.discount}
                      </Badge>
                    </div>
                    <p className="text-sm text-purple-600">
                      {coupon.description}
                    </p>
                    {coupon.min_order_amount && (
                      <p className="text-xs text-purple-500">
                        Min. amount: ₹{coupon.min_order_amount}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-purple-300 text-purple-700 hover:bg-purple-50"
                    onClick={() => onCouponSelect?.(coupon)}
                  >
                    Apply
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Offer Expiry Notice */}
      {promotions.some(p => p.end_date) && (
        <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <Clock className="h-4 w-4 text-yellow-600" />
          <p className="text-sm text-yellow-700">
            ⏰ Limited time offers! Claim before they expire.
          </p>
        </div>
      )}
    </div>
  );
}