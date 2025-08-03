import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import PageLayout from '@/components/layout/PageLayout';
import { supabase } from '@/integrations/supabase/client';

const AboutMe = () => {
  const [title, setTitle] = useState('About Me');
  const [subtitle, setSubtitle] = useState('The personal journey behind the Fast Now Protocol - years of struggle, discovery, and finally finding what works.');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (!hasLoaded) {
      loadContent();
    }
  }, [hasLoaded]);

  const loadContent = async () => {
    try {
      console.log('Loading about me content...');
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_key, setting_value')
        .in('setting_key', ['about_me_title', 'about_me_subtitle', 'about_me_content']);

      console.log('Site settings query result:', { data, error });

      if (error) {
        console.error('Database error:', error);
        throw error;
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

        console.log('Parsed settings:', settings);

        if (settings.about_me_title) setTitle(settings.about_me_title);
        if (settings.about_me_subtitle) setSubtitle(settings.about_me_subtitle);
        if (settings.about_me_content) setContent(settings.about_me_content);
      } else {
        console.log('No about me content found in database, using defaults');
      }
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      console.log('Setting loading to false');
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
            <div className="animate-pulse">Loading...</div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Helmet>
        <title>{title} - Personal Journey with Weight Loss and Fasting</title>
        <meta name="description" content={subtitle} />
      </Helmet>

      <div className="container py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-6">
              {title}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {subtitle}
            </p>
          </div>

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
    </PageLayout>
  );
};

export default AboutMe;