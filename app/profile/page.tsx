'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/lib/auth-service';
import { walletService } from '@/lib/wallet-service';
import { consultationService } from '@/lib/consultation-service';
import LoginModal from '@/components/auth/LoginModal';
import WalletRechargeModal from '@/components/wallet/WalletRechargeModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { NavBar } from '@/components/nav-bar';
import {
  User,
  Phone,
  Wallet,
  History,
  LogOut,
  Settings,
  IndianRupee,
  Calendar,
  MessageCircle,
  Star,
  CreditCard
} from 'lucide-react';

export default function ProfilePage() {
  const { user, isAuthenticated, logout, login } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState<any>(null);
  const [consultationHistory, setConsultationHistory] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserProfile();
    }
  }, [isAuthenticated, user]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      setError('');

      // Load wallet balance
      const balance = await walletService.getWalletBalance();
      setWalletBalance(balance);

      // Load consultation history
      const history = await consultationService.getConsultationHistory();
      setConsultationHistory(history);

    } catch (error: any) {
      console.error('Error loading profile:', error);
      setError(error.message || 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (phoneNumber: string) => {
    setShowLoginModal(false);
    login(phoneNumber);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setWalletBalance(null);
      setConsultationHistory([]);
      setError('');
    } catch (error: any) {
      console.error('Logout error:', error);
    }
  };

  const handleRechargeSuccess = () => {
    setShowRechargeModal(false);
    loadUserProfile();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen">
          <NavBar />

      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
            <p className="mt-2 text-gray-600">Please login to view your profile</p>
          </div>
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                  <User className="w-10 h-10 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Login Required</h3>
                  <p className="text-gray-600 text-sm mt-1">Access your profile and manage your account</p>
                </div>
                <Button onClick={() => setShowLoginModal(true)} className="w-full">
                  Login with OTP
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>


        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onSuccess={handleLoginSuccess}
        />
      </div>
      </div>
      );

  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Info Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarFallback className="text-2xl">
                    {user?.userType === 'customer' ? 'C' : 'G'}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">
                  {user?.userType === 'customer' ? 'Customer' : 'Astrologer'}
                </CardTitle>
                <CardDescription>
                  Customer ID: {user?.customerId || user?.userId}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">+91 {user?.phone || 'Not set'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm capitalize">{user?.userType}</span>
                </div>
                <Badge variant="secondary" className="w-full justify-center">
                  {user?.userType === 'customer' ? 'Customer Account' : 'Guide Account'}
                </Badge>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" disabled>
                  <Settings className="w-4 h-4 mr-2" />
                  Account Settings
                </Button>
                <Button variant="outline" className="w-full justify-start" disabled>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Payment Methods
                </Button>
                <Button variant="outline" className="w-full justify-start" disabled>
                  <History className="w-4 h-4 mr-2" />
                  Transaction History
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Wallet Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-green-600" />
                    <CardTitle>Wallet Balance</CardTitle>
                  </div>
                  <Button onClick={() => setShowRechargeModal(true)} size="sm">
                    Recharge
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-32"></div>
                  </div>
                ) : walletBalance ? (
                  <div className="space-y-4">
                    <div className="text-3xl font-bold text-green-600">
                      <IndianRupee className="w-6 h-6 inline" />
                      {walletBalance.cumulative_sum}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Real Cash</p>
                        <p className="font-semibold">
                          <IndianRupee className="w-3 h-3 inline" />
                          {walletBalance.real_cash}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Virtual Cash</p>
                        <p className="font-semibold">
                          <IndianRupee className="w-3 h-3 inline" />
                          {walletBalance.virtual_cash}
                        </p>
                      </div>
                    </div>
                    {/* Additional wallet fields from API response */}
                    <div className="border-t pt-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-500">Total Recharges</p>
                        <p className="font-semibold text-blue-600">
                          {walletBalance.recharge_count} times
                        </p>
                      </div>
                    </div>
                    {/* Debug: Show all available fields */}
                    {process.env.NODE_ENV === 'development' && (
                      <div className="border-t pt-3 mt-3">
                        <p className="text-xs text-gray-400 mb-1">Debug - Available fields:</p>
                        <pre className="text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                          {JSON.stringify(walletBalance, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500">Unable to load wallet balance</p>
                )}
              </CardContent>
            </Card>

            {/* Consultation History */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-blue-600" />
                  <CardTitle>Consultation History</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : consultationHistory.length > 0 ? (
                  <div className="space-y-4">
                    {consultationHistory.slice(0, 5).map((consultation, index) => (
                      <div key={index} className="border-b pb-4 last:border-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                              <MessageCircle className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                              <p className="font-medium">
                                {consultation.mode || 'Chat'} Consultation
                              </p>
                              <p className="text-sm text-gray-500">
                                {consultation.created_at ?
                                  new Date(consultation.created_at).toLocaleDateString() :
                                  'Recent'
                                }
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge
                              variant={consultation.status === 'completed' ? 'default' : 'secondary'}
                            >
                              {consultation.status || 'Unknown'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                    {consultationHistory.length > 5 && (
                      <Button variant="outline" className="w-full" disabled>
                        View All History
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <History className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500">No consultations yet</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Start chatting with astrologers to see your history here
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle>Your Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-orange-600">
                      {consultationHistory.length}
                    </div>
                    <p className="text-sm text-gray-500">Total Sessions</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {consultationHistory.filter(c => c.status === 'completed').length}
                    </div>
                    <p className="text-sm text-gray-500">Completed</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      <Star className="w-6 h-6" />
                    </div>
                    <p className="text-sm text-gray-500">Avg Rating</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
      />

      <WalletRechargeModal
        isOpen={showRechargeModal}
        onClose={() => setShowRechargeModal(false)}
        onSuccess={handleRechargeSuccess}
      />
    </div>
  );
}