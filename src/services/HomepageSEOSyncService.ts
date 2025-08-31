import { PageSEOService } from './PageSEOService';
import { pageContentService } from './PageContentService';

/**
 * Service to keep homepage SEO settings synchronized between 
 * the page_content table (homepage editor) and page_seo_settings table
 */
export class HomepageSEOSyncService {
  
  /**
   * Sync homepage SEO data from page_content to page_seo_settings
   * This ensures the PageSEO system has the latest homepage settings
   */
  static async syncHomepageToPageSEO(): Promise<void> {
    try {
      // Get homepage content from page_content table
      const homepageContent = await pageContentService.getPageContent('home');
      
      if (homepageContent) {
        // Update the page_seo_settings entry for homepage
        await PageSEOService.updatePageSEOContent('/', {
          page_title: homepageContent.meta_title || homepageContent.title || 'FastNow',
          page_description: homepageContent.meta_description || homepageContent.content || 'Transform your health',
          meta_title: homepageContent.meta_title,
          meta_description: homepageContent.meta_description
        });
        
        console.log('Homepage SEO synchronized successfully');
      }
    } catch (error) {
      console.error('Error syncing homepage SEO:', error);
    }
  }

  /**
   * Update homepage content and sync to PageSEO system
   */
  static async updateHomepageContent(content: {
    title?: string;
    subtitle?: string;
    content?: string;
    meta_title?: string;
    meta_description?: string;
    button_text?: string;
    button_url?: string;
    featured_image_url?: string;
  }): Promise<boolean> {
    try {
      // Save to page_content table
      const success = await pageContentService.savePageContent({
        page_key: 'home',
        ...content,
        is_published: true
      });

      if (success) {
        // Sync to page_seo_settings
        await this.syncHomepageToPageSEO();
      }

      return success;
    } catch (error) {
      console.error('Error updating homepage content:', error);
      return false;
    }
  }
}