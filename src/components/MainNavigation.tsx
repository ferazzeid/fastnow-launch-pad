
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
import { LogOut, User, ArrowRight, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { SupabaseAuthService } from "@/services/SupabaseAuthService";
import { useIsMobile } from "@/hooks/use-mobile";
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

  // Debug logging to help identify the issue
  console.log('MainNavigation - isAdmin:', isAdmin, 'isLoading:', isLoading, 'user:', user?.email);

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
        "bg-transparent border-transparent",
        isActive 
          ? "text-white bg-white/10 backdrop-blur-sm border-white/20" 
          : "text-white/90 hover:text-white hover:bg-white/10 backdrop-blur-sm border-transparent hover:border-white/20"
      );
    }
    
    return cn(
      baseClasses,
      isActive 
        ? "text-accent-green bg-accent-green/10" 
        : "text-foreground hover:text-accent-green hover:bg-accent-green/5"
    );
  };

  const NavLinks = ({ onLinkClick }: { onLinkClick?: () => void }) => (
    <>
      <Link to="/fast-now-protocol" onClick={onLinkClick}>
        <div className={getNavLinkClasses(location.pathname === "/fast-now-protocol")}>
          The Protocol
        </div>
      </Link>
      
      <Link to="/about-fastnow-app" onClick={onLinkClick}>
        <div className={getNavLinkClasses(location.pathname === "/about-fastnow-app")}>
          About App
        </div>
      </Link>
      
      <Link to="/faq" onClick={onLinkClick}>
        <div className={getNavLinkClasses(location.pathname === "/faq")}>
          FAQ
        </div>
      </Link>
      
      <Link to="/about-me" onClick={onLinkClick}>
        <div className={getNavLinkClasses(location.pathname === "/about-me")}>
          Me
        </div>
      </Link>
      
      <a 
        href="https://go.fastnow.app" 
        target="_blank" 
        rel="noopener noreferrer" 
        onClick={onLinkClick}
        className={cn(
          isMobile ? "block px-4 py-3 text-lg font-medium rounded-lg" : navigationMenuTriggerStyle(),
          "text-white hover:text-white hover:bg-accent-green-dark bg-accent-green flex items-center gap-1"
        )}
      >
        Launch App
        <ArrowRight size={14} />
      </a>
      
    </>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className={cn(
            "p-3",
            isTransparent 
              ? "text-white hover:text-white hover:bg-white/20" 
              : "text-gray-700 hover:text-gray-900"
          )}>
            <Menu size={72} />
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
        <NavigationMenuItem>
          <Link to="/fast-now-protocol">
            <NavigationMenuLink className={getNavLinkClasses(location.pathname === "/fast-now-protocol")}>
              The Protocol
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/about-fastnow-app">
            <NavigationMenuLink className={getNavLinkClasses(location.pathname === "/about-fastnow-app")}>
              About App
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/faq">
            <NavigationMenuLink className={getNavLinkClasses(location.pathname === "/faq")}>
              FAQ
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/about-me">
            <NavigationMenuLink className={getNavLinkClasses(location.pathname === "/about-me")}>
              Me
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <a 
            href="https://go.fastnow.app" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={cn(
              navigationMenuTriggerStyle(),
              "text-white hover:text-white hover:bg-accent-green-dark bg-accent-green flex items-center gap-1"
            )}
          >
            Launch App
            <ArrowRight size={14} />
          </a>
        </NavigationMenuItem>
        
        
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default MainNavigation;
