
import React, { useEffect, useState } from 'react';

interface AppMockupProps {
  customImageUrl?: string;
}

export const AppMockup: React.FC<AppMockupProps> = ({ customImageUrl }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  
  useEffect(() => {
    if (customImageUrl) {
      setImageUrl(customImageUrl);
    } else {
      const savedMockupUrl = localStorage.getItem('fastingApp_mockupUrl');
      if (savedMockupUrl) {
        setImageUrl(savedMockupUrl);
      }
    }
  }, [customImageUrl]);

  if (imageUrl) {
    return (
      <div className="relative mx-auto max-w-[300px]">
        <div className="relative overflow-hidden border-8 border-black rounded-[40px] shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-100 to-gray-300 z-0" />
          <div className="relative z-10 aspect-[9/19.5] flex items-center justify-center bg-white">
            <img 
              src={imageUrl} 
              alt="App Screenshot" 
              className="w-full h-full object-cover" 
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto max-w-[300px]">
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
