import { supabase } from '@/integrations/supabase/client';

export interface SystemMotivator {
  id: string;
  title: string;
  content: string;
  category?: string;
  male_image_url?: string;
  female_image_url?: string;
  slug: string;
  meta_title?: string;
  meta_description?: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export class SystemMotivatorService {
  static async getAllSystemMotivators(): Promise<SystemMotivator[]> {
    console.log('[SystemMotivatorService] Fetching all system motivators...');
    
    const { data, error } = await supabase
      .from('system_motivators')
      .select('*')
      .eq('is_active', true)
      .order('display_order')
      .order('title');

    if (error) {
      console.error('[SystemMotivatorService] Error fetching system motivators:', error);
      throw error;
    }

    console.log(`[SystemMotivatorService] Fetched ${data?.length || 0} system motivators`);
    return data || [];
  }

  static async getSystemMotivatorBySlug(slug: string): Promise<SystemMotivator | null> {
    console.log(`[SystemMotivatorService] Fetching system motivator by slug: ${slug}`);
    
    const { data, error } = await supabase
      .from('system_motivators')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle();

    if (error) {
      console.error('[SystemMotivatorService] Error fetching system motivator by slug:', error);
      throw error;
    }

    console.log(`[SystemMotivatorService] Found system motivator: ${data?.title || 'none'}`);
    return data;
  }

  static async getAllSystemMotivatorsForAdmin(): Promise<SystemMotivator[]> {
    console.log('[SystemMotivatorService] Fetching all system motivators for admin...');
    
    const { data, error } = await supabase
      .from('system_motivators')
      .select('*')
      .order('display_order')
      .order('title');

    if (error) {
      console.error('[SystemMotivatorService] Error fetching system motivators for admin:', error);
      throw error;
    }

    console.log(`[SystemMotivatorService] Fetched ${data?.length || 0} system motivators for admin`);
    return data || [];
  }

  static async createSystemMotivator(motivator: Omit<SystemMotivator, 'id' | 'created_at' | 'updated_at'>): Promise<SystemMotivator> {
    console.log(`[SystemMotivatorService] Creating system motivator: ${motivator.title}`);
    
    const { data, error } = await supabase
      .from('system_motivators')
      .insert([motivator])
      .select()
      .single();

    if (error) {
      console.error('[SystemMotivatorService] Error creating system motivator:', error);
      throw error;
    }

    console.log(`[SystemMotivatorService] Created system motivator: ${data.id}`);
    return data;
  }

  static async updateSystemMotivator(id: string, motivator: Partial<SystemMotivator>): Promise<SystemMotivator> {
    console.log(`[SystemMotivatorService] Updating system motivator: ${id}`);
    
    const { data, error } = await supabase
      .from('system_motivators')
      .update(motivator)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[SystemMotivatorService] Error updating system motivator:', error);
      throw error;
    }

    console.log(`[SystemMotivatorService] Updated system motivator: ${data.id}`);
    return data;
  }

  static async deleteSystemMotivator(id: string): Promise<void> {
    console.log(`[SystemMotivatorService] Deleting system motivator: ${id}`);
    
    const { error } = await supabase
      .from('system_motivators')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[SystemMotivatorService] Error deleting system motivator:', error);
      throw error;
    }

    console.log(`[SystemMotivatorService] Deleted system motivator: ${id}`);
  }

  static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  static async generateUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
    console.log(`[SystemMotivatorService] Generating unique slug for: ${baseSlug}`);
    
    const { data, error } = await supabase.rpc('generate_unique_slug', {
      base_slug: baseSlug,
      table_name: 'system_motivators',
      id_to_exclude: excludeId || null
    });

    if (error) {
      console.error('[SystemMotivatorService] Error generating unique slug:', error);
      throw error;
    }

    return data;
  }
}