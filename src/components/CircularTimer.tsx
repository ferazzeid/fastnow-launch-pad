
import React from 'react';

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
  indicatorColor = 'bg-sage-300'
}) => {
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
