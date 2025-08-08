import React, { useEffect, useState } from 'react';
import { Clock, Activity, Utensils, Target } from 'lucide-react';
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
  }
];

const AboutAppSectionsRedesigned: React.FC = () => {
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
    <section id="about-fastnow-app" className="py-12 border-t">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="max-w-4xl">
          <div className="flex items-start gap-4 mb-12">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">About FastNow App</h2>
              <p className="text-muted-foreground">Powerful features to support your weight loss journey</p>
            </div>
          </div>

          <div className="space-y-16">
            {features.map((f, idx) => (
              <div key={f.key} className="grid lg:grid-cols-2 gap-8 items-start">
                <div className={idx % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    {f.icon}
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">{f.title}</h3>
                  <p className="text-muted-foreground mb-6 text-lg">{f.subtitle}</p>
                  <ul className="space-y-3">
                    {f.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-muted-foreground">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={idx % 2 === 1 ? 'lg:order-1' : ''}>
                  <div className="w-40 mx-auto lg:w-48">
                    <FeatureScreenshotMockup imageUrl={getShot(f.key)} altText={`${f.title} screenshot`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutAppSectionsRedesigned;