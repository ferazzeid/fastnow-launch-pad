import { databaseBlogService } from './DatabaseBlogService';

class SitemapService {
  private baseUrl = 'https://fastnow.app';

  async generateSitemap(): Promise<string> {
    const blogPosts = await databaseBlogService.getAllPosts();
    
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