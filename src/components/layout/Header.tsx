
import React from 'react';
import { Link } from 'react-router-dom';
import MainNavigation from '../MainNavigation';
import { HomepageSettingsService, type HomepageLogoSettings } from "@/services/HomepageSettingsService";

const Header = () => {
  const [logoUrl, setLogoUrl] = React.useState<string | null>(null);
  const [logoSize, setLogoSize] = React.useState<number>(32);
  const [faviconUrl, setFaviconUrl] = React.useState<string | null>(null);

  // Load logo and favicon from database (with localStorage fallback)
  React.useEffect(() => {
    const loadLogoSettings = async () => {
      try {
        // First try to migrate from localStorage
        await HomepageSettingsService.migrateFromLocalStorage();
        
        // Load from database
        const logoSettings = await HomepageSettingsService.getLogoSettings();
        if (logoSettings?.url) {
          setLogoUrl(logoSettings.url);
          setLogoSize(logoSettings.height || 40);
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

  return (
    <header className="py-6 border-b border-gray-200 bg-white relative z-10">
      <div className="container flex justify-between items-center">
        {logoUrl ? (
          <Link to="/">
            <img src={logoUrl} alt="fastnow.app" style={{ height: `${logoSize}px` }} />
          </Link>
        ) : (
          <Link to="/" className="text-2xl font-bold text-accent-green">FastNow</Link>
        )}
        <MainNavigation />
      </div>
    </header>
  );
};

export default Header;
