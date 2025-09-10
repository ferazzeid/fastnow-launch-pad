
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import MainNavigation from '../MainNavigation';
import LanguageSwitcher from '../LanguageSwitcher';
import GlobalSchema from '../GlobalSchema';
import { pageContentService } from '@/services/PageContentService';
import { supabase } from '@/integrations/supabase/client';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import AdminTranslateButton from '@/components/admin/AdminTranslateButton';
import { useIsMobile } from '@/hooks/use-mobile';

interface HeaderProps {
  transparent?: boolean;
}

const Header: React.FC<HeaderProps> = ({ transparent = false }) => {
  const [logoUrl, setLogoUrl] = React.useState<string | null>(null);
  const [logoSize, setLogoSize] = React.useState<number>(32);
  const [faviconUrl, setFaviconUrl] = React.useState<string | null>(null);
  const { isAdmin } = useAdminCheck();
  const location = useLocation();
  const isMobile = useIsMobile();

  // Determine page type and key for translation
  const getPageInfo = () => {
    const path = location.pathname;
    
    if (path.startsWith('/blog/')) {
      const slug = path.replace('/blog/', '');
      return { pageType: 'blog_posts' as const, pageKey: slug };
    }
    
    if (path.startsWith('/motivators/')) {
      const slug = path.replace('/motivators/', '');
      return { pageType: 'system_motivators' as const, pageKey: slug };
    }
    
    if (path === '/about-fastnow-app') {
      return { pageType: 'page_content' as const, pageKey: 'about-fastnow-app' };
    }
    
    if (path === '/fastnow-protocol') {
      return { pageType: 'page_content' as const, pageKey: 'fastnow-protocol' };
    }
    
    if (path === '/privacy' || path === '/privacy-policy') {
      return { pageType: 'page_content' as const, pageKey: 'privacy-policy' };
    }
    
    if (path === '/terms' || path === '/terms-of-service') {
      return { pageType: 'page_content' as const, pageKey: 'terms-of-service' };
    }
    
    if (path === '/contact') {
      return { pageType: 'page_content' as const, pageKey: 'contact' };
    }
    
    return null;
  };

  const pageInfo = getPageInfo();

  // Load logo and favicon from database (with localStorage fallback)
  React.useEffect(() => {
    const loadSettings = async () => {
      try {
        // Load logo settings from homepage_settings table
        try {
          const { data: logoData } = await supabase
            .from('homepage_settings')
            .select('setting_value')
            .eq('setting_key', 'logo')
            .single();
          
          if (logoData?.setting_value && typeof logoData.setting_value === 'object') {
            const logoSettings = logoData.setting_value as { url?: string; height?: number };
            if (logoSettings.url) {
              setLogoUrl(logoSettings.url);
              setLogoSize(logoSettings.height || 40);
            }
          }
        } catch (error) {
          console.error('Error loading logo from homepage settings:', error);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        
        // Fallback to localStorage if database fails
        const savedLogoUrl = localStorage.getItem('fastingApp_logoUrl');
        if (savedLogoUrl) setLogoUrl(savedLogoUrl);
        
        const savedLogoSize = localStorage.getItem('fastingApp_logoSize');
        if (savedLogoSize) setLogoSize(parseInt(savedLogoSize));
      }
    };

    // Load favicon from database first, then localStorage fallback
    const loadFavicon = async () => {
      try {
        const faviconData = await pageContentService.getGeneralSetting('site_favicon');
        let faviconUrl = '';
        
        if (faviconData?.setting_value) {
          if (typeof faviconData.setting_value === 'string') {
            faviconUrl = faviconData.setting_value;
          } else if (typeof faviconData.setting_value === 'object' && faviconData.setting_value.url) {
            faviconUrl = faviconData.setting_value.url;
          }
        }
        
        // Fallback to localStorage if database doesn't have favicon
        if (!faviconUrl) {
          faviconUrl = localStorage.getItem('fastingApp_faviconUrl') || '';
        }
        
        if (faviconUrl) {
          setFaviconUrl(faviconUrl);
          
          // Update favicon in DOM
          let linkElement = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
          if (!linkElement) {
            linkElement = document.createElement('link');
            linkElement.rel = 'icon';
            document.head.appendChild(linkElement);
          }
          linkElement.href = faviconUrl;
          linkElement.type = 'image/png';
        }
      } catch (error) {
        console.error('Error loading favicon from database:', error);
        // Fallback to localStorage
        const fallbackFavicon = localStorage.getItem('fastingApp_faviconUrl');
        if (fallbackFavicon) {
          setFaviconUrl(fallbackFavicon);
          
          let linkElement = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
          if (!linkElement) {
            linkElement = document.createElement('link');
            linkElement.rel = 'icon';
            document.head.appendChild(linkElement);
          }
          linkElement.href = fallbackFavicon;
          linkElement.type = 'image/png';
        }
      }
    };

    loadSettings();
    loadFavicon();
  }, []);

  return (
    <>
      <GlobalSchema />
      <header className={`sticky top-0 left-0 right-0 py-4 z-50 ${
        transparent 
          ? 'bg-transparent border-transparent' 
          : 'bg-white border-b border-gray-200 shadow-sm'
      }`}>
      <div className="container flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          {logoUrl && (
            <img 
              src={logoUrl} 
              alt="fastnow.app logo" 
              style={{ height: `${logoSize}px` }}
              className="rounded-full"
            />
          )}
          <span className={`text-2xl font-bold ${transparent ? 'text-white' : 'text-gray-900'}`}>FastNow</span>
        </Link>
        
        <div className="flex items-center gap-2">
          <MainNavigation transparent={transparent} />
          
          {/* Language Switcher - moved to the far right */}
          <LanguageSwitcher transparent={transparent} />
        </div>
      </div>
    </header>
    </>
  );
};

export default Header;
