import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock, Utensils, Activity } from 'lucide-react';
import PageLayout from '@/components/layout/PageLayout';
import { pageContentService } from '@/services/PageContentService';
import { BackgroundImageService } from '@/services/BackgroundImageService';
import { supabase } from '@/integrations/supabase/client';
import SiteInfoTooltip from '@/components/SiteInfoTooltip';
import PermanentInfoTooltip from '@/components/PermanentInfoTooltip';
import ImageSlideshow from '@/components/ImageSlideshow';
import { SiteSettingsService } from '@/services/SiteSettingsService';
import { BlogPost } from '@/types/blog';
import { databaseBlogService } from '@/services/DatabaseBlogService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tag } from 'lucide-react';
import { FeatureScreenshotMockup } from '@/components/FeatureScreenshotMockup';
import { FeatureScreenshotService, FeatureScreenshot } from '@/services/FeatureScreenshotService';
import { CeramicPlate } from '@/components/CeramicPlate';
import { HomepagePhaseCard } from '@/components/HomepagePhaseCard';
import SEOHead from '@/components/SEOHead';
import LazyImage from '@/components/LazyImage';

// Helper function to get custom UI element image
const getCustomElementImage = (elementId: string): string | null => {
  try {
    const customElements = localStorage.getItem('fastingApp_customElements');
    if (customElements) {
      const elements = JSON.parse(customElements);
      const element = elements.find((el: any) => el.id === elementId);
      if (element && element.imageUrl) {
        return element.imageUrl;
      }
    }
    return null;
  } catch (error) {
    console.error("Error getting custom element image:", error);
    return null;
  }
};

