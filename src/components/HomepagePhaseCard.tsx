import React from 'react';
import { CeramicPlate } from './CeramicPlate';
import { Clock, Utensils, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HomepagePhaseCardProps {
  phaseNumber: number;
  title: string;
  image?: string;
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

const getPhaseColor = (phaseNumber: number) => {
  switch (phaseNumber) {
    case 1:
      return 'text-blue-600';
    case 2:
      return 'text-orange-600';
    case 3:
      return 'text-green-600';
    default:
      return 'text-blue-600';
  }
};

export const HomepagePhaseCard: React.FC<HomepagePhaseCardProps> = ({
  phaseNumber,
  title,
  image,
  className
}) => {
  const Icon = getPhaseIcon(phaseNumber);
  const iconColor = getPhaseColor(phaseNumber);

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <CeramicPlate size="md" className="mb-4">
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
          {/* Phase Image Background */}
          {image && (
            <div 
              className="absolute inset-0 rounded-full bg-cover bg-center opacity-20"
              style={{ backgroundImage: `url(${image})` }}
            />
          )}
          
          {/* Phase Number */}
          <div className="relative z-10 mb-3">
            <span className="text-2xl font-bold text-muted-foreground">
              {phaseNumber}
            </span>
          </div>
          
          {/* Icon */}
          <div className="relative z-10 mb-3">
            <div className="p-3 rounded-full bg-background/80 backdrop-blur-sm">
              <Icon className={cn("w-8 h-8", iconColor)} />
            </div>
          </div>
          
          {/* Title */}
          <div className="relative z-10">
            <h3 className="text-sm font-bold text-foreground leading-tight">
              {title}
            </h3>
          </div>
        </div>
      </CeramicPlate>
    </div>
  );
};