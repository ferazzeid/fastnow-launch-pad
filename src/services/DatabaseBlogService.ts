import { supabase } from "@/integrations/supabase/client";
import { BlogPost } from "@/types/blog";

class DatabaseBlogService {
  async getAllPosts(): Promise<BlogPost[]> {
    try {
      console.log('DatabaseBlogService: Starting getAllPosts...');
      
      // Check current session before making the query
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      console.log('DatabaseBlogService: Current session status:', {
        hasSession: !!session,
        hasUser: !!session?.user,
        userEmail: session?.user?.email,
        sessionError: sessionError?.message,
        accessToken: session?.access_token ? 'present' : 'missing'
      });
      
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      console.log('DatabaseBlogService: Query result:', {
        hasData: !!data,
        dataLength: data?.length || 0,
        error: error?.message || 'none',
        errorDetails: error
      });

      if (error) {
        console.error('DatabaseBlogService: Error fetching blog posts:', error);
        return [];
      }

      const mappedPosts = data?.map(this.mapDatabaseToBlogPost) || [];
      console.log('DatabaseBlogService: Mapped posts count:', mappedPosts.length);
      return mappedPosts;
    } catch (error) {
      console.error('DatabaseBlogService: Error in getAllPosts:', error);
      return [];
    }
  }

  async getAllPostsForAdmin(): Promise<BlogPost[]> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching all blog posts for admin:', error);
        return [];
      }

      return data?.map(this.mapDatabaseToBlogPost) || [];
    } catch (error) {
      console.error('Error in getAllPostsForAdmin:', error);
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
        .maybeSingle();

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
        .maybeSingle();

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
      console.log('Attempting to save blog post:', { 
        id: post.id, 
        title: post.title, 
        status: post.status,
        hasContent: !!post.content,
        hasSlug: !!post.slug 
      });
      
      const dbPost = this.mapBlogPostToDatabase(post);
      
      console.log('Mapped database post:', dbPost);
      
      const { data, error } = await supabase
        .from('blog_posts')
        .upsert(dbPost)
        .select();

      if (error) {
        console.error('Detailed Supabase error:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        return false;
      }

      console.log('Blog post saved successfully:', data);
      return true;
    } catch (error) {
      console.error('Detailed error in savePost:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
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
      featuredImageAlt: data.featured_image_alt || '',
      videoUrl: data.video_url || '',
      author: data.author,
      categories: data.categories || [],
      tags: data.tags || [],
      status: data.status,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      publishedAt: data.published_at || data.created_at,
      metaDescription: data.meta_description,
      metaKeywords: data.meta_keywords,
      showAuthorBox: data.show_author_box ?? true
    };
  }

  private mapBlogPostToDatabase(post: BlogPost): any {
    const dbPost = {
      id: post.id,
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt || '',
      featured_image: post.featuredImage || null,
      featured_image_alt: post.featuredImageAlt || null,
      video_url: post.videoUrl || null,
      author: post.author || 'FastNow Team',
      categories: post.categories || [],
      tags: post.tags || [],
      status: post.status || 'draft',
      meta_description: post.metaDescription || null,
      meta_keywords: post.metaKeywords || null,
      show_author_box: post.showAuthorBox ?? true,
      published_at: post.status === 'published' ? new Date().toISOString() : null,
      updated_at: new Date().toISOString()
    };
    
    console.log('Mapping blog post to database format:', {
      original: {
        id: post.id,
        title: post.title,
        status: post.status,
        categoriesLength: post.categories?.length,
        tagsLength: post.tags?.length,
        showAuthorBox: post.showAuthorBox
      },
      mapped: {
        id: dbPost.id,
        title: dbPost.title,
        status: dbPost.status,
        categoriesLength: dbPost.categories?.length,
        tagsLength: dbPost.tags?.length,
        show_author_box: dbPost.show_author_box,
        hasPublishedAt: !!dbPost.published_at
      }
    });
    
    return dbPost;
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