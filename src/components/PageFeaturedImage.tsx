import React, { useState, useEffect } from 'react';

// Simple in-memory cache to avoid refetch/flicker between navigations
const imageCache: Record<string, string> = {};

interface PageFeaturedImageProps {
  pageKey: string;
  className?: string;
  showDarkBackground?: boolean;
}

const PageFeaturedImage: React.FC<PageFeaturedImageProps> = ({ 
  pageKey, 
  className = "w-full h-64 object-cover rounded-lg mb-8",
  showDarkBackground = true
}) => {
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
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

        // Try to load from site_settings with homepage_featured_image key
        const { data: homeImageData, error: homeImageError } = await supabase
          .from('site_settings')
          .select('setting_value')
          .eq('setting_key', 'homepage_featured_image')
          .single();

        if (!homeImageError && homeImageData?.setting_value) {
          const imageUrl = typeof homeImageData.setting_value === 'string' 
            ? JSON.parse(homeImageData.setting_value || '""') 
            : String(homeImageData.setting_value || '');
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
      try {
        const savedImages = localStorage.getItem('fastingApp_pageImages');
        if (savedImages) {
          const pageImages = JSON.parse(savedImages);
          if (pageImages[pageKey]) {
            setImageUrl(pageImages[pageKey]);
            imageCache[pageKey] = pageImages[pageKey];
          }
        }
      } catch (error) {
        console.error('Error loading from localStorage:', error);
      }
      
      setIsLoading(false);
    };

    loadFeaturedImage();
  }, [pageKey]);

  // Handle image load
  const handleImageLoad = () => {
    setIsLoaded(true);
    setIsLoading(false);
  };

  // Handle image error
  const handleImageError = () => {
    setIsLoading(false);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Dark gradient background - always visible */}
      {showDarkBackground && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700" />
      )}
      
      {/* Image with fade-in animation */}
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt="Featured image"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="eager"
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}
      
      {/* Loading animation overlay */}
      {isLoading && showDarkBackground && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

export default PageFeaturedImage;