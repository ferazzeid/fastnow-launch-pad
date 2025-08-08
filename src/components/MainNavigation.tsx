
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
        isActive 
          ? "text-accent-green bg-white/20 backdrop-blur-sm" 
          : "text-white/90 hover:text-white hover:bg-white/20 backdrop-blur-sm"
      );
    }
    
    return cn(
      baseClasses,
      isActive 
        ? "text-accent-green bg-gray-50" 
        : "text-gray-700 hover:text-accent-green hover:bg-gray-50"
    );
  };

  const NavLinks = ({ onLinkClick }: { onLinkClick?: () => void }) => (
    <>
      <Link to="/fastnow-protocol" onClick={onLinkClick}>
        <div className={getNavLinkClasses(location.pathname === "/fastnow-protocol")}>
          The FastNow Protocol
        </div>
      </Link>
      
      <Link to="/faq" onClick={onLinkClick}>
        <div className={getNavLinkClasses(location.pathname === "/faq")}>
          FAQ
        </div>
      </Link>
      
      <Link to="/about-me" onClick={onLinkClick}>
        <div className={getNavLinkClasses(location.pathname === "/about-me")}>
          About Me
        </div>
      </Link>
      
      <Link to="/about-fastnow-app" onClick={onLinkClick}>
        <div className={getNavLinkClasses(location.pathname === "/about-fastnow-app")}>
          About FastNow App
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
        App
        <ArrowRight size={14} />
      </a>
      
      {!isLoading && isAdmin && (
        <>
          <Link to="/admin" onClick={onLinkClick}>
            <div className={cn(
              isMobile ? "block px-4 py-3 text-lg font-medium rounded-lg" : navigationMenuTriggerStyle(),
              "text-gray-700 hover:text-accent-green hover:bg-gray-50 flex items-center gap-1",
              location.pathname === "/admin" && "text-accent-green bg-gray-50"
            )}>
              <User size={16} />
              Admin Dashboard
            </div>
          </Link>
          
          <button
            onClick={() => {
              handleLogout();
              onLinkClick?.();
            }}
            className={cn(
              isMobile ? "block px-4 py-3 text-lg font-medium rounded-lg w-full text-left" : "flex items-center gap-1",
              "text-gray-700 hover:text-accent-green hover:bg-gray-50"
            )}
          >
            <LogOut size={16} />
            Logout
          </button>
        </>
      )}
      
      {!isLoading && !isAdmin && (
        <Link to="/admin/login" onClick={onLinkClick}>
          <div className={cn(
            isMobile ? "block px-4 py-3 text-lg font-medium rounded-lg" : navigationMenuTriggerStyle(),
            "text-gray-700 hover:text-accent-green hover:bg-gray-50 flex items-center gap-1",
            location.pathname === "/admin/login" && "text-accent-green bg-gray-50"
          )}>
            <User size={16} />
            Admin Login
          </div>
        </Link>
      )}
    </>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className={cn(
            "p-2",
            isTransparent 
              ? "text-white hover:text-white hover:bg-white/20" 
              : "text-gray-700 hover:text-gray-900"
          )}>
            <Menu size={24} />
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
          <Link to="/fastnow-protocol">
            <NavigationMenuLink className={getNavLinkClasses(location.pathname === "/fastnow-protocol")}>
              The FastNow Protocol
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
              About Me
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/about-fastnow-app">
            <NavigationMenuLink className={getNavLinkClasses(location.pathname === "/about-fastnow-app")}>
              About FastNow App
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
            App
            <ArrowRight size={14} />
          </a>
        </NavigationMenuItem>
        
        {!isLoading && isAdmin && (
          <>
            <NavigationMenuItem>
              <Link to="/admin">
                <NavigationMenuLink className={getNavLinkClasses(location.pathname === "/admin")}>
                  <User size={16} className="mr-1" />
                  Admin Dashboard
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout} 
                className={cn(
                  "flex items-center gap-1",
                  isTransparent 
                    ? "text-white/90 hover:text-white hover:bg-white/20" 
                    : "text-gray-700 hover:text-accent-green hover:bg-gray-50"
                )}
              >
                <LogOut size={16} />
                Logout
              </Button>
            </NavigationMenuItem>
          </>
        )}
        
        {!isLoading && !isAdmin && (
          <NavigationMenuItem>
            <Link to="/admin/login">
              <NavigationMenuLink className={getNavLinkClasses(location.pathname === "/admin/login")}>
                <User size={16} className="mr-1" />
                Admin Login
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        )}
        
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default MainNavigation;
