import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, Heart, Zap, Shield } from 'lucide-react';

const FreeAppSection = () => {
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
              Completely Free to Use
            </h2>
            <p className="text-lg text-white/90">
              All FastNow features are available at no cost
            </p>
          </div>

          {/* Benefits */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 rounded-lg p-4">
              <Heart className="w-8 h-8 text-white mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">No Subscriptions</h3>
              <p className="text-white/80 text-sm">Use all features without any recurring fees</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <Zap className="w-8 h-8 text-white mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Full Access</h3>
              <p className="text-white/80 text-sm">Complete fasting tools, walking tracker, and food log</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <Shield className="w-8 h-8 text-white mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">No Limitations</h3>
              <p className="text-white/80 text-sm">Every feature unlocked from day one</p>
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
              Launch Free App
            </Button>
          </div>

          {/* Footer Text */}
          <p className="mt-6 text-sm text-white/70">
            Start your fasting journey today — no payment required
          </p>
        </div>
      </div>
    </section>
  );
};

export default FreeAppSection;