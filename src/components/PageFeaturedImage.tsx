import React, { useState, useEffect } from 'react';

interface PageFeaturedImageProps {
  pageKey: string;
  className?: string;
}

const PageFeaturedImage: React.FC<PageFeaturedImageProps> = ({ pageKey, className = "w-full h-64 object-cover rounded-lg mb-8" }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const savedImages = localStorage.getItem('fastingApp_pageImages');
    if (savedImages) {
      const pageImages = JSON.parse(savedImages);
      if (pageImages[pageKey]) {
        setImageUrl(pageImages[pageKey]);
      }
    }
  }, [pageKey]);

  if (!imageUrl) {
    return null;
  }

  return (
    <img 
      src={imageUrl} 
      alt="Featured image"
      className={className}
    />
  );
};

export default PageFeaturedImage;