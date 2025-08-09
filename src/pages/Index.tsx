
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import PageLayout from '@/components/layout/PageLayout';
import { pageContentService } from '@/services/PageContentService';
import { BackgroundImageService } from '@/services/BackgroundImageService';

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
  
  // State for custom UI elements
  const [customElementsImages, setCustomElementsImages] = useState<{[key: string]: string | null}>({
    background3d: null
  });
  
  const [showDefaultDesign, setShowDefaultDesign] = useState(true);
  const [googlePlayLink, setGooglePlayLink] = useState('https://play.google.com');
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string>('/lovable-uploads/068e5770-2c00-4164-a0e8-9df5eb13b422.png');

  // Load content from database and localStorage
  useEffect(() => {
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

    // Load database content
    loadContent();

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
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
      </Helmet>
      
      {/* Hero Background Image */}
      <div className="absolute inset-0 w-full h-screen z-0">
        <img 
          src={backgroundImageUrl} 
          alt="Hero background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
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
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Content Section - Left aligned */}
              <div className="text-left">
                <div className="backdrop-blur-sm bg-black/20 rounded-xl p-8 border border-white/10">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-white drop-shadow-lg">
                    {heroTitle}
                  </h1>
                  <div className="text-xl sm:text-2xl md:text-3xl text-white/90 mb-6 drop-shadow-md">
                    {heroSubtitle}
                  </div>
                  
                  <div className="text-lg md:text-xl text-white/80 mb-8 max-w-lg">
                    <p className="drop-shadow-md">
                      {heroDescription}
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-start">
                  <Button asChild size="lg" className="text-lg px-8 py-4 bg-accent-green hover:bg-accent-green-dark text-white font-semibold shadow-lg">
                    <a href={ctaUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                      {ctaText}
                      <ArrowRight size={18} />
                    </a>
                  </Button>
                </div>
              </div>
              
              {/* Empty space on the right for visual balance */}
              <div className="hidden lg:block"></div>
            </div>
          </div>
        </section>

        {/* Second Section - This Isn't for Fitness Models */}
        <section className="relative z-10 min-h-screen flex items-center justify-end">
          {/* Background Image */}
          <div className="absolute inset-0 w-full h-full z-0">
            <img 
              src="/lovable-uploads/a8e0ce55-c025-4334-8015-d5d1387ec222.png" 
              alt="Professional background" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
          
          <div className="container max-w-6xl mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Empty space on the left for visual balance */}
              <div className="hidden lg:block"></div>
              
              {/* Content Section - Right aligned */}
              <div className="text-left lg:text-left">
                <div className="backdrop-blur-sm bg-black/20 rounded-xl p-8 border border-white/10">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white drop-shadow-lg">
                    This Isn't for Fitness Models
                  </h2>
                  
                  <div className="text-lg md:text-xl text-white/90 mb-6 space-y-4 drop-shadow-md max-w-2xl">
                    <p>
                      Most weight loss ads feature people in perfect shape, selling programs they "used" to get there. That's not this.
                    </p>
                    
                    <p>
                      This is for regular people who are tired of being overweight. Maybe you want to walk into a store and buy clothes off the rack. Maybe you're tired of airline seats feeling too small. Maybe a blood test woke you up. Or maybe you've simply noticed you blend into the crowd in a way you didn't before.
                    </p>
                    
                    <p>
                      You don't need a six-pack. You just need to turn the ship around.
                    </p>
                    
                    <p>
                      Over 90 days, this protocol gives you the momentum to move in a better direction—fast. After that, if you want to chase the perfect body, that's up to you. But if you want to get back to feeling good in your own skin, this is where you start.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Third Section - Nothing New — And That’s the Point */}
        <section className="relative z-10 min-h-screen flex items-center justify-start">
          <div className="absolute inset-0 w-full h-full z-0">
            <img
              src="/lovable-uploads/87fe5607-71f6-4021-a8d3-5bfd5f42b6ad.png"
              alt="Structured, minimal approach background"
              loading="lazy"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50"></div>
          </div>

          <div className="container max-w-6xl mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Content - Left aligned */}
              <div className="text-left">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white drop-shadow-lg">
                  Nothing New — And That’s the Point
                </h2>

                <div className="text-lg md:text-xl text-white/90 mb-6 space-y-4 drop-shadow-md max-w-2xl">
                  <p>
                    If you’ve tried losing weight before, you’ve already heard most of what’s in this program. That’s exactly the problem — there’s too much information.
                  </p>
                  <p>
                    This is a stripped-down, 3-step path for a fixed period of time. It’s the sweet spot between doing just enough and getting the maximum benefit. Simple enough to fit into daily life, structured enough to keep you moving, and powerful enough to deliver results — if you follow through.
                  </p>
                  <p>
                    There’s no magic here. Just logic, math, action, and reaction.
                  </p>
                </div>
              </div>

              {/* Spacer on right for balance */}
              <div className="hidden lg:block"></div>
            </div>
          </div>
        </section>


      </main>
    </PageLayout>
  );
};

export default Index;
