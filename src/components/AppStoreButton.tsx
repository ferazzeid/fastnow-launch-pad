
import React from 'react';
import { Button } from '@/components/ui/button';
import { AppleIcon } from './icons/AppleIcon';

interface AppStoreButtonProps {
  className?: string;
  href?: string;
}

export const AppStoreButton: React.FC<AppStoreButtonProps> = ({ className, href = "https://apps.apple.com" }) => {
  return (
    <Button 
      className={`h-14 px-6 bg-black hover:bg-black/80 text-white ${className}`}
      asChild
    >
      <a href={href} target="_blank" rel="nofollow noreferrer">
        <div className="flex items-center">
          <AppleIcon className="w-8 h-8 mr-2" />
          <div className="flex flex-col items-start">
            <span className="text-[10px] leading-none">Download on the</span>
            <span className="text-lg font-medium leading-tight">App Store</span>
          </div>
        </div>
      </a>
    </Button>
  );
};
