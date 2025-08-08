import { supabase } from "@/integrations/supabase/client";
import { FastingHour, FastingHourUpdate } from "@/types/fastingHours";

class FastingHoursService {
  async getAllHours(): Promise<FastingHour[]> {
    try {
      const { data, error } = await supabase
        .from('fasting_hours')
        .select('*')
        .order('hour');

      if (error) {
        console.error('Error fetching fasting hours:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllHours:', error);
      return [];
    }
  }

  async getHourById(id: string): Promise<FastingHour | null> {
    try {
      const { data, error } = await supabase
        .from('fasting_hours')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching hour by ID:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getHourById:', error);
      return null;
    }
  }

  async getHourByNumber(hour: number): Promise<FastingHour | null> {
    try {
      const { data, error } = await supabase
        .from('fasting_hours')
        .select('*')
        .eq('hour', hour)
        .single();

      if (error) {
        console.error('Error fetching hour by number:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getHourByNumber:', error);
      return null;
    }
  }

  async updateHour(id: string, updates: FastingHourUpdate): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('fasting_hours')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('Error updating fasting hour:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateHour:', error);
      return false;
    }
  }

  async createHour(hour: number, data: Partial<FastingHour>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('fasting_hours')
        .insert({
          hour,
          day: Math.ceil(hour / 24),
          title: data.title || `Hour ${hour}`,
          body_state: data.body_state || 'Details coming soon',
          encouragement: data.encouragement || "You're doing great — keep going!",
          positive_symptoms: data.positive_symptoms || [],
          challenging_symptoms: data.challenging_symptoms || [],
          common_feelings: data.common_feelings || [],
          tips: data.tips || [],
          difficulty: data.difficulty || 'easy',
          phase: data.phase || 'preparation',
          motivator_tags: data.motivator_tags || [],
          scientific_info: data.scientific_info || '',
          image_url: data.image_url || null,
          autophagy_milestone: data.autophagy_milestone || false,
          ketosis_milestone: data.ketosis_milestone || false,
          fat_burning_milestone: data.fat_burning_milestone || false,
          ...data
        });

      if (error) {
        console.error('Error creating fasting hour:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in createHour:', error);
      return false;
    }
  }

  async deleteHour(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('fasting_hours')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting fasting hour:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteHour:', error);
      return false;
    }
  }

  // Export functions
  async exportToCSV(): Promise<FastingHour[]> {
    return this.getAllHours();
  }

  async exportToJSON(): Promise<FastingHour[]> {
    return this.getAllHours();
  }
}

export const fastingHoursService = new FastingHoursService();