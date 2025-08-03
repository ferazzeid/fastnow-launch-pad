import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AppScreenshot {
  id: string;
  url: string;
  title: string;
  order: number;
}

interface AppMockupGalleryProps {
  customSize?: number;
  showNavigation?: boolean;
  autoplay?: boolean;
  autoplayInterval?: number;
}

export const AppMockupGallery: React.FC<AppMockupGalleryProps> = ({ 
  customSize, 
  showNavigation = true,
  autoplay = false,
  autoplayInterval = 5000
}) => {
  const [screenshots, setScreenshots] = useState<AppScreenshot[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [size, setSize] = useState<number>(300);
  
  useEffect(() => {
    loadScreenshots();
    loadSize();
  }, []);

  useEffect(() => {
    if (autoplay && screenshots.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % screenshots.length);
      }, autoplayInterval);
      
      return () => clearInterval(interval);
    }
  }, [autoplay, screenshots.length, autoplayInterval]);

  const loadScreenshots = () => {
    const saved = localStorage.getItem('fastingApp_appScreenshots');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setScreenshots(parsed.sort((a: AppScreenshot, b: AppScreenshot) => a.order - b.order));
      } catch (error) {
        console.error('Error loading screenshots:', error);
      }
    }
  };

  const loadSize = () => {
    if (customSize) {
      setSize(customSize);
    } else {
      const savedSize = localStorage.getItem('fastingApp_imageSize');
      if (savedSize) {
        setSize(parseInt(savedSize));
      }
    }
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + screenshots.length) % screenshots.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % screenshots.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // If no screenshots, show fallback AppMockup
  if (screenshots.length === 0) {
    return <FallbackMockup size={size} />;
  }

  const currentScreenshot = screenshots[currentIndex];

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Main mockup */}
      <div className="relative mx-auto" style={{ maxWidth: `${size}px` }}>
        <div className="relative overflow-hidden border-8 border-black rounded-[40px] shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-100 to-gray-300 z-0" />
          <div className="relative z-10 aspect-[9/19.5] flex items-center justify-center bg-white">
            <img 
              src={currentScreenshot.url} 
              alt={currentScreenshot.title} 
              className="w-full h-full object-cover" 
            />
          </div>
        </div>
        
        {/* Navigation arrows (only show if multiple screenshots and navigation enabled) */}
        {showNavigation && screenshots.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 p-0 bg-white/90 hover:bg-white shadow-lg"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <Button
              variant="secondary"
              size="sm"
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 p-0 bg-white/90 hover:bg-white shadow-lg"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>

      {/* Screenshot title */}
      {currentScreenshot.title && (
        <h3 className="text-lg font-medium text-center text-muted-foreground">
          {currentScreenshot.title}
        </h3>
      )}

      {/* Dot indicators (only show if multiple screenshots) */}
      {screenshots.length > 1 && (
        <div className="flex space-x-2">
          {screenshots.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex 
                  ? 'bg-primary' 
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
              aria-label={`Go to screenshot ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Screenshot counter */}
      {screenshots.length > 1 && (
        <p className="text-sm text-muted-foreground">
          {currentIndex + 1} of {screenshots.length}
        </p>
      )}
    </div>
  );
};

// Fallback component when no screenshots are uploaded
const FallbackMockup: React.FC<{ size: number }> = ({ size }) => {
  return (
    <div className="relative mx-auto" style={{ maxWidth: `${size}px` }}>
      <div className="relative overflow-hidden border-8 border-black rounded-[40px] shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-100 to-gray-300 z-0" />
        <div className="relative z-10 aspect-[9/19.5] bg-white">
          {/* Mock screen content */}
          <div className="flex flex-col h-full">
            <div className="bg-black text-white text-center py-2 text-xs">fastnow.app</div>
            <div className="flex-1 p-2">
              <div className="w-full h-24 bg-gray-100 rounded-lg mb-2"></div>
              <div className="w-full h-8 bg-gray-200 rounded mb-2"></div>
              <div className="w-3/4 h-8 bg-black rounded mb-4"></div>
              <div className="w-full h-24 bg-gray-100 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};