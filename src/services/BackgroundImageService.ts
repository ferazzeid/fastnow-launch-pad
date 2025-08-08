import { supabase } from '@/integrations/supabase/client';

export interface BackgroundImage {
  id: string;
  name: string;
  image_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export class BackgroundImageService {
  static async getAllImages(): Promise<BackgroundImage[]> {
    const { data, error } = await supabase
      .from('background_images')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching background images:', error);
      throw error;
    }

    return data || [];
  }

  static async getActiveImage(): Promise<BackgroundImage | null> {
    const { data, error } = await supabase
      .from('background_images')
      .select('*')
      .eq('is_active', true)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching active background image:', error);
      throw error;
    }

    return data || null;
  }

  static async uploadImage(file: File, name: string): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `backgrounds/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('background-images')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('background-images')
      .getPublicUrl(filePath);

    return publicUrl;
  }

  static async createBackgroundImage(name: string, imageUrl: string): Promise<BackgroundImage> {
    const { data, error } = await supabase
      .from('background_images')
      .insert({
        name,
        image_url: imageUrl,
        is_active: false
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating background image:', error);
      throw error;
    }

    return data;
  }

  static async setActiveImage(id: string): Promise<void> {
    // First, deactivate all images
    const { error: deactivateError } = await supabase
      .from('background_images')
      .update({ is_active: false })
      .neq('id', 'dummy'); // Update all rows

    if (deactivateError) {
      console.error('Error deactivating images:', deactivateError);
      throw deactivateError;
    }

    // Then activate the selected image
    const { error: activateError } = await supabase
      .from('background_images')
      .update({ is_active: true })
      .eq('id', id);

    if (activateError) {
      console.error('Error activating image:', activateError);
      throw activateError;
    }
  }

  static async deleteImage(id: string): Promise<void> {
    const { error } = await supabase
      .from('background_images')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting background image:', error);
      throw error;
    }
  }
}