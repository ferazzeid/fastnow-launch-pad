
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Icons } from '@/components/icons/IconSelector';
import { Helmet } from 'react-helmet-async';
import { CeramicTimer } from '@/components/CeramicTimer';
import PageLayout from '@/components/layout/PageLayout';
import { FeatureItem } from '@/components/FeatureItem';
import { pageContentService } from '@/services/PageContentService';
import { AppStoreButton } from '@/components/AppStoreButton';
import { GooglePlayButton } from '@/components/GooglePlayButton';
import PANsExplainer from '@/components/home/PANsExplainer';
import InstallPWA from '@/components/home/InstallPWA';
import InlineFAQ from '@/components/home/InlineFAQ';

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
  const [heroTitle, setHeroTitle] = useState<string>('Real weight loss. Simple fasting protocol.');
  const [heroSubtitle, setHeroSubtitle] = useState<string>("Made for real people who've been overweight too long—ready to act.");
  const [heroDescription, setHeroDescription] = useState<string>('FastNow is a tool that powers a proven, direct 80/20 method. No workouts required. No wellness fluff.');
  const [ctaText, setCtaText] = useState<string>('Download FastNow');
  const [ctaUrl, setCtaUrl] = useState<string>('#');
  
  const [ctaTitle, setCtaTitle] = useState<string>('Ready to start your fasting journey?');
  const [ctaSubtitle, setCtaSubtitle] = useState<string>('Download fastnow.app today and transform your health through fasting.');
  const [featuresTitle, setFeaturesTitle] = useState<string>('Why choose fastnow.app?');
  const [metaTitle, setMetaTitle] = useState<string>('FastNow – Simple Fasting Protocol for Real Weight Loss');
  const [metaDescription, setMetaDescription] = useState<string>('A simple, proven fasting protocol for real people. Not a fitness app—honest, direct, results-focused.');
  const [features, setFeatures] = useState([
    {
      title: "Intermittent Fasting", 
      description: "Easily track your fasting periods with our intuitive timer interface.",
      iconName: "SpeedIcon"
    },
    {
      title: "Private & Secure", 
      description: "Your health data is encrypted and never shared with third parties.",
      iconName: "SecurityIcon"
    }
  ]);
  
  // State for custom UI elements
  const [customElementsImages, setCustomElementsImages] = useState<{[key: string]: string | null}>({
    background3d: null
  });
  
  const [showDefaultDesign, setShowDefaultDesign] = useState(true);
  const [googlePlayLink, setGooglePlayLink] = useState('https://play.google.com');
  const [canonicalUrl, setCanonicalUrl] = useState<string>('');
  const inlineFaqQuestion = 'How do I track progress using clothing fit?';
  const inlineFaqAnswer = 'Choose one pair of jeans or a t-shirt and use it as your reference.\nWear it weekly at the same time of day. Notice how it fits—tighter, same, or looser.\nThis keeps focus on real-world change rather than daily scale swings.';
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
      
      // Features
      const savedFeaturesTitle = localStorage.getItem('fastingApp_featuresTitle');
      if (savedFeaturesTitle && typeof savedFeaturesTitle === 'string') setFeaturesTitle(savedFeaturesTitle);
      
      const savedFeatures = localStorage.getItem('fastingApp_features');
      if (savedFeatures) {
        try {
          const parsedFeatures = JSON.parse(savedFeatures);
          if (Array.isArray(parsedFeatures)) {
            setFeatures(parsedFeatures.slice(0, 2));
          }
        } catch (error) {
          console.error('Error parsing features:', error);
        }
      }
      
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
    setCanonicalUrl(window.location.href);
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
        <link rel="canonical" href={canonicalUrl || undefined} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "FastNow",
            url: canonicalUrl || (typeof window !== 'undefined' ? window.location.origin : ''),
            description: metaDescription,
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: inlineFaqQuestion,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: inlineFaqAnswer
                }
              }
            ]
          })}
        </script>
      </Helmet>
      
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
      
      {/* Hero Section */}
      <section className="py-12 lg:py-20 relative z-10">
        <div className="container max-w-4xl mx-auto">
          <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12">
            {/* Content Section */}
            <div className="w-full lg:w-1/2 order-2 lg:order-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 lg:mb-6 leading-tight">
                {heroTitle}
              </h1>
              <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-6">
                {heroSubtitle}
              </div>
              
              <div className="prose prose-lg max-w-none text-gray-600 dark:text-gray-300 mb-6 lg:mb-8">
                <p className="text-base md:text-lg lg:text-xl mb-4">
                  {heroDescription}
                </p>
              </div>
              
              <div className="flex flex-col gap-4 justify-start mb-6">
                <Button asChild size="lg" className="text-base lg:text-lg px-6 lg:px-8 py-3 lg:py-4">
                  <a href={ctaUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    {ctaText}
                    <ArrowRight size={16} />
                  </a>
                </Button>
                <div className="flex flex-wrap gap-3">
                  <AppStoreButton />
                  <GooglePlayButton />
                </div>
                <p className="text-sm text-muted-foreground">Priced lower than a Starbucks coffee.</p>
              </div>
            </div>
            
            {/* Image Section */}
            <div className="w-full lg:w-1/2 order-1 lg:order-2 flex justify-center">
              <div className="w-full max-w-sm lg:max-w-md">
                {mockupUrl ? (
                  <img 
                    src={mockupUrl} 
                    alt={imageAlt} 
                    className="w-full h-auto object-contain" 
                    style={{ maxWidth: `${imageSize}px` }}
                  />
                ) : (
                  <div className="relative flex justify-center items-center p-8">
                    <CeramicTimer 
                      progress={75}
                      displayTime="23:59"
                      isActive={true}
                      className="scale-110 lg:scale-125"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section aria-labelledby="who-its-for" className="py-12 border-t">
        <div className="container max-w-4xl mx-auto">
          <h2 id="who-its-for" className="text-2xl md:text-3xl font-semibold mb-4">Built for real people ready to act</h2>
          <p className="text-muted-foreground mb-4">If you've been overweight too long and want a simple, direct plan—FastNow is for you.</p>
          <ul className="list-disc pl-6 space-y-2 text-sm md:text-base">
            <li>No workouts required. Not a fitness app.</li>
            <li>Clear, honest guidance—no wellness fluff.</li>
            <li>A tool that powers a proven 80/20 protocol.</li>
          </ul>
        </div>
      </section>

      {/* Contrast section */}
      <section aria-labelledby="not-for" className="py-12">
        <div className="container max-w-4xl mx-auto">
          <h2 id="not-for" className="text-2xl md:text-3xl font-semibold mb-4">This is not for fitness models</h2>
          <p className="text-muted-foreground mb-4">Forget flashy influencer programs. FastNow is simple, grounded, and built for real-world results.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-1">Comfort and simplicity</h3>
              <p className="text-sm text-muted-foreground">Straightforward steps that fit daily life.</p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-1">Honest results</h3>
              <p className="text-sm text-muted-foreground">Track progress without hype or guesswork.</p>
            </div>
          </div>
        </div>
      </section>

      <PANsExplainer />
      <InstallPWA />
      <InlineFAQ />

    </PageLayout>
  );
};

export default Index;
