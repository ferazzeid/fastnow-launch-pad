import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InfoTooltipProps {
  title?: string;
  content: string;
  authorImage?: string;
  authorName?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({
  title = "Thinking Out Loud",
  content,
  authorImage,
  authorName = "Author",
  size = 'md',
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<'top' | 'bottom'>('top');
  const buttonRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-14 h-14'
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 18
  };

  // Calculate optimal position when opening
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceAbove = buttonRect.top;
      const spaceBelow = viewportHeight - buttonRect.bottom;
      
      // Prefer top, but use bottom if not enough space above
      setPosition(spaceAbove > 350 ? 'top' : 'bottom');
    }
  }, [isOpen]);

  return (
    <div className={cn("relative inline-block", className)}>
      {/* Clickable Info Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "rounded-full border-2 border-[#dac471] backdrop-blur-sm overflow-hidden",
          "hover:border-[#c4b266] transition-all duration-200 shadow-lg",
          "flex flex-col relative group",
          "animate-pulse hover:animate-none", // Pulsating animation
          sizeClasses[size]
        )}
        style={{ 
          background: 'linear-gradient(135deg, rgba(218, 196, 113, 0.2) 0%, rgba(218, 196, 113, 0.1) 100%)'
        }}
        aria-label="Show information"
      >
        {/* Upper half - Author image */}
        <div className="flex-1 w-full relative overflow-hidden rounded-t-full">
          {authorImage ? (
            <img 
              src={authorImage} 
              alt={authorName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: '#dac471' }}
            >
              {authorName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        
        {/* Lower half - Comment icon */}
        <div 
          className="flex-1 w-full flex items-center justify-center rounded-b-full"
          style={{ backgroundColor: '#dac471' }}
        >
          <MessageCircle size={iconSizes[size]} className="text-white" />
        </div>

        {/* Subtle glow effect */}
        <div 
          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-200 pointer-events-none"
          style={{ 
            background: 'radial-gradient(circle, #dac471 0%, transparent 70%)',
            boxShadow: '0 0 20px #dac471'
          }}
        />
      </button>

      {/* Tooltip */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Tooltip Content */}
          <div 
            ref={tooltipRef}
            className={cn(
              "absolute right-0 z-50 w-80 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden",
              "animate-scale-in",
              position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
            )}
          >
            {/* Header with Author Image */}
            <div className="bg-gray-800 text-white px-4 py-3 flex items-center gap-3">
              {authorImage ? (
                <img 
                  src={authorImage} 
                  alt={authorName}
                  className="w-8 h-8 rounded-full object-cover border-2 border-[#dac471]/50"
                />
              ) : (
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white"
                  style={{ backgroundColor: '#dac471' }}
                >
                  {authorName.charAt(0).toUpperCase()}
                </div>
              )}
              <h3 className="font-medium text-sm">{title}</h3>
            </div>

            {/* Content */}
            <div className="p-4">
              <p className="text-gray-700 text-sm leading-relaxed">
                {content}
              </p>
            </div>

            {/* Tail/Arrow */}
            <div 
              className={cn(
                "absolute w-3 h-3 bg-gray-800 transform rotate-45",
                position === 'top' 
                  ? "top-full right-4 -mt-1" 
                  : "bottom-full right-4 -mb-1"
              )}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default InfoTooltip;