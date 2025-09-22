import { auth } from './firebase';
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult
} from 'firebase/auth';

// Global reCAPTCHA verifier instance
let recaptchaVerifier: RecaptchaVerifier | null = null;

/**
 * Set up Firebase reCAPTCHA verifier (standard, not Enterprise)
 * @param containerId - ID of the container element for reCAPTCHA (for visible widget) or button ID (for invisible)
 * @param size - 'invisible' for invisible reCAPTCHA or 'normal' for visible widget
 * @returns RecaptchaVerifier instance
 */
export const setupRecaptchaVerifier = (
  containerId: string,
  size: 'invisible' | 'normal' = 'invisible'
): RecaptchaVerifier => {
  // Check if verifier already exists and is valid
  if (recaptchaVerifier) {
    console.log('♻️ Reusing existing reCAPTCHA verifier');
    return recaptchaVerifier;
  }

  // Check for existing global verifier
  if ((window as any).recaptchaVerifier) {
    console.log('♻️ Reusing global reCAPTCHA verifier');
    recaptchaVerifier = (window as any).recaptchaVerifier;
    return recaptchaVerifier;
  }

  // Clean up any existing DOM elements
  const existingContainer = document.getElementById(containerId);
  if (existingContainer) {
    existingContainer.innerHTML = '';
    console.log('🧹 Cleaned existing reCAPTCHA container');
  }

  // Set language (optional)
  auth.languageCode = 'en';

  const recaptchaConfig = {
    size: size,
    callback: (response: string) => {
      console.log('reCAPTCHA solved, allow signInWithPhoneNumber');
    },
    'expired-callback': () => {
      console.log('reCAPTCHA expired, user needs to solve it again');
      cleanupRecaptcha();
    },
    'error-callback': (error: any) => {
      console.error('reCAPTCHA error:', error);
      cleanupRecaptcha();
    }
  };

  try {
    console.log('🆕 Creating new reCAPTCHA verifier for container:', containerId);
    recaptchaVerifier = new RecaptchaVerifier(auth, containerId, recaptchaConfig);

    // Store globally for potential reset operations
    (window as any).recaptchaVerifier = recaptchaVerifier;

    console.log('✅ reCAPTCHA verifier created successfully');
    return recaptchaVerifier;
  } catch (error) {
    console.error('❌ Failed to create RecaptchaVerifier:', error);
    throw new Error('Failed to initialize phone verification. Please refresh the page and try again.');
  }
};

/**
 * Pre-render the reCAPTCHA (optional)
 * @param verifier - The RecaptchaVerifier instance
 * @returns Promise<number> - Widget ID
 */
export const prerenderRecaptcha = async (verifier: RecaptchaVerifier): Promise<number> => {
  try {
    const widgetId = await verifier.render();
    (window as any).recaptchaWidgetId = widgetId;
    console.log('reCAPTCHA pre-rendered with widget ID:', widgetId);
    return widgetId;
  } catch (error) {
    console.error('Failed to pre-render reCAPTCHA:', error);
    throw error;
  }
};

/**
 * Reset reCAPTCHA widget
 */
export const resetRecaptcha = () => {
  try {
    const widgetId = (window as any).recaptchaWidgetId;
    if (widgetId !== undefined && (window as any).grecaptcha) {
      (window as any).grecaptcha.reset(widgetId);
    } else if (recaptchaVerifier) {
      recaptchaVerifier.render().then((widgetId) => {
        (window as any).grecaptcha.reset(widgetId);
      });
    }
  } catch (error) {
    console.warn('Failed to reset reCAPTCHA:', error);
  }
};

/**
 * Send verification code to the user's phone using standard Firebase reCAPTCHA
 * @param phoneNumber - Phone number in international format (e.g., +91xxxxxxxxxx)
 * @param appVerifier - RecaptchaVerifier instance
 * @returns Promise<ConfirmationResult>
 */
