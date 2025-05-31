
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GooglePlayButton } from '@/components/GooglePlayButton';
import { Icons } from '@/components/icons/IconSelector';
import { Helmet } from 'react-helmet-async';
import CircularTimer from '@/components/CircularTimer';
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
  const [heroTitle, setHeroTitle] = useState<string>('Get things done,\nfaster than ever.');
  const [heroSubtitle, setHeroSubtitle] = useState<string>('The minimalist fasting app designed to streamline your fasting journey and boost your health in days.');
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
      const savedHeroTitle = localStorage.getItem('fastingApp_heroTitle');
      if (savedHeroTitle && typeof savedHeroTitle === 'string') setHeroTitle(savedHeroTitle);
      
      const savedHeroSubtitle = localStorage.getItem('fastingApp_heroSubtitle');
      if (savedHeroSubtitle && typeof savedHeroSubtitle === 'string') setHeroSubtitle(savedHeroSubtitle);
      
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
      <section className="py-20 relative z-10">
        <div className="container">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-10 lg:mb-0">
              <h1 className="text-5xl font-bold leading-tight mb-6 animate-fade-in text-mint-600">
                {renderHeroTitle()}
                <span className="text-primary"></span>
              </h1>
              <h2 className="text-xl text-mint-500 mb-8 max-w-md">
                {heroSubtitle}
              </h2>
              <div className="flex justify-start mt-10">
                <GooglePlayButton {...(googlePlayLink ? { href: googlePlayLink } : {})} />
              </div>
            </div>
            <div className="lg:w-1/2 flex justify-center items-center">
              <div className="relative">
                {mockupUrl ? (
                  <img 
                    src={mockupUrl} 
                    alt={imageAlt} 
                    className="max-w-full relative z-10" 
                    style={{ maxWidth: `${imageSize}px` }}
                  />
                ) : (
                  <div className="relative flex justify-center items-center">
                    <CircularTimer 
                      size={320} 
                      progress={30}
                      className="mb-10"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Updated to show only two features */}
      <section className="py-20 bg-cream-50">
        <div className="container">
          <h3 className="text-3xl font-bold text-center mb-16 text-mint-600">{featuresTitle}</h3>
          <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            {features.slice(0, 2).map((feature, index) => {
              const IconComponent = Icons[feature.iconName as keyof typeof Icons];
              return (
                <FeatureItem
                  key={index}
                  title={feature.title}
                  description={feature.description}
                  icon={IconComponent ? IconComponent({ className: "w-12 h-12" }) : null}
                />
              );
            })}
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Index;
