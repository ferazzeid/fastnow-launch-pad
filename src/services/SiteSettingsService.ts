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
      console.log('Attempting to save setting:', key, value);
      const { data, error } = await supabase
        .from('site_settings')
        .upsert({
          setting_key: key,
          setting_value: value
        }, {
          onConflict: 'setting_key'
        });

      if (error) {
        console.error('Error saving setting:', error);
        return false;
      }

      console.log('Setting saved successfully:', data);
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
  static applyDesignColors(colors: { primary: string; secondary: string; launchButton?: string }) {
    if (!colors?.primary || !colors?.secondary) {
      console.warn('Invalid colors provided:', colors);
      return;
    }

    console.log('Applying colors:', colors);
    const root = document.documentElement;
    
    // Convert hex to HSL with validation
    const hexToHsl = (hex: string): string => {
      // Remove # if present and validate
      const cleanHex = hex.replace('#', '');
      if (!/^[0-9A-F]{6}$/i.test(cleanHex)) {
        console.error('Invalid hex color:', hex);
        return '0 0% 50%'; // fallback to gray
      }

      const r = parseInt(cleanHex.slice(0, 2), 16) / 255;
      const g = parseInt(cleanHex.slice(2, 4), 16) / 255;
      const b = parseInt(cleanHex.slice(4, 6), 16) / 255;

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

    const primaryHsl = hexToHsl(colors.primary);
    const secondaryHsl = hexToHsl(colors.secondary);

    // Apply colors with console logging for debugging
    console.log('Setting CSS variables:', {
      '--primary': primaryHsl,
      '--secondary': secondaryHsl,
      '--accent-green': primaryHsl
    });

    root.style.setProperty('--primary', primaryHsl);
    root.style.setProperty('--secondary', secondaryHsl);
    root.style.setProperty('--accent-green', primaryHsl);
    root.style.setProperty('--accent-green-light', primaryHsl);
    root.style.setProperty('--accent-green-dark', primaryHsl);

    // Apply launch button color if provided
    if (colors.launchButton) {
      root.style.setProperty('--launch-button-color', colors.launchButton);
    }
  }

  // Load and apply design colors on app startup
  static async loadAndApplyDesignColors() {
    try {
      console.log('Loading design colors from database...');
      const [colors, launchButtonColor] = await Promise.all([
        this.getSetting('design_colors'),
        this.getSetting('launch_button_color')
      ]);
      
      if (colors && typeof colors === 'object' && 'primary' in colors && 'secondary' in colors) {
        console.log('Found saved colors:', colors);
        this.applyDesignColors({
          primary: String(colors.primary),
          secondary: String(colors.secondary),
          launchButton: String(launchButtonColor || '#10B981')
        });
      } else {
        console.log('No saved colors found, using defaults');
        // Apply default colors explicitly to prevent fallback issues
        this.applyDesignColors({
          primary: '#10B981',
          secondary: '#6B7280',
          launchButton: String(launchButtonColor || '#10B981')
        });
      }
    } catch (error) {
      console.error('Error loading design colors:', error);
      // Apply safe defaults on error
      this.applyDesignColors({
        primary: '#10B981',
        secondary: '#6B7280',
        launchButton: '#10B981'
      });
    }
  }
}