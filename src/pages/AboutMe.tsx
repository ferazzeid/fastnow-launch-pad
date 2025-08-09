import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import PageLayout from '@/components/layout/PageLayout';
import PageFeaturedImage from '@/components/PageFeaturedImage';
import { supabase } from '@/integrations/supabase/client';

const AboutMe = () => {
  const [title, setTitle] = useState("Close Not Scales");
  const [subtitle, setSubtitle] = useState("My measure of progress is clothes, not numbers. Real-world results over daily weight fluctuations.");
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!hasLoaded) {
      // Add timeout to prevent infinite loading
      const loadTimeout = setTimeout(() => {
        if (isLoading) {
          console.log('Loading timeout reached, forcing load complete');
          setIsLoading(false);
          setHasLoaded(true);
          setHasError(true);
        }
      }, 10000); // 10 second timeout

      loadContent().finally(() => {
        clearTimeout(loadTimeout);
      });

      return () => clearTimeout(loadTimeout);
    }
  }, [hasLoaded, isLoading]);

  const loadContent = async () => {
    try {
      console.log('Loading about me content...');
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_key, setting_value')
        .in('setting_key', ['about_me_title', 'about_me_subtitle', 'about_me_content']);

      console.log('About me query result:', { data, error });

      if (error) {
        console.error('Database error loading about me:', error);
        // Don't throw, just use defaults
      }

      if (data && data.length > 0) {
        const settings = data.reduce((acc, item) => {
          const value = item.setting_value;
          // Handle both string and object values properly
          if (typeof value === 'string') {
            try {
              const parsed = JSON.parse(value);
              acc[item.setting_key] = typeof parsed === 'string' ? parsed : String(parsed);
            } catch {
              acc[item.setting_key] = value;
            }
          } else if (typeof value === 'object' && value !== null) {
            acc[item.setting_key] = String(value);
          } else {
            acc[item.setting_key] = value ? String(value) : '';
          }
          return acc;
        }, {} as Record<string, string>);

        console.log('Parsed about me settings:', settings);

        if (settings.about_me_title) setTitle(settings.about_me_title);
        if (settings.about_me_subtitle) setSubtitle(settings.about_me_subtitle);
        if (settings.about_me_content) setContent(settings.about_me_content);
      } else {
        console.log('No about me content found in database, using defaults');
      }
    } catch (error) {
      console.error('Error loading about me content:', error);
      setHasError(true);
      // Continue with defaults instead of failing
    } finally {
      console.log('About me content loading complete');
      setIsLoading(false);
      setHasLoaded(true);
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
            <div className="animate-pulse">
              <div className="text-lg mb-4">Loading About Me...</div>
              {hasError && <div className="text-red-500">Having trouble loading content. Using defaults...</div>}
            </div>
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
        <PageFeaturedImage pageKey="about-me" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40"></div>
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
              <h2 className="text-2xl md:text-3xl font-semibold">The Real Measurement</h2>
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
                {content ? (
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
                ) : (
                  <div className="text-center py-12 bg-muted/20 rounded-lg">
                    <p>Content is being updated. Please check back soon.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default AboutMe;