import { supabase } from "@/integrations/supabase/client";
import { FastingTimelinePost } from "@/types/fastingTimeline";

class DatabaseFastingTimelineService {
  async getAllPosts(): Promise<FastingTimelinePost[]> {
    try {
      const { data, error } = await supabase
        .from('fasting_timeline_posts')
        .select('*')
        .eq('status', 'published')
        .order('hour');

      if (error) {
        console.error('Error fetching timeline posts:', error);
        return [];
      }

      return data?.map(this.mapDatabaseToTimelinePost) || [];
    } catch (error) {
      console.error('Error in getAllPosts:', error);
      return [];
    }
  }

  // Admin method to get all posts including drafts
  async getAllPostsForAdmin(): Promise<FastingTimelinePost[]> {
    try {
      const { data, error } = await supabase
        .from('fasting_timeline_posts')
        .select('*')
        .order('hour');

      if (error) {
        console.error('Error fetching admin timeline posts:', error);
        return [];
      }

      return data?.map(this.mapDatabaseToTimelinePost) || [];
    } catch (error) {
      console.error('Error in getAllPostsForAdmin:', error);
      return [];
    }
  }

  async getPostById(id: string): Promise<FastingTimelinePost | null> {
    try {
      const { data, error } = await supabase
        .from('fasting_timeline_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching timeline post by ID:', error);
        return null;
      }

      return data ? this.mapDatabaseToTimelinePost(data) : null;
    } catch (error) {
      console.error('Error in getPostById:', error);
      return null;
    }
  }

  async getPostByHour(hour: number): Promise<FastingTimelinePost | null> {
    try {
      const { data, error } = await supabase
        .from('fasting_timeline_posts')
        .select('*')
        .eq('hour', hour)
        .eq('status', 'published')
        .single();

      if (error) {
        console.error('Error fetching timeline post by hour:', error);
        return null;
      }

      return data ? this.mapDatabaseToTimelinePost(data) : null;
    } catch (error) {
      console.error('Error in getPostByHour:', error);
      return null;
    }
  }

  async getPostBySlug(slug: string): Promise<FastingTimelinePost | null> {
    try {
      const { data, error } = await supabase
        .from('fasting_timeline_posts')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) {
        console.error('Error fetching timeline post by slug:', error);
        return null;
      }

      return data ? this.mapDatabaseToTimelinePost(data) : null;
    } catch (error) {
      console.error('Error in getPostBySlug:', error);
      return null;
    }
  }

  async savePost(post: FastingTimelinePost): Promise<boolean> {
    try {
      const dbPost = this.mapTimelinePostToDatabase(post);
      
      const { error } = await supabase
        .from('fasting_timeline_posts')
        .upsert(dbPost);

      if (error) {
        console.error('Error saving timeline post:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in savePost:', error);
      return false;
    }
  }

  async deletePost(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('fasting_timeline_posts')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting timeline post:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deletePost:', error);
      return false;
    }
  }

  private mapDatabaseToTimelinePost(data: any): FastingTimelinePost {
    return {
      id: data.id,
      hour: data.hour,
      title: data.title,
      slug: data.slug,
      content: data.content,
      excerpt: data.excerpt || '',
      featuredImage: data.featured_image,
      author: data.author,
      categories: data.categories || [],
      tags: data.tags || [],
      status: data.status,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      publishedAt: data.published_at || data.created_at,
      metaDescription: data.meta_description,
      metaKeywords: data.meta_keywords,
      whatsHappening: data.whats_happening,
      howYoureFeeling: data.how_youre_feeling
    };
  }

  private mapTimelinePostToDatabase(post: FastingTimelinePost): any {
    return {
      id: post.id,
      hour: post.hour,
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      featured_image: post.featuredImage,
      author: post.author,
      categories: post.categories,
      tags: post.tags,
      status: post.status,
      meta_description: post.metaDescription,
      meta_keywords: post.metaKeywords,
      whats_happening: post.whatsHappening,
      how_youre_feeling: post.howYoureFeeling,
      published_at: post.status === 'published' ? new Date().toISOString() : null
    };
  }

  generateSlug(title: string, hour: number): string {
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .replace(/^-|-$/g, '');
    
    return `hour-${hour}-${baseSlug}`;
  }

  generateId(): string {
    return 'post_' + Math.random().toString(36).substr(2, 9);
  }

  // Migration utility to move localStorage data to database
  async migrateFromLocalStorage(): Promise<void> {
    try {
      console.log('Migrating timeline posts from localStorage to database...');
      
      const storedPosts = localStorage.getItem('timeline_posts');
      if (!storedPosts) {
        console.log('No timeline posts found in localStorage');
        return;
      }

      const posts: FastingTimelinePost[] = JSON.parse(storedPosts);
      console.log(`Found ${posts.length} timeline posts to migrate`);

      for (const post of posts) {
        await this.savePost(post);
      }

      console.log('Timeline posts migration completed successfully!');
    } catch (error) {
      console.error('Error during timeline migration:', error);
    }
  }

  // Clean up localStorage after migration
  cleanupLocalStorage(): void {
    localStorage.removeItem('timeline_posts');
    console.log('Timeline localStorage cleanup completed');
  }
}

export const databaseFastingTimelineService = new DatabaseFastingTimelineService();