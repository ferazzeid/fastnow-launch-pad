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

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <CeramicPlate size="md" className="mb-4">
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
          {/* Large Black Icon */}
          <div className="relative z-10 mb-6">
            <Icon className="w-16 h-16 text-black" />
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