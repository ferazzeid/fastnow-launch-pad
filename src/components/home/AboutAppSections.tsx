import React, { useEffect, useState } from 'react';
import { Clock, Activity, Utensils, Target, Bot } from 'lucide-react';
import { FeatureScreenshotService, FeatureScreenshot } from '@/services/FeatureScreenshotService';
import { FeatureScreenshotMockup } from '@/components/FeatureScreenshotMockup';

const features = [
  {
    key: 'fasting-timer',
    title: 'Smart Fasting Timer',
    subtitle: 'Track your fasting windows with precision and intelligence',
    icon: <Clock className="w-8 h-8 text-primary" />,
    bullets: [
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
    bullets: [
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
    bullets: [
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
    bullets: [
      'Personalized motivational messages',
      'Achievement badges and rewards',
      'Progress celebrations',
      'Inspiring success stories',
      'Custom goal setting'
    ]
  },
  {
    key: 'ai-assistant',
    title: 'AI Assistant',
    subtitle: 'Get personalized guidance from your intelligent fasting coach',
    icon: <Bot className="w-8 h-8 text-primary" />,
    bullets: [
      '24/7 personalized fasting guidance',
      'Science-based recommendations',
      'Real-time answers to your questions',
      'Adaptive protocol suggestions',
      'Health insights and tips'
    ]
  }
];

const AboutAppSections: React.FC = () => {
  const [screenshots, setScreenshots] = useState<FeatureScreenshot[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await FeatureScreenshotService.getFeatureScreenshots();
        setScreenshots(data);
      } catch (e) {
        console.error('Feature screenshots load error:', e);
      }
    };
    load();
  }, []);

  const getShot = (key: string) => screenshots.find(s => s.feature_key === key)?.image_url || '';

  return (
    <section id="about-fastnow-app" className="py-12">
      <div className="container max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">About FastNow App</h2>
        <div className="space-y-12">
          {features.map((f, idx) => (
            <div key={f.key} className="grid lg:grid-cols-2 gap-8 items-start">
              <div className={idx % 2 === 1 ? 'lg:order-2' : ''}>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-1">{f.title}</h3>
                <p className="text-muted-foreground mb-4">{f.subtitle}</p>
                <ul className="space-y-2">
                  {f.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <span className="text-muted-foreground">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={idx % 2 === 1 ? 'lg:order-1' : ''}>
                <div className="w-36 mx-auto md:w-44">
                  <FeatureScreenshotMockup imageUrl={getShot(f.key)} altText={`${f.title} screenshot`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutAppSections;
