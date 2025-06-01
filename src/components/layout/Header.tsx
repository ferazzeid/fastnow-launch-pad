
import React from 'react';
import { Link } from 'react-router-dom';
import MainNavigation from '../MainNavigation';

const Header = () => {
  const [logoUrl, setLogoUrl] = React.useState<string | null>(null);
  const [logoSize, setLogoSize] = React.useState<number>(32);
  const [faviconUrl, setFaviconUrl] = React.useState<string | null>(null);

  // Load logo and favicon from localStorage on mount
  React.useEffect(() => {
    const savedLogoUrl = localStorage.getItem('fastingApp_logoUrl');
    if (savedLogoUrl) setLogoUrl(savedLogoUrl);
    
    const savedLogoSize = localStorage.getItem('fastingApp_logoSize');
    if (savedLogoSize) setLogoSize(parseInt(savedLogoSize));

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
  }, []);

  return (
    <header className="py-6 border-b border-gray-200 bg-white relative z-10">
      <div className="container flex justify-between items-center">
        {logoUrl ? (
          <Link to="/">
            <img src={logoUrl} alt="fastnow.app" style={{ height: `${logoSize}px` }} />
          </Link>
        ) : (
          <Link to="/" className="text-2xl font-bold text-accent-green">fastnow.app</Link>
        )}
        <MainNavigation />
      </div>
    </header>
  );
};

export default Header;
