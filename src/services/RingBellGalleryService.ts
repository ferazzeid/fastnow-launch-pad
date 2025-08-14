import { supabase } from '@/integrations/supabase/client';

export interface RingBellGalleryItem {
  id: string;
  order_position: number;
  initial_state: 'image' | 'text';
  front_image_url?: string;
  front_text?: string;
  back_image_url?: string;
  back_text?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export class RingBellGalleryService {
  async getAllItems(): Promise<RingBellGalleryItem[]> {
    try {
      const { data, error } = await supabase
        .from('ring_bell_gallery_items')
        .select('*')
        .eq('is_active', true)
        .order('order_position');

      if (error) throw error;
      return (data || []) as RingBellGalleryItem[];
    } catch (error) {
      console.error('Error fetching ring bell gallery items:', error);
      return [];
    }
  }

  async getAllItemsForAdmin(): Promise<RingBellGalleryItem[]> {
    try {
      const { data, error } = await supabase
        .from('ring_bell_gallery_items')
        .select('*')
        .order('order_position');

      if (error) throw error;
      return (data || []) as RingBellGalleryItem[];
    } catch (error) {
      console.error('Error fetching ring bell gallery items for admin:', error);
      return [];
    }
  }

  async getItemByPosition(position: number): Promise<RingBellGalleryItem | null> {
    try {
      const { data, error } = await supabase
        .from('ring_bell_gallery_items')
        .select('*')
        .eq('order_position', position)
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;
      return data as RingBellGalleryItem;
    } catch (error) {
      console.error('Error fetching ring bell gallery item by position:', error);
      return null;
    }
  }

  async saveItem(item: Omit<RingBellGalleryItem, 'id' | 'created_at' | 'updated_at'>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('ring_bell_gallery_items')
        .upsert({
          ...item,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'order_position'
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error saving ring bell gallery item:', error);
      return false;
    }
  }

  async updateItem(id: string, updates: Partial<RingBellGalleryItem>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('ring_bell_gallery_items')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating ring bell gallery item:', error);
      return false;
    }
  }

  async deleteItem(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('ring_bell_gallery_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting ring bell gallery item:', error);
      return false;
    }
  }

  async reorderItems(items: { id: string; order_position: number }[]): Promise<boolean> {
    try {
      const promises = items.map(item =>
        supabase
          .from('ring_bell_gallery_items')
          .update({ 
            order_position: item.order_position,
            updated_at: new Date().toISOString()
          })
          .eq('id', item.id)
      );

      const results = await Promise.all(promises);
      const hasError = results.some(result => result.error);
      
      if (hasError) {
        console.error('Error reordering items');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error reordering ring bell gallery items:', error);
      return false;
    }
  }
}

export const ringBellGalleryService = new RingBellGalleryService();