import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { SiteSettingsService } from '@/services/SiteSettingsService';

interface PermanentInfoTooltipProps {
  title?: string;
  content: string;
  authorImage?: string;
  authorName?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  position?: 'bottom-right' | 'top-right';
}

const PermanentInfoTooltip: React.FC<PermanentInfoTooltipProps> = ({
  title,
  content,
  authorImage,
  authorName,
  size = 'md',
  className,
  position = 'bottom-right'
}) => {
  const [settings, setSettings] = useState({
    authorImage: "/lovable-uploads/e8e0bb73-dfec-4929-8f65-85fe7bb29316.png",
    authorName: "Author",
    tooltipTitle: "Thinking Out Loud"
  });
  const buttonRef = useRef<HTMLButtonElement>(null);

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-14 h-14'
  };

  // Load settings from database
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await SiteSettingsService.getSetting('info_tooltip_settings');
      if (savedSettings && typeof savedSettings === 'object') {
        const tooltipSettings = savedSettings as {
          authorImage?: string;
          authorName?: string;
          tooltipTitle?: string;
        };
        
        setSettings({
          authorImage: tooltipSettings.authorImage || "/lovable-uploads/e8e0bb73-dfec-4929-8f65-85fe7bb29316.png",
          authorName: tooltipSettings.authorName || "Author",
          tooltipTitle: tooltipSettings.tooltipTitle || "Thinking Out Loud"
        });
      }
    } catch (error) {
      console.error('Error loading InfoTooltip settings:', error);
    }
  };

  // Use props if provided, otherwise use settings from database
  const finalAuthorImage = authorImage || settings.authorImage;
  const finalAuthorName = authorName || settings.authorName;
  const finalTitle = title || settings.tooltipTitle;

  return (
    <div className={cn("relative inline-block group", className)}>
      {/* Background glow effect - outside the container */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none -z-10"
        style={{ 
          background: 'radial-gradient(circle, #dac471 0%, rgba(218, 196, 113, 0.4) 50%, transparent 70%)',
          borderRadius: '50% 50% 50% 10%',
          filter: 'blur(8px)',
          transform: 'scale(1.3)', // Make it larger than the button
        }}
      />

      {/* Container for button and tooltip */}
      <div className="flex items-start gap-2 sm:gap-4 relative w-full">
        {/* Notification badge - positioned outside button */}
        <div className="absolute -top-1 -left-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center z-20 shadow-lg border-2 border-white">
          <span className="text-white text-xs font-bold">1</span>
        </div>

        {/* Elegant Pulsating Speech Bubble Button */}
        <button
          ref={buttonRef}
          className={cn(
            "relative transition-all duration-300 flex-shrink-0",
            "hover:scale-105",
            sizeClasses[size]
          )}
          style={{
            borderRadius: '50% 50% 50% 10%', // Speech bubble shape
            animation: 'elegantPulse 3s ease-in-out infinite'
          }}
          aria-label="Information tooltip"
          disabled // No clicking since it's permanently visible
        >
          {/* Outer border with elegant pulsing - medium thickness */}
          <div 
            className="absolute inset-0 border-3 transition-all duration-1000"
            style={{
              borderColor: '#dac471',
              borderRadius: '50% 50% 50% 10%',
              animation: 'borderPulse 4s ease-in-out infinite',
              borderWidth: '3px'
            }}
          />
          
          {/* Inner content container - Circular area only */}
          <div 
            className="absolute inset-1 rounded-full overflow-hidden"
          >
            <img 
              src={finalAuthorImage} 
              alt={finalAuthorName}
              className="w-full h-full object-cover grayscale"
            />
          </div>
        </button>

        {/* Permanently Visible Tooltip - now in document flow */}
        <div 
          className={cn(
            "relative w-full max-w-80 bg-white rounded-lg shadow-xl overflow-hidden",
            "animate-fade-in mt-2 sm:max-w-sm md:max-w-80"
          )}
        >
          {/* Header - Green background */}
          <div style={{ backgroundColor: '#dac471' }} className="text-white px-4 py-3 flex items-center justify-center">
            <h3 className="font-medium text-sm">{finalTitle}</h3>
          </div>

          {/* Content */}
          <div className="p-4">
            <p className="text-gray-700 text-sm leading-relaxed">
              {content}
            </p>
          </div>

          {/* White speech bubble tail pointing left - centered */}
          <div 
            className="absolute w-3 h-3 bg-white transform rotate-45 -left-1.5"
            style={{ top: '50%', transform: 'translateY(-50%) rotate(45deg)' }}
          />
        </div>
      </div>
    </div>
  );
};

export default PermanentInfoTooltip;