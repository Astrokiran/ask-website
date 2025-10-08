/**
 * Redirects user to the appropriate app store based on their device
 * Android -> Google Play Store
 * iOS -> Apple App Store
 * Desktop/Other -> Google Play Store (default)
 */
export function redirectToAppStore() {
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

  // iOS detection
  if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
    // iOS App Store link - replace with your actual iOS app link when available
    window.location.href = "https://apps.apple.com/in/app/ask-astrokiran-astrology/id6748694746";
  }
  // Android detection
  else if (/android/i.test(userAgent)) {
    // Android Play Store link
    window.location.href = "https://play.google.com/store/apps/details?id=com.astrokiran.user&pcampaignid=web_share";
  }
  // Default fallback (desktop or other)
  else {
    // Default to Play Store
    window.location.href = "https://play.google.com/store/apps/details?id=com.astrokiran.user&pcampaignid=web_share";
  }
}
