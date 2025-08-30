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
    
    console.log('SitemapService: Fetching blog posts...');
    const blogPosts = await databaseBlogService.getAllPosts();
    console.log('SitemapService: Blog posts fetched:', { count: blogPosts.length });
    
    const staticPages = [
      { url: '/', lastmod: '2024-01-01', changefreq: 'weekly', priority: '1.0' },
      { url: '/fastnow-protocol', lastmod: '2024-01-01', changefreq: 'monthly', priority: '0.8' },
      { url: '/about-fastnow-app', lastmod: '2024-01-01', changefreq: 'monthly', priority: '0.8' },
      { url: '/blog', lastmod: '2024-01-01', changefreq: 'weekly', priority: '0.8' },
      { url: '/fasting-timeline', lastmod: '2024-01-01', changefreq: 'monthly', priority: '0.8' },
      { url: '/privacy', lastmod: '2024-01-01', changefreq: 'yearly', priority: '0.4' },
      { url: '/terms', lastmod: '2024-01-01', changefreq: 'yearly', priority: '0.4' },
    ];

    const blogPostUrls = blogPosts.map(post => ({
      url: `/blog/${post.slug}`,
      lastmod: this.formatDate(post.updatedAt || post.publishedAt || post.createdAt),
      changefreq: 'monthly',
      priority: '0.7'
    }));

    const allUrls = [...staticPages, ...blogPostUrls];

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