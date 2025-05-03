
import React from 'react';

interface AppleIconProps {
  className?: string;
}

export const AppleIcon: React.FC<AppleIconProps> = ({ className }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      viewBox="0 0 24 24" 
      fill="currentColor"
    >
      <path d="M16.5 3c-1.7 0-2.7 1-4 1-1.2 0-2.4-1-4-1-2 0-4.1 1.7-4.1 5s3 9 4.5 9c.8 0 1.3-.5 2.4-.5 1.2 0 1.5.5 2.4.5 1.5 0 4.5-4.5 4.5-8.4 0-2.2-1.3-3.1-1.7-3.6zm-2-2c.8-1.3 1.4-1 2.5-1 0 0 .5 1.8-1.5 3.5-2 1.7-4 1-4 1s-.5-1.7 3-3.5z" />
    </svg>
  );
};
