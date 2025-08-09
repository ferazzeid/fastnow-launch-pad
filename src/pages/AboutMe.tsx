import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import PageLayout from '@/components/layout/PageLayout';
import PageFeaturedImage from '@/components/PageFeaturedImage';
import { supabase } from '@/integrations/supabase/client';

const AboutMe = () => {
  const [title, setTitle] = useState("Close Not Scales");
  const [subtitle, setSubtitle] = useState("My measure of progress is clothes, not numbers. Real-world results over daily weight fluctuations.");
  const [content, setContent] = useState(`I spent years bouncing between diets, tracking every macro, and obsessing over daily weight fluctuations. The scale would go up after a good day, down after a bad one, and I'd lose motivation when the numbers didn't match my effort.

Everything changed when I stopped weighing myself entirely. Now I use clothes as my measurement system. I keep a rack of clothes in different sizes - some brand new with tags, others I haven't worn in years. They're arranged in order of what I want to fit into next.

This approach works because clothes don't lie. They either fit or they don't. There's no water weight confusion, no wondering if muscle gain is masking fat loss, no daily fluctuations that mess with your head. Just clear, visual progress.

When I can zip up something that was too tight last month, that's real progress. When I move to the next smaller size on my rack, that's a victory worth celebrating. The scale can't capture that feeling of putting on clothes that actually fit well and feeling confident.

My protocol isn't about reaching some arbitrary number on a scale. It's about getting my body to a place where I feel good in my clothes, where I have energy, and where I'm not constantly thinking about food. The clothes on my rack represent those goals - not a number that changes for dozens of reasons I can't control.`);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_key, setting_value')
        .in('setting_key', ['about_me_title', 'about_me_subtitle', 'about_me_content']);

      if (error) {
        console.error('Database error loading about me:', error);
        return;
      }

      if (data && data.length > 0) {
        const settings = data.reduce((acc, item) => {
          const value = item.setting_value;
          if (typeof value === 'string') {
            try {
              const parsed = JSON.parse(value);
              acc[item.setting_key] = typeof parsed === 'string' ? parsed : String(parsed);
            } catch {
              acc[item.setting_key] = value;
            }
          } else {
            acc[item.setting_key] = value ? String(value) : '';
          }
          return acc;
        }, {} as Record<string, string>);

        if (settings.about_me_title) setTitle(settings.about_me_title);
        if (settings.about_me_subtitle) setSubtitle(settings.about_me_subtitle);
        if (settings.about_me_content) setContent(settings.about_me_content);
      }
    } catch (error) {
      console.error('Error loading about me content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatContent = (text: string) => {
    return text.split('\n\n').map((paragraph, index) => (
      <p key={index} className="mb-6">
        {paragraph}
      </p>
    ));
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="container py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-lg mb-4">Loading...</div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Helmet>
        <title>Close Not Scales - My Weight Loss Journey | FastNow</title>
        <meta name="description" content="My measure of progress is clothes, not numbers. Learn why I track real-world results over daily weight fluctuations and how it changed my approach to weight loss." />
      </Helmet>

      {/* Hero Background Image */}
      <div className="absolute inset-0 w-full h-screen z-0">
        <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-700"></div>
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-start">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-left max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent mb-6 drop-shadow-lg">
              {title}
            </h1>
            <p className="text-xl text-white/90 mb-8 drop-shadow-md">
              {subtitle}
            </p>
            <div className="mt-6 text-white/90 space-y-4 drop-shadow-md">
              <p>
                I don't use a scale. I don't care about a number that changes for a hundred reasons. I care about real-world results.
              </p>
              <p>
                My measure of progress is clothes. Some are brand new with tags still on. Others I haven't fit into for years. I keep them on a rack, in order of which I want to wear next. No numbers. No "target weight." Just the moment I can walk outside in something I couldn't even close a few weeks ago.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <div className="relative z-10 bg-background">
        <div className="container py-16">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <div className="w-16 h-1 bg-gradient-to-r from-primary to-primary/60 mx-auto rounded-full"></div>
              
              <div className="prose prose-lg max-w-none text-muted-foreground space-y-8">
                <div className="space-y-6">
                  {content.split('\n\n').map((paragraph, index) => (
                    <div key={index} className="relative">
                      <div className="absolute left-0 top-2 w-2 h-2 bg-primary/20 rounded-full"></div>
                      <p className="pl-6 leading-relaxed">
                        {paragraph}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default AboutMe;