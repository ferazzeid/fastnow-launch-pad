import React from 'react';
import { cn } from '@/lib/utils';

interface CeramicTimerProps {
  /** Progress value from 0 to 100 */
  progress?: number;
  /** Display time text */
  displayTime?: string;
  /** Whether timer is active/running */
  isActive?: boolean;
  /** Optional background content */
  children?: React.ReactNode;
  /** Additional className */
  className?: string;
}

export const CeramicTimer: React.FC<CeramicTimerProps> = ({
  progress = 0,
  displayTime = '00:00',
  isActive = false,
  children,
  className
}) => {
  // Calculate stroke-dashoffset for progress ring
  const circumference = 2 * Math.PI * 45; // radius of 45px
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {/* Main ceramic plate */}
      <div 
        className="relative w-80 h-80 rounded-full"
        style={{
          background: 'var(--gradient-ceramic)',
          boxShadow: 'var(--shadow-plate)',
        }}
      >
        {/* Outer rim */}
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            background: 'var(--gradient-rim)',
            boxShadow: 'var(--shadow-rim)',
          }}
        />
        
        {/* Center well */}
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-52 h-52 rounded-full flex items-center justify-center"
          style={{
            background: 'var(--gradient-well)',
            boxShadow: 'var(--shadow-well)',
          }}
        >
          {/* Background content area */}
          {children && (
            <div className="absolute inset-0 rounded-full overflow-hidden">
              {children}
            </div>
          )}
          
          {/* Progress ring */}
          <svg 
            className="absolute inset-0 w-full h-full transform -rotate-90"
            viewBox="0 0 100 100"
          >
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="hsl(var(--ceramic-deep))"
              strokeWidth="2"
              opacity="0.3"
            />
            {/* Progress circle */}
            {progress > 0 && (
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={isActive ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className={cn(
                  "transition-all duration-300 ease-out",
                  isActive && "drop-shadow-sm"
                )}
                style={{
                  filter: isActive ? 'drop-shadow(0 0 4px hsl(var(--primary) / 0.4))' : 'none'
                }}
              />
            )}
          </svg>
          
          {/* Timer display */}
          <div className="relative z-10 text-center">
            <div className={cn(
              "text-4xl font-bold tabular-nums transition-colors duration-300",
              isActive ? "text-foreground" : "text-muted-foreground"
            )}>
              {displayTime}
            </div>
            {isActive && (
              <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">
                Active
              </div>
            )}
          </div>
        </div>
        
        {/* Subtle highlight on rim edge */}
        <div 
          className="absolute inset-1 rounded-full pointer-events-none"
          style={{
            background: 'conic-gradient(from 45deg, transparent 0deg, hsl(0 0% 100% / 0.1) 90deg, transparent 180deg, hsl(0 0% 100% / 0.05) 270deg, transparent 360deg)',
          }}
        />
        
        {/* Inner rim detail */}
        <div 
          className="absolute rounded-full pointer-events-none"
          style={{
            top: '12%',
            left: '12%',
            right: '12%',
            bottom: '12%',
            background: 'radial-gradient(circle, transparent 60%, hsl(var(--ceramic-shadow) / 0.2) 65%, transparent 70%)',
          }}
        />
      </div>
    </div>
  );
};