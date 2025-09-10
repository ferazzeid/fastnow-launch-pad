import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, ChevronDown, Calculator } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useNavigationTranslation } from "@/hooks/useTranslation";
import { useIsMobile } from "@/hooks/use-mobile";
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
  const isMobile = useIsMobile();
  
  // Simplified navigation links
  const navLinks = [
    { path: '/', title: t('menu.home') },
    { path: '/fastnow-protocol/water-fast', title: 'Water Fast' },
    { path: '/fastnow-protocol/calorie-limitation', title: t('menu.calorieLimitation') },
    { path: '/fastnow-protocol/walking', title: t('menu.walkingProtocol') },
  ];

  const endNavLinks = [
    { path: '/blog', title: t('menu.blog') },
  ];


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

        {/* End Navigation Links */}
        {endNavLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            onClick={onLinkClick}
            className={cn(
              isMobile 
                ? "flex items-center px-4 py-3 text-base font-medium rounded-lg transition-colors border border-border hover:bg-accent hover:text-accent-foreground min-h-[48px]"
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
              "p-2 min-h-[40px] min-w-[40px]",
              transparent 
                ? "text-white hover:text-white hover:bg-white/10 border border-white/30 hover:border-white/50" 
                : "text-gray-700 hover:text-gray-900 hover:bg-gray-100 border border-gray-300 hover:border-gray-400"
            )}
            aria-label="Open navigation menu"
          >
            <Menu size={20} />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-80 max-w-[90vw]">
          <SheetHeader>
            <SheetTitle className="text-left">Menu</SheetTitle>
          </SheetHeader>
          <div className="mt-8 space-y-2">
            <NavLinks onLinkClick={handleLinkClick} transparent={false} />
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