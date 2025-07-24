import { useEffect } from 'react';

export const SecurityHeaders = () => {
  useEffect(() => {
    // Add security headers via meta tags (limited in client-side apps)
    const addMetaTag = (name: string, content: string) => {
      const existing = document.querySelector(`meta[name="${name}"]`);
      if (existing) {
        existing.setAttribute('content', content);
      } else {
        const meta = document.createElement('meta');
        meta.name = name;
        meta.content = content;
        document.head.appendChild(meta);
      }
    };

    // Content Security Policy (limited client-side implementation)
    addMetaTag('Content-Security-Policy', 
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: https:; " +
      "font-src 'self' data:; " +
      "connect-src 'self' https:; " +
      "frame-ancestors 'none';"
    );

    // X-Content-Type-Options
    addMetaTag('X-Content-Type-Options', 'nosniff');

    // X-Frame-Options
    addMetaTag('X-Frame-Options', 'DENY');

    // X-XSS-Protection
    addMetaTag('X-XSS-Protection', '1; mode=block');

    // Referrer Policy
    addMetaTag('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Add CSRF protection token meta tag
    const csrfToken = generateCSRFToken();
    addMetaTag('csrf-token', csrfToken);
    localStorage.setItem('fastingApp_csrf_token', csrfToken);

  }, []);

  return null;
};

// Generate CSRF token
function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// CSRF validation utility
export const validateCSRFToken = (token: string): boolean => {
  const storedToken = localStorage.getItem('fastingApp_csrf_token');
  return storedToken === token;
};

// Rate limiting utility
export class RateLimiter {
  private static attempts: Map<string, { count: number; resetTime: number }> = new Map();

  static isAllowed(key: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000): boolean {
    const now = Date.now();
    const record = this.attempts.get(key);

    if (!record || now > record.resetTime) {
      this.attempts.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (record.count >= maxAttempts) {
      return false;
    }

    record.count++;
    return true;
  }

  static reset(key: string): void {
    this.attempts.delete(key);
  }
}