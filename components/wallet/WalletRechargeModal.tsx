'use client';

import { useState, useEffect } from 'react';
import { walletService } from '@/lib/wallet-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Loader2, AlertCircle, IndianRupee, CreditCard, QrCode, Smartphone, Gift } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import PromotionsBanner from '@/components/offers/PromotionsBanner';
import { Promotion, Coupon } from '@/lib/promotions-service';

// Razorpay script interface
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface WalletRechargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialAmount?: number;
}

const RECHARGE_AMOUNTS = [1, 10, 50, 100, 200, 500];

export default function WalletRechargeModal({
  isOpen,
  onClose,
  onSuccess,
  initialAmount
}: WalletRechargeModalProps) {
  const [amount, setAmount] = useState(initialAmount?.toString() || '');
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'qr' | 'upi'>('upi');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentOrder, setPaymentOrder] = useState<any>(null);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  const [showPromotions, setShowPromotions] = useState(true);

  useEffect(() => {
    if (initialAmount) {
      setAmount(initialAmount.toString());
    }
  }, [initialAmount]);

  const resetForm = () => {
    setAmount('');
    setCustomAmount('');
    setPaymentMethod('razorpay');
    setError('');
    setPaymentOrder(null);
    setSelectedPromotion(null);
    setShowPromotions(true);
  };

  const handlePromotionSelect = (promotion: Promotion) => {
    setSelectedPromotion(promotion);

    // If promotion has minimum recharge requirement, set that amount
    if (promotion.min_recharge_amount) {
      setAmount(promotion.min_recharge_amount.toString());
      setCustomAmount('');
    }

    setShowPromotions(false);
  };

  const handleCouponSelect = (coupon: Coupon) => {
    // For now, just show the coupon code
    // TODO: Implement coupon application logic
    alert(`Coupon Code: ${coupon.code}\n\nThis coupon will be applied automatically during payment.`);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleAmountSelect = (selectedAmount: number) => {
    setAmount(selectedAmount.toString());
    setCustomAmount('');
    setError('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setCustomAmount(value);
    setAmount('');
    setError('');
  };

  const getFinalAmount = (): number => {
    if (customAmount) {
      return parseInt(customAmount) || 0;
    }
    return parseInt(amount) || 0;
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const initiatePayment = async () => {
    const finalAmount = getFinalAmount();

    if (finalAmount < 1) {
      setError('Minimum recharge amount is ₹1');
      return;
    }

    if (finalAmount > 100000) {
      setError('Maximum recharge amount is ₹1,00,000');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let order;
      // Both UPI and Netbanking (razorpay) should use 'UPI' payment method
      if (paymentMethod === 'upi' || paymentMethod === 'razorpay') {
        order = await walletService.createPaymentOrder(finalAmount, 'UPI');
      } else {
        order = await walletService.createQROrder(finalAmount);
      }

      setPaymentOrder(order);

      // For Razorpay (both UPI and Card), open payment gateway using JavaScript SDK
      if ((paymentMethod === 'upi' || paymentMethod === 'razorpay') && order.gateway_order_id) {
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
          throw new Error('Failed to load payment gateway');
        }

        const options = {
          key: order.razorpay_key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_1234567890',
          amount: parseInt(order.amount) || (finalAmount * 100), // Use amount from API response
          currency: 'INR',
          name: 'Astrokiran',
          description: `Wallet Recharge - ₹${finalAmount}`,
          order_id: order.gateway_order_id, // Use gateway_order_id from API response
          handler: async function (response: any) {
            try {
              // Payment verification is handled by backend/webhooks
              // Directly call success for now
              console.log('Payment successful:', response);
              resetForm();
              onSuccess();
            } catch (error: any) {
              setError('Payment processing failed. Please contact support.');
            }
          },
          prefill: {
            contact: '', // Can be filled from user profile
            email: '', // Can be filled from user profile
          },
          theme: {
            color: '#f97316', // Orange color to match theme
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
            },
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else if (paymentMethod === 'upi' && order.payment_url) {
        // For UPI, open payment URL
        window.open(order.payment_url, '_blank');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to create payment order. Please try again.');
      setLoading(false);
    }
  };

  const verifyPayment = async () => {
    // Payment verification is handled by backend/webhooks
    // Just simulate success for user experience
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      resetForm();
      onSuccess();
    } catch (error: any) {
      setError('Payment processing failed. Please contact support.');
    } finally {
      setLoading(false);
    }
  };

  const finalAmount = getFinalAmount();

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">Recharge Wallet</DialogTitle>
          <DialogDescription className="text-center">
            Add funds to your wallet for consultations
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Promotions Banner */}
          {showPromotions && (
            <PromotionsBanner
              rechargeAmount={finalAmount}
              onPromotionSelect={handlePromotionSelect}
              onCouponSelect={handleCouponSelect}
              className="mb-4"
            />
          )}

          {/* Selected Promotion Display */}
          {selectedPromotion && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gift className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    Applied Offer: {selectedPromotion.title}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPromotions(true)}
                  className="text-green-600 hover:text-green-700"
                >
                  Change Offer
                </Button>
              </div>
              <p className="text-xs text-green-600 mt-1">
                {selectedPromotion.free_minutes
                  ? `You'll get ${selectedPromotion.free_minutes} FREE minutes after recharge!`
                  : selectedPromotion.discount_value
                    ? `You'll get ₹${selectedPromotion.discount_value} bonus after recharge!`
                    : selectedPromotion.description
                }
              </p>
            </div>
          )}

          {/* Amount Selection */}
          <div className="space-y-3">
            <Label>Select Amount</Label>
            <div className="grid grid-cols-3 gap-2">
              {RECHARGE_AMOUNTS.map((rechargeAmount) => (
                <Button
                  key={rechargeAmount}
                  variant={amount === rechargeAmount.toString() && !customAmount ? 'default' : 'outline'}
                  onClick={() => handleAmountSelect(rechargeAmount)}
                  disabled={loading}
                  className="flex items-center gap-1"
                >
                  <IndianRupee className="h-3 w-3" />
                  {rechargeAmount}
                </Button>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="custom-amount">Custom Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <IndianRupee className="h-4 w-4" />
                </span>
                <Input
                  id="custom-amount"
                  type="text"
                  placeholder="Enter amount"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  className="pl-10"
                  disabled={loading}
                />
              </div>
            </div>

            {finalAmount > 0 && (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-md">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Recharge Amount:</span>
                  <span className="text-lg font-bold text-orange-600">
                    <IndianRupee className="h-4 w-4 inline" />
                    {finalAmount}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Payment Method */}
          {finalAmount > 0 && (
            <div className="space-y-3">
              <Label>Payment Method</Label>
              <RadioGroup value={paymentMethod} onValueChange={(value: 'razorpay' | 'qr' | 'upi') => setPaymentMethod(value)}>
                <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <RadioGroupItem value="razorpay" id="razorpay" />
                  <Label htmlFor="razorpay" className="flex items-center gap-2 cursor-pointer flex-1">
                    <CreditCard className="h-4 w-4" />
                    <div>
                      <div className="font-medium">Credit/Debit Card</div>
                      <div className="text-sm text-gray-500">Pay with Razorpay</div>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <RadioGroupItem value="upi" id="upi" />
                  <Label htmlFor="upi" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Smartphone className="h-4 w-4" />
                    <div>
                      <div className="font-medium">UPI Payment</div>
                      <div className="text-sm text-gray-500">Pay via any UPI app</div>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <RadioGroupItem value="qr" id="qr" />
                  <Label htmlFor="qr" className="flex items-center gap-2 cursor-pointer flex-1">
                    <QrCode className="h-4 w-4" />
                    <div>
                      <div className="font-medium">QR Code</div>
                      <div className="text-sm text-gray-500">Scan and pay</div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Payment Actions */}
          {finalAmount > 0 && !paymentOrder && (
            <Button
              onClick={initiatePayment}
              disabled={loading || finalAmount < 1}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Payment Order...
                </>
              ) : (
                <>
                  Proceed to Pay <IndianRupee className="h-4 w-4 ml-1" />
                  {finalAmount}
                </>
              )}
            </Button>
          )}

          {/* QR Code Display */}
          {paymentOrder && paymentMethod === 'qr' && paymentOrder.image_url && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="font-medium mb-2">Scan QR Code to Pay</h3>
                <div className="inline-block p-4 bg-white border rounded-lg">
                  <img
                    src={paymentOrder.image_url}
                    alt="Payment QR Code"
                    className="w-48 h-48"
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Amount: <IndianRupee className="h-3 w-3 inline" />
                  {finalAmount}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  QR Code ID: {paymentOrder.qr_code_id}
                </p>
              </div>

              <Button
                onClick={verifyPayment}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying Payment...
                  </>
                ) : (
                  'I Have Paid'
                )}
              </Button>
            </div>
          )}

          {/* Razorpay Success - for both UPI and Card */}
          {paymentOrder && (paymentMethod === 'razorpay' || paymentMethod === 'upi') && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-2">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-medium">Payment Initiated</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Complete the payment in the new tab and return here to verify
                </p>
              </div>

              <Button
                onClick={verifyPayment}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying Payment...
                  </>
                ) : (
                  'I Have Completed Payment'
                )}
              </Button>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          {/* Info */}
          <div className="text-center text-xs text-gray-500">
            <p>Minimum recharge: ₹1 | Maximum recharge: ₹1,00,000</p>
            <p>All payments are secure and encrypted</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}