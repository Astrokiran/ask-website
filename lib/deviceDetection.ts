/**
 * Detects if the user is on an iOS device (iPhone, iPad, iPod)
 * Works for both Safari and Chrome on iOS
 */
export function isIOS(): boolean {
  if (typeof window === 'undefined') return false;

  const userAgent = window.navigator.userAgent.toLowerCase();
  const platform = window.navigator.platform.toLowerCase();

  // Check for iOS devices
  const isIOSDevice = /iphone|ipad|ipod/.test(userAgent) ||
    (platform === 'macintel' && navigator.maxTouchPoints > 1); // iPad on iOS 13+

  return isIOSDevice;
}

/**
 * Detects if the user is on an Android device
 */
export function isAndroid(): boolean {
  if (typeof window === 'undefined') return false;

  const userAgent = window.navigator.userAgent.toLowerCase();
  return /android/.test(userAgent);
}

/**
 * Redirects user to appropriate app store based on their device
 */
export function redirectToAppStore(): void {
  const IOS_APP_STORE = "https://apps.apple.com/in/app/ask-astrokiran-astrology/id6748694746";
  const ANDROID_PLAY_STORE = "https://play.google.com/store/apps/details?id=com.astrokiran.user&pcampaignid=web_share";

  if (isIOS()) {
    console.log('📱 iOS detected - Opening App Store');
    window.open(IOS_APP_STORE, "_blank", "noopener,noreferrer");
  } else if (isAndroid()) {
    console.log('📱 Android detected - Opening Play Store');
    window.open(ANDROID_PLAY_STORE, "_blank", "noopener,noreferrer");
  } else {
    console.log('💻 Desktop/Other - Opening Play Store (default)');
    window.open(ANDROID_PLAY_STORE, "_blank", "noopener,noreferrer");
  }
}