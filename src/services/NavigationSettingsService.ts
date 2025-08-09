import { supabase } from '@/integrations/supabase/client';

export interface NavigationSetting {
  id: string;
  page_key: string;
  is_visible: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export class NavigationSettingsService {
  static async getNavigationSettings(): Promise<NavigationSetting[]> {
    try {
      const { data, error } = await supabase
        .from('navigation_settings')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching navigation settings:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getNavigationSettings:', error);
      return [];
    }
  }

  static async updateNavigationSetting(pageKey: string, isVisible: boolean): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('navigation_settings')
        .update({ is_visible: isVisible })
        .eq('page_key', pageKey);

      if (error) {
        console.error('Error updating navigation setting:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateNavigationSetting:', error);
      return false;
    }
  }

  static async updateDisplayOrder(pageKey: string, displayOrder: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('navigation_settings')
        .update({ display_order: displayOrder })
        .eq('page_key', pageKey);

      if (error) {
        console.error('Error updating display order:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateDisplayOrder:', error);
      return false;
    }
  }
}