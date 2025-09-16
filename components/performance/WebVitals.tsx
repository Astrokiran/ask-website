"use client";

import { useEffect } from 'react';

export function WebVitals() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'web-vital' in window) return;

    // Only load Web Vitals in production and when needed
    if (process.env.NODE_ENV === 'production') {
      import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
        onCLS(console.log);
        onINP(console.log);
        onFCP(console.log);
        onLCP(console.log);
        onTTFB(console.log);
      });
    }
  }, []);

  return null;
}