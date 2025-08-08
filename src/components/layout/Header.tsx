
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import MainNavigation from '../MainNavigation';
import { pageContentService } from '@/services/PageContentService';

const Header = () => {
  const location = useLocation();
  const [logoUrl, setLogoUrl] = React.useState<string | null>(null);
  const [logoSize, setLogoSize] = React.useState<number>(32);
  const [faviconUrl, setFaviconUrl] = React.useState<string | null>(null);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [navigationSettings, setNavigationSettings] = React.useState<Record<string, boolean>>({});

  // Load logo, favicon and navigation settings from database (with localStorage fallback)
  React.useEffect(() => {
    const loadSettings = async () => {
      try {
        // Load site identity settings for logo
        const siteIdentity = await pageContentService.getGeneralSetting('site_identity');
        if (siteIdentity?.setting_value) {
          const { logoUrl: dbLogoUrl } = siteIdentity.setting_value;
          if (dbLogoUrl) {
            setLogoUrl(dbLogoUrl);
            setLogoSize(40); // Default size
          }
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

    // Load favicon from localStorage (keeping this separate for now)
    const savedFaviconUrl = localStorage.getItem('fastingApp_faviconUrl');
    if (savedFaviconUrl) {
      setFaviconUrl(savedFaviconUrl);
      // Update favicon in the document
      const linkElement = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
      if (linkElement) {
        linkElement.href = savedFaviconUrl;
      } else {
        const newLink = document.createElement('link');
        newLink.rel = 'icon';
        newLink.href = savedFaviconUrl;
        document.head.appendChild(newLink);
      }
    }

    loadSettings();
  }, []);

  // Handle scroll effect
  React.useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

  const shouldBeTransparent = getCurrentPageTransparency() && !isScrolled;

  return (
    <header className={`fixed top-0 left-0 right-0 py-6 transition-all duration-300 z-50 ${
      isScrolled || !getCurrentPageTransparency()
        ? 'bg-background backdrop-blur-sm border-b border-border shadow-sm' 
        : 'bg-transparent border-b border-transparent'
    }`}>
      <div className="container flex justify-between items-center">
        {logoUrl ? (
          <Link to="/">
            <img src={logoUrl} alt="fastnow.app" style={{ height: `${logoSize}px` }} />
          </Link>
        ) : (
          <Link to="/" className={`text-2xl font-bold transition-colors duration-300 ${
            shouldBeTransparent ? 'text-white drop-shadow-lg' : 'text-accent-green'
          }`}>FastNow</Link>
        )}
        <MainNavigation isTransparent={shouldBeTransparent} />
      </div>
    </header>
  );
};

export default Header;
