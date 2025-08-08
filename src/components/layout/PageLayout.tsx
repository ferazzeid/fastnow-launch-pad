
import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className={`flex-1 relative ${!isHomePage ? 'pt-20 md:pt-24' : ''}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PageLayout;
