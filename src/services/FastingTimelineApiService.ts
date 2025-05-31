
import { FastingTimelineService } from './FastingTimelineService';
import { FastingTimelinePost } from '@/types/fastingTimeline';

export class FastingTimelineApiService {
  private static JSON_FILE_PATH = '/fasting-timeline-data.json';

  static async exportToJson(): Promise<void> {
    try {
      const posts = FastingTimelineService.getAllPosts();
      const publishedPosts = posts.filter(post => post.status === 'published');
      
      // Create API-friendly format
      const apiData = {
        posts: publishedPosts.map(post => ({
          id: post.id,
          hour: post.hour,
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
          metaKeywords: post.metaKeywords,
          whatsHappening: post.whatsHappening,
          howYoureFeeling: post.howYoureFeeling
        })),
        lastUpdated: new Date().toISOString(),
        totalPosts: publishedPosts.length
      };

      // Store in localStorage with a special key for API access
      localStorage.setItem('fastingApp_fastingTimelineApi', JSON.stringify(apiData));
      
      console.log('Fasting timeline data exported to JSON successfully');
    } catch (error) {
      console.error('Error exporting fasting timeline data to JSON:', error);
    }
  }

  static getFastingTimelineApiData(): any {
    try {
      const apiData = localStorage.getItem('fastingApp_fastingTimelineApi');
      return apiData ? JSON.parse(apiData) : { posts: [], lastUpdated: null, totalPosts: 0 };
    } catch (error) {
      console.error('Error loading fasting timeline API data:', error);
      return { posts: [], lastUpdated: null, totalPosts: 0 };
    }
  }

  static getApiUrl(): string {
    return '/api/fasting-timeline';
  }
}
