import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { SEOService, SEOConfig, BreadcrumbItem } from '@/services/SEOService';

interface SEOHeadProps {
  config: SEOConfig;
  breadcrumbs?: BreadcrumbItem[];
  structuredData?: any[];
  children?: React.ReactNode;
}

const SEOHead: React.FC<SEOHeadProps> = ({ 
  config, 
  breadcrumbs = [], 
  structuredData = [],
  children 
}) => {
  const [seoConfig, setSeoConfig] = useState<SEOConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSEOConfig = async () => {
      try {
        const generatedConfig = await SEOService.generateSEOConfig(config);
        setSeoConfig(generatedConfig);
      } catch (error) {
        console.error('Error loading SEO config:', error);
        // Fallback to original config
        setSeoConfig(config);
      } finally {
        setIsLoading(false);
      }
    };

    loadSEOConfig();
  }, [config]);

  if (isLoading || !seoConfig) {
    return null; // Don't render meta tags until config is loaded
  }

  const robots = SEOService.generateRobots(seoConfig);

  // Generate structured data schemas
  const schemas = [];
  
  if (breadcrumbs.length > 0) {
    schemas.push(SEOService.generateBreadcrumbSchema(breadcrumbs));
  }
  
  if (seoConfig.type === 'article') {
    schemas.push(SEOService.generateArticleSchema(seoConfig));
  } else if (seoConfig.type === 'product') {
    schemas.push(SEOService.generateProductSchema(seoConfig));
  }
  
  // Add custom structured data
  schemas.push(...structuredData);

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{seoConfig.title}</title>
      <meta name="description" content={seoConfig.description} />
      <meta name="keywords" content={seoConfig.keywords} />
      <meta name="author" content={seoConfig.author} />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={seoConfig.canonical} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={seoConfig.title} />
      <meta property="og:description" content={seoConfig.description} />
      <meta property="og:image" content={seoConfig.image} />
      <meta property="og:url" content={seoConfig.url} />
      <meta property="og:type" content={seoConfig.type} />
      <meta property="og:site_name" content="FastNow" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoConfig.title} />
      <meta name="twitter:description" content={seoConfig.description} />
      <meta name="twitter:image" content={seoConfig.image} />
      
      {/* Article Meta Tags */}
      {seoConfig.publishedTime && (
        <meta property="article:published_time" content={seoConfig.publishedTime} />
      )}
      {seoConfig.modifiedTime && (
        <meta property="article:modified_time" content={seoConfig.modifiedTime} />
      )}
      {seoConfig.category && (
        <meta property="article:section" content={seoConfig.category} />
      )}
      {seoConfig.tags && seoConfig.tags.map(tag => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}
      
      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#6366F1" />
      <meta name="msapplication-TileColor" content="#6366F1" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      
      {/* Preload Critical Resources */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link 
        rel="preload" 
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&display=swap" 
        as="style"
      />
      
      {/* Structured Data */}
      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
      
      {/* Custom children */}
      {children}
    </Helmet>
  );
};

export default SEOHead;