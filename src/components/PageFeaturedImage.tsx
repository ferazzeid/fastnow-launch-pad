import React, { useState, useEffect } from 'react';

interface PageFeaturedImageProps {
  pageKey: string;
  className?: string;
}

const PageFeaturedImage: React.FC<PageFeaturedImageProps> = ({ pageKey, className = "w-full h-64 object-cover rounded-lg mb-8" }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadFeaturedImage = async () => {
      try {
        // Try database first for new system
        const { supabase } = await import('@/integrations/supabase/client');
        const { data, error } = await supabase
          .from('site_settings')
          .select('setting_value')
          .eq('setting_key', `${pageKey}_featured_image`)
          .single();

        if (!error && data?.setting_value) {
          const imageUrl = typeof data.setting_value === 'string' 
            ? JSON.parse(data.setting_value || '""') 
            : String(data.setting_value || '');
          if (imageUrl) {
            setImageUrl(imageUrl);
            return;
          }
        }
      } catch (error) {
        console.error('Error loading featured image:', error);
      }

      // Fallback to localStorage for backward compatibility
      const savedImages = localStorage.getItem('fastingApp_pageImages');
      if (savedImages) {
        const pageImages = JSON.parse(savedImages);
        if (pageImages[pageKey]) {
          setImageUrl(pageImages[pageKey]);
        }
      }
    };

    loadFeaturedImage();
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