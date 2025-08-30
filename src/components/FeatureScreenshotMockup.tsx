import React, { useState } from 'react';

interface FeatureScreenshotMockupProps {
  imageUrl: string;
  altText: string;
  featureKey?: string;
}

export const FeatureScreenshotMockup: React.FC<FeatureScreenshotMockupProps> = ({ 
  imageUrl, 
  altText,
  featureKey 
}) => {
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
              <img 
                src={imageUrl} 
                alt={altText}
                className="w-full h-full object-cover"
                loading="eager"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full bg-black"></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};