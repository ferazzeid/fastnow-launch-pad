import { supabase } from "@/integrations/supabase/client";
import { ImageUploadService } from "./ImageUploadService";

// Blog featured image mappings to Supabase URLs
const BLOG_FEATURED_IMAGES = {
  'blog-featured-1.jpg': 'https://texnkijwcygodtywgedm.supabase.co/storage/v1/object/public/website-images/blog/blog-featured-1.jpg',
  'blog-featured-2.jpg': 'https://texnkijwcygodtywgedm.supabase.co/storage/v1/object/public/website-images/blog/blog-featured-2.jpg',
  'blog-featured-3.jpg': 'https://texnkijwcygodtywgedm.supabase.co/storage/v1/object/public/website-images/blog/blog-featured-3.jpg',
  'blog-featured-4.jpg': 'https://texnkijwcygodtywgedm.supabase.co/storage/v1/object/public/website-images/blog/blog-featured-4.jpg',
  'blog-featured-5.jpg': 'https://texnkijwcygodtywgedm.supabase.co/storage/v1/object/public/website-images/blog/blog-featured-5.jpg',
};

export class BlogImageService {
  static async uploadBlogImage(file: File, filename?: string): Promise<{ url: string; path: string }> {
    return ImageUploadService.uploadImage(file, 'blog', filename);
  }

  static getBlogFeaturedImageUrl(imageName: string): string {
    // Check if it's one of our featured images
    if (BLOG_FEATURED_IMAGES[imageName as keyof typeof BLOG_FEATURED_IMAGES]) {
      return BLOG_FEATURED_IMAGES[imageName as keyof typeof BLOG_FEATURED_IMAGES];
    }
    
    // If it starts with a path, assume it's already a Supabase URL
    if (imageName.startsWith('http')) {
      return imageName;
    }
    
    // Otherwise, construct the Supabase URL
    return ImageUploadService.getPublicUrl(`blog/${imageName}`);
  }

  static async listBlogImages(): Promise<string[]> {
    return ImageUploadService.listImages('blog');
  }

  static async deleteBlogImage(path: string): Promise<void> {
    return ImageUploadService.deleteImage(path);
  }
}
