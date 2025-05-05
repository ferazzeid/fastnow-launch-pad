
import React from 'react';
import { Link } from 'react-router-dom';
import { AppStoreButton } from '@/components/AppStoreButton';
import { GooglePlayButton } from '@/components/GooglePlayButton';

const Footer = () => {
  const [ctaTitle, setCtaTitle] = React.useState('Ready to start your fasting journey?');
  const [ctaSubtitle, setCtaSubtitle] = React.useState('Download fastnow.app today and transform your health through fasting.');
  const [appStoreLink, setAppStoreLink] = React.useState('https://apps.apple.com');
  const [googlePlayLink, setGooglePlayLink] = React.useState('https://play.google.com');

  // Load content from localStorage on mount
  React.useEffect(() => {
    // CTA content
    const savedCtaTitle = localStorage.getItem('fastingApp_ctaTitle');
    if (savedCtaTitle) setCtaTitle(savedCtaTitle);
    
    const savedCtaSubtitle = localStorage.getItem('fastingApp_ctaSubtitle');
    if (savedCtaSubtitle) setCtaSubtitle(savedCtaSubtitle);
    
    // App store links
    const savedAppStoreLink = localStorage.getItem('fastingApp_appStoreLink');
    if (savedAppStoreLink) setAppStoreLink(savedAppStoreLink);
    
    const savedGooglePlayLink = localStorage.getItem('fastingApp_googlePlayLink');
    if (savedGooglePlayLink) setGooglePlayLink(savedGooglePlayLink);
  }, []);

  return (
    <footer className="border-t border-cream-200 bg-cream-50">
      {/* CTA Section */}
      <div className="py-16">
        <div className="container text-center">
          <h3 className="text-3xl font-bold mb-4 text-mint-600">{ctaTitle}</h3>
          <p className="text-xl text-mint-500 mb-8 max-w-md mx-auto">
            {ctaSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="neomorphic overflow-hidden rounded-2xl">
              <AppStoreButton 
                href={appStoreLink} 
                className="bg-cream-100 border-none text-mint-600"
              />
            </div>
            <div className="neomorphic overflow-hidden rounded-2xl">
              <GooglePlayButton 
                href={googlePlayLink} 
                className="bg-cream-100 border-none text-mint-600"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Links */}
      <div className="py-8 border-t border-cream-200">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-mint-500 mb-4 md:mb-0">
              © {new Date().getFullYear()} fastnow.app. All rights reserved.
            </div>
            <div className="flex gap-6">
              <Link to="/privacy" className="text-sm text-mint-500 hover:text-mint-600">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-mint-500 hover:text-mint-600">
                Terms of Service
              </Link>
              <Link to="/contact" className="text-sm text-mint-500 hover:text-mint-600">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
