import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import PageLayout from '@/components/layout/PageLayout';
import PageFeaturedImage from '@/components/PageFeaturedImage';
import { FeatureScreenshotMockup } from '@/components/FeatureScreenshotMockup';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Activity, Utensils, Target } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { SiteSettingsService } from '@/services/SiteSettingsService';
import { FeatureScreenshotService, FeatureScreenshot } from '@/services/FeatureScreenshotService';

const AboutFastNowApp = () => {
  const isMobile = useIsMobile();
  const [content, setContent] = useState({
    heroTitle: 'About FastNow App',
    heroDescription: 'Your ultimate companion for intermittent fasting, health tracking, and achieving your wellness goals.',
    featuresTitle: 'Discover FastNow Features'
  });

  const [featureScreenshots, setFeatureScreenshots] = useState<FeatureScreenshot[]>([]);

  const features = [
    {
      key: 'fasting-timer',
      title: 'Smart Fasting Timer',
      subtitle: 'Track your fasting windows with precision and intelligence',
      icon: <Clock className="w-8 h-8 text-primary" />,
      features: [
        'Multiple fasting protocols (16:8, 18:6, OMAD, and more)',
        'Visual countdown timer with progress rings',
        'Smart notifications for start/end times',
        'Historical fasting data and streaks',
        'Customizable fasting goals'
      ]
    },
    {
      key: 'walking-tracker',
      title: 'Walking Tracker',
      subtitle: 'Monitor your daily activity and movement goals',
      icon: <Activity className="w-8 h-8 text-primary" />,
      features: [
        'Step counting and distance tracking',
        'Calorie burn estimation',
        'Daily, weekly, and monthly goals',
        'Walking route history',
        'Integration with health apps'
      ]
    },
    {
      key: 'food-log',
      title: 'Food Log',
      subtitle: 'Track your nutrition during eating windows',
      icon: <Utensils className="w-8 h-8 text-primary" />,
      features: [
        'Easy meal logging with photos',
        'Macro and calorie tracking',
        'Extensive food database',
        'Custom recipe creation',
        'Eating window optimization'
      ]
    },
    {
      key: 'motivators',
      title: 'Motivators',
      subtitle: 'Stay inspired with personalized motivation and goals',
      icon: <Target className="w-8 h-8 text-primary" />,
      features: [
        'Personalized motivational messages',
        'Achievement badges and rewards',
        'Progress celebrations',
        'Inspiring success stories',
        'Custom goal setting'
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
        <title>About FastNow App | fastnow.app</title>
        <meta name="description" content="Learn about the FastNow app - your ultimate companion for intermittent fasting, health tracking, and wellness goals." />
      </Helmet>

      {/* Hero Background Image */}
      <div className="absolute inset-0 w-full h-screen z-0">
        <PageFeaturedImage pageKey="about-fastnow-app" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-start">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Content */}
            <div className="text-left">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent mb-6 drop-shadow-lg">
                {content.heroTitle}
              </h1>
              <p className="text-xl text-white/90 mb-8 drop-shadow-md">
                {content.heroDescription}
              </p>
              <div className="mt-6 text-white/90 space-y-4 drop-shadow-md">
                <h2 className="text-2xl md:text-3xl font-semibold">Why the App Matters</h2>
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
            </div>

            {/* Right side - App mockup */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-64">
                <FeatureScreenshotMockup
                  imageUrl={getScreenshotForFeature('fasting-timer')}
                  altText="FastNow App Screenshot"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <div className="relative z-10 bg-background">
        <div className="container py-12">

        {/* Features Sections */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-12">
            {content.featuresTitle}
          </h2>
          
          {/* Stacked Feature Sections */}
          <div className="space-y-16 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <div key={feature.key} className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                {/* Content Side */}
                <div className={`space-y-6 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <div className="text-center lg:text-left">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto lg:mx-0">
                      {feature.icon}
                    </div>
                    <h3 className="text-3xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-lg text-muted-foreground mb-6">
                      {feature.subtitle}
                    </p>
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
            ))}
          </div>
        </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default AboutFastNowApp;