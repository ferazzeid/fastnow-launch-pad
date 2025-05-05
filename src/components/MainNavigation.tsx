
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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

const MainNavigation = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

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
    <NavigationMenu className="mx-auto py-2 container">
      <NavigationMenuList className="mx-auto">
        <NavigationMenuItem>
          <Link to="/">
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Home
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/fasting-timeline">
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Fasting Timeline
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        
        {isAdmin && (
          <>
            <NavigationMenuItem>
              <Link to="/admin">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
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
                className="flex items-center gap-1"
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
