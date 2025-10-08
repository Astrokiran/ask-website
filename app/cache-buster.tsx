'use client';

import { useEffect } from 'react';

// This version is automatically generated during build
// Uses build time timestamp to ensure unique version on every deploy
const CURRENT_VERSION = process.env.NEXT_PUBLIC_BUILD_TIME || Date.now().toString();

export function CacheBuster() {
  useEffect(() => {
    // Run cache check immediately on mount
    const checkAndClearCache = async () => {
      try {
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

          // Store new version FIRST
          localStorage.setItem('app-version', CURRENT_VERSION);

          // Clear all service workers
          if ('serviceWorker' in navigator) {
            const registrations = await navigator.serviceWorker.getRegistrations();
            await Promise.all(registrations.map(reg => reg.unregister()));
            console.log('✅ Service workers cleared');
          }

          // Clear all browser caches
          if ('caches' in window) {
            const cacheNames = await caches.keys();
            await Promise.all(cacheNames.map(name => caches.delete(name)));
            console.log('✅ Browser caches cleared');
          }

          // Clear session storage
          sessionStorage.clear();
          console.log('✅ Session storage cleared');

          // Force hard reload with cache bypass
          console.log('🔃 Performing hard reload...');
          window.location.reload();
        }
      } catch (error) {
        console.error('Error during cache clearing:', error);
      }
    };

    checkAndClearCache();
  }, []);

  return null; // This component doesn't render anything
}
