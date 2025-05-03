
import React from 'react';

interface GooglePlayIconProps {
  className?: string;
}

export const GooglePlayIcon: React.FC<GooglePlayIconProps> = ({ className }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      viewBox="0 0 24 24" 
      fill="currentColor"
    >
      <path d="M3 20.977v-18.069l11.008 9.024-11.008 9.045zm11.989-2.265l3.681-3.033-3.681-3.013v6.046zm-1.493-9.276l5.01-2.941-14.506-8.476v.17l9.496 11.247zm1.493 3.842l4.462-3.746-4.462-2.619v6.365z" />
    </svg>
  );
};
