
import { BlogService } from './BlogService';
import { BlogPost } from '@/types/blog';

export class BlogApiService {
  private static JSON_FILE_PATH = '/blog-data.json';

  static async exportToJson(): Promise<void> {
    try {
      const posts = BlogService.getAllPosts();
      const publishedPosts = posts.filter(post => post.status === 'published');
      
      // Create API-friendly format
      const apiData = {
        posts: publishedPosts.map(post => ({
          id: post.id,
          title: post.title,
          slug: post.slug,
          content: post.content,
          excerpt: post.excerpt,
          featuredImage: post.featuredImage,
          author: post.author,
          categories: post.categories,
          tags: post.tags,
          publishedAt: post.publishedAt,
          updatedAt: post.updatedAt,
          metaDescription: post.metaDescription,
          metaKeywords: post.metaKeywords
        })),
        lastUpdated: new Date().toISOString(),
        totalPosts: publishedPosts.length
      };

      // In a real implementation, this would write to the public folder
      // For now, we'll store it in localStorage with a special key for API access
      localStorage.setItem('fastingApp_blogApi', JSON.stringify(apiData));
      
      console.log('Blog data exported to JSON successfully');
    } catch (error) {
      console.error('Error exporting blog data to JSON:', error);
    }
  }

  static getBlogApiData(): any {
    try {
      const apiData = localStorage.getItem('fastingApp_blogApi');
      return apiData ? JSON.parse(apiData) : { posts: [], lastUpdated: null, totalPosts: 0 };
    } catch (error) {
      console.error('Error loading blog API data:', error);
      return { posts: [], lastUpdated: null, totalPosts: 0 };
    }
  }

  static getApiUrl(): string {
    // In production, this would be the actual JSON file URL
    // For now, we'll create a route that serves the data
    return '/api/blog';
  }
}