export const sendVerificationCode = async (
  phoneNumber: string,
  appVerifier: RecaptchaVerifier
): Promise<ConfirmationResult> => {
  try {
    // Debug authentication context
    console.log('📱 Phone Auth Debug Info:');
    console.log('Phone number:', phoneNumber);
    console.log('Current domain:', window.location.hostname);
    console.log('Auth instance:', auth);
    console.log('App instance:', auth.app);
    console.log('Firebase config from auth:', {
      apiKey: auth.app.options.apiKey,
      authDomain: auth.app.options.authDomain,
      projectId: auth.app.options.projectId,
      appId: auth.app.options.appId
    });
    console.log('RecaptchaVerifier:', appVerifier);

    // Check if current domain is authorized
    const currentDomain = window.location.hostname;
    const authDomain = auth.app.options.authDomain;
    console.log('🌐 Domain check - Current:', currentDomain, 'Auth domain:', authDomain);

    // Validate phone number format
    if (!phoneNumber.startsWith('+')) {
      throw new Error('Please provide phone number in international format (e.g., +91xxxxxxxxxx)');
    }

    console.log('Sending verification code to:', phoneNumber);

    // Send verification code using Firebase Auth
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);

    console.log('SMS sent successfully');

    // Store confirmation result globally for access
    (window as any).confirmationResult = confirmationResult;

    return confirmationResult;
  } catch (error: any) {
    console.error('Error sending SMS:', error);

    // Reset reCAPTCHA on error to allow retry
    resetRecaptcha();

    // Handle specific Firebase Auth error codes
    if (error.code === 'auth/billing-not-enabled') {
      throw new Error('Phone authentication is not enabled for this project. Please enable it in Firebase Console.');
    } else if (error.code === 'auth/invalid-phone-number') {
      throw new Error('Invalid phone number format. Please check and try again.');
    } else if (error.code === 'auth/too-many-requests') {
      throw new Error('Too many attempts. Please try again later.');
    } else if (error.code === 'auth/captcha-check-failed') {
      throw new Error('reCAPTCHA verification failed. Please try again.');
    } else if (error.code === 'auth/quota-exceeded') {
      throw new Error('SMS quota exceeded. Please try again later.');
    } else {
      throw new Error('Failed to send verification code. Please try again.');
    }
  }
};

/**
 * Verify the SMS code entered by user
 * @param confirmationResult - Result from sendVerificationCode
 * @param verificationCode - 6-digit code entered by user
 * @returns Promise<UserCredential>
 */
export const verifyCode = async (
  confirmationResult: ConfirmationResult,
  verificationCode: string
) => {
  try {
    if (!verificationCode || verificationCode.length !== 6) {
      throw new Error('Please enter a valid 6-digit verification code');
    }

    const result = await confirmationResult.confirm(verificationCode);
    console.log('Phone number verified successfully');
    return result;
  } catch (error: any) {
    console.error('Error verifying code:', error);

    if (error.code === 'auth/invalid-verification-code') {
      throw new Error('Invalid verification code. Please check and try again.');
    } else if (error.code === 'auth/code-expired') {
      throw new Error('Verification code has expired. Please request a new code.');
    } else {
      throw new Error('Failed to verify code. Please try again.');
    }
  }
};

/**
 * Clean up reCAPTCHA verifier and global references
 */
export const cleanupRecaptcha = () => {
  try {
    if (recaptchaVerifier) {
      recaptchaVerifier.clear();
      recaptchaVerifier = null;
    }

    // Clean up global references
    if ((window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = null;
    }

    if ((window as any).recaptchaWidgetId !== undefined) {
      (window as any).recaptchaWidgetId = undefined;
    }

    if ((window as any).confirmationResult) {
      (window as any).confirmationResult = null;
    }
  } catch (error) {
    console.warn('Error during reCAPTCHA cleanup:', error);
  }
};

/**
 * Format phone number to international format
 * @param phoneNumber - Raw phone number input
 * @param countryCode - Country code (default: +91 for India)
 * @returns Formatted phone number
 */
export const formatPhoneNumber = (phoneNumber: string, countryCode: string = '+91'): string => {
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');

  // If already starts with country code, return as is
  if (phoneNumber.startsWith(countryCode)) {
    return phoneNumber;
  }

  // Add country code
  return `${countryCode}${cleaned}`;
};

/**
 * Validate Indian phone number
 * @param phoneNumber - Phone number to validate
 * @returns boolean
 */
export const validateIndianPhoneNumber = (phoneNumber: string): boolean => {
  // Remove country code and spaces
  const cleaned = phoneNumber.replace(/^\+91/, '').replace(/\s+/g, '');

  // Indian mobile numbers start with 6, 7, 8, or 9 and are 10 digits long
  const indianMobileRegex = /^[6-9]\d{9}$/;

  return indianMobileRegex.test(cleaned);
};

// Export types for use in components
export type { ConfirmationResult, RecaptchaVerifier };