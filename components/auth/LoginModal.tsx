'use client';

import { useState } from 'react';
import { authService } from '@/lib/auth-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Loader2, AlertCircle } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (phoneNumber: string) => void;
}

export default function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [requestId, setRequestId] = useState('');

  const resetForm = () => {
    setPhoneNumber('');
    setOtp('');
    setShowOTP(false);
    setError('');
    setRequestId('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authService.generateOTP({
        area_code: '+91',
        phone_number: phoneNumber,
        user_type: 'customer',
        purpose: 'login',
      });

      setRequestId(response.otp_request_id);
      setShowOTP(true);
    } catch (error: any) {
      setError(error.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await authService.validateOTP({
        area_code: '+91',
        phone_number: phoneNumber,
        user_type: 'customer',
        otp_code: otp,
        request_id: requestId,
        device_info: {
          device_type: 'web',
          device_name: 'Web Browser',
          platform: 'Web',
          platform_version: '1.0',
          app_version: '1.0.0',
          fcm_token: '', // Empty FCM token for web
        },
      });

      // Pass phone number to onSuccess BEFORE resetting form
      const phoneToPass = phoneNumber;
      console.log('📤 LoginModal - About to call onSuccess with phone:', phoneToPass);
      resetForm();
      onSuccess(phoneToPass);
    } catch (error: any) {
      setError(error.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await authService.generateOTP({
        area_code: '+91',
        phone_number: phoneNumber,
        user_type: 'customer',
        purpose: 'login',
      });

      setRequestId(response.otp_request_id);
      setOtp('');
      setError('');
    } catch (error: any) {
      setError(error.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhoneNumber(value);
    if (error) setError('');
  };

  const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
    if (error) setError('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {showOTP ? 'Enter OTP' : 'Login to Chat'}
          </DialogTitle>
          <DialogDescription className="text-center">
            {showOTP
              ? 'Enter the 6-digit OTP sent to your phone'
              : 'Enter your phone number to receive OTP'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {!showOTP ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    +91
                  </span>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="XXXXXXXXXX"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    className="pl-12"
                    disabled={loading}
                    maxLength={10}
                  />
                </div>
              </div>

              <Button
                onClick={handleSendOTP}
                disabled={loading || phoneNumber.length !== 10}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  'Send OTP'
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center text-sm text-gray-600">
                OTP sent to +91 {phoneNumber.slice(0, 5)}XXXXX
              </div>

              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="6-digit OTP"
                  value={otp}
                  onChange={handleOTPChange}
                  disabled={loading}
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                />
              </div>

              <Button
                onClick={handleVerifyOTP}
                disabled={loading || otp.length !== 6}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify OTP'
                )}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="text-sm text-orange-600 hover:text-orange-700 disabled:opacity-50"
                >
                  Resend OTP
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setShowOTP(false);
                    setOtp('');
                    setError('');
                  }}
                  className="text-sm text-gray-600 hover:text-gray-700"
                >
                  Change Phone Number
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          <div className="text-center text-xs text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}