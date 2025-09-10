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
        <div className="flex items-center justify-center h-full text-center p-6">
          <div className="flex items-center gap-3">
            {/* Phase 1: Water Fast */}
            <div className="flex flex-col items-center">
              <Clock className="w-8 h-8 text-black mb-2" />
              <span className="text-xs font-bold text-foreground leading-tight">
                3-Day<br />Water Fast
              </span>
            </div>
            
            {/* Plus Sign */}
            <div className="flex items-center justify-center mx-2">
              <div className="w-4 h-4 flex items-center justify-center text-sm font-bold text-muted-foreground">
                +
              </div>
            </div>
            
            {/* Phase 2: Simple Diet */}
            <div className="flex flex-col items-center">
              <Utensils className="w-8 h-8 text-black mb-2" />
              <span className="text-xs font-bold text-foreground leading-tight">
                Strict Simple<br />Diet
              </span>
            </div>
            
            {/* Plus Sign */}
            <div className="flex items-center justify-center mx-2">
              <div className="w-4 h-4 flex items-center justify-center text-sm font-bold text-muted-foreground">
                +
              </div>
            </div>
            
            {/* Phase 3: Walking */}
            <div className="flex flex-col items-center">
              <Activity className="w-8 h-8 text-black mb-2" />
              <span className="text-xs font-bold text-foreground leading-tight">
                Daily<br />Walking
              </span>
            </div>
          </div>
        </div>
      </CeramicPlate>
    </div>
  );
};