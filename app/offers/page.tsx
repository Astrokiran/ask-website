'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { promotionsService, Promotion, Coupon } from '@/lib/promotions-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Gift,
  Star,
  Clock,
  Zap,
  IndianRupee,
  Calendar,
  Tag,
  CheckCircle,
  XCircle,
  AlertCircle,
  Copy
} from 'lucide-react';
import WalletRechargeModal from '@/components/wallet/WalletRechargeModal';

export default function OffersPage() {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [firstRechargeOffer, setFirstRechargeOffer] = useState<Promotion | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  const [activeTab, setActiveTab] = useState<'promotions' | 'coupons'>('promotions');

  useEffect(() => {
    if (isAuthenticated && user?.customerId) {
      fetchOffers();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user?.customerId]);

  const fetchOffers = async () => {
    if (!user?.customerId) {
      setError('Customer profile not found. Please complete your profile first.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [promotionsResponse, eligibilityResponse, couponsResponse] = await Promise.all([
        promotionsService.getPromotions(),
        promotionsService.checkFirstRechargeEligibility(user.customerId),
        promotionsService.getCustomerCoupons(user.customerId)
      ]);

      setPromotions(promotionsResponse.items);
      setCoupons(couponsResponse.coupons || []);

      if (eligibilityResponse.is_eligible && eligibilityResponse.promotion) {
        setFirstRechargeOffer(eligibilityResponse.promotion);
      }
    } catch (error) {
      console.error('Failed to fetch offers:', error);
      if (error instanceof Error && error.message.includes('Customer profile not found')) {
        setError(error.message);
      } else {
        setError('Failed to load available offers. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRechargeWithOffer = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setShowRechargeModal(true);
  };

  const copyCouponCode = (coupon: Coupon) => {
    navigator.clipboard.writeText(coupon.code);
    alert(`Coupon Code ${coupon.code} copied to clipboard!`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getPromotionIcon = (vcashPercentage: string) => {
    const percentage = parseFloat(vcashPercentage);
    if (percentage === 100) {
      return <Gift className="h-5 w-5 text-purple-600" />;
    } else if (percentage >= 50) {
      return <Star className="h-5 w-5 text-orange-600" />;
    } else if (percentage >= 30) {
      return <IndianRupee className="h-5 w-5 text-blue-600" />;
    } else {
      return <Tag className="h-5 w-5 text-green-600" />;
    }
  };

  const getPromotionColor = (vcashPercentage: string) => {
    const percentage = parseFloat(vcashPercentage);
    if (percentage === 100) {
      return 'border-purple-200 bg-purple-50';
    } else if (percentage >= 50) {
      return 'border-orange-200 bg-orange-50';
    } else if (percentage >= 30) {
      return 'border-blue-200 bg-blue-50';
    } else {
      return 'border-green-200 bg-green-50';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please login to view available offers and promotions.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🎉 Special Offers & Promotions
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Get the best value for your money with our exclusive offers, discounts, and promotions tailored just for you.
        </p>
      </div>

      {/* First Recharge Special Banner */}
      {firstRechargeOffer && (
        <Alert className="mb-8 border-2 border-green-200 bg-green-50">
          <Gift className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <div className="flex items-center justify-between">
              <div>
                <strong className="text-green-900">🎉 Welcome Bonus Available!</strong>
                <p className="text-green-700 mt-1">
                  As a new user, you're eligible for special benefits on your first recharge.
                </p>
              </div>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => handleRechargeWithOffer(firstRechargeOffer)}
              >
                Claim Welcome Bonus
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="mb-8 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <div className="space-y-6">
        {/* Tab Toggle */}
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <Button
            variant={activeTab === 'promotions' ? 'default' : 'ghost'}
            className={`flex-1 ${activeTab === 'promotions' ? 'bg-white dark:bg-gray-700 shadow-sm' : ''}`}
            onClick={() => setActiveTab('promotions')}
          >
            Promotions
          </Button>
          <Button
            variant={activeTab === 'coupons' ? 'default' : 'ghost'}
            className={`flex-1 ${activeTab === 'coupons' ? 'bg-white dark:bg-gray-700 shadow-sm' : ''}`}
            onClick={() => setActiveTab('coupons')}
          >
            Coupon Codes
          </Button>
        </div>

        {/* Promotions Content */}
        {activeTab === 'promotions' && (
          <div className="space-y-6">
            {promotions.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Gift className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Promotions</h3>
                  <p className="text-gray-600 text-center">
                    There are no active promotions at the moment. Check back soon for new offers!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {promotions.map((promotion) => (
                  <Card key={promotion.rule_id} className={`relative overflow-hidden ${getPromotionColor(promotion.virtual_cash_percentage)}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getPromotionIcon(promotion.virtual_cash_percentage)}
                          <CardTitle className="text-lg">{promotion.name}</CardTitle>
                        </div>
                        <Badge variant={promotion.is_active ? "default" : "secondary"}>
                          {promotion.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <CardDescription className="text-sm">
                        Virtual Cash Bonus on Recharge
                      </CardDescription>

                      {/* Promotion Benefits */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-blue-700">
                          <IndianRupee className="h-4 w-4" />
                          <span className="font-medium">
                            Get {promotion.virtual_cash_percentage}% Virtual Cash
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          Recharge Range: ₹{promotion.min_recharge_amount} - ₹{promotion.max_recharge_amount}
                        </div>
                        <div className="text-xs text-gray-500">
                          {promotion.user_types.includes('first_time') && (
                            <Badge variant="outline" className="text-xs">
                              New User Offer
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Action Button */}
                      <Button
                        className="w-full"
                        disabled={!promotion.is_active}
                        onClick={() => handleRechargeWithOffer(promotion)}
                      >
                        {promotion.is_active ? 'Claim Offer' : 'Expired'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Coupons Content */}
        {activeTab === 'coupons' && (
          <div className="space-y-6">
            {coupons.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Tag className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Available Coupons</h3>
                  <p className="text-gray-600 text-center">
                    You don't have any coupons available at the moment. Keep checking for new offers!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {coupons.map((coupon) => (
                  <Card key={coupon.id} className="border-purple-200 bg-purple-50">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-purple-800">{coupon.title}</CardTitle>
                        <div className="flex items-center gap-2">
                          {coupon.is_applicable ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600" />
                          )}
                          <Badge variant={coupon.is_applicable ? "default" : "secondary"}>
                            {coupon.is_applicable ? "Applicable" : "Not Applicable"}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <CardDescription className="text-sm text-purple-700">
                        {coupon.description}
                      </CardDescription>

                      {/* Coupon Code */}
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-purple-200">
                        <div>
                          <div className="font-mono font-bold text-purple-800">{coupon.code}</div>
                          <div className="text-sm text-purple-600">{coupon.discount}</div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyCouponCode(coupon)}
                          disabled={!coupon.is_applicable}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Applicable Services */}
                      {coupon.applicable_services.length > 0 && (
                        <div className="text-sm text-purple-600">
                          <strong>Applicable for:</strong> {coupon.applicable_services.join(', ')}
                        </div>
                      )}

                      {/* Min Order Amount */}
                      {coupon.min_order_amount && (
                        <div className="text-sm text-purple-600">
                          Minimum order: ₹{coupon.min_order_amount}
                        </div>
                      )}

                      {/* Validity */}
                      <div className="flex items-center gap-2 text-sm text-purple-600">
                        <Clock className="h-4 w-4" />
                        <span>
                          Valid: {formatDate(coupon.start_date)} - {formatDate(coupon.end_date)}
                        </span>
                      </div>

                      {/* Usage */}
                      <div className="flex items-center justify-between text-sm text-purple-600">
                        <span>Usage: {coupon.usage_count} / {coupon.max_usage_limit}</span>
                        {!coupon.is_applicable && coupon.reason_not_applicable && (
                          <span className="text-red-600 text-xs">{coupon.reason_not_applicable}</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Recharge Modal */}
      <WalletRechargeModal
        isOpen={showRechargeModal}
        onClose={() => setShowRechargeModal(false)}
        onSuccess={() => {
          setShowRechargeModal(false);
          fetchOffers(); // Refresh offers after successful recharge
        }}
        initialAmount={selectedPromotion?.min_recharge_amount}
      />
    </div>
  );
}