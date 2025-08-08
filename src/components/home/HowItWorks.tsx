import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Rocket, Timer, Activity, CheckCircle2, Target } from 'lucide-react';

interface StepItem {
  id: string;
  title: string;
  description: string;
  icon_name?: string | null;
}

const iconMap: Record<string, React.ReactNode> = {
  rocket: <Rocket className="h-6 w-6 text-primary" />,
  timer: <Timer className="h-6 w-6 text-primary" />,
  activity: <Activity className="h-6 w-6 text-primary" />,
  target: <Target className="h-6 w-6 text-primary" />,
  check: <CheckCircle2 className="h-6 w-6 text-primary" />,
};

const HowItWorks: React.FC = () => {
  const [steps, setSteps] = useState<StepItem[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('home_steps')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      if (!error && data) setSteps(data as StepItem[]);
    };
    load();
  }, []);

  if (!steps.length) return null;

  return (
    <section aria-label="How it works" className="py-16">
      <div className="container">
        <header className="mb-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold">How FastNow Works</h2>
          <p className="text-muted-foreground mt-2">Three clear steps to sustainable fat loss</p>
        </header>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((s, i) => (
            <Card key={s.id} className="h-full">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    {iconMap[(s.icon_name || '').toLowerCase()] || iconMap.check}
                  </div>
                  <span className="text-sm text-muted-foreground">Step {i + 1}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{s.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
