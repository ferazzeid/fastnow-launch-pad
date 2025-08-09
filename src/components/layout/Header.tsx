
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import MainNavigation from '../MainNavigation';
import { pageContentService } from '@/services/PageContentService';
import { supabase } from '@/integrations/supabase/client';

const Header = () => {
  const location = useLocation();
  const [logoUrl, setLogoUrl] = React.useState<string | null>(null);
  const [logoSize, setLogoSize] = React.useState<number>(32);
  const [faviconUrl, setFaviconUrl] = React.useState<string | null>(null);
  const [navigationSettings, setNavigationSettings] = React.useState<Record<string, boolean>>({});

  // Load logo, favicon and navigation settings from database (with localStorage fallback)
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

        // Load navigation transparency settings
        const navSettings = await pageContentService.getGeneralSetting('navigation_transparency');
        if (navSettings?.setting_value) {
          setNavigationSettings(navSettings.setting_value);
        } else {
          // Default settings - transparent nav for hero pages
          setNavigationSettings({
            homepage_transparent_nav: true,
            about_transparent_nav: true,
            faq_transparent_nav: false,
            protocol_transparent_nav: true,
            timeline_transparent_nav: false,
            about_app_transparent_nav: true,
          });
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        
        // Fallback to localStorage if database fails
        const savedLogoUrl = localStorage.getItem('fastingApp_logoUrl');
        if (savedLogoUrl) setLogoUrl(savedLogoUrl);
        
        const savedLogoSize = localStorage.getItem('fastingApp_logoSize');
        if (savedLogoSize) setLogoSize(parseInt(savedLogoSize));
        
        // Default navigation settings
        setNavigationSettings({
          homepage_transparent_nav: true,
          about_transparent_nav: true,
          faq_transparent_nav: false,
          protocol_transparent_nav: true,
          timeline_transparent_nav: false,
          about_app_transparent_nav: true,
        });
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

  // Determine if current page should have transparent navigation
  const getCurrentPageTransparency = () => {
    const path = location.pathname;
    
    if (path === '/') return navigationSettings.homepage_transparent_nav;
    if (path === '/about-me') return navigationSettings.about_transparent_nav;
    if (path === '/faq') return navigationSettings.faq_transparent_nav;
    if (path === '/fast-now-protocol') return navigationSettings.protocol_transparent_nav;
    if (path === '/fasting-timeline') return navigationSettings.timeline_transparent_nav;
    if (path === '/about-fastnow-app') return navigationSettings.about_app_transparent_nav;
    
    return false; // Default to non-transparent for other pages
  };

  const shouldBeTransparent = getCurrentPageTransparency();

  return (
    <header className="absolute top-0 left-0 right-0 py-6 z-50 bg-transparent border-b border-transparent">
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
          <span className={`text-2xl font-bold transition-colors duration-300 ${
            shouldBeTransparent ? 'text-white drop-shadow-lg' : 'text-foreground'
          }`}>FastNow</span>
        </Link>
        <MainNavigation isTransparent={shouldBeTransparent} />
      </div>
    </header>
  );
};

export default Header;
