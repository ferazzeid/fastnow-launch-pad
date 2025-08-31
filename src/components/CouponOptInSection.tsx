import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, Gift, Sparkles } from 'lucide-react';

const CouponOptInSection = () => {
  const [couponCode, setCouponCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleRedeemCoupon = async () => {
    if (!couponCode.trim()) {
      toast({
        title: "Enter Coupon Code",
        description: "Please enter a valid coupon code to continue.",
        variant: "destructive",
      });
      return;
    }

    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to redeem your coupon code.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.rpc('redeem_coupon_code', {
        coupon_code: couponCode.trim().toUpperCase()
      });

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        const result = data[0];
        if (result.success) {
          setIsSuccess(true);
          toast({
            title: "Trial Activated! 🎉",
            description: `Congratulations! You now have ${result.days_granted} days of premium access.`,
          });
        } else {
          toast({
            title: "Redemption Failed",
            description: result.message || "Unable to redeem coupon code.",
            variant: "destructive",
          });
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <section className="relative py-16 bg-gradient-to-br from-yellow-50 to-yellow-100">
        <div className="container max-w-4xl mx-auto px-4">
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-yellow-200 shadow-xl">
            <div className="p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                🎉 Trial Activated!
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                You now have 90 days of premium access. Download the app and start your journey!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-green-600 hover:bg-green-700 text-white px-8"
                >
                  Download App
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => window.location.reload()}
                >
                  Redeem Another Code
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-16 bg-gradient-to-br from-yellow-50 to-yellow-100">
      <div className="container max-w-4xl mx-auto px-4">
        <Card className="bg-white/90 backdrop-blur-sm border-2 border-yellow-200 shadow-xl">
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Gift className="w-8 h-8 text-yellow-600" />
                </div>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Limited Time: Test the App Free for 90 Days
              </h2>
              <p className="text-lg text-gray-600 mb-2">
                Enter the exclusive code to unlock full premium features
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-yellow-700 bg-yellow-100 rounded-full px-4 py-2 inline-flex">
                <Sparkles className="w-4 h-4" />
                <span className="font-medium">Use code: FASTNOW90</span>
              </div>
            </div>

            <div className="max-w-md mx-auto space-y-4">
              <div className="space-y-2">
                <label htmlFor="coupon-code" className="text-sm font-medium text-gray-700">
                  Coupon Code
                </label>
                <Input
                  id="coupon-code"
                  type="text"
                  placeholder="Enter code: FASTNOW90"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="h-12 text-center text-lg font-mono tracking-wider border-2 focus:border-yellow-400"
                  disabled={isLoading}
                />
              </div>
              
              <Button
                onClick={handleRedeemCoupon}
                disabled={isLoading || !couponCode.trim()}
                size="lg"
                className="w-full h-12 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold text-lg"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                    Activating...
                  </div>
                ) : (
                  'Activate Trial'
                )}
              </Button>
            </div>

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>No credit card required • Cancel anytime • Valid until Dec 31, 2024</p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default CouponOptInSection;