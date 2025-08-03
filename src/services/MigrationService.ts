import { databaseBlogService } from './DatabaseBlogService';
import { databaseFastingTimelineService } from './DatabaseFastingTimelineService';
import { databaseAppContentService } from './DatabaseAppContentService';
import { pageContentService } from './PageContentService';
import { supabase } from '@/integrations/supabase/client';

class MigrationService {
  private migrationKey = 'full_migration_completed_v1';

  async runCompleteMigration(): Promise<void> {
    const migrationCompleted = localStorage.getItem(this.migrationKey);
    
    if (migrationCompleted) {
      console.log('Migration already completed');
      return;
    }

    console.log('Starting complete localStorage to database migration...');

    try {
      // 1. Migrate homepage and page content
      await this.migratePageContent();
      
      // 2. Migrate blog posts
      await this.migrateBlogPosts();
      
      // 3. Migrate fasting timeline posts
      await this.migrateFastingTimelinePosts();
      
      // 4. Migrate app content (motivators and fasting hours)
      await this.migrateAppContent();
      
      // 5. Migrate design and UI settings
      await this.migrateDesignSettings();
      
      // 6. Clean up all localStorage
      await this.cleanupAllLocalStorage();
      
      // Mark migration as completed
      localStorage.setItem(this.migrationKey, 'true');
      
      console.log('Complete migration finished successfully!');
    } catch (error) {
      console.error('Error during complete migration:', error);
      throw error;
    }
  }

  private async migratePageContent(): Promise<void> {
    console.log('Migrating page content...');
    
    try {
      // Homepage content
      const homeTitle = localStorage.getItem('fastingApp_homepageHeroTitle') || 
                       localStorage.getItem('homepage_title');
      const homeSubtitle = localStorage.getItem('fastingApp_homepageHeroSubtitle') || 
                          localStorage.getItem('homepage_subtitle');
      const homeDescription = localStorage.getItem('fastingApp_homepageHeroDescription') || 
                             localStorage.getItem('homepage_description');
      const ctaText = localStorage.getItem('fastingApp_homepageCtaText') || 
                     localStorage.getItem('homepage_button_text');
      const ctaUrl = localStorage.getItem('fastingApp_homepageCtaUrl') || 
                    localStorage.getItem('homepage_button_url');

      if (homeTitle || homeSubtitle || homeDescription) {
        await pageContentService.savePageContent({
          page_key: 'home',
          title: homeTitle || 'My Protocol for Fat Loss',
          subtitle: homeSubtitle || 'Transform your body with our scientifically-backed fasting approach',
          content: homeDescription || 'Discover the power of intermittent fasting with our comprehensive timeline and personalized guidance.',
          button_text: ctaText || 'Launch App',
          button_url: ctaUrl || 'https://go.fastnow.app',
          meta_title: 'FastNow - My Protocol for Fat Loss',
          meta_description: homeSubtitle || 'Transform your body with scientifically-backed intermittent fasting protocols and personalized guidance.',
          is_published: true
        });
      }

      // FAQ content
      const faqTitle = localStorage.getItem('faq_title');
      const faqDescription = localStorage.getItem('faq_description');
      
      if (faqTitle || faqDescription) {
        await pageContentService.savePageContent({
          page_key: 'faq',
          title: faqTitle || 'Frequently Asked Questions',
          content: faqDescription || 'Find answers to common questions about our fasting protocol.',
          meta_title: 'FAQ - FastNow',
          meta_description: 'Frequently asked questions about FastNow fasting protocols and app features.',
          is_published: true
        });
      }

      // Site identity settings
      const siteName = localStorage.getItem('site_name') || localStorage.getItem('fastingApp_siteName');
      const siteTagline = localStorage.getItem('site_tagline') || localStorage.getItem('fastingApp_siteTagline');
      const siteDescription = localStorage.getItem('site_description') || localStorage.getItem('fastingApp_siteDescription');
      const logoUrl = localStorage.getItem('site_logo_url') || localStorage.getItem('fastingApp_logoUrl');
      const faviconUrl = localStorage.getItem('site_favicon_url') || localStorage.getItem('fastingApp_faviconUrl');

      if (siteName || siteTagline || logoUrl) {
        await pageContentService.saveGeneralSetting({
          setting_key: 'site_identity',
          setting_value: {
            siteName: siteName || 'FastNow',
            tagline: siteTagline || 'Transform Your Body with Intermittent Fasting',
            description: siteDescription || 'Scientifically-backed fasting protocols for sustainable weight loss',
            logoUrl: logoUrl || '',
            faviconUrl: faviconUrl || ''
          }
        });
      }

      console.log('Page content migration completed');
    } catch (error) {
      console.error('Error migrating page content:', error);
    }
  }

