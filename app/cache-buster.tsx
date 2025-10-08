'use client';

import { useEffect } from 'react';

// Change this version number every time you deploy!
// Format: YYYYMMDD-HHMM (e.g., 20250108-1430)
const CURRENT_VERSION = '20250108-1045';

export function CacheBuster() {
  useEffect(() => {
    // Check version in localStorage
    const storedVersion = localStorage.getItem('app-version');

    if (!storedVersion) {
      // First time visitor
      localStorage.setItem('app-version', CURRENT_VERSION);
      console.log('✅ App version set:', CURRENT_VERSION);
      return;
    }

    // If stored version is different from current version
    if (storedVersion !== CURRENT_VERSION) {
      console.log('🔄 New version detected!');
      console.log('   Old:', storedVersion);
      console.log('   New:', CURRENT_VERSION);

      // Clear all caches
      localStorage.setItem('app-version', CURRENT_VERSION);

      // Clear service workers if any
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          registrations.forEach((registration) => registration.unregister());
        });
      }

      // Clear browser cache for this domain
      if ('caches' in window) {
        caches.keys().then((names) => {
          names.forEach((name) => {
            caches.delete(name);
          });
        });
      }

      // Force hard reload after clearing cache
      console.log('🔃 Performing hard reload...');
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  }, []);

  return null; // This component doesn't render anything
}
