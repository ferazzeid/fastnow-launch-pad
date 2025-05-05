
import React, { useEffect, useState } from 'react';

interface CircularTimerProps {
  size?: number;
  progress?: number;
  className?: string;
  indicatorColor?: string;
}

export const CircularTimer: React.FC<CircularTimerProps> = ({
  size = 200,
  progress = 25,
  className = '',
  indicatorColor = 'var(--mint-light)'
}) => {
  const [customTimerImage, setCustomTimerImage] = useState<string | null>(null);
  const [showDefaultDesign, setShowDefaultDesign] = useState(true);
  
  useEffect(() => {
    // Check if we should use default design as fallback
    const defaultDesignSetting = localStorage.getItem('fastingApp_showDefaultDesign');
    if (defaultDesignSetting !== null) {
      setShowDefaultDesign(defaultDesignSetting !== 'false');
    }
    
    // Check for custom timer image
    try {
      const customElements = localStorage.getItem('fastingApp_customElements');
      if (customElements) {
        const elements = JSON.parse(customElements);
        const timerElement = elements.find((el: any) => el.id === 'timer');
        if (timerElement && timerElement.imageUrl) {
          setCustomTimerImage(timerElement.imageUrl);
        }
      }
    } catch (error) {
      console.error("Error loading custom timer image:", error);
    }
  }, []);
  
  // If we have a custom image and aren't using default design, or if we have a custom image regardless
  if (customTimerImage && (!showDefaultDesign || true)) {
    return (
      <div 
        className={`custom-timer ${className}`}
        style={{ width: size, height: size }}
      >
        <img 
          src={customTimerImage} 
          alt="Custom timer" 
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  // Default neomorphic timer implementation
  const strokeWidth = size * 0.03;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div 
      className={`timer-circle ${className}`}
      style={{ width: size, height: size }}
    >
      <div 
        className="timer-inner"
        style={{ width: '80%', height: '80%' }}
      >
        <svg 
          className="absolute top-0 left-0 transform -rotate-90"
          width={size} 
          height={size}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            stroke={indicatorColor}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>
    </div>
  );
};

export default CircularTimer;
