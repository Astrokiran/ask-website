// TypeScript declarations for Google reCAPTCHA Enterprise

declare global {
  interface Window {
    grecaptcha: {
      enterprise: {
        ready: (callback: () => void) => void;
        execute: (siteKey: string, options: { action: string }) => Promise<string>;
        render: (container: string | Element, parameters: any) => number;
        reset: (widgetId?: number) => void;
        getResponse: (widgetId?: number) => string;
      };
    };
  }
}

export {};