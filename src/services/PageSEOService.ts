import { supabase } from '@/integrations/supabase/client';

export interface PageSEOSetting {
  id: string;
  page_path: string;
  page_title: string;
  page_description?: string;
  is_indexed: boolean;
  robots_directive: string;
  page_type: 'content' | 'blog' | 'admin' | 'legal' | 'system';
  is_dynamic: boolean;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
}

export interface BlogPostSEO {
  id: string;
  slug: string;
  title: string;
  status: string;
  is_indexed?: boolean;
}

export class PageSEOService {
  static async getAllPageSettings(): Promise<PageSEOSetting[]> {
    const { data, error } = await supabase
      .from('page_seo_settings')
      .select('*')
      .order('page_type', { ascending: true })
      .order('page_path', { ascending: true });
    
    if (error) {
      console.error('Error fetching page SEO settings:', error);
      throw error;
    }
    
    return (data || []).map(item => ({
      ...item,
      page_type: item.page_type as 'content' | 'blog' | 'admin' | 'legal' | 'system'
    }));
  }

  static async getBlogPostsWithSEO(): Promise<BlogPostSEO[]> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, slug, title, status')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching blog posts:', error);
      throw error;
    }
    
    return (data || []).map(post => ({
      ...post,
      is_indexed: post.status === 'published' // Default to indexed if published
    }));
  }

  static async updatePageIndexing(pageId: string, isIndexed: boolean): Promise<void> {
    const robotsDirective = isIndexed ? 'index, follow' : 'noindex, nofollow';
    
    const { error } = await supabase
      .from('page_seo_settings')
      .update({ 
        is_indexed: isIndexed,
        robots_directive: robotsDirective,
        updated_at: new Date().toISOString()
      })
      .eq('id', pageId);
    
    if (error) {
      console.error('Error updating page indexing:', error);
      throw error;
    }
  }

  static async bulkUpdateIndexing(pageIds: string[], isIndexed: boolean): Promise<void> {
    const robotsDirective = isIndexed ? 'index, follow' : 'noindex, nofollow';
    
    const { error } = await supabase
      .from('page_seo_settings')
      .update({ 
        is_indexed: isIndexed,
        robots_directive: robotsDirective,
        updated_at: new Date().toISOString()
      })
      .in('id', pageIds);
    
    if (error) {
      console.error('Error bulk updating page indexing:', error);
      throw error;
    }
  }

  static async addNewPageSetting(pageSetting: Omit<PageSEOSetting, 'id' | 'created_at' | 'updated_at'>): Promise<void> {
    const { error } = await supabase
      .from('page_seo_settings')
      .insert(pageSetting);
    
    if (error) {
      console.error('Error adding new page setting:', error);
      throw error;
    }
  }

  static async getPageSEOByPath(pagePath: string): Promise<{ is_indexed: boolean; robots_directive: string; meta_title?: string; meta_description?: string } | null> {
    const { data, error } = await supabase
      .rpc('get_page_seo_settings', { page_path_param: pagePath });
    
    if (error) {
      console.error('Error fetching page SEO by path:', error);
      return null;
    }
    
    return data?.[0] || null;
  }

  static getPageTypeColor(pageType: string): string {
    switch (pageType) {
      case 'content': return 'text-green-600 bg-green-50 border-green-200';
      case 'blog': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'admin': return 'text-red-600 bg-red-50 border-red-200';
      case 'legal': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'system': return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'tool': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  }

  static async updatePageSEOContent(pagePath: string, updates: {
    page_title?: string;
    page_description?: string;
    meta_title?: string;
    meta_description?: string;
  }): Promise<void> {
    const { error } = await supabase
      .from('page_seo_settings')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('page_path', pagePath);
    
    if (error) {
      console.error('Error updating page SEO content:', error);
      throw error;
    }
  }

  static getPageTypeLabel(pageType: string): string {
    switch (pageType) {
      case 'content': return 'Content';
      case 'blog': return 'Blog';
      case 'admin': return 'Admin';
      case 'legal': return 'Legal';
      case 'system': return 'System';
      case 'tool': return 'Tools';
      default: return 'Unknown';
    }
  }
}