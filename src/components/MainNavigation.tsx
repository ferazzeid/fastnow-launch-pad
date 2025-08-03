
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
import { LogOut, User, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { SupabaseAuthService } from "@/services/SupabaseAuthService";

const MainNavigation = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    const success = await SupabaseAuthService.signOut();
    if (success) {
      toast.success("Logged out successfully");
      navigate('/');
    }
  };

  return (
    <NavigationMenu className="bg-white">
      <NavigationMenuList className="flex items-center gap-4">
        <NavigationMenuItem>
          <Link to="/fastnow-protocol">
            <NavigationMenuLink 
              className={cn(
                navigationMenuTriggerStyle(),
                "text-gray-700 hover:text-accent-green hover:bg-gray-50",
                location.pathname === "/fastnow-protocol" && "text-accent-green bg-gray-50"
              )}
            >
              The FastNow Protocol
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/faq">
            <NavigationMenuLink 
              className={cn(
                navigationMenuTriggerStyle(),
                "text-gray-700 hover:text-accent-green hover:bg-gray-50",
                location.pathname === "/faq" && "text-accent-green bg-gray-50"
              )}
            >
              FAQ
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/about-fastnow-app">
            <NavigationMenuLink 
              className={cn(
                navigationMenuTriggerStyle(),
                "text-gray-700 hover:text-accent-green hover:bg-gray-50",
                location.pathname === "/about-fastnow-app" && "text-accent-green bg-gray-50"
              )}
            >
              About FastNow App
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink 
            className={cn(
              navigationMenuTriggerStyle(),
              "text-white hover:text-white hover:bg-accent-green-dark bg-accent-green"
            )}
            asChild
          >
            <a href="https://go.fastnow.app" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
              Access FastNow App
              <ArrowRight size={14} />
            </a>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/about-me">
            <NavigationMenuLink 
              className={cn(
                navigationMenuTriggerStyle(),
                "text-gray-700 hover:text-accent-green hover:bg-gray-50",
                location.pathname === "/about-me" && "text-accent-green bg-gray-50"
              )}
            >
              About Me
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        {/* Blog temporarily hidden */}
        {false && (
          <NavigationMenuItem>
            <Link to="/blog">
              <NavigationMenuLink 
                className={cn(
                  navigationMenuTriggerStyle(),
                  "text-gray-700 hover:text-accent-green hover:bg-gray-50",
                  location.pathname.startsWith("/blog") && "text-accent-green bg-gray-50"
                )}
              >
                FastNow Insights
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        )}
        
        {isAdmin && (
          <>
            <NavigationMenuItem>
              <Link to="/admin">
                <NavigationMenuLink 
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "text-gray-700 hover:text-accent-green hover:bg-gray-50",
                    location.pathname === "/admin" && "text-accent-green bg-gray-50"
                  )}
                >
                  <User size={16} className="mr-1" />
                  Admin
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout} 
                className="flex items-center gap-1 text-gray-700 hover:text-accent-green hover:bg-gray-50"
              >
                <LogOut size={16} />
                Logout
              </Button>
            </NavigationMenuItem>
          </>
        )}
        
        {!isAdmin && (
          <NavigationMenuItem>
            <Link to="/admin/login">
              <NavigationMenuLink 
                className={cn(
                  navigationMenuTriggerStyle(),
                  "text-gray-700 hover:text-accent-green hover:bg-gray-50",
                  location.pathname === "/admin/login" && "text-accent-green bg-gray-50"
                )}
              >
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
