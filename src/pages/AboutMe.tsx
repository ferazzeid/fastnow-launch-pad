import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import PageLayout from '@/components/layout/PageLayout';
import { supabase } from '@/integrations/supabase/client';

const AboutMe = () => {
  const [title, setTitle] = useState('About Me');
  const [subtitle, setSubtitle] = useState('The personal journey behind the Fast Now Protocol - years of struggle, discovery, and finally finding what works.');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_key, setting_value')
        .in('setting_key', ['about_me_title', 'about_me_subtitle', 'about_me_content']);

      if (error) throw error;

      if (data && data.length > 0) {
        const settings = data.reduce((acc, item) => {
          const value = item.setting_value;
          acc[item.setting_key] = typeof value === 'string' ? JSON.parse(value || '""') : '';
          return acc;
        }, {} as Record<string, string>);

        if (settings.about_me_title) setTitle(settings.about_me_title);
        if (settings.about_me_subtitle) setSubtitle(settings.about_me_subtitle);
        if (settings.about_me_content) setContent(settings.about_me_content);
      }
    } catch (error) {
      console.error('Error loading content:', error);
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
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-accent-green to-mint-600 bg-clip-text text-transparent mb-6">
              {title}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {subtitle}
            </p>
          </div>

          <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
            {content ? formatContent(content) : (
              <p>Content is being updated. Please check back soon.</p>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default AboutMe;