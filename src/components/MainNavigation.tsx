import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { SiteSettingsService } from "@/services/SiteSettingsService";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface MainNavigationProps {
  transparent?: boolean;
}

const MainNavigation: React.FC<MainNavigationProps> = ({ transparent = false }) => {
  const { isAdmin } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  // Static navigation links - no database calls needed
  const navigationLinks = [
    { path: '/', title: 'Home' },
    { path: '/fast-now-protocol', title: 'The Protocol' },
    { path: '/about-fastnow-app', title: 'About App' }
  ];

  // Simple mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLinkClick = () => setIsOpen(false);

  const getNavLinkStyle = (isActive: boolean) => {
    if (transparent) {
      return cn(
        "px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
        "text-white border border-white/30 hover:border-white/50 hover:bg-white/10",
        isActive && "bg-white/20 border-white/50"
      );
    }
    return cn(
      "px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
      "text-gray-900 border border-gray-300 hover:border-gray-400 hover:bg-gray-50",
      isActive && "bg-gray-100 border-gray-400"
    );
  };

  const getLaunchAppStyle = () => {
    return "px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2";
  };

  const NavLinks = ({ onLinkClick }: { onLinkClick?: () => void }) => {
    return (
      <div className={cn("flex gap-4", isMobile ? "flex-col" : "flex-row items-center")}>
        {navigationLinks.map((link) => (
          <Link 
            key={link.path} 
            to={link.path} 
            onClick={onLinkClick}
            className={getNavLinkStyle(location.pathname === link.path)}
          >
            {link.title}
          </Link>
        ))}
        
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
            className={cn(
              "p-2 hover:bg-gray-100",
              transparent 
                ? "text-white hover:text-white hover:bg-white/10" 
                : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            )}
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