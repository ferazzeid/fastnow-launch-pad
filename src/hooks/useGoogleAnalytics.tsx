
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useGoogleAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Load Google Analytics ID from localStorage
    const seoSettings = localStorage.getItem('fastingApp_seo_settings');
    let googleAnalyticsId = null;
    
    if (seoSettings) {
      const parsed = JSON.parse(seoSettings);
      googleAnalyticsId = parsed.googleAnalyticsId;
    }

    if (googleAnalyticsId && googleAnalyticsId.trim()) {
      // Initialize Google Analytics if not already loaded
      if (!window.gtag) {
        // Load the Google Analytics script
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`;
        document.head.appendChild(script);

        // Initialize gtag
        window.dataLayer = window.dataLayer || [];
        window.gtag = function() {
          window.dataLayer.push(arguments);
        };
        window.gtag('js', new Date());
        window.gtag('config', googleAnalyticsId);
        
        console.log('Google Analytics initialized with ID:', googleAnalyticsId);
      }
    }
  }, []);

  useEffect(() => {
    // Track page views on route changes
    const seoSettings = localStorage.getItem('fastingApp_seo_settings');
    let googleAnalyticsId = null;
    
    if (seoSettings) {
      const parsed = JSON.parse(seoSettings);
      googleAnalyticsId = parsed.googleAnalyticsId;
    }

    if (googleAnalyticsId && googleAnalyticsId.trim() && window.gtag) {
      window.gtag('config', googleAnalyticsId, {
        page_path: location.pathname + location.search,
      });
      console.log('GA page view tracked:', location.pathname + location.search);
    }
  }, [location]);
};

// Add type definitions for gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}
