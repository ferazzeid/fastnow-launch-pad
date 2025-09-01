import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Phase {
  title: string;
  description: string;
  duration: string;
  keyPoints: string[];
}

interface ModernPhaseSectionProps {
  phases: Phase[];
}

export const ModernPhaseSection: React.FC<ModernPhaseSectionProps> = ({ phases }) => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Your 3-Phase Journey
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            A scientifically-backed approach to sustainable fat loss through intermittent fasting
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {phases.map((phase, index) => (
            <Card key={index} className="group relative overflow-hidden border-0 bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-sm hover:shadow-2xl hover:scale-[1.02] transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <CardContent className="relative p-8 h-full">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-bold text-lg">{index + 1}</span>
                    </div>
                    <span className="text-sm font-medium text-primary/70 uppercase tracking-wider">
                      {phase.duration}
                    </span>
                  </div>
                  <ArrowRight className="h-5 w-5 text-primary/40 group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
                </div>

                <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                  {phase.title}
                </h3>
                
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {phase.description}
                </p>

                <div className="space-y-3">
                  {phase.keyPoints.map((point, pointIndex) => (
                    <div key={pointIndex} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-2 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{point}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 px-8 py-4 h-auto rounded-xl">
            <Link to="/fastnow-protocol">
              <span className="mr-2">Explore the Full Protocol</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};