
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
      {/* CTA Section */}
      <div className="py-16">
        <div className="container text-center">
          <h3 className="text-3xl font-bold mb-4 text-gray-900">{ctaTitle}</h3>
          <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
            {ctaSubtitle}
          </p>
        </div>
      </div>
      
      {/* Footer Links */}
      <div className="py-8 border-t border-gray-200 bg-white">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-600 mb-4 md:mb-0">
              © {new Date().getFullYear()} fastnow.app. All rights reserved.
            </div>
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
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
