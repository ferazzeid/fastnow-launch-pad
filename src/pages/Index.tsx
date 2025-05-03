
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppStoreButton } from '@/components/AppStoreButton';
import { GooglePlayButton } from '@/components/GooglePlayButton';
import { FeatureItem } from '@/components/FeatureItem';
import { SpeedIcon, SecurityIcon, IntuitiveIcon } from '@/components/icons/FeatureIcons';
import { AppMockup } from '@/components/AppMockup';
import { Icons } from '@/components/icons/IconSelector';
import { Helmet } from 'react-helmet-async';

const Index = () => {
  // State for dynamic content
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [mockupUrl, setMockupUrl] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState<number>(300);
  const [imageAlt, setImageAlt] = useState<string>('Fasting app interface preview');
  const [heroTitle, setHeroTitle] = useState('Get things done,\nfaster than ever.');
  const [heroSubtitle, setHeroSubtitle] = useState('The minimalist fasting app designed to streamline your fasting journey and boost your health in days.');
  const [ctaTitle, setCtaTitle] = useState('Ready to start your fasting journey?');
  const [ctaSubtitle, setCtaSubtitle] = useState('Download fastnow.app today and transform your health through fasting.');
  const [featuresTitle, setFeaturesTitle] = useState('Why choose fastnow.app?');
  const [metaTitle, setMetaTitle] = useState('fastnow.app - Intermittent Fasting Made Simple');
  const [metaDescription, setMetaDescription] = useState('Track your fasting periods with our minimalist, intuitive app. Download fastnow.app today and transform your health through fasting.');
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
    },
    {
      title: "Simple Design", 
      description: "Minimal learning curve with our clean, user-friendly design.",
      iconName: "IntuitiveIcon"
    }
  ]);
  
  const [appStoreLink, setAppStoreLink] = useState('https://apps.apple.com');
  const [googlePlayLink, setGooglePlayLink] = useState('https://play.google.com');

  // Load content from localStorage on component mount
  useEffect(() => {
    // Logo
    const savedLogoUrl = localStorage.getItem('fastingApp_logoUrl');
    if (savedLogoUrl) setLogoUrl(savedLogoUrl);
    
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
    if (savedHeroTitle) setHeroTitle(savedHeroTitle);
    
    const savedHeroSubtitle = localStorage.getItem('fastingApp_heroSubtitle');
    if (savedHeroSubtitle) setHeroSubtitle(savedHeroSubtitle);
    
    // CTA content
    const savedCtaTitle = localStorage.getItem('fastingApp_ctaTitle');
    if (savedCtaTitle) setCtaTitle(savedCtaTitle);
    
    const savedCtaSubtitle = localStorage.getItem('fastingApp_ctaSubtitle');
    if (savedCtaSubtitle) setCtaSubtitle(savedCtaSubtitle);
    
    // Features
    const savedFeaturesTitle = localStorage.getItem('fastingApp_featuresTitle');
    if (savedFeaturesTitle) setFeaturesTitle(savedFeaturesTitle);
    
    const savedFeatures = localStorage.getItem('fastingApp_features');
    if (savedFeatures) {
      setFeatures(JSON.parse(savedFeatures));
    }
    
    // App store links
    const savedAppStoreLink = localStorage.getItem('fastingApp_appStoreLink');
    if (savedAppStoreLink) setAppStoreLink(savedAppStoreLink);
    
    const savedGooglePlayLink = localStorage.getItem('fastingApp_googlePlayLink');
    if (savedGooglePlayLink) setGooglePlayLink(savedGooglePlayLink);
    
    // SEO Settings
    const savedMetaTitle = localStorage.getItem('fastingApp_metaTitle');
    if (savedMetaTitle) setMetaTitle(savedMetaTitle);
    
    const savedMetaDescription = localStorage.getItem('fastingApp_metaDescription');
    if (savedMetaDescription) setMetaDescription(savedMetaDescription);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
      </Helmet>
      
      {/* Header */}
      <header className="py-6">
        <div className="container flex justify-between items-center">
          {logoUrl ? (
            <Link to="/">
              <img src={logoUrl} alt="fastnow.app" className="h-8" />
            </Link>
          ) : (
            <div className="text-2xl font-bold">fastnow.app</div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-10 lg:mb-0">
              <h1 className="text-5xl font-bold leading-tight mb-6 animate-fade-in">
                {heroTitle.split('\\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < heroTitle.split('\\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
                <span className="text-primary"></span>
              </h1>
              <h2 className="text-xl text-muted-foreground mb-8 max-w-md">
                {heroSubtitle}
              </h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <AppStoreButton {...(appStoreLink ? { href: appStoreLink } : {})} />
                <GooglePlayButton {...(googlePlayLink ? { href: googlePlayLink } : {})} />
              </div>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              {mockupUrl ? (
                <img 
                  src={mockupUrl} 
                  alt={imageAlt} 
                  className="max-w-full" 
                  style={{ maxWidth: `${imageSize}px` }}
                />
              ) : (
                <AppMockup customSize={imageSize} />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary">
        <div className="container">
          <h3 className="text-3xl font-bold text-center mb-16">{featuresTitle}</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureItem 
                key={index}
                title={feature.title} 
                description={feature.description}
                icon={Icons[feature.iconName as keyof typeof Icons]?.({ className: "w-8 h-8" })} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container text-center">
          <h3 className="text-3xl font-bold mb-4">{ctaTitle}</h3>
          <p className="text-xl text-muted-foreground mb-8 max-w-md mx-auto">
            {ctaSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <AppStoreButton {...(appStoreLink ? { href: appStoreLink } : {})} />
            <GooglePlayButton {...(googlePlayLink ? { href: googlePlayLink } : {})} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-muted-foreground mb-4 md:mb-0">
              © {new Date().getFullYear()} fastnow.app. All rights reserved.
            </div>
            <div className="flex gap-6">
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                Terms of Service
              </Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
