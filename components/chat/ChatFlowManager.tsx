'use client';

import { useState, useEffect } from 'react';
import { authService } from '@/lib/auth-service';
import { walletService } from '@/lib/wallet-service';
import { consultationService } from '@/lib/consultation-service';
import { serviceOrderService } from '@/lib/service-order-service';
import { promotionsService } from '@/lib/promotions-service';
import { useAuth } from '@/contexts/AuthContext';
import LoginModal from '../auth/LoginModal';
import WalletRechargeModal from '../wallet/WalletRechargeModal';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Wallet, AlertCircle, Loader2, CheckCircle, Gift } from 'lucide-react';
import type { Guide } from '@/types/guide';

interface ChatFlowManagerProps {
  guide: Guide;
  isOpen: boolean;
  onClose: () => void;
  onChatStarted: (consultationId: string, pairId: string) => void;
}

interface WalletBalance {
  user_id: number;
  real_cash_balance: number;
  virtual_cash_balance: number;
  total_balance: number;
}

export default function ChatFlowManager({
  guide,
  isOpen,
  onClose,
  onChatStarted
}: ChatFlowManagerProps) {
  const { user, isAuthenticated, login: authLogin } = useAuth();
  const [currentStep, setCurrentStep] = useState<'login' | 'wallet-check' | 'recharge' | 'creating' | 'success' | 'error'>('login');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [walletBalance, setWalletBalance] = useState<WalletBalance | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [applicableCoupon, setApplicableCoupon] = useState<any>(null);
  const [orderResponse, setOrderResponse] = useState<any>(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      resetFlow();
      checkUserStatus();
    } else {
      resetFlow();
    }
  }, [isOpen]);

  const resetFlow = () => {
    setCurrentStep('login');
    setShowLoginModal(false);
    setShowRechargeModal(false);
    setLoading(false);
    setError('');
    setWalletBalance(null);
    setSuccessMessage('');
    setPhoneNumber('');
    setApplicableCoupon(null);
    setOrderResponse(null);
  };

  const checkUserStatus = async () => {
    try {
      // Check if user is authenticated using AuthContext
      if (isAuthenticated && user) {
        setCurrentStep('wallet-check');
        await checkWalletBalance();
      } else {
        setCurrentStep('login');
      }
    } catch (error) {
      console.error('Error checking user status:', error);
      setCurrentStep('login');
    }
  };

  const checkWalletBalance = async () => {
    try {
      setLoading(true);

      // Get wallet balance
      const balance = await walletService.getWalletBalance();
      setWalletBalance(balance);

      // Check for applicable coupons
      await checkApplicableCoupons();

    } catch (error: any) {
      console.error('Error checking wallet balance:', error);
      setError(error.message || 'Failed to check wallet balance');
      setCurrentStep('error');
    } finally {
      setLoading(false);
    }
  };

  const checkApplicableCoupons = async () => {
    try {
      if (!user?.customerId) {
        throw new Error('Customer ID not found');
      }

      console.log('🔍 Checking applicable coupons for customer:', user.customerId);

      // Check for first recharge eligibility
      const firstRechargeEligibility = await promotionsService.checkFirstRechargeEligibility(user.customerId);

      // Check for applicable coupons
      const couponsResponse = await promotionsService.getApplicableCoupons(user.customerId);
      const applicableCoupons = couponsResponse.coupons || [];

      console.log('✅ First recharge eligibility:', firstRechargeEligibility);
      console.log('✅ Applicable coupons:', applicableCoupons);

      let bestCoupon = null;

      // Priority 1: First recharge free minutes
      if (firstRechargeEligibility.is_eligible && firstRechargeEligibility.coupon) {
        const coupon = firstRechargeEligibility.coupon;
        if (coupon.coupon_type === 'FREE_MINUTES') {
          bestCoupon = coupon;
          console.log('🎉 Using first recharge free minutes coupon:', bestCoupon);
        }
      }

      // Priority 2: Other applicable free minutes coupons
      if (!bestCoupon) {
        const freeMinutesCoupon = applicableCoupons.find(coupon =>
          coupon.coupon_type === 'FREE_MINUTES' && coupon.is_applicable
        );
        if (freeMinutesCoupon) {
          bestCoupon = freeMinutesCoupon;
          console.log('🎉 Using applicable free minutes coupon:', bestCoupon);
        }
      }

      // Priority 3: Other applicable coupons
      if (!bestCoupon && applicableCoupons.length > 0) {
        bestCoupon = applicableCoupons.find(coupon => coupon.is_applicable);
        console.log('🎉 Using applicable coupon:', bestCoupon);
      }

      setApplicableCoupon(bestCoupon);

      // Now check consultation feasibility with coupon
      await checkConsultationFeasibility(bestCoupon);

    } catch (error) {
      console.error('💥 Error checking applicable coupons:', error);
      // Fallback to wallet balance check
      if (walletBalance && walletBalance.total_balance >= 1) {
        setCurrentStep('creating');
        createConsultation();
      } else {
        setCurrentStep('recharge');
      }
    }
  };

  const checkConsultationFeasibility = async (coupon?: any) => {
    try {
      if (!user?.customerId) {
        throw new Error('Customer ID not found');
      }

      const consultantId = guide.id; // Assuming guide.id is the consultant ID
      const couponCode = coupon?.code;

      console.log('🔍 Checking consultation feasibility:', {
        customerId: user.customerId,
        consultantId,
        couponCode
      });

      const feasibility = await serviceOrderService.checkConsultationFeasibility(
        user.customerId,
        consultantId,
        'CHAT',
        false,
        couponCode
      );

      console.log('✅ Consultation feasibility result:', feasibility);

      if (feasibility.feasible) {
        setCurrentStep('creating');
        await createServiceOrder(coupon);
      } else {
        console.log('❌ Consultation not feasible:', feasibility.message);
        setError(feasibility.message);
        setCurrentStep('error');
      }

    } catch (error) {
      console.error('💥 Error checking consultation feasibility:', error);
      setError(error instanceof Error ? error.message : 'Failed to check consultation feasibility');
      setCurrentStep('error');
    }
  };

  const createServiceOrder = async (coupon?: any) => {
    try {
      setLoading(true);
      setError('');

      if (!user?.customerId) {
        throw new Error('User not authenticated');
      }

      const consultantId = guide.id; // Assuming guide.id is the consultant ID
      const couponCode = coupon?.code;

      console.log('🔍 Creating service order:', {
        customerId: user.customerId,
        consultantId,
        couponCode
      });

      // Create service order with coupon
      const orderResponse = await serviceOrderService.createServiceOrder(
        user.customerId,
        consultantId,
        'CHAT',
        false,
        couponCode
      );

      console.log('✅ Service order created:', orderResponse);
      setOrderResponse(orderResponse);

      // Confirm order rates
      await serviceOrderService.confirmOrderRates(
        user.customerId,
        orderResponse.order.order_id
      );

      // Start the order
      const startResponse = await serviceOrderService.startOrder(
        user.customerId,
        orderResponse.order.order_id
      );

      console.log('✅ Order started:', startResponse);

      setCurrentStep('success');
      setSuccessMessage(coupon
        ? `${coupon.description || 'Free consultation started'}! Starting chat...`
        : 'Consultation created successfully! Starting chat...'
      );

      // For now, we'll create a consultation for compatibility
      // TODO: Update this to use the actual order ID when the chat system is updated
      const consultation = await consultationService.createConsultation({
        guide_id: guide.id,
        mode: 'chat',
        service_type: 'consultation',
      });

      // Notify parent component
      setTimeout(() => {
        onChatStarted(consultation.consultation_id, consultation.pair_id);
        onClose();
      }, 2000);

    } catch (error: any) {
      console.error('💥 Error creating service order:', error);
      setError(error.message || 'Failed to create consultation');
      setCurrentStep('error');
    } finally {
      setLoading(false);
    }
  };

  // Fallback function for backward compatibility
  const createConsultation = async () => {
    await createServiceOrder(applicableCoupon);
  };

  const handleLoginSuccess = async (phone: string) => {
    console.log('🎉 handleLoginSuccess called with phone:', phone);

    // Update AuthContext immediately
    authLogin(phone);

    // Update UI states
    setPhoneNumber(phone);
    setShowLoginModal(false);
    setCurrentStep('wallet-check');

    // Pass phone number directly to avoid state timing issues
    await ensureCustomerProfile(phone);
  };

  const ensureCustomerProfile = async (phone?: string) => {
    try {
      setLoading(true);
      setError('');

      // Use the passed phone number or fall back to state
      const phoneToUse = phone || phoneNumber;
      console.log('🔍 ensureCustomerProfile called');
      console.log('📱 phoneNumber parameter:', phone);
      console.log('📱 phoneNumber state:', phoneNumber);
      console.log('📱 phoneToUse:', phoneToUse);
      console.log('👤 user state:', user);

      if (!phoneToUse) {
        console.error('❌ Phone number is empty');
        throw new Error('Phone number not available');
      }

      console.log('✅ Phone number available, calling authService.ensureCustomerExists');
      // Create customer with phone number (backend will handle if already exists)
      await authService.ensureCustomerExists(phoneToUse);
      console.log('✅ Customer profile ensured');
      checkWalletBalance();
    } catch (error: any) {
      console.error('💥 Error ensuring customer profile:', error);
      setError(error.message || 'Failed to create customer profile');
      setCurrentStep('error');
    } finally {
      setLoading(false);
    }
  };

  const handleRechargeSuccess = () => {
    setShowRechargeModal(false);
    setCurrentStep('wallet-check');
    checkWalletBalance();
  };

  const handleLogin = () => {
    setShowLoginModal(true);
  };

  const handleRecharge = () => {
    setShowRechargeModal(true);
  };

  const handleRetry = () => {
    setError('');
    if (currentStep === 'error') {
      checkUserStatus();
    }
  };

  const getRequiredAmount = () => {
    if (!walletBalance) return 1;
    return Math.max(1, 1 - walletBalance.total_balance);
  };

  const renderContent = () => {
    switch (currentStep) {
      case 'login':
        return (
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold">Login Required</h3>
            <p className="text-gray-600">
              Please login to start chatting with {guide.full_name}
            </p>
            <Button onClick={handleLogin} className="w-full">
              Login with OTP
            </Button>
          </div>
        );

      case 'wallet-check':
        return (
          <div className="text-center space-y-4">
            {loading ? (
              <>
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-orange-600" />
                <h3 className="text-lg font-semibold">Checking Eligibility...</h3>
                <p className="text-gray-600">Please wait while we check your offers and wallet balance</p>
              </>
            ) : (
              <>
                {applicableCoupon && applicableCoupon.coupon_type === 'FREE_MINUTES' ? (
                  <>
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <Gift className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-green-600">Free Consultation Available!</h3>
                    <div className="space-y-2">
                      <p className="text-xl font-bold text-green-600">
                        {applicableCoupon.value} FREE Minutes
                      </p>
                      <p className="text-sm text-green-700 bg-green-50 p-2 rounded-lg">
                        {applicableCoupon.description || 'Special offer for new users'}
                      </p>
                      <p className="text-xs text-green-600">
                        Coupon: {applicableCoupon.code}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <Wallet className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold">Wallet Balance</h3>
                    {walletBalance && (
                      <div className="space-y-2">
                        <p className="text-2xl font-bold text-green-600">
                          ₹{walletBalance.total_balance}
                        </p>
                        <p className="text-sm text-gray-600">
                          Available for consultations
                        </p>
                        {applicableCoupon && (
                          <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded-lg">
                            🎁 {applicableCoupon.discount} applied
                          </p>
                        )}
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        );

      case 'recharge':
        return (
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold">Insufficient Balance</h3>
            <p className="text-gray-600">
              {walletBalance
                ? `You have ₹${walletBalance.total_balance}. Add at least ₹${getRequiredAmount()} to start chatting.`
                : 'Please add funds to your wallet to start chatting.'
              }
            </p>
            <Button onClick={handleRecharge} className="w-full">
              Recharge Wallet
            </Button>
          </div>
        );

      case 'creating':
        return (
          <div className="text-center space-y-4">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-orange-600" />
            <h3 className="text-lg font-semibold">Creating Consultation...</h3>
            <p className="text-gray-600">
              Setting up your chat session with {guide.full_name}
            </p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-green-600">Success!</h3>
            <p className="text-gray-600">{successMessage}</p>
          </div>
        );

      case 'error':
        return (
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-red-600">Error</h3>
            <p className="text-gray-600">{error}</p>
            <Button onClick={handleRetry} variant="outline" className="w-full">
              Try Again
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              Start Chat with {guide.full_name}
            </DialogTitle>
          </DialogHeader>
          <div className="min-h-[300px] flex items-center justify-center">
            {renderContent()}
          </div>
        </DialogContent>
      </Dialog>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
      />

      {/* Wallet Recharge Modal */}
      <WalletRechargeModal
        isOpen={showRechargeModal}
        onClose={() => setShowRechargeModal(false)}
        onSuccess={handleRechargeSuccess}
        initialAmount={getRequiredAmount()}
      />
    </>
  );
}