
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [ctaTitle, setCtaTitle] = React.useState('Ready to start your health transformation?');
  const [ctaSubtitle, setCtaSubtitle] = React.useState('Access the Fast Now app and take control of your health through our structured protocol.');

  // Load content from localStorage on mount
  React.useEffect(() => {
    // CTA content
    const savedCtaTitle = localStorage.getItem('fastingApp_ctaTitle');
    if (savedCtaTitle) setCtaTitle(savedCtaTitle);
    
    const savedCtaSubtitle = localStorage.getItem('fastingApp_ctaSubtitle');
    if (savedCtaSubtitle) setCtaSubtitle(savedCtaSubtitle);
  }, []);

  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      {/* Footer Links */}
      <div className="py-8 bg-white">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-600 mb-4 md:mb-0">
              © {new Date().getFullYear()} fastnow.app. All rights reserved.
            </div>
            <div className="flex items-center gap-6">
              <div className="flex gap-6">
                <Link to="/privacy" className="text-sm text-gray-600 hover:text-accent-green">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="text-sm text-gray-600 hover:text-accent-green">
                  Terms of Service
                </Link>
                <Link to="/contact" className="text-sm text-gray-600 hover:text-accent-green">
                  Contact
                </Link>
              </div>
              
              {/* Social Media Links */}
              <div className="flex items-center gap-4 ml-4 border-l border-gray-300 pl-4">
                <a 
                  href="https://www.tiktok.com/@fastnowapp" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-accent-green transition-colors"
                  aria-label="Follow us on TikTok"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M19.321 5.562a5.124 5.124 0 01-.443-.258 6.228 6.228 0 01-1.137-.966c-.849-.849-1.154-1.918-1.154-2.898V1h-3.177v14.826c0 1.765-1.435 3.199-3.199 3.199s-3.199-1.434-3.199-3.199c0-1.765 1.435-3.199 3.199-3.199.395 0 .774.072 1.126.203V9.689c-.367-.052-.742-.08-1.126-.08-3.873 0-7.015 3.142-7.015 7.015S6.339 23.64 10.211 23.64s7.015-3.142 7.015-7.015V9.689c1.579.978 3.445 1.548 5.439 1.548v-3.842c-1.22 0-2.364-.386-3.344-1.115l.001-.718z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
