import React from 'react';
import { cn } from '@/lib/utils';

interface CeramicPlateProps {
  children?: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const CeramicPlate: React.FC<CeramicPlateProps> = ({
  children,
  className,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-48 h-48',
    md: 'w-80 h-80',
    lg: 'w-96 h-96'
  };

  const wellSizeClasses = {
    sm: 'w-32 h-32',
    md: 'w-52 h-52',
    lg: 'w-64 h-64'
  };

  return (
    <div className={cn("ceramic-plate-container", className)}>
      <div className={cn("ceramic-plate", sizeClasses[size])}>
        {/* Outer rim */}
        <div className="ceramic-plate-rim" />
        
        {/* Center well */}
        <div className={cn("ceramic-plate-well", wellSizeClasses[size])}>
          {/* Content */}
          <div className="ceramic-plate-content">
            {children}
          </div>
        </div>
        
        {/* Subtle highlight on rim edge */}
        <div className="ceramic-plate-highlight" />
        
        {/* Inner rim detail */}
        <div className="ceramic-plate-inner-rim" />
      </div>
    </div>
  );
};