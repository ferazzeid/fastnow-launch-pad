import React, { useState } from 'react';

interface FeatureScreenshotMockupProps {
  imageUrl: string;
  altText: string;
}

export const FeatureScreenshotMockup: React.FC<FeatureScreenshotMockupProps> = ({ 
  imageUrl, 
  altText 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  return (
    <div className="relative">
      {/* Mobile phone frame */}
      <div className="relative bg-gray-900 rounded-[2rem] p-2 shadow-2xl">
        <div className="bg-black rounded-[1.5rem] p-1">
          <div className="relative bg-white rounded-[1.25rem] overflow-hidden aspect-[9/19.5]">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-10"></div>
            
            {/* Screenshot content */}
            {imageUrl && !imageError ? (
              <div className="relative w-full h-full">
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center animate-pulse">
                    <div className="text-center text-muted-foreground">
                      <div className="w-8 h-8 bg-muted rounded-full mx-auto mb-2 flex items-center justify-center">
                        <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </div>
                      <p className="text-xs">Loading...</p>
                    </div>
                  </div>
                )}
                <img 
                  src={imageUrl} 
                  alt={altText}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                  loading="eager"
                />
              </div>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-sm">Screenshot</p>
                  <p className="text-sm">Not Available</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};