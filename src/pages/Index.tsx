
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Icons } from '@/components/icons/IconSelector';
import { Helmet } from 'react-helmet-async';
import { CeramicTimer } from '@/components/CeramicTimer';
import PageLayout from '@/components/layout/PageLayout';
import { FeatureItem } from '@/components/FeatureItem';

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
  const [heroTitle, setHeroTitle] = useState<string>('My Fasting Protocol for Fat Loss');
  const [heroSubtitle, setHeroSubtitle] = useState<string>('(That Actually Worked)');
  const [heroDescription, setHeroDescription] = useState<string>('After years of trying and failing with generalized advice, I finally followed a specific protocol that worked — and I documented every part of it.\n\nTo help you apply it (or adapt it to your own situation), I built a minimal mobile-friendly app you can use right now:');
  const [ctaText, setCtaText] = useState<string>('Launch App');
  const [ctaUrl, setCtaUrl] = useState<string>('https://go.fastnow.app');
  const [protocolCtaText, setProtocolCtaText] = useState<string>('Read the Complete Protocol');
  const [ctaTitle, setCtaTitle] = useState<string>('Ready to start your fasting journey?');
  const [ctaSubtitle, setCtaSubtitle] = useState<string>('Download fastnow.app today and transform your health through fasting.');
  const [featuresTitle, setFeaturesTitle] = useState<string>('Why choose fastnow.app?');
  const [metaTitle, setMetaTitle] = useState<string>('fastnow.app - Intermittent Fasting Made Simple');
  const [metaDescription, setMetaDescription] = useState<string>('Track your fasting periods with our minimalist, intuitive app. Download fastnow.app today and transform your health through fasting.');
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

  // Load content from localStorage on component mount
  useEffect(() => {
    try {
      // Logo
      const savedLogoUrl = localStorage.getItem('fastingApp_logoUrl');
      if (savedLogoUrl) setLogoUrl(savedLogoUrl);
      
      // Logo Size
      const savedLogoSize = localStorage.getItem('fastingApp_logoSize');
      if (savedLogoSize) setLogoSize(parseInt(savedLogoSize));
      
      // App Image
      const savedMockupUrl = localStorage.getItem('fastingApp_mockupUrl');
      if (savedMockupUrl) setMockupUrl(savedMockupUrl);

      // Image Size
      const savedImageSize = localStorage.getItem('fastingApp_imageSize');
      if (savedImageSize) setImageSize(parseInt(savedImageSize));
      
      // Image Alt Text
      const savedImageAlt = localStorage.getItem('fastingApp_imageAlt');
      if (savedImageAlt) setImageAlt(savedImageAlt);
      
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
      
      const savedProtocolCtaText = localStorage.getItem('fastingApp_homepageProtocolCtaText');
      if (savedProtocolCtaText && typeof savedProtocolCtaText === 'string') setProtocolCtaText(savedProtocolCtaText);
      
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
        <div className="container">
          <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12">
            {/* Content Section */}
            <div className="w-full lg:w-1/2 order-2 lg:order-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 lg:mb-6 leading-tight">
                {heroTitle}{' '}
                <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl">{heroSubtitle}</span>
              </h1>
              
              <div className="prose prose-lg max-w-none text-gray-600 dark:text-gray-300 mb-6 lg:mb-8">
                {heroDescription.split('\n').map((paragraph, index) => (
                  paragraph.trim() && (
                    <p key={index} className="text-base md:text-lg lg:text-xl mb-4">
                      {paragraph}
                    </p>
                  )
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-start mb-8">
                <Button asChild size="lg" className="text-base lg:text-lg px-6 lg:px-8 py-3 lg:py-4">
                  <a href={ctaUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    {ctaText}
                    <ArrowRight size={16} />
                  </a>
                </Button>
              </div>
              
              <div>
                <h3 className="text-lg lg:text-xl font-semibold mb-4">Want to See the Full Protocol First?</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm lg:text-base">
                  Before you try the app, you can read exactly what I did — including how I structured the fast, how I transitioned to calorie control, and what actually worked:
                </p>
                <Button asChild variant="outline" size="lg">
                  <Link to="/fastnow-protocol">{protocolCtaText}</Link>
                </Button>
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

    </PageLayout>
  );
};

export default Index;
