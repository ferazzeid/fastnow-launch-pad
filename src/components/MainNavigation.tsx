import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { SupabaseAuthService } from "@/services/SupabaseAuthService";
import { NavigationSettingsService, NavigationSetting } from "@/services/NavigationSettingsService";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const MainNavigation = () => {
  const { isAdmin, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [navigationSettings, setNavigationSettings] = useState<NavigationSetting[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [navLoading, setNavLoading] = useState(true);
  const [navError, setNavError] = useState(false);

  // Default fallback navigation settings
  const defaultNavSettings: NavigationSetting[] = [
    { id: '1', page_key: 'fast-now-protocol', is_visible: true, display_order: 1, created_at: '', updated_at: '' },
    { id: '2', page_key: 'about-fastnow-app', is_visible: true, display_order: 2, created_at: '', updated_at: '' },
    { id: '3', page_key: 'faq', is_visible: true, display_order: 3, created_at: '', updated_at: '' },
    { id: '4', page_key: 'about-me', is_visible: true, display_order: 4, created_at: '', updated_at: '' }
  ];

  // Simple mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load navigation settings with improved error handling
  useEffect(() => {
    let mounted = true;
    
    const loadNavigationSettings = async () => {
      try {
        setNavLoading(true);
        setNavError(false);
        console.log('🔄 Loading navigation settings...');
        
        const settings = await NavigationSettingsService.getNavigationSettings();
        
        if (!mounted) return;
        
        if (settings && settings.length > 0) {
          console.log('✅ Navigation settings loaded successfully:', settings);
          setNavigationSettings(settings);
        } else {
          console.log('⚠️ No navigation settings found, using default fallback');
          setNavigationSettings(defaultNavSettings);
        }
      } catch (error) {
        console.error('❌ Failed to load navigation settings:', error);
        if (mounted) {
          setNavError(true);
          setNavigationSettings(defaultNavSettings);
        }
      } finally {
        if (mounted) {
          setNavLoading(false);
        }
      }
    };

    loadNavigationSettings();
    
    return () => {
      mounted = false;
    };
  }, []);

  const handleLogout = async () => {
    const success = await SupabaseAuthService.signOut();
    if (success) {
      toast.success("Logged out successfully");
      navigate('/');
    }
  };

  const handleLinkClick = () => setIsOpen(false);

  const getPageInfo = (pageKey: string, customUrl?: string) => {
    const pages = {
      'fast-now-protocol': { path: '/fast-now-protocol', title: 'The Protocol' },
      'about-fastnow-app': { path: '/about-fastnow-app', title: 'About App' },
      'faq': { path: '/faq', title: 'FAQ' },
      'about-me': { path: '/about-me', title: 'Me' }
    };
    const defaultPage = pages[pageKey as keyof typeof pages];
    if (!defaultPage) return null;
    
    return {
      ...defaultPage,
      path: customUrl || defaultPage.path
    };
  };

  const getNavLinkStyle = (isActive: boolean) => {
    return cn(
      "px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
      "text-gray-900 border border-gray-300 hover:border-gray-400 hover:bg-gray-50",
      isActive && "bg-gray-100 border-gray-400"
    );
  };

  const getLaunchAppStyle = () => {
    return "px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 text-gray-900 border border-gray-300 hover:border-gray-400 hover:bg-gray-50 inline-flex items-center gap-2";
  };

  const NavLinks = ({ onLinkClick }: { onLinkClick?: () => void }) => {
    console.log('🔍 Rendering NavLinks:', { 
      navigationSettings: navigationSettings.length, 
      navLoading, 
      navError,
      visibleSettings: navigationSettings.filter(s => s.is_visible).length
    });

    if (navLoading) {
      return (
        <div className={cn("flex gap-4", isMobile ? "flex-col" : "flex-row items-center")}>
          <span className="text-sm text-gray-500">Loading navigation...</span>
        </div>
      );
    }

    return (
      <div className={cn("flex gap-4", isMobile ? "flex-col" : "flex-row items-center")}>
        {navigationSettings
          .filter(setting => setting.is_visible)
          .sort((a, b) => a.display_order - b.display_order)
          .map((setting) => {
            const pageInfo = getPageInfo(setting.page_key, setting.custom_url);
            if (!pageInfo) return null;

            return (
              <Link 
                key={setting.page_key} 
                to={pageInfo.path} 
                onClick={onLinkClick}
                className={getNavLinkStyle(location.pathname === pageInfo.path)}
              >
                {pageInfo.title}
              </Link>
            );
          })}
        
        {/* Admin link - conditional based on auth */}
        {isAdmin ? (
          <Link 
            to="/admin" 
            onClick={onLinkClick}
            className={getNavLinkStyle(location.pathname.startsWith('/admin'))}
          >
            Admin
          </Link>
        ) : (
          <Link 
            to="/admin/login" 
            onClick={onLinkClick}
            className={getNavLinkStyle(location.pathname.startsWith('/admin'))}
          >
            Admin
          </Link>
        )}
        
        <a 
          href="https://go.fastnow.app" 
          target="_blank" 
          rel="noopener noreferrer" 
          onClick={onLinkClick}
          className={getLaunchAppStyle()}
        >
          Launch App
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    );
  };

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100"
          >
            <Menu size={24} />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-80">
          <SheetHeader>
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <NavLinks onLinkClick={handleLinkClick} />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <nav className="flex items-center">
      <NavLinks />
    </nav>
  );
};

export default MainNavigation;