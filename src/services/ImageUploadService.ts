import { supabase } from "@/integrations/supabase/client";

export interface UploadResult {
  url: string;
  path: string;
}

export class ImageUploadService {
  private static BUCKET_NAME = 'website-images';

  static async uploadImage(file: File, folder: string, filename?: string): Promise<UploadResult> {
    try {
      // Generate a unique filename if not provided
      const timestamp = Date.now();
      const extension = file.name.split('.').pop();
      const finalFilename = filename || `${timestamp}-${Math.random().toString(36).substring(7)}.${extension}`;
      const path = `${folder}/${finalFilename}`;

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(path);

      return {
        url: publicUrl,
        path: data.path
      };
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  }

  static async deleteImage(path: string): Promise<void> {
    try {
      const { error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([path]);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting image:', error);
      throw new Error('Failed to delete image');
    }
  }

  static async listImages(folder: string): Promise<string[]> {
    try {
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list(folder);

      if (error) throw error;

      return data?.map(file => `${folder}/${file.name}`) || [];
    } catch (error) {
      console.error('Error listing images:', error);
      return [];
    }
  }

  static getPublicUrl(path: string): string {
    const { data: { publicUrl } } = supabase.storage
      .from(this.BUCKET_NAME)
      .getPublicUrl(path);
    
    return publicUrl;
  }

  /**
   * Extract storage path from Supabase public URL
   * Example: https://texnkijwcygodtywgedm.supabase.co/storage/v1/object/public/website-images/blog/image.jpg
   * Returns: blog/image.jpg
   */
  static extractPathFromUrl(url: string): string | null {
    try {
      if (!url || !url.includes('/storage/v1/object/public/')) return null;
      
      const parts = url.split('/storage/v1/object/public/website-images/');
      return parts[1] || null;
    } catch (error) {
      console.error('Error extracting path from URL:', error);
      return null;
    }
  }

  /**
   * Delete old image and upload new one
   */
  static async replaceImage(file: File, folder: string, oldImageUrl?: string, filename?: string): Promise<UploadResult> {
    // Delete old image if it exists and is from our storage
    if (oldImageUrl) {
      const oldPath = this.extractPathFromUrl(oldImageUrl);
      if (oldPath) {
        try {
          await this.deleteImage(oldPath);
        } catch (error) {
          console.warn('Failed to delete old image:', error);
          // Continue with upload even if deletion fails
        }
      }
    }

    // Upload new image
    return this.uploadImage(file, folder, filename);
  }
}