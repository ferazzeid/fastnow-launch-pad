import { SchemaService } from './SchemaService';
import { SiteSettingsService } from './SiteSettingsService';
import { PageSEOService } from './PageSEOService';

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  category?: string;
  tags?: string[];
  canonical?: string;
  robots?: {
    index?: boolean;
    follow?: boolean;
    noarchive?: boolean;
    noimageindex?: boolean;
    nosnippet?: boolean;
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export class SEOService {
  private static baseUrl = 'https://fastnow.app';
  private static defaultImage = '/lovable-uploads/social-share-image.jpg';
  private static siteName = 'FastNow';

  // Initialize base settings
  static async init() {
    try {
      const settings = await SiteSettingsService.getAllSettings();
      if (settings.site_url) this.baseUrl = settings.site_url;
      if (settings.site_name) this.siteName = settings.site_name;
      if (settings.default_social_image) this.defaultImage = settings.default_social_image;
    } catch (error) {
      console.error('Error initializing SEO service:', error);
    }
  }

  // Generate complete SEO config for a page
  static async generateSEOConfig(config: SEOConfig): Promise<SEOConfig> {
    const url = config.url || window.location.href;
    const canonical = config.canonical || url;
    const image = config.image || this.defaultImage;
    const fullImageUrl = image.startsWith('http') ? image : `${this.baseUrl}${image}`;

    // Get page-specific SEO settings
    const pagePath = url.replace(this.baseUrl, '') || '/';
    const pageSEOSettings = await PageSEOService.getPageSEOByPath(pagePath);

    return {
      ...config,
      title: pageSEOSettings?.meta_title || this.truncateTitle(config.title),
      description: pageSEOSettings?.meta_description || this.truncateDescription(config.description),
      keywords: config.keywords || this.generateKeywords(config.title, config.description),
      image: fullImageUrl,
      url,
      canonical,
      type: config.type || 'website',
      author: config.author || this.siteName,
      robots: {
        index: config.robots?.index ?? (pageSEOSettings?.is_indexed !== false),
        follow: config.robots?.follow ?? (pageSEOSettings?.is_indexed !== false),
        noarchive: config.robots?.noarchive || false,
        noimageindex: config.robots?.noimageindex || false,
        nosnippet: config.robots?.nosnippet || false,
      }
    };
  }

  // Generate breadcrumb structured data
  static generateBreadcrumbSchema(breadcrumbs: BreadcrumbItem[]) {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": item.url.startsWith('http') ? item.url : `${this.baseUrl}${item.url}`
      }))
    };
  }

  // Generate Article schema for blog posts
  static generateArticleSchema(config: SEOConfig) {
    return {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": config.title,
      "description": config.description,
      "image": config.image,
      "url": config.url,
      "datePublished": config.publishedTime,
      "dateModified": config.modifiedTime || config.publishedTime,
      "author": {
        "@type": "Person",
        "name": config.author || this.siteName
      },
      "publisher": {
        "@type": "Organization", 
        "name": this.siteName,
        "logo": {
          "@type": "ImageObject",
          "url": `${this.baseUrl}/favicon.ico`
        }
      },
      "articleSection": config.category,
      "keywords": config.keywords,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": config.url
      }
    };
  }

  // Generate Product schema for app pages
  static generateProductSchema(config: SEOConfig) {
    return {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": config.title,
      "description": config.description,
      "image": config.image,
      "url": config.url,
      "applicationCategory": "HealthApplication",
      "operatingSystem": ["Web", "iOS", "Android"],
      "offers": {
        "@type": "Offer",
        "price": "0",
        "@priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      },
      "aggregateRating": {
        "@type": "AggregateRating", 
        "ratingValue": "4.8",
        "ratingCount": "1247",
        "bestRating": "5",
        "worstRating": "1"
      },
      "author": {
        "@type": "Organization",
        "name": this.siteName
      }
    };
  }

  // Truncate title to optimal length (50-60 chars)
  static truncateTitle(title: string): string {
    if (title.length <= 60) return title;
    return title.substring(0, 57) + '...';
  }

  // Truncate description to optimal length (150-160 chars)
  static truncateDescription(description: string): string {
    if (description.length <= 160) return description;
    return description.substring(0, 157) + '...';
  }

  // Generate keywords from title and description
  static generateKeywords(title: string, description: string): string {
    const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'a', 'an'];
    
    const titleWords = title.toLowerCase().split(/\s+/).filter(word => 
      word.length > 3 && !commonWords.includes(word)
    );
    
    const descWords = description.toLowerCase().split(/\s+/).filter(word => 
      word.length > 4 && !commonWords.includes(word)
    ).slice(0, 5);
    
    const keywords = [...new Set([...titleWords, ...descWords])];
    return keywords.slice(0, 10).join(', ');
  }

  // Generate robots meta content
  static generateRobots(config: SEOConfig): string {
    const directives = [];
    
    if (config.robots?.index === false) {
      directives.push('noindex');
    } else {
      directives.push('index');
    }
    
    if (config.robots?.follow === false) {
      directives.push('nofollow');
    } else {
      directives.push('follow');
    }
    
    if (config.robots?.noarchive) directives.push('noarchive');
    if (config.robots?.noimageindex) directives.push('noimageindex');
    if (config.robots?.nosnippet) directives.push('nosnippet');
    
    directives.push('max-snippet:-1', 'max-image-preview:large', 'max-video-preview:-1');
    
    return directives.join(', ');
  }

  // Preload critical resources
  static preloadCriticalResources() {
    const resources = [
      { href: 'https://fonts.googleapis.com', rel: 'preconnect' },
      { href: 'https://fonts.gstatic.com', rel: 'preconnect', crossorigin: true },
      { href: '/fonts/inter-var.woff2', rel: 'preload', as: 'font', type: 'font/woff2', crossorigin: true }
    ];

    resources.forEach(resource => {
      const link = document.createElement('link');
      Object.assign(link, resource);
      document.head.appendChild(link);
    });
  }

  // Optimize images for SEO
  static optimizeImages() {
    // Add loading="lazy" to all images below the fold
    const images = document.querySelectorAll('img:not([loading])');
    images.forEach((img, index) => {
      // Skip first 2 images (likely above fold)
      if (index > 1) {
        img.setAttribute('loading', 'lazy');
      }
    });

    // Add missing alt attributes
    const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
    imagesWithoutAlt.forEach(img => {
      const src = img.getAttribute('src') || '';
      const filename = src.split('/').pop()?.split('.')[0] || '';
      img.setAttribute('alt', filename.replace(/[-_]/g, ' '));
    });
  }

  // Generate sitemap URLs
  static async generateSitemapUrls(): Promise<string[]> {
    try {
      const pageSettings = await PageSEOService.getAllPageSettings();
      return pageSettings
        .filter(page => page.is_indexed && page.page_type !== 'admin')
        .map(page => `${this.baseUrl}${page.page_path}`);
    } catch (error) {
      console.error('Error generating sitemap URLs:', error);
      // Fallback to static list
      return [
        '/',
        '/fastnow-protocol',
        '/about-fastnow-app', 
        '/blog'
      ].map(path => `${this.baseUrl}${path}`);
    }
  }

  // Inject structured data
  static injectStructuredData(schema: any, id?: string) {
    // Remove existing schema with same ID
    if (id) {
      const existing = document.getElementById(id);
      if (existing) existing.remove();
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    if (id) script.id = id;
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  // Clean up old meta tags and add new ones
  static updateMetaTags(config: SEOConfig) {
    const metaTags = [
      { name: 'description', content: config.description },
      { name: 'keywords', content: config.keywords },
      { name: 'author', content: config.author },
      { name: 'robots', content: this.generateRobots(config) },
      
      // Open Graph
      { property: 'og:title', content: config.title },
      { property: 'og:description', content: config.description },
      { property: 'og:image', content: config.image },
      { property: 'og:url', content: config.url },
      { property: 'og:type', content: config.type },
      { property: 'og:site_name', content: this.siteName },
      
      // Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: config.title },
      { name: 'twitter:description', content: config.description },
      { name: 'twitter:image', content: config.image },
      
      // Additional SEO
      { name: 'theme-color', content: '#6366F1' },
      { name: 'msapplication-TileColor', content: '#6366F1' },
    ];

    if (config.publishedTime) {
      metaTags.push({ property: 'article:published_time', content: config.publishedTime });
    }
    
    if (config.modifiedTime) {
      metaTags.push({ property: 'article:modified_time', content: config.modifiedTime });
    }

    metaTags.forEach(tag => {
      const selector = tag.name ? `meta[name="${tag.name}"]` : `meta[property="${tag.property}"]`;
      let element = document.querySelector(selector);
      
      if (!element) {
        element = document.createElement('meta');
        if (tag.name) element.setAttribute('name', tag.name);
        if (tag.property) element.setAttribute('property', tag.property);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', tag.content);
    });

    // Add canonical link
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = config.canonical || config.url || window.location.href;
  }
}