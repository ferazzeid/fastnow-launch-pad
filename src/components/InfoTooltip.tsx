import React, { useState, useRef, useEffect } from 'react';
import { Hand } from 'lucide-react';
import { cn } from '@/lib/utils';
// Using placeholder for author image for now

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
  authorImage = "/lovable-uploads/e8e0bb73-dfec-4929-8f65-85fe7bb29316.png",
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
      {/* Elegant Pulsating Speech Bubble Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative overflow-hidden group transition-all duration-300",
          "hover:scale-105",
          sizeClasses[size]
        )}
        style={{
          borderRadius: '50% 50% 50% 10%', // Speech bubble shape
          animation: 'elegantPulse 3s ease-in-out infinite'
        }}
        aria-label="Show information"
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
            src={authorImage} 
            alt={authorName}
            className="w-full h-full object-cover grayscale"
          />
        </div>

        {/* Stronger glow effect on hover */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none"
          style={{ 
            background: 'radial-gradient(circle, #dac471 0%, rgba(218, 196, 113, 0.4) 50%, transparent 70%)',
            borderRadius: '50% 50% 50% 10%',
            filter: 'blur(2px)'
          }}
        />
      </button>

      {/* Tooltip */}
      {isOpen && (
        <>
          {/* Backdrop - higher z-index and better coverage */}
          <div 
            className="fixed inset-0 z-40 bg-transparent" 
            onClick={() => setIsOpen(false)}
            style={{ cursor: 'default' }}
          />
          
          {/* Tooltip Content */}
          <div 
            ref={tooltipRef}
            className={cn(
              "absolute right-0 z-50 w-80 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden",
              "animate-fade-in",
              position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
            )}
          >
            {/* Header with Author Image - Green background */}
            <div style={{ backgroundColor: '#dac471' }} className="text-white px-4 py-3 flex items-center gap-3">
              <img 
                src={authorImage} 
                alt={authorName}
                className="w-8 h-8 rounded-full object-cover border-2 border-white/50 grayscale"
              />
              <h3 className="font-medium text-sm">{title}</h3>
            </div>

            {/* Content */}
            <div className="p-4">
              <p className="text-gray-700 text-sm leading-relaxed">
                {content}
              </p>
            </div>

            {/* White speech bubble tail pointing down */}
            <div 
              className="absolute w-3 h-3 bg-white transform rotate-45 top-full right-4 -mt-1"
            />
          </div>
        </>
      )}

    </div>
  );
};

export default InfoTooltip;