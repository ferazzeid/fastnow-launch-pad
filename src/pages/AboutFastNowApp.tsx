import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import PageLayout from '@/components/layout/PageLayout';
import PageFeaturedImage from '@/components/PageFeaturedImage';
import { FeatureScreenshotMockup } from '@/components/FeatureScreenshotMockup';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Activity, Utensils, Target } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { SiteSettingsService } from '@/services/SiteSettingsService';
import { FeatureScreenshotService, FeatureScreenshot } from '@/services/FeatureScreenshotService';

const AboutFastNowApp = () => {
  const isMobile = useIsMobile();
  const [content, setContent] = useState({
    heroTitle: 'Why the App Matters',
    heroDescription: '',
    featuresTitle: 'Discover FastNow Features'
  });

  const [featureScreenshots, setFeatureScreenshots] = useState<FeatureScreenshot[]>([]);

  const features = [
    {
      key: 'fasting-timer',
      title: 'Fasting Timer',
      subtitle: '',
      icon: <Clock className="w-8 h-8 text-primary" />,
      features: [
        'Built for water fasting only — no intermittent fasting or refeed windows',
        'Count up or count down to your fasting goal',
        'Pre-set 60-hour fast, plus other standard and custom lengths (including beyond 72 hours)',
        'Clean, distraction-free design to help you stay immersed in the fasted state',
        'See exactly how much time you\'ve completed or have left',
        'Hour-by-hour fasting state descriptions, showing what\'s likely happening in your body',
        'Planned feature: personal hourly comments from the creator to guide your journey'
      ]
    },
    {
      key: 'walking-tracker',
      title: 'Walking Tracker',
      subtitle: 'Your "Joker card" for creating extra calorie burn without exhausting yourself.',
      icon: <Activity className="w-8 h-8 text-primary" />,
      features: [
        'Track walking time, distance, and estimated calories burned',
        'See estimated fat burned (in grams) for each walk',
        'Integrated into your daily deficit overview for a complete progress picture',
        'Keeps you immersed in your weight-loss process',
        'Builds a real-world sense of how movement affects calorie balance — showing exactly how much walking it takes to offset extra food'
      ]
    },
    {
      key: 'food-log',
      title: 'Food Log',
      subtitle: 'The most important tool in the app — because what you eat decides whether you succeed or fail.',
      icon: <Utensils className="w-8 h-8 text-primary" />,
      features: [
        'Track calories and carbs for every food you eat',
        'Built to support a significant daily deficit (around 1,500 kcal and ~30g carbs for most people)',
        'Manual and AI-assisted food entry options',
        'Save foods to your personal library for quick reuse',
        'Create and reuse daily food templates to keep your diet simple and consistent',
        'Includes a starter library of foods from the creator\'s own diet for easy copying and adjustment',
        'Helps you learn food values and spot mistakes that could stall progress — even a small error can cost you a day\'s results'
      ]
    },
    {
      key: 'motivators',
      title: 'Motivators',
      subtitle: 'The reasons you start — and the reminders that keep you going.',
      icon: <Target className="w-8 h-8 text-primary" />,
      features: [
        'Capture the 3–4 real reasons you\'re taking action — in as much detail as possible',
        'Add personal photos or AI-generated symbolic images (real images are most powerful)',
        'Use motivators during water fasts, restricted dieting, and walks to stay on track',
        'Access a library of example motivators from the creator for inspiration and easy customization',
        'Record both positive drivers (events, goals, clothes you want to wear) and difficult truths (health issues, criticism, wake-up moments)',
        'AI-assisted entry makes it quick to start — with manual fine-tuning for maximum personal impact'
      ]
    }
  ];

  useEffect(() => {
    const loadContent = async () => {
      try {
        const [settings, screenshots] = await Promise.all([
          SiteSettingsService.getAllSettings(),
          FeatureScreenshotService.getFeatureScreenshots()
        ]);
        
        if (settings.aboutAppContent) {
          setContent(settings.aboutAppContent);
        }
        
        setFeatureScreenshots(screenshots);
      } catch (error) {
        console.error('Error loading About App content:', error);
      }
    };

    loadContent();
  }, []);

  const getScreenshotForFeature = (featureKey: string): string => {
    const screenshot = featureScreenshots.find(s => s.feature_key === featureKey);
    return screenshot?.image_url || '';
  };

  return (
    <PageLayout>
      <Helmet>
        <title>About App | fastnow.app</title>
        <meta name="description" content="Learn about the FastNow app - your ultimate companion for intermittent fasting, health tracking, and wellness goals." />
      </Helmet>

      {/* Hero Background Image */}
      <div className="absolute inset-0 w-full h-screen z-0">
        <PageFeaturedImage pageKey="about-fastnow-app" className="w-full h-full object-cover" showDarkBackground={true} />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 min-h-[85vh] flex items-start justify-start pt-6 md:pt-10">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Content */}
            <div className="text-left">
              <div className="backdrop-blur-sm bg-black/20 rounded-xl p-8 border border-white/10">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent mb-6 drop-shadow-lg">
                  {content.heroTitle}
                </h1>
                <div className="mt-6 text-white/90 space-y-4 drop-shadow-md">
                  <p>
                    You could track this program on paper and still succeed. But the app keeps you immersed in the process — which is critical.
                  </p>
                  <p>
                    Immersion makes your brain assign higher priority to what you're doing. It keeps the program front and center, helps you focus, and reveals how easy it is to sabotage yourself without even realizing it.
                  </p>
                  <p>
                    The app removes those blind spots, keeps you accountable, and gives you the momentum to see the program through.
                  </p>
                </div>
                
                {/* Launch App Button */}
                <div className="mt-8 pt-6 border-t border-white/20"> 
                  <button className="bg-accent-green hover:bg-accent-green-dark text-white px-8 py-3 rounded-lg font-semibold shadow-lg transition-colors flex items-center gap-2">
                    Launch App
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Right side - App mockup */}
            <div className="flex justify-center lg:justify-end lg:pl-16 lg:self-start lg:mt-4">
              <div className="w-72">
                <FeatureScreenshotMockup
                  imageUrl={getScreenshotForFeature('fasting-timer')}
                  altText="FastNow App Screenshot"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Discover Features Black Stripe */}
      <div className="relative z-10 bg-gray-900 py-8">
        <div className="container">
          <h2 className="text-3xl font-bold text-center text-white">
            {content.featuresTitle}
          </h2>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative z-10">
        <div className="container py-12">

        {/* Features Sections */}
        <div className="mb-16">
          
          {/* Stacked Feature Sections */}
          <div className="space-y-0 max-w-4xl mx-auto">
            {features.map((feature, index) => {
              // Define background colors for each section, getting lighter as we go down
              const backgrounds = [
                'bg-gray-100', // Fasting Timer
                'bg-gray-50',  // Walking Tracker  
                'bg-white',    // Food Log
                'bg-gray-25'   // Motivators
              ];
              
              return (
                <div key={feature.key} className={`${backgrounds[index]} py-16`}>
                  <div className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                    {/* Content Side */}
                    <div className={`space-y-6 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                      <div className="text-center lg:text-left">
                        <div className="flex items-center gap-3 mb-4 justify-center lg:justify-start">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            {feature.icon}
                          </div>
                          <h3 className="text-3xl font-bold">{feature.title}</h3>
                        </div>
                        {feature.subtitle && (
                          <p className="text-lg text-muted-foreground mb-6">
                            {feature.subtitle}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-lg mb-4">✨ Features:</h4>
                        <ul className="space-y-3">
                          {feature.features.map((item, featureIndex) => (
                            <li key={featureIndex} className="flex items-start gap-3">
                              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-muted-foreground">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Visual Side - Placeholder for now since we're removing screenshots */}
                    <div className={`flex justify-center ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                      <div className="w-64 h-40 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center border border-primary/20">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-2 mx-auto">
                            {feature.icon}
                          </div>
                          <p className="text-sm text-muted-foreground">{feature.title}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pricing Section: Free vs Premium */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-4">
              Free vs Premium — 7‑day trial included
            </h2>
            <p className="text-center text-muted-foreground mb-10">
              Every new account gets full access for 7 days. After the trial, the Food Log locks on Free, while fasting and walking trackers plus Motivators stay available.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Free Plan */}
              <div className="bg-card rounded-xl shadow-soft border border-primary/10 p-6 flex flex-col">
                <div className="flex items-baseline justify-between mb-4">
                  <h3 className="text-2xl font-semibold">Free</h3>
                  <span className="text-lg text-muted-foreground">$0</span>
                </div>
                <ul className="space-y-3 text-muted-foreground mb-6 flex-grow">
                  <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-primary mt-2" />Fasting Timer</li>
                  <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-primary mt-2" />Walking Tracker</li>
                  <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-primary mt-2" />Motivators</li>
                  <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-primary mt-2" />Food Log locked after trial</li>
                </ul>
                <div className="text-center">
                  <Button variant="outline" asChild>
                    <a href="#">Continue Free</a>
                  </Button>
                </div>
              </div>

              {/* Premium Plan */}
              <div className="bg-card rounded-xl shadow-soft border border-primary/20 p-6 flex flex-col">
                <div className="flex items-baseline justify-between mb-4">
                  <h3 className="text-2xl font-semibold">Premium</h3>
                  <span className="text-lg text-foreground">$9/month</span>
                </div>
                <ul className="space-y-3 text-muted-foreground mb-6 flex-grow">
                  <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-primary mt-2" />Everything in Free</li>
                  <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-primary mt-2" />Food Log unlocked after trial</li>
                </ul>
                <div className="text-center">
                  <Button asChild>
                    <a href="#">Start 7‑day trial</a>
                  </Button>
                </div>
              </div>
            </div>

            <p className="text-center text-muted-foreground mt-8">
              Your $9/month helps keep this project alive — and funds new, practical tools for people like us. Thank you for considering Premium.
            </p>
          </div>
        </section>

        {/* Install App instructions */}
        <section className="py-16 bg-gray-25">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-6">FastNow – Install the App on Your Phone</h2>
            <p className="text-center text-muted-foreground mb-10">Even though FastNow runs in your browser, you can add it to your home screen so it works like a real app — full screen, fast, and easy to open.</p>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-3">For Android Users</h3>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li><span className="font-medium">Step 1 – Open FastNow in Chrome:</span> Use Google Chrome (or Samsung Internet) on your phone. Go to fastnow.app (or your site URL).</li>
                  <li><span className="font-medium">Step 2 – Add to Home Screen:</span> Tap the ⋮ menu (top right in Chrome). Select “Add to Home screen”. Confirm the name FastNow and tap Add.</li>
                  <li><span className="font-medium">Step 3 – Put It in Your Main Navigation Bar (optional):</span> Press and hold the new FastNow icon. Drag it to your main dock/navigation bar so it’s always visible.</li>
                </ol>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">For iPhone & iPad Users</h3>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li><span className="font-medium">Step 1 – Open FastNow in Safari:</span> Use Safari (Apple’s browser). Go to fastnow.app (or your site URL).</li>
                  <li><span className="font-medium">Step 2 – Add to Home Screen:</span> Tap the Share icon (square with arrow up). Scroll and tap “Add to Home Screen”. Confirm the name FastNow and tap Add.</li>
                </ol>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-3">Why Install?</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>One-tap access — no need to type the address.</li>
                <li>Full screen — looks and feels like a native app.</li>
                <li>Faster startup — loads instantly from your phone.</li>
              </ul>
            </div>
          </div>
        </section>

        </div>
      </div>
    </PageLayout>
  );
};

export default AboutFastNowApp;