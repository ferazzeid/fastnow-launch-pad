import { supabase } from "@/integrations/supabase/client";

export interface FeatureScreenshot {
  id: string;
  feature_key: string;
  image_url: string;
  title: string;
  alt_text?: string;
  created_at: string;
  updated_at: string;
}

export class FeatureScreenshotService {
  static async getFeatureScreenshots(): Promise<FeatureScreenshot[]> {
    const { data, error } = await supabase
      .from('feature_screenshots')
      .select('*')
      .order('feature_key');
    
    if (error) {
      console.error('Error fetching feature screenshots:', error);
      throw error;
    }
    
    return data || [];
  }

  static async getFeatureScreenshot(featureKey: string): Promise<FeatureScreenshot | null> {
    const { data, error } = await supabase
      .from('feature_screenshots')
      .select('*')
      .eq('feature_key', featureKey)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching feature screenshot:', error);
      throw error;
    }
    
    return data;
  }

  static async updateFeatureScreenshot(featureKey: string, imageUrl: string, title: string, altText?: string): Promise<void> {
    const updateData: any = {
      image_url: imageUrl,
      title: title,
      updated_at: new Date().toISOString()
    };

    if (altText !== undefined) {
      updateData.alt_text = altText;
    }

    const { error } = await supabase
      .from('feature_screenshots')
      .update(updateData)
      .eq('feature_key', featureKey);
    
    if (error) {
      console.error('Error updating feature screenshot:', error);
      throw error;
    }
  }
}