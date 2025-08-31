import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import SEOHead from '@/components/SEOHead';
import { WeightLossCalculator } from '@/components/WeightLossCalculator';

const WeightLossCalculatorPage: React.FC = () => {
  return (
    <PageLayout>
      <SEOHead
        config={{
          title: "Weight Loss Calculator - FastNow",
          description: "Calculate your projected weight loss based on calorie intake and activity level. Uses scientific BMR calculations and walking activity to estimate your results.",
          keywords: "weight loss calculator, BMR calculator, calorie deficit, weight projection, TDEE calculator",
          canonical: "/weight-loss-calculator"
        }}
      />
      
      <main className="min-h-screen bg-background-primary">
        <WeightLossCalculator />
      </main>
    </PageLayout>
  );
};

export default WeightLossCalculatorPage;