import { supabase } from "@/integrations/supabase/client";

export interface PageContent {
  id?: string;
  page_key: string;
  title?: string;
  subtitle?: string;
  content?: string;
  meta_title?: string;
  meta_description?: string;
  featured_image_url?: string;
  button_text?: string;
  button_url?: string;
  is_published?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface GeneralSetting {
  id?: string;
  setting_key: string;
  setting_value: any;
  created_at?: string;
  updated_at?: string;
}

class PageContentService {
  // Page Content Methods
  async getPageContent(pageKey: string): Promise<PageContent | null> {
    try {
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .eq('page_key', pageKey)
        .eq('is_published', true)
        .maybeSingle();

      if (error) {
        console.error('Error fetching page content:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getPageContent:', error);
      return null;
    }
  }

  async getAllPageContent(): Promise<PageContent[]> {
    try {
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .eq('is_published', true)
        .order('page_key');

      if (error) {
        console.error('Error fetching all page content:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllPageContent:', error);
      return [];
    }
  }

  async savePageContent(pageContent: PageContent): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('page_content')
        .upsert({
          ...pageContent,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'page_key'
        });

      if (error) {
        console.error('Error saving page content:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in savePageContent:', error);
      return false;
    }
  }

  async deletePageContent(pageKey: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('page_content')
        .delete()
        .eq('page_key', pageKey);

      if (error) {
        console.error('Error deleting page content:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deletePageContent:', error);
      return false;
    }
  }

  // General Settings Methods
  async getGeneralSetting(settingKey: string): Promise<GeneralSetting | null> {
    try {
      const { data, error } = await supabase
        .from('general_settings')
        .select('*')
        .eq('setting_key', settingKey)
        .maybeSingle();

      if (error) {
        console.error('Error fetching general setting:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getGeneralSetting:', error);
      return null;
    }
  }

  async getAllGeneralSettings(): Promise<GeneralSetting[]> {
    try {
      const { data, error } = await supabase
        .from('general_settings')
        .select('*')
        .order('setting_key');

      if (error) {
        console.error('Error fetching all general settings:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllGeneralSettings:', error);
      return [];
    }
  }

  async saveGeneralSetting(setting: GeneralSetting): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('general_settings')
        .upsert({
          ...setting,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'setting_key'
        });

      if (error) {
        console.error('Error saving general setting:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in saveGeneralSetting:', error);
      return false;
    }
  }

  // Migration utility to transfer localStorage content to database
  async migrateLocalStorageToDatabase(): Promise<void> {
    try {
      console.log('Starting migration from localStorage to database...');

      // Migrate general homepage content from localStorage
      const storedTitle = localStorage.getItem('homepage_title');
      const storedSubtitle = localStorage.getItem('homepage_subtitle');
      const storedDescription = localStorage.getItem('homepage_description');
      const storedButtonText = localStorage.getItem('homepage_button_text');
      const storedButtonUrl = localStorage.getItem('homepage_button_url');

      if (storedTitle || storedSubtitle || storedDescription) {
        await this.savePageContent({
          page_key: 'home',
          title: storedTitle || 'My Protocol for Fat Loss',
          subtitle: storedSubtitle || 'Transform your body with our scientifically-backed fasting approach',
          content: storedDescription || 'Discover the power of intermittent fasting with our comprehensive timeline and personalized guidance.',
          button_text: storedButtonText || 'Download FastNow',
          button_url: storedButtonUrl || '#',
          meta_title: 'FastNow - My Protocol for Fat Loss',
          meta_description: 'Transform your body with scientifically-backed intermittent fasting protocols and personalized guidance.'
        });
      }

      // Migrate FAQ content
      const storedFaqTitle = localStorage.getItem('faq_title');
      const storedFaqDescription = localStorage.getItem('faq_description');

      if (storedFaqTitle || storedFaqDescription) {
        await this.savePageContent({
          page_key: 'faq',
          title: storedFaqTitle || 'Frequently Asked Questions',
          content: storedFaqDescription || 'Find answers to common questions about our fasting protocol.',
          meta_title: 'FAQ - FastNow',
          meta_description: 'Frequently asked questions about FastNow fasting protocols and app features.'
        });
      }

      // Migrate About Me content from site_settings (this was already in database)
      // No need to migrate this as it's already properly stored in site_settings

      // Migrate site identity settings
      const siteName = localStorage.getItem('site_name') || 'FastNow';
      const siteTagline = localStorage.getItem('site_tagline') || 'Transform Your Body with Intermittent Fasting';
      const siteDescription = localStorage.getItem('site_description') || 'Scientifically-backed fasting protocols for sustainable weight loss';

      await this.saveGeneralSetting({
        setting_key: 'site_identity',
        setting_value: {
          siteName,
          tagline: siteTagline,
          description: siteDescription,
          logoUrl: localStorage.getItem('site_logo_url') || '',
          faviconUrl: localStorage.getItem('site_favicon_url') || ''
        }
      });

      console.log('Migration completed successfully!');
    } catch (error) {
      console.error('Error during migration:', error);
    }
  }

  // Cleanup localStorage after successful migration
  cleanupLocalStorage(): void {
    const keysToRemove = [
      'homepage_title',
      'homepage_subtitle', 
      'homepage_description',
      'homepage_button_text',
      'homepage_button_url',
      'faq_title',
      'faq_description',
      'site_name',
      'site_tagline',
      'site_description',
      'site_logo_url',
      'site_favicon_url'
    ];

    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });

    console.log('localStorage cleanup completed');
  }
}

export const pageContentService = new PageContentService();
export { PageContentService };