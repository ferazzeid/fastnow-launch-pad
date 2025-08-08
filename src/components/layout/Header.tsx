
import React from 'react';
import { Link } from 'react-router-dom';
import MainNavigation from '../MainNavigation';
import { pageContentService } from '@/services/PageContentService';

const Header = () => {
  const [logoUrl, setLogoUrl] = React.useState<string | null>(null);
  const [logoSize, setLogoSize] = React.useState<number>(32);
  const [faviconUrl, setFaviconUrl] = React.useState<string | null>(null);
  const [isScrolled, setIsScrolled] = React.useState(false);

  // Load logo and favicon from database (with localStorage fallback)
  React.useEffect(() => {
    const loadLogoSettings = async () => {
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
      } catch (error) {
        console.error('Error loading logo settings:', error);
        
        // Fallback to localStorage if database fails
        const savedLogoUrl = localStorage.getItem('fastingApp_logoUrl');
        if (savedLogoUrl) setLogoUrl(savedLogoUrl);
        
        const savedLogoSize = localStorage.getItem('fastingApp_logoSize');
        if (savedLogoSize) setLogoSize(parseInt(savedLogoSize));
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

    loadLogoSettings();
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

  return (
    <header className={`fixed top-0 left-0 right-0 py-6 transition-all duration-300 z-50 ${
      isScrolled 
        ? 'bg-background/95 backdrop-blur-sm border-b border-border shadow-sm' 
        : 'bg-transparent border-b border-transparent'
    }`}>
      <div className="container flex justify-between items-center">
        {logoUrl ? (
          <Link to="/">
            <img src={logoUrl} alt="fastnow.app" style={{ height: `${logoSize}px` }} />
          </Link>
        ) : (
          <Link to="/" className={`text-2xl font-bold transition-colors duration-300 ${
            isScrolled ? 'text-accent-green' : 'text-white drop-shadow-lg'
          }`}>FastNow</Link>
        )}
        <MainNavigation isTransparent={!isScrolled} />
      </div>
    </header>
  );
};

export default Header;
