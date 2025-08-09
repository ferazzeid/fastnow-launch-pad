
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { LogOut, User, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { SupabaseAuthService } from "@/services/SupabaseAuthService";
import { useIsMobile } from "@/hooks/use-mobile";
import { NavigationSettingsService, NavigationSetting } from "@/services/NavigationSettingsService";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface MainNavigationProps {
  isTransparent?: boolean;
}

const MainNavigation = ({ isTransparent = false }: MainNavigationProps) => {
  const { isAdmin, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [navigationSettings, setNavigationSettings] = useState<NavigationSetting[]>([]);

  // Load navigation settings from database with error handling
  useEffect(() => {
    const loadNavigationSettings = async () => {
      try {
        const settings = await NavigationSettingsService.getNavigationSettings();
        setNavigationSettings(settings);
      } catch (error) {
        console.error('Failed to load navigation settings:', error);
        // Use fallback navigation if database fails
        setNavigationSettings([
          { id: '1', page_key: 'fast-now-protocol', is_visible: true, display_order: 1, created_at: '', updated_at: '' },
          { id: '2', page_key: 'about-fastnow-app', is_visible: true, display_order: 2, created_at: '', updated_at: '' },
          { id: '3', page_key: 'faq', is_visible: true, display_order: 3, created_at: '', updated_at: '' },
          { id: '4', page_key: 'about-me', is_visible: true, display_order: 4, created_at: '', updated_at: '' }
        ]);
      }
    };

    loadNavigationSettings();
  }, []);

  // Debug logging to help identify the issue
  console.log('MainNavigation - isAdmin:', isAdmin, 'isLoading:', isLoading, 'user:', user?.email);
  console.log('MainNavigation - isMobile:', isMobile, 'window width:', typeof window !== 'undefined' ? window.innerWidth : 'undefined');
  console.log('MainNavigation - rendering mobile menu:', isMobile, 'Menu icon size should be 72px');

  const handleLogout = async () => {
    const success = await SupabaseAuthService.signOut();
    if (success) {
      toast.success("Logged out successfully");
      navigate('/');
    }
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const getNavLinkClasses = (isActive: boolean) => {
    const baseClasses = isMobile ? "block px-4 py-3 text-lg font-medium rounded-lg" : navigationMenuTriggerStyle();
    
    if (isTransparent && !isMobile) {
      return cn(
        baseClasses,
        "bg-transparent border-transparent !opacity-100",
        isActive 
          ? "text-white bg-white/10 backdrop-blur-sm border-white/20" 
          : "text-white hover:text-white hover:bg-white/10 backdrop-blur-sm border-transparent hover:border-white/20"
      );
    }
    
    return cn(
      baseClasses,
      "!opacity-100",
      isActive 
        ? "text-black bg-black/10" 
        : "text-foreground hover:text-black hover:bg-black/5"
    );
  };

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

  const NavLinks = ({ onLinkClick }: { onLinkClick?: () => void }) => (
    <>
      {navigationSettings
        .filter(setting => setting.is_visible)
        .map((setting) => {
          const pageInfo = getPageInfo(setting.page_key, setting.custom_url);
          if (!pageInfo) return null;

          return (
            <Link key={setting.page_key} to={pageInfo.path} onClick={onLinkClick}>
              <div className={getNavLinkClasses(location.pathname === pageInfo.path)}>
                {pageInfo.title}
              </div>
            </Link>
          );
        })}
      
      <a 
        href="https://go.fastnow.app" 
        target="_blank" 
        rel="noopener noreferrer" 
        onClick={onLinkClick}
        className={cn(
          isMobile ? "block px-4 py-3 text-lg font-medium rounded-lg" : "inline-flex items-center justify-center gap-1 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2",
          isTransparent 
            ? "text-white hover:text-white hover:bg-white/10 bg-transparent border border-white/20 hover:border-white/40" 
            : "text-black hover:text-black hover:bg-black/10 bg-transparent border border-black/20 hover:border-black/40"
        )}
      >
        Launch App
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    </>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className={cn(
            "p-6 w-20 h-20",
            isTransparent 
              ? "text-white hover:text-white hover:bg-white/20" 
              : "text-gray-700 hover:text-gray-900"
          )}>
            <Menu size={72} style={{ width: '72px', height: '72px', minWidth: '72px', minHeight: '72px' }} />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-80">
          <SheetHeader>
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-2 mt-6">
            <NavLinks onLinkClick={handleLinkClick} />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <NavigationMenu className={isTransparent ? "bg-transparent" : "bg-white"}>
      <NavigationMenuList className="flex items-center gap-4">
        {navigationSettings
          .filter(setting => setting.is_visible)
          .map((setting) => {
            const pageInfo = getPageInfo(setting.page_key, setting.custom_url);
            if (!pageInfo) return null;

            return (
              <NavigationMenuItem key={setting.page_key}>
                <Link to={pageInfo.path}>
                  <NavigationMenuLink className={getNavLinkClasses(location.pathname === pageInfo.path)}>
                    {pageInfo.title}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            );
          })}
        
        <NavigationMenuItem>
          <a 
            href="https://go.fastnow.app" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={cn(
              "inline-flex items-center justify-center gap-1 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2",
              isTransparent 
                ? "text-white hover:text-white hover:bg-white/10 bg-transparent border border-white/20 hover:border-white/40" 
                : "text-black hover:text-black hover:bg-black/10 bg-transparent border border-black/20 hover:border-black/40"
            )}
          >
            Launch App
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default MainNavigation;
