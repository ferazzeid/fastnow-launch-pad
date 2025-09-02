
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
    <div className="min-h-screen">
      <Header />
      <main className={`${!isHomePage ? 'pt-24 md:pt-28' : ''}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PageLayout;
