import { databaseBlogService } from './DatabaseBlogService';
import { supabase } from '@/integrations/supabase/client';

class SitemapService {
  private baseUrl = 'https://fastnow.app';

  async generateSitemap(): Promise<string> {
    console.log('SitemapService: Starting sitemap generation...');
    
    // Check authentication status before making database calls
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    console.log('SitemapService: Current session:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      userEmail: session?.user?.email,
      sessionError: sessionError?.message
    });
    
    // Test admin status
    try {
      const { data: adminStatus, error: adminError } = await supabase.rpc('is_current_user_admin' as any);
      console.log('SitemapService: Admin check result:', { adminStatus, adminError });
    } catch (error) {
      console.error('SitemapService: Admin check failed:', error);
    }
    
    // Fetch all page SEO settings to check indexing status
    console.log('SitemapService: Fetching page SEO settings from database...');
    let allPageSettings: any[] = [];
    try {
      const { data: pagesData, error: pagesError } = await supabase
        .from('page_seo_settings')
        .select('page_path, updated_at, is_indexed');

      if (pagesError) {
        console.error('SitemapService: Error fetching page settings:', pagesError);
      } else {
        allPageSettings = pagesData || [];
      }
    } catch (error) {
      console.error('SitemapService: Exception fetching page settings:', error);
    }

    // Create static pages based on database settings with fallback
    const staticPages: Array<{ url: string; lastmod: string; changefreq: string; priority: string }> = [];
    
    const defaultPages = [
      { path: '/', priority: '1.0', changefreq: 'weekly' },
      { path: '/fastnow-protocol', priority: '0.8', changefreq: 'monthly' },
      { path: '/about-fastnow-app', priority: '0.8', changefreq: 'monthly' },
    ];

    for (const page of defaultPages) {
      const pageSettings = allPageSettings.find(p => p.page_path === page.path);
      // Include if no specific setting OR if explicitly indexed
      if (!pageSettings || pageSettings.is_indexed) {
        staticPages.push({
          url: page.path,
          lastmod: pageSettings ? this.formatDate(pageSettings.updated_at) : '2024-01-01',
          changefreq: page.changefreq,
          priority: page.priority
        });
      }
    }

    console.log('SitemapService: Static pages after filtering:', staticPages.map(p => p.url));
    
    console.log('SitemapService: Fetching blog posts...');
    
    // Fetch published blog posts directly from Supabase
    let blogPosts: any[] = [];
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('slug, updated_at, published_at, created_at, title')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) {
        console.error('SitemapService: Error fetching blog posts:', error);
        // Fallback to service method
        blogPosts = await databaseBlogService.getAllPosts();
      } else {
        blogPosts = data || [];
      }
    } catch (error) {
      console.error('SitemapService: Exception fetching blog posts:', error);
      // Final fallback to service method
      try {
        blogPosts = await databaseBlogService.getAllPosts();
      } catch (serviceError) {
        console.error('SitemapService: Service fallback also failed:', serviceError);
        blogPosts = [];
      }
    }
    
    console.log('SitemapService: Blog posts fetched:', { count: blogPosts.length, posts: blogPosts.map(p => p.slug) });

    // Filter blog posts based on indexing settings
    const blogPostUrls: Array<{ url: string; lastmod: string; changefreq: string; priority: string }> = [];
    
    for (const post of blogPosts) {
      const blogPagePath = `/${post.slug}`;
      const pageSettings = allPageSettings.find(p => p.page_path === blogPagePath);
      
      // Include if no specific setting (default to indexed for published posts) OR if explicitly indexed
      if (!pageSettings || pageSettings.is_indexed) {
        blogPostUrls.push({
          url: blogPagePath,
          lastmod: this.formatDate(post.updated_at || post.updatedAt || post.published_at || post.publishedAt || post.created_at || post.createdAt),
          changefreq: 'monthly',
          priority: '0.7'
        });
      }
    }

    console.log('SitemapService: Generated blog URLs after indexing filter:', blogPostUrls.map(u => u.url));

    const allUrls = [...staticPages, ...blogPostUrls];
    console.log('SitemapService: Total URLs in sitemap:', allUrls.length);

    return this.generateXMLSitemap(allUrls);
  }

  private generateXMLSitemap(urls: Array<{ url: string; lastmod: string; changefreq: string; priority: string }>): string {
    const header = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
    
    const footer = `</urlset>`;
    
    const urlElements = urls.map(page => `  <url>
    <loc>${this.baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n');

    return `${header}\n${urlElements}\n${footer}`;
  }

  private formatDate(dateString: string): string {
    return new Date(dateString).toISOString().split('T')[0];
  }

  async updateSitemapFile(): Promise<void> {
    try {
      const sitemapContent = await this.generateSitemap();
      
      // In a real application, you would write this to the public directory
      // For now, we'll log it so it can be manually updated
      console.log('Generated sitemap.xml content:');
      console.log(sitemapContent);
      
      // Store in localStorage as a fallback for admin access
      localStorage.setItem('generated_sitemap', sitemapContent);
    } catch (error) {
      console.error('Error generating sitemap:', error);
    }
  }
}

export const sitemapService = new SitemapService();