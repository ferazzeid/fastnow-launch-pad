import React from 'react';
import InfoTooltip from './InfoTooltip';

interface SiteInfoTooltipProps {
  content: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * A simple wrapper around InfoTooltip that automatically loads 
 * the author image and settings from the admin panel.
 * Perfect for placing throughout the site with just content.
 */
const SiteInfoTooltip: React.FC<SiteInfoTooltipProps> = ({
  content,
  size = 'md',
  className
}) => {
  return (
    <InfoTooltip
      content={content}
      size={size}
      className={className}
    />
  );
};

export default SiteInfoTooltip;