import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Define the shape of the context data
interface AuthContextType {
  isLoggedIn: boolean;
  showLoginModal: boolean;
  handleOpenLoginModal: () => void;
  handleLogout: () => void;
  handleCloseModals: () => void;
  // We'll also pass the modal rendering logic through the context
  renderAuthModals: () => ReactNode;
}

// Create the context
const AuthContext = createContext<AuthContextType | null>(null);

// Create a custom hook for easy access to the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Create the Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountryCode, setSelectedCountryCode] = useState('+91');
  const [otp, setOtp] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const countryCodes = [
      { code: '+91', name: 'India', flag: '🇮🇳' },
      { code: '+1', name: 'USA', flag: '🇺🇸' },
      { code: '+44', name: 'UK', flag: '🇬🇧' },
  ];

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleOpenLoginModal = () => {
    setShowLoginModal(true);
    setPhoneNumber('');
    setOtp('');
    setLoginError('');
  };
  
  const handleCloseModals = () => {
    setShowLoginModal(false);
    setShowOtpModal(false);
    setLoginError('');
  };

  const handleSendOtp = async () => {
    if (!/^\d{10}$/.test(phoneNumber)) {
        setLoginError('Please enter a valid 10-digit phone number.');
        return;
    }
    setLoading(true);
    setLoginError('');
    try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_ASTROKIRAN_API_BASE_URL;
        const response = await fetch(`${apiBaseUrl}/horoscope/send-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone_number: phoneNumber }),
        });
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.message || 'Failed to send OTP.');
        setShowLoginModal(false);
        setShowOtpModal(true);
    } catch (error) {
        setLoginError(error instanceof Error ? error.message : 'An error occurred.');
    } finally {
        setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!/^\d{4,6}$/.test(otp)) {
        setLoginError('Please enter a valid OTP.');
        return;
    }
    setLoading(true);
    setLoginError('');
    const fullPhoneNumber = (selectedCountryCode + phoneNumber).replace('+', '');
    try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_ASTROKIRAN_API_BASE_URL;
        const response = await fetch(`${apiBaseUrl}/horoscope/validate-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone_number: fullPhoneNumber, otp_code: otp }),
        });
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.error || 'OTP verification failed.');
        if (data.data.access) {
            localStorage.setItem('accessToken', data.data.access);
            localStorage.setItem('refreshToken', data.data.refresh);
            localStorage.setItem('userPhoneNumber', fullPhoneNumber);
            setIsLoggedIn(true);
            handleCloseModals();
        } else {
            throw new Error('Invalid response from server.');
        }
    } catch (error) {
        setLoginError(error instanceof Error ? error.message : 'An error occurred.');
    } finally {
        setLoading(false);
    }
  };

  const handleLogout = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const userPhoneNumber = localStorage.getItem('userPhoneNumber');
    if (accessToken && userPhoneNumber) {
        try {
            const apiBaseUrl = process.env.NEXT_PUBLIC_ASTROKIRAN_API_BASE_URL;
            await fetch(`${apiBaseUrl}/horoscope/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ phone_number: userPhoneNumber }),
            });
        } catch (error) {
            console.error('Server logout failed:', error);
        }
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userPhoneNumber');
    setIsLoggedIn(false);
    alert("You have been logged out.");
  };

  // This function returns the JSX for the modals
  const renderAuthModals = () => (
    <>
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Sign In</h2>
              <button onClick={handleCloseModals} className="text-gray-400 hover:text-gray-600 text-3xl">&times;</button>
            </div>
            <p className="text-gray-600 mb-5 text-sm">Enter your mobile number to receive an OTP.</p>
            <div className="flex gap-2">
              <div className="w-1/3">
                  <select value={selectedCountryCode} onChange={(e) => setSelectedCountryCode(e.target.value)} className="w-full px-2 py-3 border rounded-lg">
                      {countryCodes.map(c => <option key={c.code} value={c.code}>{c.flag} {c.code}</option>)}
                  </select>
              </div>
              <div className="w-2/3">
                  <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))} placeholder="Mobile number" className="w-full px-4 py-3 border rounded-lg"/>
              </div>
            </div>
            {loginError && <p className="text-red-500 text-xs mt-2">{loginError}</p>}
            <button onClick={handleSendOtp} disabled={loading} className="w-full bg-orange-500 text-white py-3 mt-4 rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50">
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </div>
        </div>
      )}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Verify OTP</h2>
            <p className="text-gray-600 mb-4 text-sm">Enter the OTP sent to {selectedCountryCode}{phoneNumber}.</p>
            <input type="text" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} placeholder="Enter OTP" maxLength={6} className="w-full px-4 py-3 border rounded-lg text-center tracking-widest"/>
            {loginError && <p className="text-red-500 text-xs mt-2">{loginError}</p>}
            <button onClick={handleVerifyOtp} disabled={loading} className="w-full bg-orange-500 text-white py-3 mt-4 rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50">
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>
          </div>
        </div>
      )}
    </>
  );

  const value = {
    isLoggedIn,
    showLoginModal,
    handleOpenLoginModal,
    handleLogout,
    handleCloseModals,
    renderAuthModals,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};