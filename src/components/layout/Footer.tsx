
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { SupabaseAuthService } from '@/services/SupabaseAuthService';
import { toast } from '@/components/ui/sonner';
import { LogOut, User } from 'lucide-react';
import SocialMediaLinks from '@/components/SocialMediaLinks';

const Footer = () => {
  const { isAdmin, isLoading } = useAuth();
  const [ctaTitle, setCtaTitle] = React.useState('Ready to start your health transformation?');
  const [ctaSubtitle, setCtaSubtitle] = React.useState('Access the Fast Now app and take control of your health through our structured protocol.');

  const handleLogout = async () => {
    const success = await SupabaseAuthService.signOut();
    if (success) {
      toast.success("Logged out successfully");
    }
  };

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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-600">
              © {new Date().getFullYear()} fastnow.app. All rights reserved.
            </div>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 w-full md:w-auto">
              <div className="flex flex-wrap gap-4 md:gap-6">
                <Link to="/privacy" className="text-sm text-gray-600 hover:text-foreground">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="text-sm text-gray-600 hover:text-foreground">
                  Terms of Service
                </Link>
                <Link to="/contact" className="text-sm text-gray-600 hover:text-foreground">
                  Contact
                </Link>
                <Link to="/blog" className="text-sm text-gray-600 hover:text-foreground">
                  Blog
                </Link>
                
                {/* Admin access - show appropriate link based on auth state */}
                {!isLoading && isAdmin ? (
                  <>
                    <Link to="/admin" className="text-sm text-gray-600 hover:text-foreground flex items-center gap-1">
                      <User size={14} />
                      Admin
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="text-sm text-gray-600 hover:text-foreground flex items-center gap-1"
                    >
                      <LogOut size={14} />
                      Logout
                    </button>
                  </>
                ) : (
                  <Link to="/admin/login" className="text-sm text-gray-600 hover:text-foreground flex items-center gap-1">
                    <User size={14} />
                    Login
                  </Link>
                )}
              </div>
              
              {/* Social Media Links */}
              <div className="flex items-center gap-4 md:border-l md:border-gray-300 md:pl-4">
                <SocialMediaLinks />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
