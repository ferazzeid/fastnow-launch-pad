
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
import { LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";


const MainNavigation = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check admin status on mount
    const authStatus = localStorage.getItem('fastingApp_auth');
    setIsAdmin(authStatus === 'true');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('fastingApp_auth');
    setIsAdmin(false);
    toast.success("Logged out successfully");
  };

  return (
    <NavigationMenu className="bg-white">
      <NavigationMenuList className="flex items-center gap-4">
        <NavigationMenuItem>
          <Link to="/">
            <NavigationMenuLink 
              className={cn(
                navigationMenuTriggerStyle(),
                "text-gray-700 hover:text-accent-green hover:bg-gray-50",
                location.pathname === "/" && "text-accent-green bg-gray-50"
              )}
            >
              Home
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/blog">
            <NavigationMenuLink 
              className={cn(
                navigationMenuTriggerStyle(),
                "text-gray-700 hover:text-accent-green hover:bg-gray-50",
                location.pathname.startsWith("/blog") && "text-accent-green bg-gray-50"
              )}
            >
              Blog
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        
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
        
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default MainNavigation;
