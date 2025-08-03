import { supabase } from "@/integrations/supabase/client";
import { BlogPost } from "@/types/blog";

class DatabaseBlogService {
  async getAllPosts(): Promise<BlogPost[]> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) {
        console.error('Error fetching blog posts:', error);
        return [];
      }

      return data?.map(this.mapDatabaseToBlogPost) || [];
    } catch (error) {
      console.error('Error in getAllPosts:', error);
      return [];
    }
  }

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) {
        console.error('Error fetching blog post:', error);
        return null;
      }

      return data ? this.mapDatabaseToBlogPost(data) : null;
    } catch (error) {
      console.error('Error in getPostBySlug:', error);
      return null;
    }
  }

  async getPostById(id: string): Promise<BlogPost | null> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching blog post by ID:', error);
        return null;
      }

      return data ? this.mapDatabaseToBlogPost(data) : null;
    } catch (error) {
      console.error('Error in getPostById:', error);
      return null;
    }
  }

  async savePost(post: BlogPost): Promise<boolean> {
    try {
      const dbPost = this.mapBlogPostToDatabase(post);
      
      const { error } = await supabase
        .from('blog_posts')
        .upsert(dbPost);

      if (error) {
        console.error('Error saving blog post:', error);
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
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting blog post:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deletePost:', error);
      return false;
    }
  }

  private mapDatabaseToBlogPost(data: any): BlogPost {
    return {
      id: data.id,
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
      metaKeywords: data.meta_keywords
    };
  }

  private mapBlogPostToDatabase(post: BlogPost): any {
    return {
      id: post.id,
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
      published_at: post.status === 'published' ? new Date().toISOString() : null
    };
  }

  // Migration utility to move localStorage data to database
  async migrateFromLocalStorage(): Promise<void> {
    try {
      console.log('Migrating blog posts from localStorage to database...');
      
      const storedPosts = localStorage.getItem('blog_posts');
      if (!storedPosts) {
        console.log('No blog posts found in localStorage');
        return;
      }

      const posts: BlogPost[] = JSON.parse(storedPosts);
      console.log(`Found ${posts.length} blog posts to migrate`);

      for (const post of posts) {
        await this.savePost(post);
      }

      console.log('Blog posts migration completed successfully!');
    } catch (error) {
      console.error('Error during blog migration:', error);
    }
  }

  // Clean up localStorage after migration
  cleanupLocalStorage(): void {
    localStorage.removeItem('blog_posts');
    console.log('Blog localStorage cleanup completed');
  }
}

export const databaseBlogService = new DatabaseBlogService();