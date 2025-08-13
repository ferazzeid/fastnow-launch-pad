import React, { useState } from 'react';
import { Info } from 'lucide-react';
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

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  };

  return (
    <div className={cn("relative inline-block", className)}>
      {/* Clickable Info Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "rounded-full bg-white/20 border border-white/30 backdrop-blur-sm",
          "hover:bg-white/30 hover:border-white/40 transition-all duration-200",
          "flex items-center justify-center text-white shadow-lg",
          sizeClasses[size]
        )}
        aria-label="Show information"
      >
        <Info size={iconSizes[size]} />
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
          <div className="absolute right-0 top-full mt-2 z-50 w-80 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
            {/* Header with Author Image */}
            <div className="bg-gray-800 text-white px-4 py-3 flex items-center gap-3">
              {authorImage ? (
                <img 
                  src={authorImage} 
                  alt={authorName}
                  className="w-8 h-8 rounded-full object-cover border-2 border-white/20"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-xs font-medium">
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
            <div className="absolute top-[-6px] right-4 w-3 h-3 bg-gray-800 transform rotate-45"></div>
          </div>
        </>
      )}
    </div>
  );
};

export default InfoTooltip;