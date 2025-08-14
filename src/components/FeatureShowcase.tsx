import React from 'react';
import { FeatureScreenshotMockup } from './FeatureScreenshotMockup';

interface FeatureShowcaseProps {
  features: Array<{
    key: string;
    title: string;
    imageUrl: string;
  }>;
}

export const FeatureShowcase: React.FC<FeatureShowcaseProps> = ({ features }) => {
  return (
    <section className="py-16 bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Powerful Features in Your Pocket
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to succeed on your health journey, beautifully designed and easy to use.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {features.map((feature) => (
            <div key={feature.key} className="flex flex-col items-center">
              <div className="w-48 h-auto mb-4">
                <FeatureScreenshotMockup 
                  imageUrl={feature.imageUrl} 
                  altText={`${feature.title} screenshot`}
                />
              </div>
              <h3 className="text-lg font-semibold text-foreground text-center">
                {feature.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};