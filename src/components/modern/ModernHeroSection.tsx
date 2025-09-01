import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Download } from 'lucide-react';
import LazyImage from '@/components/LazyImage';

interface ModernHeroSectionProps {
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  heroImageUrl?: string;
  sideImageUrl?: string;
  sideImageAlignment?: 'top' | 'center' | 'bottom';
  sideImageWidth?: number;
}

export const ModernHeroSection: React.FC<ModernHeroSectionProps> = ({
  title,
  subtitle,
  description,
  ctaText,
  ctaUrl,
  heroImageUrl,
  sideImageUrl,
  sideImageAlignment = 'center',
  sideImageWidth = 25
}) => {
  const getAlignmentClass = () => {
    switch (sideImageAlignment) {
      case 'top': return 'items-start';
      case 'bottom': return 'items-end';
      default: return 'items-center';
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center py-20 overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,120,120,0.3),transparent)]" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Content Column */}
          <div className={`${sideImageUrl ? 'lg:col-span-7' : 'lg:col-span-8'} space-y-8`}>
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Transform Your Health
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                {title}
              </h1>
              
              <p className="text-xl sm:text-2xl text-muted-foreground font-medium">
                {subtitle}
              </p>
              
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                {description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                asChild 
                size="lg" 
                className="group bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 h-auto rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <a href={ctaUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 h-5 w-5" />
                  {ctaText}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                asChild
                className="border-2 hover:bg-primary/5 px-8 py-4 h-auto rounded-xl font-semibold text-lg"
              >
                <a href="#learn-more">
                  Learn More
                </a>
              </Button>
            </div>
          </div>

          {/* Image Columns */}
          {sideImageUrl && (
            <div className={`lg:col-span-5 flex ${getAlignmentClass()} justify-center`}>
              <div className="relative" style={{ width: `${sideImageWidth}rem` }}>
                <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-3xl transform rotate-6" />
                <LazyImage
                  src={sideImageUrl}
                  alt="FastNow App Preview"
                  className="relative rounded-2xl shadow-2xl object-cover w-full"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};