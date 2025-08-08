
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

const MainNavigation = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

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

  const NavLinks = ({ onLinkClick }: { onLinkClick?: () => void }) => (
    <>
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
    </>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="p-2">
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
    <NavigationMenu className="bg-white">
      <NavigationMenuList className="flex items-center gap-4">
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
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default MainNavigation;
