import { supabase } from '@/integrations/supabase/client';

export class SiteSettingsService {
  // Get a setting by key
  static async getSetting(key: string) {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_value')
        .eq('setting_key', key)
        .single();

      if (error) {
        console.error('Error fetching setting:', error);
        return null;
      }

      return data?.setting_value || null;
    } catch (error) {
      console.error('Exception fetching setting:', error);
      return null;
    }
  }

  // Set a setting by key
  static async setSetting(key: string, value: any) {
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          setting_key: key,
          setting_value: value
        });

      if (error) {
        console.error('Error saving setting:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Exception saving setting:', error);
      return false;
    }
  }

  // Get all settings
  static async getAllSettings() {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');

      if (error) {
        console.error('Error fetching all settings:', error);
        return {};
      }

      // Convert to key-value object
      const settings: Record<string, any> = {};
      data?.forEach(setting => {
        settings[setting.setting_key] = setting.setting_value;
      });

      return settings;
    } catch (error) {
      console.error('Exception fetching all settings:', error);
      return {};
    }
  }

  // Apply design colors to CSS custom properties
  static applyDesignColors(colors: { primary: string; secondary: string }) {
    if (!colors?.primary || !colors?.secondary) return;

    const root = document.documentElement;
    
    // Convert hex to HSL
    const hexToHsl = (hex: string): string => {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }

      return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
    };

    root.style.setProperty('--primary', hexToHsl(colors.primary));
    root.style.setProperty('--secondary', hexToHsl(colors.secondary));
    root.style.setProperty('--accent-green', hexToHsl(colors.primary));
  }

  // Load and apply design colors on app startup
  static async loadAndApplyDesignColors() {
    const colors = await this.getSetting('design_colors');
    if (colors && typeof colors === 'object' && 'primary' in colors && 'secondary' in colors) {
      this.applyDesignColors(colors as { primary: string; secondary: string });
    }
  }
}