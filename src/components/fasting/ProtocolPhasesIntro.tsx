import React, { useState, useEffect } from 'react';
import { Clock, Utensils, Activity } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const ProtocolPhasesIntro = () => {
  const [phaseImages, setPhaseImages] = useState({
    phase1: '',
    phase2: '',
    phase3: ''
  });

  useEffect(() => {
    loadPhaseImages();
  }, []);

  const loadPhaseImages = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_key, setting_value')
        .in('setting_key', ['protocol_phase1_intro_image', 'protocol_phase2_intro_image', 'protocol_phase3_intro_image']);

      if (error) throw error;

      const settings = data?.reduce((acc, item) => {
        const value = item.setting_value;
        try {
          acc[item.setting_key] = typeof value === 'string' ? JSON.parse(value || '""') : String(value || '');
        } catch {
          acc[item.setting_key] = String(value || '');
        }
        return acc;
      }, {} as Record<string, string>) || {};

      setPhaseImages({
        phase1: settings.protocol_phase1_intro_image || '',
        phase2: settings.protocol_phase2_intro_image || '',
        phase3: settings.protocol_phase3_intro_image || ''
      });
    } catch (error) {
      console.error('Error loading phase images:', error);
    }
  };

  return (
    <div className="py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-center gap-8">
          {/* Phase 1 */}
          <div className="flex-1 max-w-sm">
            <div className="bg-card rounded-xl shadow-soft overflow-hidden border-l-4 border-blue-500 text-center min-h-[280px] flex flex-col">
              {phaseImages.phase1 && (
                <div className="mb-6 -m-8 mt-0 mx-0">
                  <img 
                    src={phaseImages.phase1} 
                    alt="Phase 1 - Water Fast" 
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}
              <div className="px-8 pb-8 flex flex-col flex-grow">
                <div className="bg-blue-500/10 p-4 rounded-full inline-flex mb-6 mx-auto">
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-4">Phase 1</span>
                <h3 className="text-xl font-bold text-foreground flex-grow">3-Day Initiation Water Fast</h3>
              </div>
            </div>
          </div>
          
          {/* Plus Icon */}
          <div className="text-4xl font-bold text-muted-foreground">+</div>
          
          {/* Phase 2 */}
          <div className="flex-1 max-w-sm">
            <div className="bg-card rounded-xl shadow-soft overflow-hidden border-l-4 border-orange-500 text-center min-h-[280px] flex flex-col">
              {phaseImages.phase2 && (
                <div className="mb-6 -m-8 mt-0 mx-0">
                  <img 
                    src={phaseImages.phase2} 
                    alt="Phase 2 - Diet Control" 
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}
              <div className="px-8 pb-8 flex flex-col flex-grow">
                <div className="bg-orange-500/10 p-4 rounded-full inline-flex mb-6 mx-auto">
                  <Utensils className="w-8 h-8 text-orange-600" />
                </div>
                <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-4">Phase 2</span>
                <h3 className="text-xl font-bold text-foreground flex-grow">Daily Calorie Limit</h3>
              </div>
            </div>
          </div>
          
          {/* Plus Icon */}
          <div className="text-4xl font-bold text-muted-foreground">+</div>
          
          {/* Phase 3 */}
          <div className="flex-1 max-w-sm">
            <div className="bg-card rounded-xl shadow-soft overflow-hidden border-l-4 border-green-500 text-center min-h-[280px] flex flex-col">
              {phaseImages.phase3 && (
                <div className="mb-6 -m-8 mt-0 mx-0">
                  <img 
                    src={phaseImages.phase3} 
                    alt="Phase 3 - Daily Walking" 
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}
              <div className="px-8 pb-8 flex flex-col flex-grow">
                <div className="bg-green-500/10 p-4 rounded-full inline-flex mb-6 mx-auto">
                  <Activity className="w-8 h-8 text-green-600" />
                </div>
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-4">Phase 3</span>
                <h3 className="text-xl font-bold text-foreground flex-grow">Daily Walking</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden space-y-6">
          {/* Phase 1 */}
          <div className="bg-card rounded-xl shadow-soft overflow-hidden border-l-4 border-blue-500">
            {phaseImages.phase1 && (
              <div className="mb-6 -m-6 mt-0 mx-0">
                <img 
                  src={phaseImages.phase1} 
                  alt="Phase 1 - Water Fast" 
                  className="w-full h-40 object-cover"
                />
              </div>
            )}
            <div className="px-6 pb-6">
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
          </div>
          
          {/* Plus Icon */}
          <div className="text-center text-2xl font-bold text-muted-foreground">+</div>
          
          {/* Phase 2 */}
          <div className="bg-card rounded-xl shadow-soft overflow-hidden border-l-4 border-orange-500">
            {phaseImages.phase2 && (
              <div className="mb-6 -m-6 mt-0 mx-0">
                <img 
                  src={phaseImages.phase2} 
                  alt="Phase 2 - Diet Control" 
                  className="w-full h-40 object-cover"
                />
              </div>
            )}
            <div className="px-6 pb-6">
              <div className="flex items-center gap-4">
                <div className="bg-orange-500/10 p-3 rounded-full">
                  <Utensils className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">Phase 2</span>
                  <h3 className="text-lg font-bold mt-2 text-foreground">Daily Calorie Limit</h3>
                </div>
              </div>
            </div>
          </div>
          
          {/* Plus Icon */}
          <div className="text-center text-2xl font-bold text-muted-foreground">+</div>
          
          {/* Phase 3 */}
          <div className="bg-card rounded-xl shadow-soft overflow-hidden border-l-4 border-green-500">
            {phaseImages.phase3 && (
              <div className="mb-6 -m-6 mt-0 mx-0">
                <img 
                  src={phaseImages.phase3} 
                  alt="Phase 3 - Daily Walking" 
                  className="w-full h-40 object-cover"
                />
              </div>
            )}
            <div className="px-6 pb-6">
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
    </div>
  );
};

export default ProtocolPhasesIntro;