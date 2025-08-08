import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Clock, Target, Activity } from 'lucide-react';

interface StepItem {
  id: string;
  title: string;
  description: string;
  icon_name?: string;
}

// Icon mapping
const iconMap: Record<string, React.ComponentType<any>> = {
  clock: Clock,
  target: Target,
  activity: Activity,
};

const HowItWorksConditional: React.FC = () => {
  const [steps, setSteps] = useState<StepItem[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const { data, error } = await supabase
          .from('home_steps')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });
        
        if (!error && data) {
          setSteps(data || []);
        }
      } catch (e) {
        console.error('Steps load error:', e);
      }
    };
    load();
  }, []);

  // Don't render if no steps available
  if (!steps.length) return null;

  return (
    <section className="py-12 bg-muted/30">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Simple steps to transform your health with FastNow
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon_name ? iconMap[step.icon_name] || Target : Target;
            
            return (
              <div key={step.id} className="relative">
                <div className="bg-card rounded-lg p-6 shadow-sm border h-full">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <div className="absolute -top-2 -left-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksConditional;