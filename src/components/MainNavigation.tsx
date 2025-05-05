
import React from "react";
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const MainNavigation = () => {
  return (
    <NavigationMenu className="fixed top-4 right-4 z-50">
      <NavigationMenuList>
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
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default MainNavigation;
