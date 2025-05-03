
import React from 'react';
import { Button } from '@/components/ui/button';
import { GooglePlayIcon } from './icons/GooglePlayIcon';

interface GooglePlayButtonProps {
  className?: string;
}

export const GooglePlayButton: React.FC<GooglePlayButtonProps> = ({ className }) => {
  return (
    <Button 
      className={`h-14 px-6 bg-black hover:bg-black/80 text-white ${className}`}
      asChild
    >
      <a href="https://play.google.com" target="_blank" rel="noreferrer">
        <div className="flex items-center">
          <GooglePlayIcon className="w-8 h-8 mr-2" />
          <div className="flex flex-col items-start">
            <span className="text-[10px] leading-none">GET IT ON</span>
            <span className="text-lg font-medium leading-tight">Google Play</span>
          </div>
        </div>
      </a>
    </Button>
  );
};
