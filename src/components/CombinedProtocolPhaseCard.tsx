import React from 'react';
import { CeramicPlate } from './CeramicPlate';
import { Clock, Utensils, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CombinedProtocolPhaseCardProps {
  className?: string;
}

export const CombinedProtocolPhaseCard: React.FC<CombinedProtocolPhaseCardProps> = ({
  className
}) => {
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <CeramicPlate size="lg" className="mb-4">
        <div className="flex items-center justify-center h-full text-center p-4">
          <div className="flex items-center gap-2">
            {/* Phase 1: Water Fast */}
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-black" />
              <span className="text-xs font-bold text-foreground whitespace-nowrap">
                3-Day Water Fast
              </span>
            </div>
            
            {/* Plus Sign */}
            <div className="flex items-center justify-center mx-1">
              <div className="w-3 h-3 flex items-center justify-center text-xs font-bold text-muted-foreground">
                +
              </div>
            </div>
            
            {/* Phase 2: Simple Diet */}
            <div className="flex items-center gap-1">
              <Utensils className="w-4 h-4 text-black" />
              <span className="text-xs font-bold text-foreground whitespace-nowrap">
                Strict Simple Diet
              </span>
            </div>
            
            {/* Plus Sign */}
            <div className="flex items-center justify-center mx-1">
              <div className="w-3 h-3 flex items-center justify-center text-xs font-bold text-muted-foreground">
                +
              </div>
            </div>
            
            {/* Phase 3: Walking */}
            <div className="flex items-center gap-1">
              <Activity className="w-4 h-4 text-black" />
              <span className="text-xs font-bold text-foreground whitespace-nowrap">
                Daily Walking
              </span>
            </div>
          </div>
        </div>
      </CeramicPlate>
    </div>
  );
};