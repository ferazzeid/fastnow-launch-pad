
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
import InstallPWA from '@/components/home/InstallPWA';
import InlineFAQ from '@/components/home/InlineFAQ';
import ProtocolContent from '@/components/home/ProtocolContent';
import AboutMeSection from '@/components/home/AboutMeSection';
import FAQFull from '@/components/home/FAQFull';
import AboutAppSections from '@/components/home/AboutAppSections';

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
  const [heroTitle, setHeroTitle] = useState<string>('Fat Loss App for Real People: The Protocol That Cuts Through the Noise');
  const [heroSubtitle, setHeroSubtitle] = useState<string>("Transform your body with a concentrated, results-driven weight loss protocol—built for everyday people, not fitness models.");
  const [heroDescription, setHeroDescription] = useState<string>('If you\'ve been gaining weight through normal life and you\'re done with fad diets, overcomplicated routines, or "influencer" gimmicks—this protocol is for you. FastNow is the distilled essence of what truly works for sustainable fat loss: three clear steps, rigorously tested and refined through real experience.<br><br>This isn\'t about shortcuts or starving yourself. It\'s about focusing on what actually delivers results, cutting out all the distractions, and helping you take real, daily action for lasting change.<br><br>I built this app after trying everything myself—and finally succeeding. It\'s designed for those who want maximum progress from honest effort, without wasting time on noise.<br><br>If you\'re ready to make a real change, with a protocol that actually works—start here.');
  const [ctaText, setCtaText] = useState<string>('Download FastNow');
  const [ctaUrl, setCtaUrl] = useState<string>('#');
  const [appStoreUrl, setAppStoreUrl] = useState<string>('');
  const [playStoreUrl, setPlayStoreUrl] = useState<string>('');
  
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
      
      // App store links from Admin General settings
      const generalSettings = localStorage.getItem('fastingApp_generalSettings');
      if (generalSettings) {
        try {
          const parsed = JSON.parse(generalSettings);
          if (parsed.appStoreUrl) setAppStoreUrl(parsed.appStoreUrl);
          if (parsed.playStoreUrl) setPlayStoreUrl(parsed.playStoreUrl);
        } catch (e) {
          console.error('Error parsing general settings:', e);
        }
      }

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
                 <p className="text-base md:text-lg lg:text-xl mb-4" dangerouslySetInnerHTML={{ __html: heroDescription }}>
                 </p>
               </div>
              
              <div className="flex flex-col gap-4 justify-start mb-6">
                <Button asChild size="lg" className="text-base lg:text-lg px-6 lg:px-8 py-3 lg:py-4">
                  <a href={ctaUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    {ctaText}
                    <ArrowRight size={16} />
                  </a>
                </Button>
                {(appStoreUrl || playStoreUrl) && (
                  <div className="flex flex-wrap gap-3">
                    {appStoreUrl && <AppStoreButton href={appStoreUrl} />}
                    {playStoreUrl && <GooglePlayButton href={playStoreUrl} />}
                  </div>
                )}
              </div>
            </div>
            
            {/* Image Section - Hidden on mobile */}
            <div className="hidden lg:flex w-full lg:w-1/2 order-1 lg:order-2 justify-center">
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
      {/* Consolidated sections */}
      <ProtocolContent />
      <AboutMeSection />
      <FAQFull />
      <AboutAppSections />

      <InstallPWA />
    </PageLayout>
  );
};

export default Index;