const Index = () => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoSize, setLogoSize] = useState<number>(32);
  const [mockupUrl, setMockupUrl] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState<number>(300);
  const [imageAlt, setImageAlt] = useState<string>('Fasting app interface preview');
  const [heroTitle, setHeroTitle] = useState<string>('My Protocol for Fat Loss');
  const [heroSubtitle, setHeroSubtitle] = useState<string>('Transform your body with our scientifically-backed fasting approach');
  const [heroDescription, setHeroDescription] = useState<string>('Discover the power of intermittent fasting with our comprehensive timeline and personalized guidance.');
  const [ctaText, setCtaText] = useState<string>('Download FastNow');
  const [ctaUrl, setCtaUrl] = useState<string>('#');
  const [ctaTitle, setCtaTitle] = useState<string>('Ready to start your fasting journey?');
  const [ctaSubtitle, setCtaSubtitle] = useState<string>('Download fastnow.app today and transform your health through fasting.');
  const [metaTitle, setMetaTitle] = useState<string>('FastNow - My Protocol for Fat Loss');
  const [metaDescription, setMetaDescription] = useState<string>('Transform your body with scientifically-backed intermittent fasting protocols and personalized guidance.');
  
  // Hero side image settings
  const [sideImageUrl, setSideImageUrl] = useState<string>('');
  const [sideImageAlignment, setSideImageAlignment] = useState<'top' | 'center' | 'bottom'>('center');
  const [sideImageWidth, setSideImageWidth] = useState<number>(25);
  
  // Content for slides 2, 3, and 4
  const [slide2Title, setSlide2Title] = useState<string>('This Isn\'t for Fitness Models');
  const [slide2Content, setSlide2Content] = useState<string>('Most weight loss ads feature people in perfect shape, selling programs they "used" to get there. That\'s not this.\n\nThis is for regular people who are tired of being overweight. Maybe you want to walk into a store and buy clothes off the rack. Maybe you\'re tired of airline seats feeling too small. Maybe a blood test woke you up. Or maybe you\'ve simply noticed you blend into the crowd in a way you didn\'t before.\n\nYou don\'t need a six-pack. You just need to turn the ship around.\n\nOver 90 days, this protocol gives you the momentum to move in a better direction—fast. After that, if you want to chase the perfect body, that\'s up to you. But if you want to get back to feeling good in your own skin, this is where you start.');
  const [slide3Title, setSlide3Title] = useState<string>('Nothing New — And That\'s the Point');
  const [slide3Content, setSlide3Content] = useState<string>('If you\'ve tried losing weight before, you\'ve already heard most of what\'s in this program. That\'s exactly the problem — there\'s too much information.\n\nThis is a stripped-down, 3-step path for a fixed period of time. It\'s the sweet spot between doing just enough and getting the maximum benefit. Simple enough to fit into daily life, structured enough to keep you moving, and powerful enough to deliver results — if you follow through.\n\nThere\'s no magic here. Just logic, math, action, and reaction.');
  const [slide4Title, setSlide4Title] = useState<string>('New Slide');
  const [slide4Content, setSlide4Content] = useState<string>('');
  const [featuredImageUrl, setFeaturedImageUrl] = useState<string>('');
  const [slide2ImageUrl, setSlide2ImageUrl] = useState<string>('');
  const [slide3ImageUrl, setSlide3ImageUrl] = useState<string>('');
  const [slide4ImageUrl, setSlide4ImageUrl] = useState<string>('');
  const [launchButtonColor, setLaunchButtonColor] = useState<string>('#6366F1');
  
  // Phase images state
  const [phaseImages, setPhaseImages] = useState({
    phase1: '',
    phase2: '',
    phase3: ''
  });
  
  // State for custom UI elements
  const [customElementsImages, setCustomElementsImages] = useState<{[key: string]: string | null}>({
    background3d: null
  });
  
  const [showDefaultDesign, setShowDefaultDesign] = useState(true);
  const [googlePlayLink, setGooglePlayLink] = useState('https://play.google.com');
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string>('');
  
  // Latest blog posts state
  const [latestBlogPosts, setLatestBlogPosts] = useState<BlogPost[]>([]);
  const [featureScreenshots, setFeatureScreenshots] = useState<FeatureScreenshot[]>([]);
  const [aboutAppPageContent, setAboutAppPageContent] = useState<any>(null);

  // Load content from database and localStorage
  useEffect(() => {
    // Load latest blog posts
    const loadBlogPosts = async () => {
      try {
        const allPosts = await databaseBlogService.getAllPosts();
        const publishedPosts = allPosts.filter(post => post.status === 'published');
        const sortedPosts = publishedPosts
          .sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime());
        setLatestBlogPosts(sortedPosts.slice(0, 3));
      } catch (error) {
        console.error('Error loading blog posts:', error);
      }
    };

    // Load feature screenshots and about app content
    const loadFeatureScreenshots = async () => {
      try {
        const [screenshots, aboutContent] = await Promise.all([
          FeatureScreenshotService.getFeatureScreenshots(),
          pageContentService.getPageContent('about-fastnow-app')
        ]);
        setFeatureScreenshots(screenshots);
        setAboutAppPageContent(aboutContent);
      } catch (error) {
        console.error('Error loading feature screenshots:', error);
      }
    };

    const loadPhaseImages = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('setting_key, setting_value')
          .in('setting_key', ['protocol_phase1_intro_image', 'protocol_phase2_intro_image', 'protocol_phase3_intro_image']);

        if (error) throw error;

        const settings = data?.reduce((acc, item) => {
          const value = item.setting_value;
          try {
            acc[item.setting_key] = typeof value === 'string' ? JSON.parse(value || '""') : String(value || '');
          } catch {
            acc[item.setting_key] = String(value || '');
          }
          return acc;
        }, {} as Record<string, string>) || {};

        setPhaseImages({
          phase1: settings.protocol_phase1_intro_image || '',
          phase2: settings.protocol_phase2_intro_image || '',
          phase3: settings.protocol_phase3_intro_image || ''
        });
      } catch (error) {
        console.error('Error loading phase images:', error);
      }
    };

    const loadContent = async () => {
      try {
        // Check if migration has already been done
        const migrationDone = localStorage.getItem('content_migration_completed');
        
        if (!migrationDone) {
          console.log('Running content migration...');
          await pageContentService.migrateLocalStorageToDatabase();
          localStorage.setItem('content_migration_completed', 'true');
          pageContentService.cleanupLocalStorage();
        }

        // Load homepage content from database
        const homeContent = await pageContentService.getPageContent('home');
        
        if (homeContent) {
          setHeroTitle(homeContent.title || 'My Protocol for Fat Loss');
          setHeroSubtitle(homeContent.subtitle || 'Transform your body with our scientifically-backed fasting approach');
          setHeroDescription(homeContent.content || 'Discover the power of intermittent fasting with our comprehensive timeline and personalized guidance.');
          setCtaText(homeContent.button_text || 'Download FastNow');
          setCtaUrl(homeContent.button_url || '#');
          setMetaTitle(homeContent.meta_title || 'FastNow - My Protocol for Fat Loss');
          setMetaDescription(homeContent.meta_description || 'Transform your body with scientifically-backed intermittent fasting protocols and personalized guidance.');
          setFeaturedImageUrl(homeContent.featured_image_url || '');
        }

        // Load slide 2 content
        const slide2Content = await pageContentService.getPageContent('home-slide2');
        if (slide2Content) {
          setSlide2Title(slide2Content.title || 'This Isn\'t for Fitness Models');
          setSlide2Content(slide2Content.content || 'Most weight loss ads feature people in perfect shape, selling programs they "used" to get there. That\'s not this.\n\nThis is for regular people who are tired of being overweight. Maybe you want to walk into a store and buy clothes off the rack. Maybe you\'re tired of airline seats feeling too small. Maybe a blood test woke you up. Or maybe you\'ve simply noticed you blend into the crowd in a way you didn\'t before.\n\nYou don\'t need a six-pack. You just need to turn the ship around.\n\nOver 90 days, this protocol gives you the momentum to move in a better direction—fast. After that, if you want to chase the perfect body, that\'s up to you. But if you want to get back to feeling good in your own skin, this is where you start.');
          setSlide2ImageUrl(slide2Content.featured_image_url || '');
        }

        // Load slide 3 content  
        const slide3Content = await pageContentService.getPageContent('home-slide3');
        if (slide3Content) {
          setSlide3Title(slide3Content.title || 'Nothing New — And That\'s the Point');
          setSlide3Content(slide3Content.content || 'If you\'ve tried losing weight before, you\'ve already heard most of what\'s in this program. That\'s exactly the problem — there\'s too much information.\n\nThis is a stripped-down, 3-step path for a fixed period of time. It\'s the sweet spot between doing just enough and getting the maximum benefit. Simple enough to fit into daily life, structured enough to keep you moving, and powerful enough to deliver results — if you follow through.\n\nThere\'s no magic here. Just logic, math, action, and reaction.');
          setSlide3ImageUrl(slide3Content.featured_image_url || '');
        }

        // Load slide 4 content  
        const slide4Content = await pageContentService.getPageContent('home-slide4');
        if (slide4Content) {
          setSlide4Title(slide4Content.title || 'New Slide');
          setSlide4Content(slide4Content.content || '');
          setSlide4ImageUrl(slide4Content.featured_image_url || '');
        }

        // Load launch button color from design settings
        const designSettings = await pageContentService.getGeneralSetting('design_colors');
        if (designSettings?.setting_value?.launchButton) {
          setLaunchButtonColor(designSettings.setting_value.launchButton);
        }

        // Load site identity settings for logo
        const siteIdentity = await pageContentService.getGeneralSetting('site_identity');
        if (siteIdentity?.setting_value) {
          const { logoUrl: dbLogoUrl } = siteIdentity.setting_value;
          if (dbLogoUrl) setLogoUrl(dbLogoUrl);
        }

      } catch (error) {
        console.error('Error loading content from database:', error);
      }
    };

    // Load hero side image settings
    const loadHeroSideImage = async () => {
      try {
        const settings = await SiteSettingsService.getSetting('hero_side_image_settings');
        if (settings && typeof settings === 'object') {
          const imageSettings = settings as {
            sideImageUrl?: string;
            imageAlignment?: 'top' | 'center' | 'bottom';
            imageWidth?: number;
          };
          
          setSideImageUrl(imageSettings.sideImageUrl || '');
          setSideImageAlignment(imageSettings.imageAlignment || 'center');
          setSideImageWidth(imageSettings.imageWidth || 25);
        }
      } catch (error) {
        console.error('Error loading hero side image settings:', error);
      }
    };

    // Load database content
    loadBlogPosts();
    loadFeatureScreenshots();
    loadPhaseImages();
    loadContent();
    loadHeroSideImage();

    // Load active background image
    const loadBackgroundImage = async () => {
      try {
        const activeImage = await BackgroundImageService.getActiveImage();
        if (activeImage) {
          setBackgroundImageUrl(activeImage.image_url);
        }
      } catch (error) {
        console.error('Error loading background image:', error);
        // Keep default image if loading fails
      }
    };

    loadBackgroundImage();

    try {
      
      // Hero content
      const savedHeroTitle = localStorage.getItem('fastingApp_homepageHeroTitle');
      if (savedHeroTitle && typeof savedHeroTitle === 'string') setHeroTitle(savedHeroTitle);
      
      const savedHeroSubtitle = localStorage.getItem('fastingApp_homepageHeroSubtitle');
      if (savedHeroSubtitle && typeof savedHeroSubtitle === 'string') setHeroSubtitle(savedHeroSubtitle);
      
      const savedHeroDescription = localStorage.getItem('fastingApp_homepageHeroDescription');
      if (savedHeroDescription && typeof savedHeroDescription === 'string') setHeroDescription(savedHeroDescription);
      
      const savedCtaText = localStorage.getItem('fastingApp_homepageCtaText');
      if (savedCtaText && typeof savedCtaText === 'string') setCtaText(savedCtaText);
      
      const savedCtaUrl = localStorage.getItem('fastingApp_homepageCtaUrl');
      if (savedCtaUrl && typeof savedCtaUrl === 'string') setCtaUrl(savedCtaUrl);
      
      
      // CTA content
      const savedCtaTitle = localStorage.getItem('fastingApp_ctaTitle');
      if (savedCtaTitle && typeof savedCtaTitle === 'string') setCtaTitle(savedCtaTitle);
      
      const savedCtaSubtitle = localStorage.getItem('fastingApp_ctaSubtitle');
      if (savedCtaSubtitle && typeof savedCtaSubtitle === 'string') setCtaSubtitle(savedCtaSubtitle);
      
      // Google Play link
      const savedGooglePlayLink = localStorage.getItem('fastingApp_googlePlayLink');
      if (savedGooglePlayLink && typeof savedGooglePlayLink === 'string') setGooglePlayLink(savedGooglePlayLink);
      
      // SEO Settings
      const savedMetaTitle = localStorage.getItem('fastingApp_metaTitle');
      if (savedMetaTitle && typeof savedMetaTitle === 'string') setMetaTitle(savedMetaTitle);
      
      const savedMetaDescription = localStorage.getItem('fastingApp_metaDescription');
      if (savedMetaDescription && typeof savedMetaDescription === 'string') setMetaDescription(savedMetaDescription);
      
      // Load custom UI elements
      const defaultDesignSetting = localStorage.getItem('fastingApp_showDefaultDesign');
      if (defaultDesignSetting !== null) {
        setShowDefaultDesign(defaultDesignSetting !== 'false');
      }
      
      // Only load background3d custom image
      const background3dImage = getCustomElementImage('background3d');
      if (background3dImage) {
        setCustomElementsImages({
          background3d: background3dImage
        });
      }
    } catch (error) {
      console.error('Error loading localStorage data:', error);
    }
  }, []);

  // Helper function to get the same phone image as About App page
  const getPhoneMockupImage = (): string => {
    return aboutAppPageContent?.button_url || featureScreenshots.find(s => s.feature_key === 'fasting-timer')?.image_url || '';
  };

  // Helper function to safely split hero title
  const renderHeroTitle = () => {
    if (!heroTitle || typeof heroTitle !== 'string') {
      return 'Get things done, faster than ever.';
    }
    
    const lines = heroTitle.split('\\n');
    return lines.map((line, i) => (
      <span key={i}>
        {line}
        {i < lines.length - 1 && <br />}
      </span>
    ));
  };

  return (
    <PageLayout>
      <SEOHead 
        config={{
          title: metaTitle,
          description: metaDescription,
          keywords: "intermittent fasting, weight loss app, fasting protocol, health transformation, FastNow",
          image: featuredImageUrl || '/lovable-uploads/social-share-image.jpg',
          type: 'website',
          url: 'https://fastnow.app'
        }}
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "FastNow",
            "url": "https://fastnow.app",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://fastnow.app/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          },
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "FastNow App",
            "applicationCategory": "HealthApplication",
            "description": "Track fasting, manage diet, and follow proven protocols for weight loss",
            "operatingSystem": ["Web", "iOS", "Android"],
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          }
        ]}
      />
      
      {/* Hero Background Image */}
      {(featuredImageUrl || backgroundImageUrl) && (
        <div className="absolute inset-0 w-full h-screen z-0">
          <LazyImage
            src={featuredImageUrl || backgroundImageUrl} 
            alt="FastNow fasting protocol hero background showcasing transformation journey" 
            className="w-full h-full object-cover"
            priority={true}
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
      )}
      
      {/* Background 3D Element if available */}
      {customElementsImages.background3d && (
        <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
          <img 
            src={customElementsImages.background3d} 
            alt="3D Background" 
            className="w-full h-full object-cover opacity-25"
          />
        </div>
      )}
      
      <main className="flex-1 relative">
        {/* Hero Section */}
        <section className="relative z-10 min-h-screen flex items-center justify-start">
          <div className="container max-w-6xl mx-auto px-4">
            <div className={`flex gap-8 lg:gap-12 items-center ${sideImageUrl ? 'justify-between' : 'justify-center'}`}>
              {/* Content Section - Takes dynamic width based on image setting */}
              <div 
                className="text-left flex-1"
                style={{ 
                  width: sideImageUrl ? `${100 - sideImageWidth}%` : '100%',
                  maxWidth: sideImageUrl ? `${100 - sideImageWidth}%` : '100%'
                }}
              >
                <div className="backdrop-blur-sm bg-black/20 rounded-xl p-8 border border-white/10">
                  <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-white drop-shadow-lg">
                    {heroTitle}
                  </h1>
                  
                  <div className="text-lg md:text-xl text-white/80 mb-8 max-w-lg">
                    <p className="drop-shadow-md">
                      {heroDescription}
                    </p>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-white/20 flex items-center justify-between">
                    <Button 
                      className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 lg:px-8 py-2.5 lg:py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 flex items-center gap-2 hover:shadow-xl hover:scale-105"
                      asChild
                    >
                      <a href={ctaUrl} target="_blank" rel="noopener noreferrer">
                        {ctaText}
                        <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </Button>
                    
                    <SiteInfoTooltip
                      content="After years of struggling with complicated diet plans and fitness programs, I realized that simplicity is key. This protocol combines the most effective elements I've discovered through personal experience and research. It's not about perfection - it's about consistent progress that actually fits into your real life."
                      size="md"
                    />
                  </div>
                </div>
              </div>
              
              {/* Side Image - Takes dynamic width based on setting */}
              {sideImageUrl ? (
                <div 
                  className="hidden lg:block flex-shrink-0" 
                  style={{ 
                    width: `${sideImageWidth}%`,
                    maxWidth: `${sideImageWidth}%`
                  }}
                >
                  <div className={`h-full flex min-h-[70vh] ${
                    sideImageAlignment === 'top' ? 'items-start' : 
                    sideImageAlignment === 'bottom' ? 'items-end' : 
                    'items-center'
                  }`}>
                    <img 
                      src={sideImageUrl}
                      alt="Hero side image"
                      className="w-full h-auto max-h-[80vh] object-cover rounded-lg shadow-2xl"
                    />
                  </div>
                </div>
              ) : (
                /* Empty space for visual balance when no image */
                <div className="hidden lg:block"></div>
              )}
            </div>
          </div>
        </section>

        {/* Second Section - This Isn't for Fitness Models */}
        <section className="relative z-10 min-h-screen flex items-center justify-center pb-0 mb-0">
          <div className="absolute inset-0 w-full h-full z-0 bg-gray-900"></div>
          
          <div className="container max-w-6xl mx-auto px-4 relative z-10">
            <div className={`${slide2ImageUrl ? 'grid lg:grid-cols-2 gap-12 items-center' : 'text-left'}`}>
              {/* Text Content */}
              <div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white">
                  {slide2Title}
                </h2>
                
                <div className="text-lg md:text-xl text-white mb-6 space-y-4 max-w-4xl">
                  {slide2Content.split('\n\n').map((paragraph, index) => (
                    <p key={index}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
              
              {/* Image Content - Only foreground image, no background mirror */}
              {slide2ImageUrl && (
                <div className="hidden lg:block">
                  <img 
                    src={slide2ImageUrl}
                    alt="This isn't for fitness models"
                    className="w-full h-auto rounded-lg shadow-2xl"
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* What About the App Section */}
        <section className="relative z-10 py-16 bg-white">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              {/* Phone mockup - smaller and on the left */}
              <div className="lg:col-span-2 flex justify-center lg:justify-start order-2 lg:order-1">
                <div className="w-28 sm:w-32 lg:w-36">
                  <div className="relative">
                    {/* Simplified phone frame - thinner borders */}
                    <div className="relative bg-gray-800 rounded-[1.5rem] p-1 shadow-xl">
                      <div className="bg-black rounded-[1.25rem] p-0.5">
                        <div className="relative bg-white rounded-[1rem] overflow-hidden aspect-[9/19.5]">
                          {/* Simplified notch */}
                          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-4 bg-black rounded-b-xl z-10"></div>
                          
                          {/* Screenshot content */}
                          <img 
                            src={getPhoneMockupImage()} 
                            alt="FastNow App Screenshot"
                            className="w-full h-full object-cover"
                            loading="eager"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Content - center column */}
              <div className="lg:col-span-7 text-left order-1 lg:order-2">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight text-gray-900">
                  What About the App
                </h2>
                
                <div className="text-lg md:text-xl text-gray-700 mb-8 space-y-4">
                  <p>
                    There's no magic formula for weight loss — just the right formula, done right.
                  </p>
                  <p>
                    The real challenge is discipline and consistent execution for 90 days. You could track it on paper or in your phone's notes, but we've built a tool designed specifically for the FastNow program. Why not see how it can help you succeed?
                  </p>
                </div>
                
                <div className="mt-8 flex gap-4">
                  <Link to="/about-fastnow-app">
                    <Button 
                      className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg font-semibold shadow-lg transition-colors flex items-center gap-2"
                    >
                      Read More
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                  <a 
                    href="https://fastnow.app" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button 
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-4 py-2 rounded-lg font-semibold shadow-lg transition-colors flex items-center gap-2"
                    >
                      Launch App
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </a>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Latest Blog Posts Section */}
        {latestBlogPosts.length > 0 && (
          <section className="relative z-10 py-16 bg-gray-50">
            <div className="container max-w-6xl mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">Latest Insights</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Practical advice and real experiences from the FastNow protocol
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                {latestBlogPosts.map((post) => (
                  <Card key={post.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-accent-green">
                    {post.featuredImage && (
                      <Link to={`/blog/${post.slug}`} className="block">
                        <div className="aspect-video overflow-hidden rounded-t-lg">
                          <img
                            src={post.featuredImage}
                            alt={post.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </Link>
                    )}
                    <CardHeader className="pb-2">
                      <CardTitle className="line-clamp-2 text-lg">
                        <Link 
                          to={`/blog/${post.slug}`}
                          className="hover:text-accent-green transition-colors"
                        >
                          {post.title}
                        </Link>
                      </CardTitle>
                      <CardDescription className="line-clamp-2 text-sm">
                        {post.excerpt}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1 flex-wrap">
                          {post.categories.slice(0, 1).map(category => (
                            <span
                              key={category}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-accent-green/10 text-accent-green"
                            >
                              <Tag className="w-3 h-3" />
                              {category}
                            </span>
                          ))}
                        </div>
                        <Link
                          to={`/blog/${post.slug}`}
                          className="text-accent-green hover:underline text-sm font-medium"
                        >
                          Read More
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="text-center mt-8">
                <Link to="/blog">
                  <Button variant="outline" className="px-8">
                    View All Posts
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Slideshow Section - Aren't you tired of this */}
        <ImageSlideshow />

        {/* Third Section - Why This Is Working */}
        <section className="relative z-10 py-16 bg-white">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center max-w-6xl mx-auto">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-900">
                Why This Is Working
              </h2>

              <div className="text-lg md:text-xl text-gray-700 mb-8 space-y-4">
                {slide3Content.split('\n\n').map((paragraph, index) => (
                  <p key={index}>
                    {paragraph}
                  </p>
                ))}
              </div>
              
              {/* Read More Button - Centered above graphics */}
              <div className="mt-8 mb-12 flex justify-center">
                <Link to="/fast-now-protocol">
                  <Button 
                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg font-semibold shadow-lg transition-colors flex items-center gap-2"
                  >
                    Read More
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
              
              {/* Three Phases Ceramic Plates */}
              <div className="mt-8">
                <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-16 max-w-5xl mx-auto">
                  <HomepagePhaseCard
                    phaseNumber={1}
                    title="3-Day Water Fast"
                    image={phaseImages.phase1}
                  />
                  
                  {/* Plus Sign */}
                  <div className="flex items-center justify-center">
                    <div className="w-8 h-8 flex items-center justify-center text-2xl font-bold text-muted-foreground">
                      +
                    </div>
                  </div>
                  
                  <HomepagePhaseCard
                    phaseNumber={2}
                    title="Strict Simple Diet"
                    image={phaseImages.phase2}
                  />
                  
                  {/* Plus Sign */}
                  <div className="flex items-center justify-center">
                    <div className="w-8 h-8 flex items-center justify-center text-2xl font-bold text-muted-foreground">
                      +
                    </div>
                  </div>
                  
                  <HomepagePhaseCard
                    phaseNumber={3}
                    title="Daily Walking"
                    image={phaseImages.phase3}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Personal Touch Section - Speech Bubble Explanation */}
        <section className="relative z-10 py-16 bg-gray-100">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
              {/* Left Column - Title and Description */}
              <div className="flex flex-col justify-start">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight text-gray-900">
                  Adding a Human Touch
                </h2>
                <p className="text-lg text-gray-600 max-w-xl">
                  Throughout this site, you'll notice little speech bubbles that add personal perspective and real experience to the content.
                </p>
              </div>
              
              {/* Right Column - Permanent Speech Bubble */}
              <div className="flex justify-center lg:justify-start lg:pt-8">
                <div className="relative">
                  <div className="scale-125 transform">
                    <PermanentInfoTooltip 
                      content="I'm trying to integrate these little bubbles where I leave a personal note or perspective on particular topics. Weight loss theory can be quite dry, so it's nice to have a real personal touch from someone who has actually gone through this process."
                      size="lg"
                      className="mx-auto"
                      position="bottom-right"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
    </PageLayout>
  );
};

export default Index;
