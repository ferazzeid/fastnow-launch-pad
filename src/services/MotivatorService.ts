import { supabase } from "@/integrations/supabase/client";

export interface Motivator {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category?: string;
  image_url?: string;
  male_image_url?: string;
  female_image_url?: string;
  link_url?: string;
  slug: string;
  meta_title?: string;
  meta_description?: string;
  is_published: boolean;
  is_active: boolean;
  show_in_animations: boolean;
  created_at: string;
  updated_at: string;
}

export class MotivatorService {
  static async getAllMotivators(): Promise<Motivator[]> {
    console.log('[MotivatorService] Fetching all user motivators...');
    
    const { data, error } = await supabase
      .from('motivators')
      .select('*')
      .eq('is_active', true)
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[MotivatorService] Error fetching motivators:', error);
      throw error;
    }

    console.log(`[MotivatorService] Fetched ${data?.length || 0} user motivators`);
    return data || [];
  }

  static async getMotivatorBySlug(slug: string): Promise<Motivator | null> {
    const { data, error } = await supabase
      .from('motivators')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .eq('is_published', true)
      .maybeSingle();

    if (error) {
      console.error('Error fetching motivator by slug:', error);
      throw error;
    }

    return data;
  }

  static async getAllMotivatorsForAdmin(): Promise<Motivator[]> {
    console.log('[MotivatorService] Fetching all user motivators for admin...');
    
    const { data, error } = await supabase
      .from('motivators')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[MotivatorService] Error fetching user motivators for admin:', error);
      throw error;
    }

    console.log(`[MotivatorService] Fetched ${data?.length || 0} user motivators for admin`);
    return data || [];
  }

  static async getUnifiedSystemGoals(): Promise<Motivator[]> {
    console.log('[MotivatorService] This method is deprecated. Use SystemMotivatorService.getAllSystemMotivators() instead.');
    
    // Import SystemMotivatorService dynamically to avoid circular imports
    const { SystemMotivatorService } = await import('./SystemMotivatorService');
    const systemMotivators = await SystemMotivatorService.getAllSystemMotivators();
    
    // Convert SystemMotivator to Motivator format for backward compatibility
    return systemMotivators.map(motivator => ({
      ...motivator,
      user_id: 'system', // Placeholder since this is system data
      is_active: motivator.is_active,
      is_published: true,
      is_system_goal: true, // For backward compatibility
      show_in_animations: true,
      image_url: motivator.male_image_url || motivator.female_image_url,
      link_url: null,
      gender: null
    }));
  }

  static async createMotivator(motivator: Omit<Motivator, 'id' | 'created_at' | 'updated_at'>): Promise<Motivator> {
    const { data, error } = await supabase
      .from('motivators')
      .insert([motivator])
      .select()
      .single();

    if (error) {
      console.error('Error creating motivator:', error);
      throw error;
    }

    // Sync to SEO settings
    try {
      const { PageSEOService } = await import('./PageSEOService');
      await PageSEOService.syncMotivatorURLsToSEO();
    } catch (error) {
      console.warn('Failed to sync motivator to SEO settings:', error);
    }

    return data;
  }

  static async updateMotivator(id: string, motivator: Partial<Motivator>): Promise<Motivator> {
    const { data, error } = await supabase
      .from('motivators')
      .update(motivator)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating motivator:', error);
      throw error;
    }

    // Sync to SEO settings if slug or publication status changed
    if (motivator.slug || motivator.is_published !== undefined || motivator.is_active !== undefined) {
      try {
        const { PageSEOService } = await import('./PageSEOService');
        await PageSEOService.syncMotivatorURLsToSEO();
      } catch (error) {
        console.warn('Failed to sync motivator to SEO settings:', error);
      }
    }

    return data;
  }

  static async deleteMotivator(id: string): Promise<void> {
    const { error } = await supabase
      .from('motivators')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting motivator:', error);
      throw error;
    }
  }

  static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  }

  static async generateUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
    const { data } = await supabase.rpc('generate_unique_slug', {
      base_slug: baseSlug,
      table_name: 'motivators',
      id_to_exclude: excludeId || null
    });

    return data || baseSlug;
  }
}