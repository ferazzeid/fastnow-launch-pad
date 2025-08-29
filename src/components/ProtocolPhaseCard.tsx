import React, { useState } from 'react';
import { CeramicPlate } from './CeramicPlate';
import { Clock, Utensils, Activity, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProtocolPhaseCardProps {
  phaseNumber: 1 | 2 | 3;
  title: string;
  content: Record<string, any>;
  image?: string;
  readMoreLink?: string;
  className?: string;
}

const getPhaseIcon = (phaseNumber: number) => {
  switch (phaseNumber) {
    case 1:
      return Clock;
    case 2:
      return Utensils;
    case 3:
      return Activity;
    default:
      return Clock;
  }
};

export const ProtocolPhaseCard: React.FC<ProtocolPhaseCardProps> = ({
  phaseNumber,
  title,
  content,
  image,
  readMoreLink,
  className
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const IconComponent = getPhaseIcon(phaseNumber);

  return (
    <div className={cn("flex flex-col items-center space-y-6", className)}>
      {/* Ceramic Plate with Phase Info */}
      <div className="relative group">
        <CeramicPlate size="md" className="hover:scale-105 transition-transform duration-300">
          <div className="flex flex-col items-center justify-center text-center space-y-3 p-4">
            {/* Phase Number */}
            <div className="bg-gray-900/10 text-gray-900 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
              {phaseNumber}
            </div>
            
            {/* Icon */}
            <div className="bg-gray-900/20 p-4 rounded-full">
              <IconComponent className="w-8 h-8 text-gray-900" />
            </div>
            
            {/* Phase Title */}
            <h3 className="font-semibold text-sm text-center leading-tight max-w-32">
              {title}
            </h3>
          </div>
        </CeramicPlate>
        
        {/* Click to expand indicator */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-background border border-border rounded-full p-2 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110"
          aria-label={isExpanded ? "Collapse details" : "Expand details"}
        >
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
      </div>

      {/* Expandable Content */}
      <div
        className={cn(
          "w-full max-w-md transition-all duration-300 overflow-hidden",
          isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="bg-card rounded-lg shadow-soft border border-border overflow-hidden">
          {/* Phase Image */}
          {image && (
            <div className="w-full h-48 overflow-hidden">
              <img 
                src={image} 
                alt={`Phase ${phaseNumber} - ${title}`}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          {/* Content Details */}
          <div className="p-6 space-y-4">
            {/* Duration */}
            {content.duration && (
              <div className="bg-muted/50 p-3 rounded-lg">
                <h4 className="text-sm font-semibold text-foreground mb-1">Duration</h4>
                <p className="text-sm text-muted-foreground">{content.duration}</p>
              </div>
            )}
            
            {/* Purpose */}
            {content.purpose && (
              <div className="bg-muted/50 p-3 rounded-lg">
                <h4 className="text-sm font-semibold text-foreground mb-1">Purpose</h4>
                <p className="text-sm text-muted-foreground">{content.purpose}</p>
              </div>
            )}
            
            {/* Instructions */}
            {content.instructions && (
              <div className="bg-muted/50 p-3 rounded-lg">
                <h4 className="text-sm font-semibold text-foreground mb-1">Instructions</h4>
                <p className="text-sm text-muted-foreground">{content.instructions}</p>
              </div>
            )}
            
            {/* Phase 2 Specific Content */}
            {phaseNumber === 2 && (
              <>
                {content.calorieCap && (
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <h4 className="text-sm font-semibold text-foreground mb-1">Calorie Cap</h4>
                    <p className="text-sm text-muted-foreground">{content.calorieCap}</p>
                  </div>
                )}
                
                {content.carbCap && (
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <h4 className="text-sm font-semibold text-foreground mb-1">Carb Limit</h4>
                    <p className="text-sm text-muted-foreground">{content.carbCap}</p>
                  </div>
                )}
                
                {content.whatToEat && (
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <h4 className="text-sm font-semibold text-foreground mb-1">What to Eat</h4>
                    <div className="text-sm text-muted-foreground">
                      {content.whatToEat.split('\n').map((line: string, index: number) => (
                        <p key={index} className="mb-1 last:mb-0">{line}</p>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
            
            {/* Phase 3 Specific Content */}
            {phaseNumber === 3 && (
              <>
                {content.rule && (
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <h4 className="text-sm font-semibold text-foreground mb-1">Rule</h4>
                    <p className="text-sm text-muted-foreground">{content.rule}</p>
                  </div>
                )}
                
                {content.why && (
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <h4 className="text-sm font-semibold text-foreground mb-1">Why</h4>
                    <p className="text-sm text-muted-foreground">{content.why}</p>
                  </div>
                )}
              </>
            )}
            
            {/* Details */}
            {content.details && (
              <div className="bg-muted/50 p-3 rounded-lg">
                <h4 className="text-sm font-semibold text-foreground mb-1">What to Expect</h4>
                <div className="text-sm text-muted-foreground">
                  {content.details.split('\n\n').map((paragraph: string, index: number) => (
                    <p key={index} className="mb-2 last:mb-0">{paragraph}</p>
                  ))}
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
};