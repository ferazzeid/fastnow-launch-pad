import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import SEOHead from '@/components/SEOHead';
import { WalkingCalculator } from '@/components/WalkingCalculator';

const WalkingCalculatorPage: React.FC = () => {
  return (
    <PageLayout>
      <SEOHead
        config={{
          title: "Walking Calorie Calculator - FastNow",
          description: "Calculate calories burned from walking based on steps, distance, or time. Get personalized results with fun food equivalents and health recommendations.",
          keywords: "walking calculator, calories burned walking, step counter, walking fitness, calorie burn",
          canonical: "/walking-calculator"
        }}
      />
      
      <main className="min-h-screen bg-background-primary">
        <WalkingCalculator />
      </main>
    </PageLayout>
  );
};

export default WalkingCalculatorPage;