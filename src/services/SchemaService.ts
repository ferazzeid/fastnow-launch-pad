import { SiteSettingsService } from './SiteSettingsService';

export class SchemaService {
  // Get organization data from site settings
  static async getOrganizationData() {
    try {
      const settings = await SiteSettingsService.getAllSettings();
      return {
        name: settings.site_name || 'FastNow',
        description: settings.site_description || 'The FastNow app and protocol for effective fasting and weight loss',
        url: settings.site_url || 'https://fastnow.app',
        email: settings.contact_email || 'hello@fastnow.app',
        foundingDate: settings.founding_date || '2024',
        sameAs: [
          settings.twitter_url,
          settings.facebook_url,
          settings.linkedin_url,
          settings.instagram_url
        ].filter(Boolean)
      };
    } catch (error) {
      console.error('Error getting organization data:', error);
      return {
        name: 'FastNow',
        description: 'The FastNow app and protocol for effective fasting and weight loss',
        url: 'https://fastnow.app',
        email: 'hello@fastnow.app',
        foundingDate: '2024',
        sameAs: []
      };
    }
  }

  // Generate Organization schema
  static async generateOrganizationSchema() {
    const orgData = await this.getOrganizationData();
    
    return {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": orgData.name,
      "description": orgData.description,
      "url": orgData.url,
      "email": orgData.email,
      "foundingDate": orgData.foundingDate,
      "sameAs": orgData.sameAs,
      "logo": {
        "@type": "ImageObject",
        "url": `${orgData.url}/favicon.ico`
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "email": orgData.email,
        "contactType": "customer service"
      }
    };
  }

  // Generate SoftwareApplication schema for the app
  static async generateSoftwareApplicationSchema() {
    const orgData = await this.getOrganizationData();
    
    return {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "FastNow App",
      "applicationCategory": "HealthApplication",
      "description": "The FastNow app helps you track fasting periods, manage your diet, and follow the proven FastNow Protocol for sustainable weight loss through strategic fasting and calorie control.",
      "operatingSystem": ["iOS", "Android", "Web"],
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "provider": {
        "@type": "Organization",
        "name": orgData.name,
        "url": orgData.url
      },
      "featureList": [
        "Fasting timer and tracking",
        "Calorie counting and management",
        "3-phase protocol guidance",
        "Daily walking goals",
        "Progress tracking and analytics",
        "Educational content and tips"
      ],
      "screenshot": [
        `${orgData.url}/lovable-uploads/app-screenshot-1.png`,
        `${orgData.url}/lovable-uploads/app-screenshot-2.png`,
        `${orgData.url}/lovable-uploads/app-screenshot-3.png`
      ]
    };
  }

  // Generate HowTo schema for the protocol
  static generateHowToSchema(protocolData: any) {
    return {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": protocolData.title || "The FastNow Protocol",
      "description": protocolData.metaDescription || "Learn how to lose fat with a 3-day fast plus calorie control using the FastNow Protocol",
      "totalTime": "P90D", // 90 days
      "estimatedCost": {
        "@type": "MonetaryAmount",
        "currency": "USD",
        "value": "0"
      },
      "supply": [
        {
          "@type": "HowToSupply",
          "name": "Water"
        },
        {
          "@type": "HowToSupply", 
          "name": "Black coffee (optional)"
        },
        {
          "@type": "HowToSupply",
          "name": "Calorie tracking app or journal"
        }
      ],
      "step": [
        {
          "@type": "HowToStep",
          "name": "Phase 1: 3-Day Initiation Water Fast",
          "text": "Complete a 60-hour water fast to flip the fat-burning switch (ketosis), break the carb/insulin cycle, and set the stage for Phase 2. Drink water and black coffee only. No food.",
          "image": protocolData.phase1?.image
        },
        {
          "@type": "HowToStep",
          "name": "Phase 2: Strict Simple Diet", 
          "text": "Follow a strict calorie deficit diet (1500 calories or 2000 if walking 90 minutes) with ≤30g net carbs/day for 30-60 days minimum. Track every single thing you eat.",
          "image": protocolData.phase2?.image
        },
        {
          "@type": "HowToStep",
          "name": "Phase 3: Daily Walking",
          "text": "Walk 90 minutes every day (non-negotiable) to burn approximately 500 calories, improve mood, maintain stable energy, and ensure consistency.",
          "image": protocolData.phase3?.image
        }
      ],
      "result": {
        "@type": "Thing",
        "name": "Sustainable fat loss of approximately 1kg per week"
      }
    };
  }

  // Generate FAQPage schema
  static generateFAQPageSchema(faqs: Array<{question: string; answer: string}>, category: string) {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "name": `Frequently Asked Questions - ${category === 'app' ? 'FastNow App' : 'FastNow Protocol'}`,
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
  }

  // Generate WebSite schema
  static async generateWebSiteSchema() {
    const orgData = await this.getOrganizationData();
    
    return {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": orgData.name,
      "description": orgData.description,
      "url": orgData.url,
      "publisher": {
        "@type": "Organization",
        "name": orgData.name,
        "url": orgData.url
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${orgData.url}/search?q={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    };
  }

  // Helper to inject schema into document head
  static injectSchema(schemaObject: any, id?: string) {
    if (typeof window === 'undefined') return;
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    if (id) script.id = id;
    script.textContent = JSON.stringify(schemaObject);
    document.head.appendChild(script);
  }

  // Helper to remove existing schema
  static removeSchema(id: string) {
    if (typeof window === 'undefined') return;
    
    const existingScript = document.getElementById(id);
    if (existingScript) {
      existingScript.remove();
    }
  }
}