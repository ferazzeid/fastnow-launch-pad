import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, Utensils, Timer, TrendingUp, ShieldCheck } from 'lucide-react';

const FreeWithFoodLogSection = () => {
  const handleLaunchApp = () => {
    // Open the app in a new tab
    window.open('https://go.fastnow.app', '_blank');
  };

  return (
    <section className="relative py-16 bg-primary">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="text-center">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Complete Food Tracking — No AI Features
            </h2>
            <p className="text-lg text-white/90">
              Full access to manual food logging and basic nutrition tracking
            </p>
          </div>

          {/* What's Included */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white/10 rounded-lg p-4">
              <Timer className="w-8 h-8 text-white mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Fasting Timer</h3>
              <p className="text-white/80 text-sm">Track your fasting sessions with precision</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <TrendingUp className="w-8 h-8 text-white mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Walking Tracker</h3>
              <p className="text-white/80 text-sm">Monitor your daily walking and activity</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <Utensils className="w-8 h-8 text-white mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Manual Food Log</h3>
              <p className="text-white/80 text-sm">Complete food tracking with manual entry</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <ShieldCheck className="w-8 h-8 text-white mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">No AI Required</h3>
              <p className="text-white/80 text-sm">Pure manual control over your tracking</p>
            </div>
          </div>

          {/* What's NOT Included */}
          <div className="bg-white/5 rounded-lg p-6 mb-8">
            <h3 className="text-white font-semibold mb-4">AI Features Not Included:</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-white/70">
              <div>• AI meal suggestions</div>
              <div>• AI nutrition analysis</div>
              <div>• AI dietary recommendations</div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-center max-w-md mx-auto">
            <Button
              onClick={handleLaunchApp}
              size="lg"
              className="bg-white text-primary hover:bg-white/90 font-semibold"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Launch App
            </Button>
          </div>

          {/* Footer Text */}
          <p className="mt-6 text-sm text-white/70">
            Full food tracking without AI assistance — completely free
          </p>
        </div>
      </div>
    </section>
  );
};

export default FreeWithFoodLogSection;