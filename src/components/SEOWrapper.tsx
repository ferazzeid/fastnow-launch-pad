import React, { useEffect } from 'react';
import { SEOService } from '@/services/SEOService';

interface SEOWrapperProps {
  children: React.ReactNode;
}

const SEOWrapper: React.FC<SEOWrapperProps> = ({ children }) => {
  useEffect(() => {
    // Initialize SEO service
    SEOService.init();
    
    // Optimize images on page load
    const optimizeImages = () => {
      SEOService.optimizeImages();
    };
    
    // Run optimization after component mounts and DOM is ready
    const timer = setTimeout(optimizeImages, 100);
    
    // Also run on window load to catch any dynamically loaded images
    window.addEventListener('load', optimizeImages);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('load', optimizeImages);
    };
  }, []);

  return <>{children}</>;
};

export default SEOWrapper;