import { SiteSettingsService } from './SiteSettingsService';

export interface OrganizationSchema {
  "@context": string;
  "@type": string;
  name: string;
  description: string;
  url: string;
  logo?: {
    "@type": string;
    url: string;
  };
  sameAs?: string[];
  contactPoint?: {
    "@type": string;
    email: string;
    contactType: string;
  };
}

export class StructuredDataService {
  // Generate organization schema from site settings
  static async generateOrganizationSchema(): Promise<OrganizationSchema> {
    try {
      const [
        orgName,
        orgDescription,
        orgUrl,
        orgLogo,
        orgEmail,
        socialFacebook,
        socialTwitter,
        socialInstagram,
        socialYoutube,
        socialLinkedin
      ] = await Promise.all([
        SiteSettingsService.getSetting('seo_organization_name'),
        SiteSettingsService.getSetting('seo_organization_description'),
        SiteSettingsService.getSetting('seo_organization_url'),
        SiteSettingsService.getSetting('seo_organization_logo'),
        SiteSettingsService.getSetting('seo_organization_email'),
        SiteSettingsService.getSetting('seo_social_facebook'),
        SiteSettingsService.getSetting('seo_social_twitter'),
        SiteSettingsService.getSetting('seo_social_instagram'),
        SiteSettingsService.getSetting('seo_social_youtube'),
        SiteSettingsService.getSetting('seo_social_linkedin')
      ]);

      const sameAs = [
        socialFacebook,
        socialTwitter,
        socialInstagram,
        socialYoutube,
        socialLinkedin
      ].filter(url => url && String(url).trim() !== '').map(url => String(url));

      const schema: OrganizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: String(orgName || "FastNow"),
        description: String(orgDescription || "The FastNow protocol for effective fat loss and body transformation"),
        url: String(orgUrl || "https://fastnow.app"),
        sameAs: sameAs.length > 0 ? sameAs : undefined
      };

      if (orgLogo) {
        schema.logo = {
          "@type": "ImageObject",
          url: String(orgLogo)
        };
      }

      if (orgEmail) {
        schema.contactPoint = {
          "@type": "ContactPoint",
          email: String(orgEmail),
          contactType: "customer service"
        };
      }

      return schema;
    } catch (error) {
      console.error('Error generating organization schema:', error);
      // Return fallback schema
      return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "FastNow",
        description: "The FastNow protocol for effective fat loss and body transformation",
        url: "https://fastnow.app"
      };
    }
  }

  // Inject structured data into page
  static injectSchema(schema: any, id?: string) {
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

  // Remove schema by ID
  static removeSchema(id: string) {
    const existing = document.getElementById(id);
    if (existing) existing.remove();
  }
}