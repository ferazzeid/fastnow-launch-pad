import { supabase } from '@/integrations/supabase/client';

interface BlogPost {
  slug: string;
  updatedAt?: string;
  publishedAt?: string;
  createdAt: string;
}

class PublicSitemapService {
  private baseUrl = 'https://fastnow.app';

  async generateSitemap(): Promise<string> {
    console.log('PublicSitemapService: Starting public sitemap generation...');
    
    try {
      // Fetch published blog posts directly using public RLS policy
      console.log('PublicSitemapService: Fetching published blog posts...');
      const { data: blogPosts, error } = await supabase
        .from('blog_posts')
        .select('slug, created_at, updated_at, published_at')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) {
        console.error('PublicSitemapService: Error fetching blog posts:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      console.log('PublicSitemapService: Blog posts fetched:', { count: blogPosts?.length || 0 });

      const staticPages = [
        { url: '/', lastmod: '2024-01-01', changefreq: 'weekly', priority: '1.0' },
        { url: '/fastnow-protocol', lastmod: '2024-01-01', changefreq: 'monthly', priority: '0.8' },
        { url: '/about-fastnow-app', lastmod: '2024-01-01', changefreq: 'monthly', priority: '0.8' },
        { url: '/about-me', lastmod: '2024-01-01', changefreq: 'monthly', priority: '0.6' },
        { url: '/faq', lastmod: '2024-01-01', changefreq: 'monthly', priority: '0.7' },
        { url: '/blog', lastmod: '2024-01-01', changefreq: 'weekly', priority: '0.8' },
        { url: '/fasting-timeline', lastmod: '2024-01-01', changefreq: 'monthly', priority: '0.8' },
        { url: '/privacy', lastmod: '2024-01-01', changefreq: 'yearly', priority: '0.4' },
        { url: '/terms', lastmod: '2024-01-01', changefreq: 'yearly', priority: '0.4' },
        { url: '/contact', lastmod: '2024-01-01', changefreq: 'monthly', priority: '0.5' },
      ];

      const blogPostUrls = (blogPosts || []).map(post => ({
        url: `/blog/${post.slug}`,
        lastmod: this.formatDate(post.updated_at || post.published_at || post.created_at),
        changefreq: 'monthly',
        priority: '0.7'
      }));

      const allUrls = [...staticPages, ...blogPostUrls];

      console.log('PublicSitemapService: Generating XML with', allUrls.length, 'URLs');
      return this.generateXMLSitemap(allUrls);
    } catch (error) {
      console.error('PublicSitemapService: Error in generateSitemap:', error);
      throw error;
    }
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

  // Static fallback sitemap if all else fails
  generateStaticSitemap(): string {
    console.log('PublicSitemapService: Generating static fallback sitemap...');
    
    const staticUrls = [
      { url: '/', lastmod: '2024-01-01', changefreq: 'weekly', priority: '1.0' },
      { url: '/fastnow-protocol', lastmod: '2024-01-01', changefreq: 'monthly', priority: '0.8' },
      { url: '/about-fastnow-app', lastmod: '2024-01-01', changefreq: 'monthly', priority: '0.8' },
      { url: '/about-me', lastmod: '2024-01-01', changefreq: 'monthly', priority: '0.6' },
      { url: '/faq', lastmod: '2024-01-01', changefreq: 'monthly', priority: '0.7' },
      { url: '/blog', lastmod: '2024-01-01', changefreq: 'weekly', priority: '0.8' },
      { url: '/fasting-timeline', lastmod: '2024-01-01', changefreq: 'monthly', priority: '0.8' },
      { url: '/privacy', lastmod: '2024-01-01', changefreq: 'yearly', priority: '0.4' },
      { url: '/terms', lastmod: '2024-01-01', changefreq: 'yearly', priority: '0.4' },
      { url: '/contact', lastmod: '2024-01-01', changefreq: 'monthly', priority: '0.5' },
      // Add known blog post URLs as fallback
      { url: '/blog/intermittent-fasting-beginners-guide', lastmod: '2024-01-01', changefreq: 'monthly', priority: '0.7' },
      { url: '/blog/fasting-weight-loss-tips', lastmod: '2024-01-01', changefreq: 'monthly', priority: '0.7' },
      { url: '/blog/24-hour-fast-benefits', lastmod: '2024-01-01', changefreq: 'monthly', priority: '0.7' },
      { url: '/blog/fasting-mistakes-avoid', lastmod: '2024-01-01', changefreq: 'monthly', priority: '0.7' },
      { url: '/blog/autophagy-fasting-guide', lastmod: '2024-01-01', changefreq: 'monthly', priority: '0.7' },
      { url: '/blog/extended-fasting-safety', lastmod: '2024-01-01', changefreq: 'monthly', priority: '0.7' },
    ];

    return this.generateXMLSitemap(staticUrls);
  }
}

export const publicSitemapService = new PublicSitemapService();