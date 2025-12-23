import { useEffect } from 'react';

// Security Headers Component - adds CSP and other security headers
export const SecurityHeaders = () => {
  useEffect(() => {
    // Add Content Security Policy meta tag if not already present
    if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
      const cspMeta = document.createElement('meta');
      cspMeta.httpEquiv = 'Content-Security-Policy';
      cspMeta.content = `
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval' https://grbtziyqindonbkkkfkc.supabase.co https://checkout.razorpay.com;
        style-src 'self' 'unsafe-inline';
        img-src 'self' data: https: blob:;
        font-src 'self' data: https:;
        connect-src 'self' https://grbtziyqindonbkkkfkc.supabase.co wss://grbtziyqindonbkkkfkc.supabase.co https://api.razorpay.com https://checkout.razorpay.com;
        frame-src 'self' https://checkout.razorpay.com https://api.razorpay.com;
        object-src 'none';
        base-uri 'self';
        form-action 'self';
      `.replace(/\s+/g, ' ').trim();
      document.head.appendChild(cspMeta);
    }

    // Add X-Content-Type-Options
    if (!document.querySelector('meta[http-equiv="X-Content-Type-Options"]')) {
      const noSniffMeta = document.createElement('meta');
      noSniffMeta.httpEquiv = 'X-Content-Type-Options';
      noSniffMeta.content = 'nosniff';
      document.head.appendChild(noSniffMeta);
    }

    // Add X-Frame-Options
    if (!document.querySelector('meta[http-equiv="X-Frame-Options"]')) {
      const frameOptionsMeta = document.createElement('meta');
      frameOptionsMeta.httpEquiv = 'X-Frame-Options';
      frameOptionsMeta.content = 'SAMEORIGIN';
      document.head.appendChild(frameOptionsMeta);
    }

    // Add Referrer Policy
    if (!document.querySelector('meta[name="referrer"]')) {
      const referrerMeta = document.createElement('meta');
      referrerMeta.name = 'referrer';
      referrerMeta.content = 'strict-origin-when-cross-origin';
      document.head.appendChild(referrerMeta);
    }
  }, []);

  return null; // This component doesn't render anything
};