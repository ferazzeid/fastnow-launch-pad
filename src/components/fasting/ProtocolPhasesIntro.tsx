import React from 'react';
import { Clock, Utensils, Activity } from 'lucide-react';

const ProtocolPhasesIntro = () => {
  return (
    <div className="py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-center gap-8">
          {/* Phase 1 */}
          <div className="flex-1 max-w-sm">
            <div className="bg-card rounded-xl shadow-soft p-8 border-l-4 border-blue-500 text-center">
              <div className="bg-blue-500/10 p-4 rounded-full inline-flex mb-4">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">Phase 1</span>
              <h3 className="text-xl font-bold mt-3 text-foreground">3-Day Initiation Water Fast</h3>
            </div>
          </div>
          
          {/* Plus Icon */}
          <div className="text-4xl font-bold text-muted-foreground">+</div>
          
          {/* Phase 2 */}
          <div className="flex-1 max-w-sm">
            <div className="bg-card rounded-xl shadow-soft p-8 border-l-4 border-orange-500 text-center">
              <div className="bg-orange-500/10 p-4 rounded-full inline-flex mb-4">
                <Utensils className="w-8 h-8 text-orange-600" />
              </div>
              <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">Phase 2</span>
              <h3 className="text-xl font-bold mt-3 text-foreground">Strict Simple Diet with Daily Calorie Deficit</h3>
            </div>
          </div>
          
          {/* Plus Icon */}
          <div className="text-4xl font-bold text-muted-foreground">+</div>
          
          {/* Phase 3 */}
          <div className="flex-1 max-w-sm">
            <div className="bg-card rounded-xl shadow-soft p-8 border-l-4 border-green-500 text-center">
              <div className="bg-green-500/10 p-4 rounded-full inline-flex mb-4">
                <Activity className="w-8 h-8 text-green-600" />
              </div>
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">Phase 3</span>
              <h3 className="text-xl font-bold mt-3 text-foreground">Daily Walking</h3>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden space-y-6">
          {/* Phase 1 */}
          <div className="bg-card rounded-xl shadow-soft p-6 border-l-4 border-blue-500">
            <div className="flex items-center gap-4">
              <div className="bg-blue-500/10 p-3 rounded-full">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">Phase 1</span>
                <h3 className="text-lg font-bold mt-2 text-foreground">3-Day Initiation Water Fast</h3>
              </div>
            </div>
          </div>
          
          {/* Plus Icon */}
          <div className="text-center text-2xl font-bold text-muted-foreground">+</div>
          
          {/* Phase 2 */}
          <div className="bg-card rounded-xl shadow-soft p-6 border-l-4 border-orange-500">
            <div className="flex items-center gap-4">
              <div className="bg-orange-500/10 p-3 rounded-full">
                <Utensils className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">Phase 2</span>
                <h3 className="text-lg font-bold mt-2 text-foreground">Strict Simple Diet with Daily Calorie Deficit</h3>
              </div>
            </div>
          </div>
          
          {/* Plus Icon */}
          <div className="text-center text-2xl font-bold text-muted-foreground">+</div>
          
          {/* Phase 3 */}
          <div className="bg-card rounded-xl shadow-soft p-6 border-l-4 border-green-500">
            <div className="flex items-center gap-4">
              <div className="bg-green-500/10 p-3 rounded-full">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">Phase 3</span>
                <h3 className="text-lg font-bold mt-2 text-foreground">Daily Walking</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProtocolPhasesIntro;