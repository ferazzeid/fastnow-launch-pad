import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Copy, Scissors, ExternalLink } from 'lucide-react';

const CouponOptInSection = () => {
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText('FASTNOW90');
      setIsCopied(true);
      toast({
        title: "Code Copied!",
        description: "FASTNOW90 has been copied to your clipboard.",
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Please copy the code manually: FASTNOW90",
        variant: "destructive",
      });
    }
  };

  const handleLaunchApp = () => {
    handleCopyCode();
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
              90 Days Free Trial
            </h2>
            <p className="text-lg text-white/90">
              Copy the code, then use it in the app
            </p>
          </div>

          {/* Coupon Display */}
          <div className="relative inline-block mb-8">
            {/* Scissors icon */}
            <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10">
              <Scissors className="w-6 h-6 text-white/60 rotate-45" />
            </div>
            
            {/* Coupon */}
            <div className="relative bg-white rounded-lg border-2 border-dashed border-primary/30 p-6 mx-4">
              {/* Coupon holes */}
              <div className="absolute -left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-primary rounded-full"></div>
              <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-primary rounded-full"></div>
              
              {/* Content */}
              <div className="text-center">
                <div className="text-xs font-medium text-gray-500 mb-2 tracking-wider">
                  COUPON CODE
                </div>
                <div className="text-4xl font-bold text-primary font-mono tracking-wider mb-2">
                  FASTNOW90
                </div>
                <div className="text-xs text-gray-500">
                  Valid until Dec 31, 2024
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Button
              onClick={handleCopyCode}
              variant="outline"
              size="lg"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
            >
              {isCopied ? (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Code
                </>
              )}
            </Button>
            
            <Button
              onClick={handleLaunchApp}
              size="lg"
              className="bg-white text-primary hover:bg-white/90 font-semibold"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Copy & Launch App
            </Button>
          </div>

          {/* Fine print */}
          <p className="mt-6 text-sm text-white/70">
            No credit card required • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
};

export default CouponOptInSection;