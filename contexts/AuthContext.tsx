'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/lib/auth-service';

interface User {
  userId: number;
  userType: string;
  phone?: string;
  customerId?: number;
}

interface AuthContextType {
  user: User | null;
  session: any | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (phoneNumber: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => void;
  validateSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  const refreshAuth = () => {
    const userInfo = authService.getUserInfo();
    const sessionInfo = authService.getSessionInfo();
    setUser(userInfo);
    setSession(sessionInfo);
    setIsLoading(false);
  };

  useEffect(() => {
    refreshAuth();

    // Set up periodic session validation
    const validationInterval = setInterval(async () => {
      if (authService.isAuthenticated()) {
        const isValid = await authService.validateSession();
        if (!isValid) {
          console.log('Session validation failed, refreshing auth state');
          refreshAuth();
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(validationInterval);
  }, []);

  const login = async (phoneNumber: string) => {
    // This is called after successful OTP verification
    const userInfo = authService.getUserInfo();
    const sessionInfo = authService.getSessionInfo();
    if (userInfo) {
      setUser({
        ...userInfo,
        phone: phoneNumber,
        customerId: userInfo.customerId
      });
    }
    if (sessionInfo) {
      setSession(sessionInfo);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails on server, clear local state
      setUser(null);
      setSession(null);
    }
  };

  const validateSession = async (): Promise<boolean> => {
    return await authService.validateSession();
  };

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refreshAuth,
    validateSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}