import React, { useState, useEffect } from 'react';

// Simple in-memory cache to avoid refetch/flicker between navigations
const imageCache: Record<string, string> = {};

interface PageFeaturedImageProps {
  pageKey: string;
  className?: string;
}

const PageFeaturedImage: React.FC<PageFeaturedImageProps> = ({ pageKey, className = "w-full h-64 object-cover rounded-lg mb-8" }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(() => {
    // Initialize from memory cache or localStorage for instant paint
    if (imageCache[pageKey]) return imageCache[pageKey];
    try {
      const savedImages = localStorage.getItem('fastingApp_pageImages');
      if (savedImages) {
        const pageImages = JSON.parse(savedImages);
        if (pageImages && pageImages[pageKey]) {
          imageCache[pageKey] = pageImages[pageKey];
          return pageImages[pageKey] as string;
        }
      }
    } catch {}
    return null;
  });
  useEffect(() => {
    const loadFeaturedImage = async () => {
      try {
        const { supabase } = await import('@/integrations/supabase/client');
        
        // Map frontend page keys to database keys and handle special cases
        const databaseKeyMap: Record<string, string> = {
          'about-me': 'about_me_featured_image',
          'fast-now-protocol': 'protocol_featured_image',
          'faq': 'faq_featured_image',
          'contact': 'contact_featured_image',
          'privacy-policy': 'privacy_featured_image',
          'terms-of-service': 'terms_featured_image',
          'home': 'homepage_featured_image'
        };

        // For about-fastnow-app, check the aboutAppContent object
        if (pageKey === 'about-fastnow-app') {
          const { data, error } = await supabase
            .from('site_settings')
            .select('setting_value')
            .eq('setting_key', 'aboutAppContent')
            .single();

          if (!error && data?.setting_value) {
            const content = data.setting_value;
            if (content && typeof content === 'object' && 'featuredImage' in content && content.featuredImage) {
              const url = content.featuredImage as string;
              setImageUrl(url);
              imageCache[pageKey] = url;
              try {
                const saved = localStorage.getItem('fastingApp_pageImages');
                const map = saved ? JSON.parse(saved) : {};
                map[pageKey] = url;
                localStorage.setItem('fastingApp_pageImages', JSON.stringify(map));
              } catch {}
              return;
            }
          }
        }

        // Try the mapped database key for other pages
        const databaseKey = databaseKeyMap[pageKey];
        if (databaseKey) {
          const { data, error } = await supabase
            .from('site_settings')
            .select('setting_value')
            .eq('setting_key', databaseKey)
            .single();

          if (!error && data?.setting_value) {
            const imageUrl = typeof data.setting_value === 'string' 
              ? JSON.parse(data.setting_value || '""') 
              : String(data.setting_value || '');
            if (imageUrl) {
              const url = imageUrl as string;
              setImageUrl(url);
              imageCache[pageKey] = url;
              try {
                const saved = localStorage.getItem('fastingApp_pageImages');
                const map = saved ? JSON.parse(saved) : {};
                map[pageKey] = url;
                localStorage.setItem('fastingApp_pageImages', JSON.stringify(map));
              } catch {}
              return;
            }
          }
        }

        // Try the page_content table as fallback
        const { data: pageData, error: pageError } = await supabase
          .from('page_content')
          .select('featured_image_url')
          .eq('page_key', pageKey)
          .single();

        if (!pageError && pageData?.featured_image_url) {
          const url = pageData.featured_image_url as string;
          setImageUrl(url);
          imageCache[pageKey] = url;
          try {
            const saved = localStorage.getItem('fastingApp_pageImages');
            const map = saved ? JSON.parse(saved) : {};
            map[pageKey] = url;
            localStorage.setItem('fastingApp_pageImages', JSON.stringify(map));
          } catch {}
          return;
        }
      } catch (error) {
        console.error('Error loading featured image for', pageKey, ':', error);
      }

      // Fallback to localStorage for backward compatibility
      const savedImages = localStorage.getItem('fastingApp_pageImages');
      if (savedImages) {
        const pageImages = JSON.parse(savedImages);
        if (pageImages[pageKey]) {
          setImageUrl(pageImages[pageKey]);
          imageCache[pageKey] = pageImages[pageKey];
        }
      }
    };

    loadFeaturedImage();
  }, [pageKey]);

  if (!imageUrl) {
    // Render a lightweight placeholder to avoid layout jumps and gray flashes
    return <div className={className} aria-hidden="true" />;
  }

  return (
    <img 
      src={imageUrl} 
      alt="Featured image"
      className={className}
      loading="eager"
    />
  );
};

export default PageFeaturedImage;