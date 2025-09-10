import React, { useState, useEffect } from 'react';
import SEOHead from '@/components/SEOHead';
import PageLayout from '@/components/layout/PageLayout';
import PageFeaturedImage from '@/components/PageFeaturedImage';
import { pageContentService } from '@/services/PageContentService';
import { Button } from '@/components/ui/button';
import { Utensils } from 'lucide-react';

const CalorieLimitationProtocol = () => {
  const [pageContent, setPageContent] = useState({
    title: 'Strict Simple Diet',
    subtitle: 'Achieve rapid visible progress with strategic calorie control',
    content: '',
    metaTitle: 'Calorie Limitation Protocol - Strict Simple Diet | FastNow',
    metaDescription: 'Master the calorie limitation phase of the FastNow Protocol with strategic food choices and precise tracking for rapid fat loss.',
    featuredImage: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const content = await pageContentService.getPageContent('calorie-limitation-protocol');
      if (content) {
        setPageContent({
          title: content.title,
          subtitle: content.subtitle || '',
          content: content.content,
          metaTitle: content.meta_title || content.title,
          metaDescription: content.meta_description || '',
          featuredImage: content.featured_image_url || ''
        });
      }
    } catch (error) {
      console.error('Error loading calorie limitation protocol content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatContent = (text: string) => {
    if (!text) return null;
    return text.split('\n\n').map((paragraph, index) => (
      <p key={index} className="mb-4 text-gray-700 leading-relaxed">
        {paragraph}
      </p>
    ));
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading content...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <SEOHead 
        config={{
          title: pageContent.metaTitle,
          description: pageContent.metaDescription,
          type: 'article'
        }}
      />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 py-20">
        <PageFeaturedImage 
          pageKey="calorie-limitation-protocol" 
          className="absolute inset-0 w-full h-full object-cover opacity-20" 
          defaultAlt="Calorie Limitation Protocol - Strict Simple Diet"
        />
        <div className="container max-w-6xl mx-auto px-4 relative z-20">
          <div className="text-left max-w-3xl">
            <div className="backdrop-blur-sm bg-black/20 rounded-xl p-8 border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-white/20 p-3 rounded-full">
                  <Utensils className="w-6 h-6 text-white" />
                </div>
                <div className="bg-white/20 rounded-full px-4 py-2 text-white font-medium">
                  Phase 2
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent mb-6 drop-shadow-lg">
                {pageContent.title}
              </h1>
              
              {pageContent.subtitle && (
                <p className="text-lg md:text-xl text-white/90 mb-6 drop-shadow-md">
                  {pageContent.subtitle}
                </p>
              )}
              
              <div className="mt-8">
                <Button 
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 inline-flex items-center gap-2 hover:shadow-xl hover:scale-105"
                  asChild
                >
                  <a href="https://go.fastnow.app" target="_blank" rel="noopener noreferrer">
                    Track Your Diet
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg max-w-none">
            {formatContent(pageContent.content)}
          </div>
          
          <div className="mt-12 grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-3">✅ What to Eat</h3>
              <ul className="text-green-700 space-y-2">
                <li>• Cheese, sausage, eggs, cold cuts</li>
                <li>• Fish and meat</li>
                <li>• Cucumbers and pickles</li>
                <li>• Plain yogurt</li>
                <li>• Water, coffee, diet sodas</li>
              </ul>
            </div>
            
            <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="text-lg font-semibold text-red-800 mb-3">❌ What to Avoid</h3>
              <ul className="text-red-700 space-y-2">
                <li>• Bread, rice, noodles, potatoes</li>
                <li>• Fruit, carrots, tomatoes</li>
                <li>• Oil and high-fat dressings</li>
                <li>• Everything else not on the OK list</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default CalorieLimitationProtocol;