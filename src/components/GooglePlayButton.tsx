
import React from 'react';
import { Button } from '@/components/ui/button';
import { GooglePlayIcon } from './icons/GooglePlayIcon';

interface GooglePlayButtonProps {
  className?: string;
  href?: string;
}

export const GooglePlayButton: React.FC<GooglePlayButtonProps> = ({ className, href = "https://play.google.com" }) => {
  return (
    <Button 
      className={`h-14 px-6 bg-black hover:bg-gray-700 text-white ${className}`}
      asChild
    >
      <a href={href} target="_blank" rel="nofollow noreferrer">
        <div className="flex items-center">
          <GooglePlayIcon className="w-6 h-6 mr-3" />
          <div className="flex flex-col items-start">
            <span className="text-[10px] leading-none">GET IT ON</span>
            <span className="text-lg font-medium leading-tight">Google Play</span>
          </div>
        </div>
      </a>
    </Button>
  );
};
