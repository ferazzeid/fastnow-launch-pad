
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [logoUrl, setLogoUrl] = React.useState<string | null>(null);
  const [logoSize, setLogoSize] = React.useState<number>(32);

  // Load logo from localStorage on mount
  React.useEffect(() => {
    const savedLogoUrl = localStorage.getItem('fastingApp_logoUrl');
    if (savedLogoUrl) setLogoUrl(savedLogoUrl);
    
    const savedLogoSize = localStorage.getItem('fastingApp_logoSize');
    if (savedLogoSize) setLogoSize(parseInt(savedLogoSize));
  }, []);

  return (
    <header className="py-6 border-b relative z-10">
      <div className="container flex justify-between items-center">
        {logoUrl ? (
          <Link to="/">
            <img src={logoUrl} alt="fastnow.app" style={{ height: `${logoSize}px` }} />
          </Link>
        ) : (
          <Link to="/" className="text-2xl font-bold text-mint-600">fastnow.app</Link>
        )}
      </div>
    </header>
  );
};

export default Header;
