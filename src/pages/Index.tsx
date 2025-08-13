import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock, Utensils, Activity } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import PageLayout from '@/components/layout/PageLayout';
import { pageContentService } from '@/services/PageContentService';
import { BackgroundImageService } from '@/services/BackgroundImageService';
import { supabase } from '@/integrations/supabase/client';
import SiteInfoTooltip from '@/components/SiteInfoTooltip';

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

  // Load content from database and localStorage
  useEffect(() => {
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

    // Load database content
    loadPhaseImages();
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
      {(featuredImageUrl || backgroundImageUrl) && (
        <div className="absolute inset-0 w-full h-screen z-0">
          <img 
            src={featuredImageUrl || backgroundImageUrl} 
            alt="Hero background" 
            className="w-full h-full object-cover"
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
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Content Section - Left aligned */}
              <div className="text-left">
                <div className="backdrop-blur-sm bg-black/20 rounded-xl p-8 border border-white/10">
                  <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-white drop-shadow-lg">
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
                  
                  <div className="mt-8 pt-6 border-t border-white/20 flex items-center justify-between">
                    <button 
                      className="text-white px-8 py-4 rounded-lg font-semibold shadow-lg transition-colors flex items-center gap-2"
                      style={{ backgroundColor: launchButtonColor }}
                    >
                      Launch App
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </button>
                    
                    <SiteInfoTooltip
                      content="After years of struggling with complicated diet plans and fitness programs, I realized that simplicity is key. This protocol combines the most effective elements I've discovered through personal experience and research. It's not about perfection - it's about consistent progress that actually fits into your real life."
                      size="md"
                    />
                  </div>
                </div>
              </div>
              
              {/* Empty space on the right for visual balance */}
              <div className="hidden lg:block"></div>
            </div>
          </div>
        </section>

        {/* Second Section - This Isn't for Fitness Models */}
        <section className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="absolute inset-0 w-full h-full z-0 bg-gray-900"></div>
          
          <div className="container max-w-6xl mx-auto px-4 relative z-10">
            <div className="text-left">
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
          </div>
        </section>


        {/* Third Section - Nothing New — And That's the Point */}
        <section className="relative z-10 py-16 bg-white">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-left max-w-4xl">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-900">
                {slide3Title}
              </h2>

              <div className="text-lg md:text-xl text-gray-700 mb-6 space-y-4">
                {slide3Content.split('\n\n').map((paragraph, index) => (
                  <p key={index}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Protocol Phases Section */}
        <section className="py-16 bg-gradient-to-b from-background to-muted/20">
          <div className="container max-w-6xl mx-auto px-4">
            {/* Desktop Layout */}
            <div className="hidden md:flex items-center justify-center gap-8">
              {/* Phase 1 */}
              <div className="flex-1 max-w-sm">
                <div className="bg-card rounded-xl shadow-soft overflow-hidden border-l-4 border-blue-500 text-center min-h-[280px] flex flex-col">
                  {phaseImages.phase1 && (
                    <div className="mb-4 -m-8 mt-0 mx-0">
                      <img 
                        src={phaseImages.phase1} 
                        alt="Phase 1 - Water Fast" 
                        className="w-full h-32 object-cover"
                      />
                    </div>
                  )}
                  <div className="px-8 pb-8 flex flex-col flex-grow">
                    <div className="bg-blue-500/10 p-4 rounded-full inline-flex mb-4 mx-auto">
                      <Clock className="w-8 h-8 text-blue-600" />
                    </div>
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">Phase 1</span>
                    <h3 className="text-xl font-bold mt-3 text-foreground flex-grow">3-Day Initiation Water Fast</h3>
                  </div>
                </div>
              </div>
              
              {/* Plus Icon */}
              <div className="text-4xl font-bold text-muted-foreground">+</div>
              
              {/* Phase 2 */}
              <div className="flex-1 max-w-sm">
                <div className="bg-card rounded-xl shadow-soft overflow-hidden border-l-4 border-orange-500 text-center min-h-[280px] flex flex-col">
                  {phaseImages.phase2 && (
                    <div className="mb-4 -m-8 mt-0 mx-0">
                      <img 
                        src={phaseImages.phase2} 
                        alt="Phase 2 - Diet Control" 
                        className="w-full h-32 object-cover"
                      />
                    </div>
                  )}
                  <div className="px-8 pb-8 flex flex-col flex-grow">
                    <div className="bg-orange-500/10 p-4 rounded-full inline-flex mb-4 mx-auto">
                      <Utensils className="w-8 h-8 text-orange-600" />
                    </div>
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">Phase 2</span>
                    <h3 className="text-xl font-bold mt-3 text-foreground flex-grow">Strict Simple Diet with Daily Calorie Deficit</h3>
                  </div>
                </div>
              </div>
              
              {/* Plus Icon */}
              <div className="text-4xl font-bold text-muted-foreground">+</div>
              
              {/* Phase 3 */}
              <div className="flex-1 max-w-sm">
                <div className="bg-card rounded-xl shadow-soft overflow-hidden border-l-4 border-green-500 text-center min-h-[280px] flex flex-col">
                  {phaseImages.phase3 && (
                    <div className="mb-4 -m-8 mt-0 mx-0">
                      <img 
                        src={phaseImages.phase3} 
                        alt="Phase 3 - Daily Walking" 
                        className="w-full h-32 object-cover"
                      />
                    </div>
                  )}
                  <div className="px-8 pb-8 flex flex-col flex-grow">
                    <div className="bg-green-500/10 p-4 rounded-full inline-flex mb-4 mx-auto">
                      <Activity className="w-8 h-8 text-green-600" />
                    </div>
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">Phase 3</span>
                    <h3 className="text-xl font-bold mt-3 text-foreground flex-grow">Daily Walking</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden space-y-6">
              {/* Phase 1 */}
              <div className="bg-card rounded-xl shadow-soft overflow-hidden border-l-4 border-blue-500">
                {phaseImages.phase1 && (
                  <div className="mb-4 -m-6 mt-0 mx-0">
                    <img 
                      src={phaseImages.phase1} 
                      alt="Phase 1 - Water Fast" 
                      className="w-full h-32 object-cover"
                    />
                  </div>
                )}
                <div className="px-6 pb-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-500/10 p-3 rounded-full">
                      <Clock className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">Phase 1</span>
                      <h3 className="text-lg font-bold mt-2 text-foreground">3-Day Initiation Water Fast</h3>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Plus Icon */}
              <div className="text-center text-2xl font-bold text-muted-foreground">+</div>
              
              {/* Phase 2 */}
              <div className="bg-card rounded-xl shadow-soft overflow-hidden border-l-4 border-orange-500">
                {phaseImages.phase2 && (
                  <div className="mb-4 -m-6 mt-0 mx-0">
                    <img 
                      src={phaseImages.phase2} 
                      alt="Phase 2 - Diet Control" 
                      className="w-full h-32 object-cover"
                    />
                  </div>
                )}
                <div className="px-6 pb-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-orange-500/10 p-3 rounded-full">
                      <Utensils className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">Phase 2</span>
                      <h3 className="text-lg font-bold mt-2 text-foreground">Strict Simple Diet with Daily Calorie Deficit</h3>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Plus Icon */}
              <div className="text-center text-2xl font-bold text-muted-foreground">+</div>
              
              {/* Phase 3 */}
              <div className="bg-card rounded-xl shadow-soft overflow-hidden border-l-4 border-green-500">
                {phaseImages.phase3 && (
                  <div className="mb-4 -m-6 mt-0 mx-0">
                    <img 
                      src={phaseImages.phase3} 
                      alt="Phase 3 - Daily Walking" 
                      className="w-full h-32 object-cover"
                    />
                  </div>
                )}
                <div className="px-6 pb-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-500/10 p-3 rounded-full">
                      <Activity className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">Phase 3</span>
                      <h3 className="text-lg font-bold mt-2 text-foreground">Daily Walking</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why This Is Working Section */}
        <section className="relative z-10 py-16 bg-gray-100">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-left max-w-4xl">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-900">
                Why This Is Working
              </h2>

              <div className="text-lg md:text-xl text-gray-700 mb-6 space-y-4">
                {/* Content will be added later */}
              </div>
            </div>
          </div>
        </section>

      </main>
    </PageLayout>
  );
};

export default Index;
