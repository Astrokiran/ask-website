"use client";

import { useEffect } from 'react';

export function WebVitals() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'web-vital' in window) return;

    // Only load Web Vitals in production and when needed
    if (process.env.NODE_ENV === 'production') {
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(console.log);
        getFID(console.log);
        getFCP(console.log);
        getLCP(console.log);
        getTTFB(console.log);
      });
    }
  }, []);

  return null;
}