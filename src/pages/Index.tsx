import React, { useEffect, useState } from 'react';
import { Clock, Utensils, Activity, Heart } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import { pageContentService } from '@/services/PageContentService';
import { supabase } from '@/integrations/supabase/client';
import SiteInfoTooltip from '@/components/SiteInfoTooltip';
import { SiteSettingsService } from '@/services/SiteSettingsService';
import { BlogPost } from '@/types/blog';
import { databaseBlogService } from '@/services/DatabaseBlogService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FeatureScreenshotMockup } from '@/components/FeatureScreenshotMockup';
import { FeatureScreenshotService, FeatureScreenshot } from '@/services/FeatureScreenshotService';
import SEOHead from '@/components/SEOHead';
import LazyImage from '@/components/LazyImage';
import PageFeaturedImage from '@/components/PageFeaturedImage';
import CouponOptInSection from '@/components/CouponOptInSection';
import { ModernHeroSection } from '@/components/modern/ModernHeroSection';
import { ModernFeatureCard } from '@/components/modern/ModernFeatureCard';
import { ModernPhaseSection } from '@/components/modern/ModernPhaseSection';

const Index = () => {
  // Content state
  const [heroTitle, setHeroTitle] = useState<string>('My Protocol for Fat Loss');
  const [heroSubtitle, setHeroSubtitle] = useState<string>('Transform your body with our scientifically-backed fasting approach');
  const [heroDescription, setHeroDescription] = useState<string>('Discover the power of intermittent fasting with our comprehensive timeline and personalized guidance.');
  const [ctaText, setCtaText] = useState<string>('Download FastNow');
  const [ctaUrl, setCtaUrl] = useState<string>('#');
  const [metaTitle, setMetaTitle] = useState<string>('FastNow - My Protocol for Fat Loss');
  const [metaDescription, setMetaDescription] = useState<string>('Transform your body with scientifically-backed intermittent fasting protocols and personalized guidance.');
  
  // Hero side image settings
  const [sideImageUrl, setSideImageUrl] = useState<string>('');
  const [sideImageAlignment, setSideImageAlignment] = useState<'top' | 'center' | 'bottom'>('center');
  const [sideImageWidth, setSideImageWidth] = useState<number>(25);
  
  const [featuredImageUrl, setFeaturedImageUrl] = useState<string>('');
  const [googlePlayLink, setGooglePlayLink] = useState('https://play.google.com');
  
  // Latest blog posts and feature screenshots
  const [latestBlogPosts, setLatestBlogPosts] = useState<BlogPost[]>([]);
  const [featureScreenshots, setFeatureScreenshots] = useState<FeatureScreenshot[]>([]);

  // Modern phase data
  const phases = [
    {
      title: "Foundation Phase",
      description: "Build sustainable fasting habits with 16:8 intermittent fasting. Learn proper meal timing and nutrition basics.",
      duration: "Days 1-30",
      keyPoints: [
        "16-hour fasting window",
        "8-hour eating window",
        "Focus on whole foods",
        "Track your progress"
      ]
    },
    {
      title: "Adaptation Phase", 
      description: "Extend fasting periods and optimize nutrition. Your body adapts to fat burning as primary fuel source.",
      duration: "Days 31-60",
      keyPoints: [
        "18-20 hour fasting windows",
        "Enhanced meal quality",
        "Increased metabolic flexibility",
        "Better energy levels"
      ]
    },
    {
      title: "Mastery Phase",
      description: "Advanced protocols including extended fasts. Achieve deep ketosis and autophagy benefits.",
      duration: "Days 61-90",
      keyPoints: [
        "24-48 hour extended fasts",
        "Autophagy activation",
        "Deep ketosis benefits",
        "Long-term lifestyle integration"
      ]
    }
  ];

  // Load content from database
  useEffect(() => {
    const loadContent = async () => {
      try {
        const [
          pageData,
          blogPosts,
          screenshots,
          siteSettings
        ] = await Promise.all([
          pageContentService.getPageContent('homepage'),
          databaseBlogService.getAllPosts().then(posts => posts.filter(p => p.status === 'published').slice(0, 3)),
          FeatureScreenshotService.getFeatureScreenshots(),
          SiteSettingsService.getAllSettings()
        ]);

        // Load homepage content
        if (pageData) {
          setMetaTitle(pageData.meta_title || metaTitle);
          setMetaDescription(pageData.meta_description || metaDescription);
          setFeaturedImageUrl(pageData.featured_image_url || '');
        }

        setLatestBlogPosts(blogPosts);
        setFeatureScreenshots(screenshots);

        // Load site settings
        const playStoreUrl = siteSettings.find(s => s.setting_key === 'google_play_store_url');
        if (playStoreUrl?.setting_value) {
          setGooglePlayLink(JSON.parse(playStoreUrl.setting_value).url);
        }
      } catch (error) {
        console.error('Error loading content:', error);
      }
    };

    loadContent();
  }, []);

  const seoConfig = {
    title: metaTitle,
    description: metaDescription,
    keywords: 'intermittent fasting, weight loss, FastNow, fasting app, fat loss protocol, healthy lifestyle',
    canonical: '/',
    type: 'website' as const,
  };

  return (
    <PageLayout>
      <SEOHead config={seoConfig} />
      
      <main>
        {featuredImageUrl && (
          <div className="w-full">
            <img src={featuredImageUrl} alt="FastNow Featured Image" className="w-full h-auto" />
          </div>
        )}

        {/* Modern Hero Section */}
        <ModernHeroSection
          title={heroTitle}
          subtitle={heroSubtitle}
          description={heroDescription}
          ctaText={ctaText}
          ctaUrl={ctaUrl}
          sideImageUrl={sideImageUrl}
          sideImageAlignment={sideImageAlignment}
          sideImageWidth={sideImageWidth}
        />

        {/* Modern Features Section */}
        <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Everything You Need to Succeed
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Comprehensive tools and guidance to make your fasting journey effective and sustainable
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <ModernFeatureCard
                title="Fasting Protocol"
                description="Follow our scientifically-backed 90-day protocol designed for sustainable fat loss and metabolic health."
                icon={Clock}
                href="/fastnow-protocol"
                gradient="from-blue-100 to-blue-50"
              />
              
              <ModernFeatureCard
                title="Walking Calculator"
                description="Calculate calories burned, track your progress, and get personalized recommendations for your walking routine."
                icon={Activity}
                href="/walking-calculator"
                gradient="from-green-100 to-green-50"
              />
              
              <ModernFeatureCard
                title="Weight Loss Calculator"
                description="Plan your weight loss journey with our BMR-based calculator and realistic timeline projections."
                icon={Heart}
                href="/weight-loss-calculator"
                gradient="from-purple-100 to-purple-50"
              />

              <ModernFeatureCard
                title="Fasting Timeline"
                description="Hour-by-hour breakdown of what happens in your body during fasting periods."
                icon={Clock}
                href="/fasting-timeline"
                gradient="from-orange-100 to-orange-50"
              />
              
              <ModernFeatureCard
                title="Motivators"
                description="Find inspiration and motivation to keep you focused on your health transformation goals."
                icon={Heart}
                href="/motivators"
                gradient="from-pink-100 to-pink-50"
              />
              
              <ModernFeatureCard
                title="About the App"
                description="Learn about the FastNow mobile app and how it can support your fasting journey."
                icon={Utensils}
                href="/about-fastnow-app"
                gradient="from-indigo-100 to-indigo-50"
              />
            </div>
          </div>
        </section>

        {/* Modern Phase Section */}
        <ModernPhaseSection phases={phases} />

        {/* App Screenshots Section */}
        {featureScreenshots.length > 0 && (
          <section className="py-20 bg-gradient-to-b from-background to-primary/5">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                  See FastNow in Action
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Get a preview of the beautiful, intuitive interface that makes fasting simple and effective.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {featureScreenshots.slice(0, 6).map((screenshot) => (
                  <div key={screenshot.id} className="group">
                    <Card className="overflow-hidden border-0 bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-sm hover:shadow-2xl hover:scale-[1.02] transition-all duration-500">
                      <CardContent className="p-0">
                        <FeatureScreenshotMockup
                          imageUrl={screenshot.image_url}
                          altText={screenshot.title}
                          featureKey={screenshot.feature_key}
                        />
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Blog Posts Section */}
        {latestBlogPosts.length > 0 && (
          <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                  Latest Insights
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Stay updated with the latest research, tips, and success stories from the fasting community.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {latestBlogPosts.map((post) => (
                  <Card key={post.id} className="group overflow-hidden border-0 bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-sm hover:shadow-2xl hover:scale-[1.02] transition-all duration-500">
                    {post.featuredImage && (
                      <div className="aspect-video overflow-hidden">
                        <LazyImage
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardContent className="p-6">
                      <CardHeader className="p-0 mb-4">
                        <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </CardTitle>
                        {post.excerpt && (
                          <CardDescription className="line-clamp-3 text-sm">
                            {post.excerpt}
                          </CardDescription>
                        )}
                      </CardHeader>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{post.author}</span>
                        {post.publishedAt && (
                          <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-primary/10 via-primary/5 to-background">
          <div className="container mx-auto px-4">
            <CouponOptInSection />
          </div>
        </section>

      </main>
    </PageLayout>
  );
};

export default Index;