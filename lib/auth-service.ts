interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  auth_user_id: number;
  user_type: string;
  user_roles: string[];
  customer_id?: number; // Add customer_id after customer creation
  session_id?: string; // Backend session ID for enhanced session management
}

interface OTPRequest {
  area_code: string;
  phone_number: string;
  user_type: 'customer' | 'guide';
  purpose: string;
}

interface OTPValidation {
  area_code: string;
  phone_number: string;
  user_type: 'customer' | 'guide';
  otp_code: string;
  request_id: string;
  device_info: {
    device_type: string;
    device_name: string;
    platform: string;
    platform_version: string;
    app_version: string;
    fcm_token: string;
  };
}

interface SessionInfo {
  session_id: string;
  auth_user_id: number;
  device_type: 'web' | 'mobile';
  device_id: string;
  last_accessed_at: string;
  is_active: boolean;
}

class AuthService {
  private baseURL: string;
  private tokens: AuthTokens | null = null;
  private sessionInfo: SessionInfo | null = null;
  private refreshTimer: ReturnType<typeof setTimeout> | null = null;
  private sessionValidationTimer: ReturnType<typeof setTimeout> | null = null;
  private activityTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.baseURL = (process.env as any).NEXT_PUBLIC_AUTH_GATEWAY_URL || 'https://devazstg.astrokiran.com/auth';
    this.loadTokensFromStorage();
    this.loadSessionInfoFromStorage();
    this.setupCrossTabCommunication();
    this.startActivityMonitoring();
  }

  async generateOTP(request: OTPRequest): Promise<{ request_id: string }> {
    const response = await fetch(`${this.baseURL}/api/v1/auth/otp/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `OTP generation failed: ${response.statusText}`);
    }

    return response.json();
  }

  async validateOTP(validation: OTPValidation): Promise<AuthTokens> {
    const response = await fetch(`${this.baseURL}/api/v1/auth/otp/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validation),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `OTP validation failed: ${response.statusText}`);
    }

    const tokens = await response.json();
    this.createSessionFromTokens(tokens);
    return tokens;
  }

  async refreshToken(): Promise<AuthTokens> {
    if (!this.tokens?.refresh_token) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${this.baseURL}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: this.tokens.refresh_token }),
    });

    if (!response.ok) {
      this.clearTokens();
      throw new Error('Session expired. Please login again.');
    }

    const newTokens = await response.json();
    this.createSessionFromTokens(newTokens);
    return newTokens;
  }

  async logout(): Promise<void> {
    try {
      // Notify backend to deactivate session
      if (this.sessionInfo?.session_id && this.tokens?.access_token) {
        const response = await fetch(`${this.baseURL}/api/v1/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.tokens.access_token}`,
          },
          body: JSON.stringify({
            session_id: this.sessionInfo.session_id,
            device_id: this.generateDeviceId(),
          }),
        });

        if (!response.ok) {
          console.error('Backend logout failed:', response.status);
        } else {
          console.log('✅ Backend logout successful');
        }
      }
    } catch (error) {
      console.error('Backend logout error:', error);
    }

    // Clear local storage and timers
    this.clearTokens();
    this.clearSessionInfo();
  }

  getAccessToken(): string | null {
    return this.tokens?.access_token || null;
  }

  isAuthenticated(): boolean {
    return !!this.tokens?.access_token;
  }

  getUserInfo(): { userId: number; userType: string; customerId?: number } | null {
    console.log('🔍 getUserInfo called, current tokens:', this.tokens);
    if (!this.tokens) {
      console.log('❌ No tokens available');
      return null;
    }
    const userInfo = {
      userId: this.tokens.auth_user_id,
      userType: this.tokens.user_type,
      customerId: this.tokens.customer_id,
    };
    console.log('📤 getUserInfo returning:', userInfo);
    return userInfo;
  }

  getAuthHeaders(): Record<string, string> {
    const token = this.getAccessToken();
    if (!token) throw new Error('Not authenticated');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  async ensureCustomerExists(phoneNumber: string): Promise<any> {
    const headers = this.getAuthHeaders();
    const userInfo = this.getUserInfo();
    if (!userInfo) throw new Error('User not authenticated');

    console.log('🔍 Checking customer existence for auth_user_id:', userInfo.userId);
    console.log('📱 Phone number:', phoneNumber);
    console.log('🔗 API URL:', `${(process.env as any).NEXT_PUBLIC_CUSTOMER_API_URL}/`);

    try {
      // First check if customer_id already exists in tokens
      if (this.tokens?.customer_id) {
        console.log('✅ Customer already exists with ID:', this.tokens.customer_id);
        return { customer_id: this.tokens.customer_id };
      }

      // Try to create customer (backend should handle existing customers)
      console.log('🔨 Creating customer profile (backend will handle existing customers)');
      return await this.createCustomerWithPhone(phoneNumber);

    } catch (error) {
      console.error('💥 Error ensuring customer exists:', error);
      throw error;
    }
  }

  async createCustomerWithPhone(phoneNumber: string): Promise<any> {
    const headers = this.getAuthHeaders();
    const userInfo = this.getUserInfo();
    if (!userInfo) throw new Error('User not authenticated');

    console.log('🔨 Creating customer with phone number');
    console.log('📱 Phone:', phoneNumber);
    console.log('👤 User ID:', userInfo.userId);
    console.log('🔗 Create API URL:', `${(process.env as any).NEXT_PUBLIC_CUSTOMER_API_URL}`);
    console.log('🔑 Auth headers:', headers);

    const requestBody = {
      country_code: '+91',
      phone_number: phoneNumber,
    };
    console.log('📤 Request body:', requestBody);

    // Create a customer with phone number - this will be set as default profile
    const customerUrl = `${(process.env as any).NEXT_PUBLIC_CUSTOMER_API_URL}/`;
    console.log('🔗 Final customer URL with trailing slash:', customerUrl);

    const response = await fetch(customerUrl, {
      method: 'POST',
      headers: {
        ...headers,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      mode: 'cors',
      credentials: 'omit',
    });

    console.log('📊 Create customer response status:', response.status);
    console.log('📊 Response URL (after redirects):', response.url);
    console.log('📊 Response headers:', [...response.headers.entries()]);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ Create customer error response:', errorData);
      console.error('❌ Response redirected?', response.redirected);
      console.error('❌ Final URL:', response.url);
      throw new Error(`Failed to create customer profile: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Customer created successfully:', data);
    console.log('🆔 Customer ID returned:', data.customer_id);
    console.log('🏠 Before storing customer_id, current tokens:', this.tokens);

    // Store customer_id in tokens if returned
    if (data.customer_id) {
      this.tokens = {
        ...this.tokens,
        customer_id: data.customer_id
      };
      console.log('💾 After storing customer_id, new tokens:', this.tokens);

      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_tokens', JSON.stringify(this.tokens));
        console.log('💾 Saved to localStorage');
      }
    } else {
      console.warn('⚠️ No customer_id in response data');
      // Try to find customer_id in other possible response fields
      const possibleIdFields = ['id', 'customer', 'user_id', 'profile_id'];
      for (const field of possibleIdFields) {
        if (data[field]) {
          console.log(`🔄 Found customer_id in field '${field}':`, data[field]);
          this.tokens = {
            ...this.tokens,
            customer_id: data[field]
          };
          if (typeof window !== 'undefined') {
            localStorage.setItem('auth_tokens', JSON.stringify(this.tokens));
            console.log('💾 Saved to localStorage with customer_id from alternative field');
          }
          break;
        }
      }
    }

    return data;
  }

  private setTokens(tokens: AuthTokens): void {
    this.tokens = tokens;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_tokens', JSON.stringify(tokens));
    }
    this.scheduleTokenRefresh();
    this.broadcastTokenUpdate();
  }

  private loadTokensFromStorage(): void {
    if (typeof window === 'undefined') return;

    const stored = localStorage.getItem('auth_tokens');
    if (stored) {
      try {
        this.tokens = JSON.parse(stored);
        this.scheduleTokenRefresh();
      } catch (error) {
        console.error('Error loading tokens:', error);
        localStorage.removeItem('auth_tokens');
      }
    }
  }

  private clearTokens(): void {
    this.tokens = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_tokens');
    }
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  private scheduleTokenRefresh(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    // Check if we have valid tokens
    if (!this.tokens || !this.tokens.expires_in) {
      console.warn('Cannot schedule token refresh: no tokens available');
      return;
    }

    // Refresh 5 minutes before expiry, but not if expiry is too soon
    const currentTime = Date.now();
    const tokenExpiry = this.tokens.expires_in * 1000; // Convert to milliseconds
    const refreshTime = Math.max(tokenExpiry - (5 * 60 * 1000), 10 * 1000); // At least 10 seconds from now

    if (refreshTime <= 0) {
      console.warn('Token has already expired or will expire too soon');
      return;
    }

    this.refreshTimer = setTimeout(() => {
      this.refreshToken().catch(error => {
        console.error('Auto token refresh failed:', error);
        this.clearTokens();
        this.clearSessionInfo();
        // Redirect to login or show login modal
        window.location.reload();
      });
    }, refreshTime);
  }

  // NEW: Enhanced session management methods
  private generateDeviceId(): string {
    let deviceId = localStorage.getItem('device_id');
    if (!deviceId) {
      deviceId = `web_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('device_id', deviceId);
    }
    return deviceId;
  }

  private setSessionInfo(sessionInfo: SessionInfo): void {
    this.sessionInfo = sessionInfo;
    if (typeof window !== 'undefined') {
      localStorage.setItem('session_info', JSON.stringify(sessionInfo));
    }
    this.startSessionValidation();
    this.broadcastSessionUpdate();
  }

  private loadSessionInfoFromStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      const sessionData = localStorage.getItem('session_info');
      if (sessionData) {
        this.sessionInfo = JSON.parse(sessionData);
        if (this.sessionInfo && this.sessionInfo.is_active) {
          this.startSessionValidation();
        }
      }
    } catch (error) {
      console.error('Failed to load session info from storage:', error);
    }
  }

  private clearSessionInfo(): void {
    this.sessionInfo = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('session_info');
    }
    if (this.sessionValidationTimer) {
      clearTimeout(this.sessionValidationTimer);
      this.sessionValidationTimer = null;
    }
    if (this.activityTimer) {
      clearTimeout(this.activityTimer);
      this.activityTimer = null;
    }
    this.broadcastSessionLogout();
  }

  // NEW: Cross-tab communication
  private setupCrossTabCommunication(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('storage', (event) => {
      // Ignore events from this same tab
      if (event.storageArea !== localStorage) return;

      if (event.key === 'auth_tokens') {
        if (event.newValue) {
          // Tokens updated in another tab
          try {
            const newTokens = JSON.parse(event.newValue);
            this.tokens = newTokens;
            this.scheduleTokenRefresh();
            console.log('🔄 Tokens updated from another tab');
          } catch (error) {
            console.error('Failed to parse tokens from storage event:', error);
          }
        } else {
          // User logged out in another tab
          console.log('🔄 Logout detected from another tab');
          this.clearTokens();
          this.clearSessionInfo();
        }
      } else if (event.key === 'session_info') {
        if (event.newValue) {
          // Session info updated in another tab
          try {
            const newSessionInfo = JSON.parse(event.newValue);
            this.sessionInfo = newSessionInfo;
            if (this.sessionInfo?.is_active) {
              this.startSessionValidation();
            }
            console.log('🔄 Session info updated from another tab');
          } catch (error) {
            console.error('Failed to parse session info from storage event:', error);
          }
        } else {
          // Session cleared in another tab
          console.log('🔄 Session cleared from another tab');
          this.clearSessionInfo();
        }
      }
    });
  }

  private broadcastTokenUpdate(): void {
    if (typeof window !== 'undefined' && this.tokens) {
      // Set a flag to prevent handling our own event
      localStorage.setItem('auth_tokens_sync_source', 'auth_service');
      localStorage.setItem('auth_tokens', JSON.stringify(this.tokens));
      // Clean up the flag
      setTimeout(() => localStorage.removeItem('auth_tokens_sync_source'), 100);
    }
  }

  private broadcastSessionUpdate(): void {
    if (typeof window !== 'undefined' && this.sessionInfo) {
      // Set a flag to prevent handling our own event
      localStorage.setItem('session_sync_source', 'auth_service');
      localStorage.setItem('session_info', JSON.stringify(this.sessionInfo));
      // Clean up the flag
      setTimeout(() => localStorage.removeItem('session_sync_source'), 100);
    }
  }

  private broadcastSessionLogout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('session_info');
    }
  }

  // NEW: Backend session validation
  private startSessionValidation(): void {
    if (this.sessionValidationTimer) {
      clearTimeout(this.sessionValidationTimer);
    }

    // Only start validation if we have an active session
    if (!this.sessionInfo?.is_active) {
      return;
    }

    // Validate session every 5 minutes
    this.sessionValidationTimer = setTimeout(async () => {
      const isValid = await this.validateSession();
      if (!isValid) {
        console.warn('Session validation failed, logging out');
        this.clearTokens();
        this.clearSessionInfo();
        window.location.reload();
      } else {
        // Only schedule next validation if session is still active
        if (this.sessionInfo?.is_active) {
          this.startSessionValidation();
        }
      }
    }, 5 * 60 * 1000); // 5 minutes
  }

  async validateSession(): Promise<boolean> {
    console.log('🔍 Validating session - current sessionInfo:', this.sessionInfo);
    if (!this.sessionInfo?.session_id) {
      console.warn('No session info available for validation');
      console.log('🔍 Available tokens:', this.tokens ? 'Has tokens' : 'No tokens');
      return false;
    }

    try {
      const response = await fetch(
        `${this.baseURL}/api/v1/auth/session/${this.sessionInfo.session_id}`,
        {
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        console.error('Session validation failed:', response.status, response.statusText);
        return false;
      }

      const data = await response.json();
      console.log('✅ Session validation successful:', data);

      // Update session info with latest data
      if (data.last_accessed_at) {
        this.sessionInfo.last_accessed_at = data.last_accessed_at;
        this.setSessionInfo(this.sessionInfo);
      }

      return data.is_active || true;
    } catch (error) {
      console.error('Session validation error:', error);
      return false;
    }
  }

  // NEW: Activity monitoring
  private startActivityMonitoring(): void {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const activityEvents = [
      'mousedown', 'mousemove', 'keypress', 'scroll',
      'touchstart', 'click', 'keydown', 'focus'
    ];

    const handleUserActivity = () => {
      if (this.activityTimer) {
        clearTimeout(this.activityTimer);
      }

      // Only update activity if we have an active session
      if (!this.sessionInfo?.is_active) return;

      // Update session activity if user is inactive for more than 1 minute
      this.activityTimer = setTimeout(async () => {
        try {
          await this.updateSessionActivity();
        } catch (error) {
          console.error('Activity update failed:', error);
        }
      }, 60000); // 1 minute
    };

    // Add event listeners safely
    try {
      activityEvents.forEach(event => {
        document.addEventListener(event, handleUserActivity, { passive: true });
      });

      // Monitor tab visibility
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
          handleUserActivity(); // Tab became visible
        }
      });

      // Monitor window focus
      window.addEventListener('focus', handleUserActivity);
    } catch (error) {
      console.error('Failed to setup activity monitoring:', error);
    }
  }

  private async updateSessionActivity(): Promise<void> {
    if (!this.sessionInfo?.session_id) return;

    try {
      // This would be a call to your backend to update last_accessed_at
      // For now, we'll just update locally
      this.sessionInfo.last_accessed_at = new Date().toISOString();
      this.setSessionInfo(this.sessionInfo);
      console.log('✅ Session activity updated');
    } catch (error) {
      console.error('Failed to update session activity:', error);
    }
  }

  // NEW: Enhanced session info getter
  getSessionInfo(): SessionInfo | null {
    return this.sessionInfo;
  }

  
  // NEW: Create session after successful authentication
  createSessionFromTokens(tokens: AuthTokens): void {
    this.setTokens(tokens);

    console.log('🔧 Creating session from tokens:', tokens);
    console.log('🆔 Session ID in tokens:', tokens.session_id);

    if (tokens.session_id) {
      const sessionInfo: SessionInfo = {
        session_id: tokens.session_id,
        auth_user_id: tokens.auth_user_id,
        device_type: 'web',
        device_id: this.generateDeviceId(),
        last_accessed_at: new Date().toISOString(),
        is_active: true,
      };
      console.log('✨ Creating session info:', sessionInfo);
      this.setSessionInfo(sessionInfo);
      console.log('✅ Session info should now be stored');
    } else {
      console.warn('⚠️ No session_id in tokens, session tracking not available');
    }
  }
}

export const authService = new AuthService();