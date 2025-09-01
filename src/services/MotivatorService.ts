import { supabase } from "@/integrations/supabase/client";

export interface Motivator {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category?: string;
  image_url?: string;
  link_url?: string;
  slug: string;
  meta_title?: string;
  meta_description?: string;
  is_published: boolean;
  is_active: boolean;
  show_in_animations: boolean;
  gender?: string;
  is_system_goal?: boolean;
  created_at: string;
  updated_at: string;
}

export class MotivatorService {
  static async getAllMotivators(): Promise<Motivator[]> {
    const { data, error } = await supabase
      .from('motivators')
      .select('*')
      .eq('is_active', true)
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching motivators:', error);
      throw error;
    }

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
    const { data, error } = await supabase
      .from('motivators')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching motivators for admin:', error);
      throw error;
    }

    return data || [];
  }

  static async getUnifiedSystemGoals(): Promise<Motivator[]> {
    try {
      const { data, error } = await supabase
        .from('motivators')
        .select('*')
        .match({ 
          is_system_goal: true,
          is_active: true,
          is_published: true
        })
        .order('title', { ascending: true });

      if (error) {
        console.error('Error fetching unified system goals:', error);
        throw error;
      }

      if (!data || data.length === 0) return [];

      // Group by title to get unique goal types
      const goalsByTitle: { [key: string]: Motivator[] } = {};
      data.forEach((goal: any) => {
        const baseTitle = goal.title.replace(/-male$|-female$/i, '').trim();
        if (!goalsByTitle[baseTitle]) {
          goalsByTitle[baseTitle] = [];
        }
        goalsByTitle[baseTitle].push(goal as Motivator);
      });

      // Get unique goal types and select mix of male/female
      const uniqueGoals = Object.values(goalsByTitle);
      const selectedGoals: Motivator[] = [];
      
      // Take first 8 unique goal types and alternate male/female when possible
      for (let i = 0; i < Math.min(8, uniqueGoals.length); i++) {
        const goalGroup = uniqueGoals[i];
        if (goalGroup.length > 1) {
          // Pick male for even indices, female for odd indices
          const preferMale = i % 2 === 0;
          const maleGoal = goalGroup.find(g => g.gender === 'male');
          const femaleGoal = goalGroup.find(g => g.gender === 'female');
          
          if (preferMale && maleGoal) {
            selectedGoals.push(maleGoal);
          } else if (!preferMale && femaleGoal) {
            selectedGoals.push(femaleGoal);
          } else {
            // Fallback to any available
            selectedGoals.push(goalGroup[0]);
          }
        } else {
          selectedGoals.push(goalGroup[0]);
        }
      }

      return selectedGoals;
    } catch (error) {
      console.error('Error in getUnifiedSystemGoals:', error);
      // Fallback to regular method if this fails
      return this.getAllMotivators();
    }
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