import { supabase } from "@/integrations/supabase/client";
import { ImageUploadService } from "./ImageUploadService";

export interface HomepageImageSettings {
  url: string;
  maxWidth?: number;
  altText?: string;
  version?: number; // For cache busting
}

export interface HomepageLogoSettings {
  url: string;
  height?: number;
  version?: number; // For cache busting
}

export class HomepageSettingsService {
  private static addCacheBuster(url: string): string {
    if (!url) return url;
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}v=${Date.now()}`;
  }

  static async getLogoSettings(): Promise<HomepageLogoSettings | null> {
    try {
      const { data, error } = await supabase
        .from('homepage_settings')
        .select('setting_value')
        .eq('setting_key', 'logo')
        .maybeSingle();

      if (error) {
        console.error('Error fetching logo settings:', error);
        return null;
      }

      return (data?.setting_value as unknown as HomepageLogoSettings) || null;
    } catch (error) {
      console.error('Error in getLogoSettings:', error);
      return null;
    }
  }

  static async getHeroImageSettings(): Promise<HomepageImageSettings | null> {
    try {
      const { data, error } = await supabase
        .from('homepage_settings')
        .select('setting_value')
        .eq('setting_key', 'hero_image')
        .maybeSingle();

      if (error) {
        console.error('Error fetching hero image settings:', error);
        return null;
      }

      return (data?.setting_value as unknown as HomepageImageSettings) || null;
    } catch (error) {
      console.error('Error in getHeroImageSettings:', error);
      return null;
    }
  }

  static async updateLogoSettings(settings: HomepageLogoSettings): Promise<boolean> {
    try {
      // Add version for cache busting
      const settingsWithVersion = {
        ...settings,
        version: Date.now()
      };

      const { error } = await supabase
        .from('homepage_settings')
        .upsert({
          setting_key: 'logo',
          setting_value: settingsWithVersion
        }, {
          onConflict: 'setting_key'
        });

      if (error) {
        console.error('Error updating logo settings:', error);
        return false;
      }

      // Clear localStorage cache
      this.clearLocalStorageCache();
      
      return true;
    } catch (error) {
      console.error('Error in updateLogoSettings:', error);
      return false;
    }
  }

  static async updateHeroImageSettings(settings: HomepageImageSettings): Promise<boolean> {
    try {
      // Add version for cache busting
      const settingsWithVersion = {
        ...settings,
        version: Date.now()
      };

      const { error } = await supabase
        .from('homepage_settings')
        .upsert({
          setting_key: 'hero_image',
          setting_value: settingsWithVersion
        }, {
          onConflict: 'setting_key'
        });

      if (error) {
        console.error('Error updating hero image settings:', error);
        return false;
      }

      // Clear localStorage cache
      this.clearLocalStorageCache();
      
      return true;
    } catch (error) {
      console.error('Error in updateHeroImageSettings:', error);
      return false;
    }
  }

  static async uploadAndSetLogo(file: File, height?: number): Promise<boolean> {
    try {
      // Get current logo to delete it
      const currentLogo = await this.getLogoSettings();
      
      // Upload new logo
      const uploadResult = await ImageUploadService.uploadImage(file, 'homepage', `logo-${Date.now()}`);
      
      // Delete old logo if it exists
      if (currentLogo?.url) {
        try {
          const oldPath = this.extractPathFromUrl(currentLogo.url);
          if (oldPath) {
            await ImageUploadService.deleteImage(oldPath);
          }
        } catch (deleteError) {
          console.warn('Could not delete old logo:', deleteError);
        }
      }

      // Update settings with cache-busted URL
      const logoSettings: HomepageLogoSettings = {
        url: this.addCacheBuster(uploadResult.url),
        height: height || 40
      };

      return await this.updateLogoSettings(logoSettings);
    } catch (error) {
      console.error('Error in uploadAndSetLogo:', error);
      return false;
    }
  }

  static async uploadAndSetHeroImage(file: File, maxWidth?: number, altText?: string): Promise<boolean> {
    try {
      // Get current hero image to delete it
      const currentHeroImage = await this.getHeroImageSettings();
      
      // Upload new hero image
      const uploadResult = await ImageUploadService.uploadImage(file, 'homepage', `hero-${Date.now()}`);
      
      // Delete old hero image if it exists
      if (currentHeroImage?.url) {
        try {
          const oldPath = this.extractPathFromUrl(currentHeroImage.url);
          if (oldPath) {
            await ImageUploadService.deleteImage(oldPath);
          }
        } catch (deleteError) {
          console.warn('Could not delete old hero image:', deleteError);
        }
      }

      // Update settings with cache-busted URL
      const heroImageSettings: HomepageImageSettings = {
        url: this.addCacheBuster(uploadResult.url),
        maxWidth: maxWidth || 500,
        altText: altText || 'Hero Image'
      };

      return await this.updateHeroImageSettings(heroImageSettings);
    } catch (error) {
      console.error('Error in uploadAndSetHeroImage:', error);
      return false;
    }
  }

  static async clearAllSettings(): Promise<boolean> {
    try {
      // Get current settings to delete images
      const [logoSettings, heroImageSettings] = await Promise.all([
        this.getLogoSettings(),
        this.getHeroImageSettings()
      ]);

      // Delete images from storage
      const deletePromises: Promise<void>[] = [];
      
      if (logoSettings?.url) {
        const logoPath = this.extractPathFromUrl(logoSettings.url);
        if (logoPath) {
          deletePromises.push(ImageUploadService.deleteImage(logoPath));
        }
      }

      if (heroImageSettings?.url) {
        const heroPath = this.extractPathFromUrl(heroImageSettings.url);
        if (heroPath) {
          deletePromises.push(ImageUploadService.deleteImage(heroPath));
        }
      }

      // Wait for image deletions (but don't fail if they error)
      await Promise.allSettled(deletePromises);

      // Clear database settings
      const { error } = await supabase
        .from('homepage_settings')
        .update({
          setting_value: { url: '', height: 40, maxWidth: 500, altText: 'Hero Image' }
        })
        .in('setting_key', ['logo', 'hero_image']);

      if (error) {
        console.error('Error clearing settings:', error);
        return false;
      }

      // Clear localStorage cache
      this.clearLocalStorageCache();

      return true;
    } catch (error) {
      console.error('Error in clearAllSettings:', error);
      return false;
    }
  }

  private static extractPathFromUrl(url: string): string | null {
    try {
      // Extract path from Supabase URL
      const match = url.match(/\/storage\/v1\/object\/public\/[^\/]+\/(.+?)(?:\?|$)/);
      return match ? match[1] : null;
    } catch (error) {
      console.error('Error extracting path from URL:', error);
      return null;
    }
  }

  private static clearLocalStorageCache(): void {
    try {
      // Clear old localStorage entries that might cause conflicts
      localStorage.removeItem('fastingApp_logoUrl');
      localStorage.removeItem('fastingApp_logoHeight');
      localStorage.removeItem('fastingApp_homeImageUrl');
      localStorage.removeItem('fastingApp_homeImageSize');
      localStorage.removeItem('fastingApp_homeImageAlt');
    } catch (error) {
      console.error('Error clearing localStorage cache:', error);
    }
  }

  // Migration helper - move localStorage data to database
  static async migrateFromLocalStorage(): Promise<void> {
    try {
      const logoUrl = localStorage.getItem('fastingApp_logoUrl');
      const logoHeight = localStorage.getItem('fastingApp_logoHeight');
      const homeImageUrl = localStorage.getItem('fastingApp_homeImageUrl');
      const homeImageSize = localStorage.getItem('fastingApp_homeImageSize');
      const homeImageAlt = localStorage.getItem('fastingApp_homeImageAlt');

      // Migrate logo if exists
      if (logoUrl) {
        const logoSettings: HomepageLogoSettings = {
          url: logoUrl,
          height: logoHeight ? parseInt(logoHeight) : 40
        };
        await this.updateLogoSettings(logoSettings);
      }

      // Migrate hero image if exists
      if (homeImageUrl) {
        const heroImageSettings: HomepageImageSettings = {
          url: homeImageUrl,
          maxWidth: homeImageSize ? parseInt(homeImageSize) : 500,
          altText: homeImageAlt || 'Hero Image'
        };
        await this.updateHeroImageSettings(heroImageSettings);
      }

      // Clear localStorage after migration
      this.clearLocalStorageCache();
    } catch (error) {
      console.error('Error migrating from localStorage:', error);
    }
  }
}