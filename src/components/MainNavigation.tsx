import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, ChevronDown, Calculator } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { SiteSettingsService } from "@/services/SiteSettingsService";
import { useNavigationTranslation } from "@/hooks/useTranslation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MainNavigationProps {
  transparent?: boolean;
}

const MainNavigation: React.FC<MainNavigationProps> = ({ transparent = false }) => {
  const { isAdmin } = useAuth();
  const location = useLocation();
  const { t } = useNavigationTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Navigation links with translations
  const navLinks = [
    { path: '/', title: t('menu.home') },
    { path: '/fastnow-protocol', title: t('menu.protocol') },
    { path: '/about-fastnow-app', title: t('menu.about') },
    { path: '/motivators', title: t('menu.motivators') },
  ];

  const endNavLinks = [
    { path: '/blog', title: t('menu.blog') },
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

  const calculatorLinks = [
    { path: '/walking-calculator', title: t('menu.walkingCalculator') },
    { path: '/weight-loss-calculator', title: t('menu.weightLossCalculator') }
  ];

  const isCalculatorPath = calculatorLinks.some(link => location.pathname === link.path);

  const NavLinks = ({ onLinkClick, transparent }: { onLinkClick?: () => void; transparent?: boolean }) => {
    return (
      <div className={cn("flex gap-4", isMobile ? "flex-col space-y-2" : "flex-row items-center")}>
        {navLinks.map((link) => (
          <Link 
            key={link.path} 
            to={link.path} 
            onClick={onLinkClick}
            className={cn(
              isMobile 
                ? "flex items-center px-4 py-3 text-base font-medium rounded-lg transition-colors border border-border hover:bg-accent hover:text-accent-foreground min-h-[48px]"
                : getNavLinkStyle(location.pathname === link.path),
              isMobile && location.pathname === link.path && "bg-accent text-accent-foreground"
            )}
          >
            {link.title}
          </Link>
        ))}
        
        {/* Calculators Dropdown - Desktop */}
        {!isMobile && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center gap-1",
                  transparent
                    ? "text-white border border-white/30 hover:border-white/50 hover:bg-white/10"
                    : "text-gray-900 border border-gray-300 hover:border-gray-400 hover:bg-gray-50",
                  isCalculatorPath && (transparent ? "bg-white/20 border-white/50" : "bg-gray-100 border-gray-400")
                )}
              >
                <Calculator className="w-4 h-4" />
                {t('menu.calculators')}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="start" 
              className="w-56 bg-background border border-border shadow-lg z-50"
            >
              {calculatorLinks.map((link) => (
                <DropdownMenuItem key={link.path} asChild>
                  <Link
                    to={link.path}
                    className="flex items-center px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                  >
                    <Calculator className="w-4 h-4 mr-2" />
                    {link.title}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Calculators Links - Mobile */}
        {isMobile && (
          <div className="space-y-2">
            <div className="px-4 py-2 text-sm font-semibold text-muted-foreground">
              {t('menu.calculators')}
            </div>
            {calculatorLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={onLinkClick}
                className={cn(
                  "flex items-center px-6 py-3 text-base font-medium rounded-lg transition-colors border border-border hover:bg-accent hover:text-accent-foreground min-h-[48px]",
                  location.pathname === link.path && "bg-accent text-accent-foreground"
                )}
              >
                <Calculator className="w-4 h-4 mr-3" />
                {link.title}
              </Link>
            ))}
          </div>
        )}

        {/* End Navigation Links */}
        {endNavLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            onClick={onLinkClick}
            className={cn(
              isMobile 
                ? "flex items-center px-6 py-3 text-base font-medium rounded-lg transition-colors border border-border hover:bg-accent hover:text-accent-foreground min-h-[48px]"
                : "px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 border border-transparent hover:border-gray-300",
              transparent && !isMobile
                ? "text-white border-white/30 hover:border-white/50 hover:bg-white/10"
                : !isMobile && "text-gray-900 border-gray-300 hover:border-gray-400 hover:bg-gray-50",
              location.pathname === link.path && (transparent && !isMobile ? "bg-white/20 border-white/50" : !isMobile ? "bg-gray-100 border-gray-400" : "bg-accent text-accent-foreground")
            )}
          >
            {link.title}
          </Link>
        ))}
        
        {/* Language Switcher */}
        <LanguageSwitcher transparent={transparent} />
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
            <NavLinks onLinkClick={handleLinkClick} transparent={transparent} />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <nav className="flex items-center">
      <NavLinks transparent={transparent} />
    </nav>
  );
};

export default MainNavigation;