  private async migrateBlogPosts(): Promise<void> {
    console.log('Migrating blog posts...');
    
    try {
      const storedPosts = localStorage.getItem('blog_posts');
      if (storedPosts) {
        const posts = JSON.parse(storedPosts);
        console.log(`Found ${posts.length} blog posts to migrate`);
        
        for (const post of posts) {
          await databaseBlogService.savePost(post);
        }
      }
      
      console.log('Blog posts migration completed');
    } catch (error) {
      console.error('Error migrating blog posts:', error);
    }
  }

  private async migrateFastingTimelinePosts(): Promise<void> {
    console.log('Migrating fasting timeline posts...');
    
    try {
      const storedPosts = localStorage.getItem('timeline_posts');
      if (storedPosts) {
        const posts = JSON.parse(storedPosts);
        console.log(`Found ${posts.length} timeline posts to migrate`);
        
        for (const post of posts) {
          await databaseFastingTimelineService.savePost(post);
        }
      }
      
      console.log('Timeline posts migration completed');
    } catch (error) {
      console.error('Error migrating timeline posts:', error);
    }
  }

  private async migrateAppContent(): Promise<void> {
    console.log('Migrating app content...');
    
    try {
      await databaseAppContentService.migrateFromLocalStorage();
      console.log('App content migration completed');
    } catch (error) {
      console.error('Error migrating app content:', error);
    }
  }

  private async migrateDesignSettings(): Promise<void> {
    console.log('Migrating design settings...');
    
    try {
      // Collect all design-related localStorage items
      const designSettings: any = {};
      
      // Colors and theme settings
      const customColors = localStorage.getItem('fastingApp_customColors');
      const customElements = localStorage.getItem('fastingApp_customElements');
      const showDefaultDesign = localStorage.getItem('fastingApp_showDefaultDesign');
      
      if (customColors) designSettings.customColors = JSON.parse(customColors);
      if (customElements) designSettings.customElements = JSON.parse(customElements);
      if (showDefaultDesign) designSettings.showDefaultDesign = showDefaultDesign === 'true';

      // App store settings
      const googlePlayLink = localStorage.getItem('fastingApp_googlePlayLink');
      const appleStoreLink = localStorage.getItem('fastingApp_appleStoreLink');
      
      if (googlePlayLink || appleStoreLink) {
        designSettings.appStoreSettings = {
          googlePlayLink: googlePlayLink || 'https://play.google.com',
          appleStoreLink: appleStoreLink || 'https://apps.apple.com'
        };
      }

      // Save consolidated design settings if any exist
      if (Object.keys(designSettings).length > 0) {
        await pageContentService.saveGeneralSetting({
          setting_key: 'design_settings',
          setting_value: designSettings
        });
      }

      console.log('Design settings migration completed');
    } catch (error) {
      console.error('Error migrating design settings:', error);
    }
  }

  private async cleanupAllLocalStorage(): Promise<void> {
    console.log('Cleaning up localStorage...');
    
    const keysToRemove = [
      // Homepage content
      'fastingApp_homepageHeroTitle',
      'fastingApp_homepageHeroSubtitle', 
      'fastingApp_homepageHeroDescription',
      'fastingApp_homepageCtaText',
      'fastingApp_homepageCtaUrl',
      'homepage_title',
      'homepage_subtitle',
      'homepage_description',
      'homepage_button_text',
      'homepage_button_url',
      
      // FAQ content
      'faq_title',
      'faq_description',
      
      // Site identity
      'site_name',
      'site_tagline',
      'site_description',
      'site_logo_url',
      'site_favicon_url',
      'fastingApp_siteName',
      'fastingApp_siteTagline',
      'fastingApp_siteDescription',
      'fastingApp_logoUrl',
      'fastingApp_faviconUrl',
      
      // Blog and timeline content
      'blog_posts',
      'timeline_posts',
      'motivators',
      'fasting_hours',
      'app_content_data',
      
      // Design settings
      'fastingApp_customColors',
      'fastingApp_customElements',
      'fastingApp_showDefaultDesign',
      'fastingApp_googlePlayLink',
      'fastingApp_appleStoreLink',
      
      // Migration flags
      'content_migration_completed'
    ];

    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });

    console.log('localStorage cleanup completed');
  }

  // Check if migration is needed
  isMigrationNeeded(): boolean {
    const migrationCompleted = localStorage.getItem(this.migrationKey);
    return !migrationCompleted;
  }

  // Force re-migration (for development/testing)
  async forceMigration(): Promise<void> {
    localStorage.removeItem(this.migrationKey);
    await this.runCompleteMigration();
  }
}

export const migrationService = new MigrationService();