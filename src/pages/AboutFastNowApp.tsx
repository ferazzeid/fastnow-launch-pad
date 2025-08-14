import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import PageLayout from '@/components/layout/PageLayout';
import PageFeaturedImage from '@/components/PageFeaturedImage';
import { FeatureScreenshotMockup } from '@/components/FeatureScreenshotMockup';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Activity, Utensils, Target } from 'lucide-react';
import FAQSection from '@/components/FAQSection';
import { useIsMobile } from '@/hooks/use-mobile';
import { SiteSettingsService } from '@/services/SiteSettingsService';
import { FeatureScreenshotService, FeatureScreenshot } from '@/services/FeatureScreenshotService';
import { pageContentService } from '@/services/PageContentService';

const AboutFastNowApp = () => {
  const isMobile = useIsMobile();
  const [content, setContent] = useState({
    heroTitle: 'Why the App Matters',
    heroDescription: '',
    featuresTitle: 'Discover FastNow Features'
  });

  const [pageContent, setPageContent] = useState<any>(null);
  const [featureScreenshots, setFeatureScreenshots] = useState<FeatureScreenshot[]>([]);
  const [launchButtonColor, setLaunchButtonColor] = useState('#10B981');

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
        const [settings, screenshots, aboutAppPageContent] = await Promise.all([
          SiteSettingsService.getAllSettings(),
          FeatureScreenshotService.getFeatureScreenshots(),
          pageContentService.getPageContent('about-fastnow-app')
        ]);
        
        if (settings.aboutAppContent) {
          setContent(settings.aboutAppContent);
        }
        
        // Load launch button color from settings
        if (settings.launch_button_color) {
          setLaunchButtonColor(settings.launch_button_color);
          // Apply to CSS custom property
          document.documentElement.style.setProperty('--launch-button-color', settings.launch_button_color);
        }
        
        setPageContent(aboutAppPageContent);
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

  const getPhoneMockupImage = (): string => {
    return pageContent?.button_url || getScreenshotForFeature('fasting-timer');
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
      <section className="relative z-10 min-h-[85vh] flex items-center justify-center pt-6 md:pt-10">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            {/* Mobile: Phone first, Desktop: Content first */}
            <div className="order-1 lg:order-2 flex justify-center lg:pt-0">
              <div className="w-48 sm:w-56 lg:w-80">
                <FeatureScreenshotMockup
                  imageUrl={getPhoneMockupImage()}
                  altText="FastNow App Screenshot"
                />
              </div>
            </div>

            {/* Content */}
            <div className="order-2 lg:order-1 text-left">
              <div className="backdrop-blur-sm bg-black/20 rounded-xl p-6 lg:p-8 border border-white/10">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent mb-6 drop-shadow-lg">
                  {content.heroTitle}
                </h1>
                <div className="mt-6 text-white/90 space-y-4 drop-shadow-md text-sm lg:text-base">
                  {pageContent?.content ? (
                    pageContent.content.split('\n\n').map((paragraph: string, index: number) => (
                      <p key={index}>{paragraph}</p>
                    ))
                  ) : (
                    <>
                      <p>
                        You could track this program on paper and still succeed. But the app keeps you immersed in the process — which is critical.
                      </p>
                      <p>
                        Immersion makes your brain assign higher priority to what you're doing. It keeps the program front and center, helps you focus, and reveals how easy it is to sabotage yourself without even realizing it.
                      </p>
                      <p>
                        The app removes those blind spots, keeps you accountable, and gives you the momentum to see the program through.
                      </p>
                    </>
                  )}
                </div>
                
                {/* Launch App Button */}
                <div className="mt-6 lg:mt-8 pt-4 lg:pt-6 border-t border-white/20"> 
                  <button 
                    className="text-white px-6 lg:px-8 py-2.5 lg:py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 flex items-center gap-2 hover:shadow-xl hover:scale-105"
                    style={{ 
                      backgroundColor: launchButtonColor,
                      boxShadow: `0 4px 14px 0 ${launchButtonColor}40`
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = `${launchButtonColor}dd`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = launchButtonColor;
                    }}
                  >
                    Launch App
                    <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>
                </div>
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
        {/* Features Sections */}
        <div className="mb-0">
          
          {/* Stacked Feature Sections */}
          <div className="space-y-0">
            {features.map((feature, index) => {
              // Define background colors for each section, getting lighter as we go down
              const backgrounds = [
                'bg-gray-100', // Fasting Timer
                'bg-gray-50',  // Walking Tracker  
                'bg-white',    // Food Log
                'bg-gray-200'  // Motivators - distinct from Food Log
              ];
              
              return (
                <div key={feature.key} className={`${backgrounds[index]} py-16 w-full`}>
                  <div className="container max-w-4xl mx-auto">
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
                </div>
              );
            })}
          </div>
        </div>

        {/* Pricing Section: Free vs Premium */}
        <div className="py-16 bg-gray-50 w-full">
          <div className="container max-w-5xl mx-auto">
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
        </div>

        {/* Install App instructions with new tabbed design */}
        <div className="py-16 bg-gray-100 w-full">
          <div className="container max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-6">Install the app on your phone?</h2>
            <p className="text-center text-muted-foreground mb-10">Even though FastNow runs in your browser, you can add it to your home screen so it works like a real app — full screen, fast, and easy to open.</p>

            <Tabs defaultValue="why" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="grid w-full max-w-md grid-cols-3 bg-white/60 backdrop-blur-sm border border-primary/20">
                  <TabsTrigger value="why" className="text-sm font-medium">Why Install?</TabsTrigger>
                  <TabsTrigger value="android" className="text-sm font-medium">ANDROID</TabsTrigger>
                  <TabsTrigger value="iphone" className="text-sm font-medium">IPHONE</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="why" className="mt-8">
                <div className="max-w-4xl mx-auto">
                  <Card className="border-primary/20 shadow-lg">
                    <CardHeader className="text-center">
                      <CardTitle className="text-2xl text-primary">Why Install the App?</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <h3 className="font-semibold mb-2">Full-Screen Experience</h3>
                          <p className="text-muted-foreground text-sm">No browser bars, tabs, or distractions. Just your fasting app in focus.</p>
                        </div>
                        
                        <div className="text-center">
                          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                          <h3 className="font-semibold mb-2">Lightning Fast</h3>
                          <p className="text-muted-foreground text-sm">Instant access from your home screen. No typing URLs or waiting for browsers.</p>
                        </div>
                        
                        <div className="text-center">
                          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <h3 className="font-semibold mb-2">Better Focus</h3>
                          <p className="text-muted-foreground text-sm">Stay immersed in your fasting journey without browser distractions pulling you away.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="android" className="mt-8">
                <div className="max-w-6xl mx-auto">
                  <Card className="border-primary/20 shadow-lg">
                    <CardHeader className="text-center">
                      <CardTitle className="text-2xl text-primary flex items-center justify-center gap-2">
                        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85a.637.637 0 0 0-.83.22l-1.88 3.24a11.43 11.43 0 0 0-8.94 0L5.65 5.67a.637.637 0 0 0-.83-.22c-.3.16-.42.54-.26.85L6.4 9.48C3.3 11.25 1.28 14.44 1 18h22c-.28-3.56-2.3-6.75-5.4-8.52zM7 15.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm10 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5z"/>
                        </svg>
                        Android Installation
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid lg:grid-cols-2 gap-8 items-center">
                        <div className="space-y-6">
                          <div className="flex items-start gap-4">
                            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">1</div>
                            <div>
                              <h3 className="font-semibold mb-2">Open FastNow in Chrome</h3>
                              <p className="text-muted-foreground text-sm">Use Google Chrome (or Samsung Internet) on your phone. Go to <strong>fastnow.app</strong></p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-4">
                            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">2</div>
                            <div>
                              <h3 className="font-semibold mb-2">Add to Home Screen</h3>
                              <p className="text-muted-foreground text-sm">Tap the <strong>⋮ menu</strong> (top right in Chrome). Select <strong>"Add to Home screen"</strong>. Confirm the name FastNow and tap Add.</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-4">
                            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">3</div>
                            <div>
                              <h3 className="font-semibold mb-2">Open the App</h3>
                              <p className="text-muted-foreground text-sm">Look for the FastNow icon on your home screen. Tap it to open the app in full-screen mode.</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-center">
                          {/* Android Phone Mockup */}
                          <div className="w-64 h-96 bg-gradient-to-b from-gray-900 to-gray-700 rounded-3xl shadow-2xl border-4 border-gray-600 relative overflow-hidden">
                            <div className="absolute inset-4 bg-white rounded-2xl overflow-hidden">
                              <div className="h-6 bg-gray-100 flex items-center justify-between px-3">
                                <span className="text-xs font-medium">9:41</span>
                                <div className="flex gap-1">
                                  <div className="w-3 h-2 bg-green-500 rounded-sm"></div>
                                  <div className="w-3 h-2 bg-green-500 rounded-sm"></div>
                                  <div className="w-3 h-2 bg-green-500 rounded-sm"></div>
                                </div>
                              </div>
                              <div className="h-10 bg-gray-50 border-b flex items-center px-3">
                                <div className="flex-1 bg-white rounded-full px-3 py-1 text-xs text-gray-600 border">
                                  fastnow.app
                                </div>
                                <button className="ml-2 w-6 h-6 flex items-center justify-center">
                                  <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                                  <div className="w-1 h-1 bg-gray-600 rounded-full ml-1"></div>
                                  <div className="w-1 h-1 bg-gray-600 rounded-full ml-1"></div>
                                </button>
                              </div>
                              <div className="flex-1 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                                <div className="text-center">
                                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-2">
                                    <Clock className="w-6 h-6 text-white" />
                                  </div>
                                  <p className="text-xs font-medium text-primary">FastNow</p>
                                </div>
                              </div>
                            </div>
                            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gray-800 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="iphone" className="mt-8">
                <div className="max-w-6xl mx-auto">
                  <Card className="border-primary/20 shadow-lg">
                    <CardHeader className="text-center">
                      <CardTitle className="text-2xl text-primary flex items-center justify-center gap-2">
                        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                        </svg>
                        iPhone Installation
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid lg:grid-cols-2 gap-8 items-center">
                        <div className="space-y-6">
                          <div className="flex items-start gap-4">
                            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">1</div>
                            <div>
                              <h3 className="font-semibold mb-2">Open FastNow in Safari</h3>
                              <p className="text-muted-foreground text-sm">Use Safari on your phone. Go to <strong>fastnow.app</strong></p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-4">
                            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">2</div>
                            <div>
                              <h3 className="font-semibold mb-2">Add to Home Screen</h3>
                              <p className="text-muted-foreground text-sm">Tap the <strong>Share button</strong> at the bottom center. Scroll down and tap <strong>"Add to Home Screen"</strong>. Confirm the name FastNow and tap Add.</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-4">
                            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">3</div>
                            <div>
                              <h3 className="font-semibold mb-2">Open the App</h3>
                              <p className="text-muted-foreground text-sm">Look for the FastNow icon on your home screen. Tap it to open the app in full-screen mode.</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-center">
                          {/* iPhone Mockup */}
                          <div className="w-64 h-96 bg-gradient-to-b from-gray-900 to-gray-700 rounded-3xl shadow-2xl border-2 border-gray-600 relative overflow-hidden">
                            <div className="absolute inset-2 bg-black rounded-3xl overflow-hidden">
                              <div className="absolute inset-1 bg-white rounded-3xl overflow-hidden">
                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-black rounded-b-2xl"></div>
                                <div className="h-10 bg-gray-100 flex items-center justify-between px-6 pt-6">
                                  <span className="text-xs font-medium">9:41</span>
                                  <div className="flex gap-1">
                                    <div className="w-4 h-2 bg-green-500 rounded-sm"></div>
                                  </div>
                                </div>
                                <div className="h-12 bg-gray-50 border-b flex items-center px-4">
                                  <div className="flex-1 bg-white rounded-full px-3 py-2 text-xs text-gray-600 border">
                                    fastnow.app
                                  </div>
                                </div>
                                <div className="flex-1 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                                  <div className="text-center">
                                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-2">
                                      <Clock className="w-6 h-6 text-white" />
                                    </div>
                                    <p className="text-xs font-medium text-primary">FastNow</p>
                                  </div>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gray-50 border-t flex items-center justify-center">
                                  <button className="w-8 h-8 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* FAQ Section */}
        <FAQSection category="app" className="bg-white" />

      </div>
    </PageLayout>
  );
};

export default AboutFastNowApp;
