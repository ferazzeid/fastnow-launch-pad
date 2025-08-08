import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { Upload, X, RefreshCw } from "lucide-react";
import { HomepageSettingsService, type HomepageImageSettings, type HomepageLogoSettings } from "@/services/HomepageSettingsService";

const HomepageLogoSettings = () => {
  const [logoSettings, setLogoSettings] = useState<HomepageLogoSettings | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [heroImageSettings, setHeroImageSettings] = useState<HomepageImageSettings | null>(null);
  const [heroImagePreview, setHeroImagePreview] = useState<string>('');
  
  const [faviconPreview, setFaviconPreview] = useState<string>('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      
      // Try to migrate from localStorage first
      await HomepageSettingsService.migrateFromLocalStorage();
      
      // Load settings from database
      const [logoData, heroImageData] = await Promise.all([
        HomepageSettingsService.getLogoSettings(),
        HomepageSettingsService.getHeroImageSettings()
      ]);

      if (logoData?.url) {
        setLogoSettings(logoData);
        setLogoPreview(logoData.url);
      }

      if (heroImageData?.url) {
        setHeroImageSettings(heroImageData);
        setHeroImagePreview(heroImageData.url);
      }

      // Load favicon from localStorage as backup
      const savedFavicon = localStorage.getItem('fastingApp_faviconUrl');
      if (savedFavicon) {
        setFaviconPreview(savedFavicon);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('File size must be less than 5MB');
      return;
    }

    setLogoPreview(URL.createObjectURL(file));
    setUploading(true);
    
    try {
      const success = await HomepageSettingsService.uploadAndSetLogo(file, logoSettings?.height || 40);
      
      if (success) {
        // Reload settings to get updated data
        await loadSettings();
        toast.success('Logo uploaded successfully and cache cleared');
      } else {
        toast.error('Failed to upload logo');
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Failed to upload logo');
    } finally {
      setUploading(false);
    }
  };

  const handleHeroImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('File size must be less than 10MB');
      return;
    }

    setHeroImagePreview(URL.createObjectURL(file));
    setUploading(true);
    
    try {
      const success = await HomepageSettingsService.uploadAndSetHeroImage(
        file, 
        heroImageSettings?.maxWidth || 500, 
        heroImageSettings?.altText || 'Hero Image'
      );
      
      if (success) {
        // Reload settings to get updated data
        await loadSettings();
        toast.success('Hero image uploaded successfully and cache cleared');
      } else {
        toast.error('Failed to upload hero image');
      }
    } catch (error) {
      console.error('Error uploading hero image:', error);
      toast.error('Failed to upload hero image');
    } finally {
      setUploading(false);
    }
  };

  const handleLogoSizeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const height = parseInt(e.target.value);
    
    if (logoSettings) {
      const updatedSettings = { ...logoSettings, height };
      setLogoSettings(updatedSettings);
      
      const success = await HomepageSettingsService.updateLogoSettings(updatedSettings);
      if (!success) {
        toast.error('Failed to update logo size');
      }
    }
  };

  const handleHeroImageSizeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const maxWidth = parseInt(e.target.value);
    
    if (heroImageSettings) {
      const updatedSettings = { ...heroImageSettings, maxWidth };
      setHeroImageSettings(updatedSettings);
      
      const success = await HomepageSettingsService.updateHeroImageSettings(updatedSettings);
      if (!success) {
        toast.error('Failed to update image size');
      }
    }
  };

  const handleHeroImageAltChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const altText = e.target.value;
    
    if (heroImageSettings) {
      const updatedSettings = { ...heroImageSettings, altText };
      setHeroImageSettings(updatedSettings);
      
      const success = await HomepageSettingsService.updateHeroImageSettings(updatedSettings);
      if (!success) {
        toast.error('Failed to update alt text');
      }
    }
  };

  const removeLogo = async () => {
    const success = await HomepageSettingsService.updateLogoSettings({ url: '', height: 40 });
    
    if (success) {
      setLogoSettings(null);
      setLogoPreview('');
      toast.success('Logo removed and cache cleared');
    } else {
      toast.error('Failed to remove logo');
    }
  };

  const removeHeroImage = async () => {
    const success = await HomepageSettingsService.updateHeroImageSettings({ 
      url: '', 
      maxWidth: 500, 
      altText: 'Hero Image' 
    });
    
    if (success) {
      setHeroImageSettings(null);
      setHeroImagePreview('');
      toast.success('Hero image removed and cache cleared');
    } else {
      toast.error('Failed to remove hero image');
    }
  };

  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) { // 2MB limit for favicon
      toast.error('Favicon file size must be less than 2MB');
      return;
    }

    setFaviconPreview(URL.createObjectURL(file));
    setUploading(true);
    
    try {
      const result = await import('@/services/ImageUploadService').then(m => 
        m.ImageUploadService.uploadImage(file, 'favicons', `favicon-${Date.now()}`)
      );
      
      setFaviconPreview(result.url);
      
      // Save to database instead of just localStorage
      const { pageContentService } = await import('@/services/PageContentService');
      await pageContentService.saveGeneralSetting({
        setting_key: 'site_favicon',
        setting_value: result.url
      });
      
      // Keep localStorage as backup
      localStorage.setItem('fastingApp_faviconUrl', result.url);
      localStorage.setItem('fastingApp_faviconPath', result.path);
      
      // Update favicon in real-time
      const linkElement = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
      if (linkElement) {
        linkElement.href = result.url;
      } else {
        const newLink = document.createElement('link');
        newLink.rel = 'icon';
        newLink.href = result.url;
        document.head.appendChild(newLink);
      }
      
      toast.success('Favicon uploaded and saved to database successfully');
    } catch (error) {
      console.error('Error uploading favicon:', error);
      toast.error('Failed to upload favicon');
    } finally {
      setUploading(false);
    }
  };

  const clearAllCache = async () => {
    const success = await HomepageSettingsService.clearAllSettings();
    
    if (success) {
      setLogoSettings(null);
      setLogoPreview('');
      setHeroImageSettings(null);
      setHeroImagePreview('');
      setFaviconPreview('');
      localStorage.removeItem('fastingApp_faviconUrl');
      localStorage.removeItem('fastingApp_faviconPath');
      toast.success('All cached images cleared and database reset');
    } else {
      toast.error('Failed to clear cache');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Favicon Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload size={20} />
            Favicon Upload
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="favicon-upload">Upload Favicon</Label>
            <Input
              id="favicon-upload"
              type="file"
              accept="image/*"
              onChange={handleFaviconUpload}
              disabled={uploading}
            />
            <p className="text-sm text-muted-foreground mt-1">
              This will be displayed in browser tabs. PNG or JPG format recommended, max 2MB.
            </p>
          </div>
          {faviconPreview && (
            <div className="border rounded p-4 flex justify-center">
              <img 
                src={faviconPreview} 
                alt="Favicon preview" 
                className="max-h-16" 
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Clear Cache Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw size={20} />
            Clear Stuck Images
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            If you're seeing old images that won't update, use this button to clear all cached images and start fresh. 
            This will also clear browser cache by adding cache-busting parameters.
          </p>
          <Button onClick={clearAllCache} variant="destructive" disabled={uploading}>
            <RefreshCw size={16} className="mr-2" />
            Clear All Cached Images
          </Button>
        </CardContent>
      </Card>

      {/* Logo Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload size={20} />
            Site Logo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {logoPreview && (
            <div className="flex items-center gap-4">
              <img 
                src={logoPreview} 
                alt="Logo preview" 
                style={{ height: `${logoSettings?.height || 40}px` }}
                className="border rounded"
              />
              <Button onClick={removeLogo} variant="outline" size="sm" disabled={uploading}>
                <X size={16} className="mr-2" />
                Remove
              </Button>
            </div>
          )}
          
          <div>
            <Label htmlFor="logo-upload">Upload Logo</Label>
            <Input
              id="logo-upload"
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              disabled={uploading}
            />
            <p className="text-sm text-muted-foreground mt-1">
              Recommended: PNG or SVG format, max 5MB. Cache will be automatically cleared.
            </p>
          </div>

          <div>
            <Label htmlFor="logo-size">Logo Height (pixels)</Label>
            <Input
              id="logo-size"
              type="number"
              value={logoSettings?.height || 40}
              onChange={handleLogoSizeChange}
              min="16"
              max="200"
              disabled={uploading}
            />
          </div>
        </CardContent>
      </Card>

      {/* Homepage Image Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload size={20} />
            Homepage Hero Image
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {heroImagePreview && (
            <div className="flex items-center gap-4">
              <img 
                src={heroImagePreview} 
                alt="Homepage image preview" 
                style={{ maxWidth: `${heroImageSettings?.maxWidth || 500}px` }}
                className="border rounded max-h-48 object-contain"
              />
              <Button onClick={removeHeroImage} variant="outline" size="sm" disabled={uploading}>
                <X size={16} className="mr-2" />
                Remove
              </Button>
            </div>
          )}
          
          <div>
            <Label htmlFor="home-image-upload">Upload Homepage Image</Label>
            <Input
              id="home-image-upload"
              type="file"
              accept="image/*"
              onChange={handleHeroImageChange}
              disabled={uploading}
            />
            <p className="text-sm text-muted-foreground mt-1">
              This image appears on the right side of the homepage hero section. Max 10MB. Cache will be automatically cleared.
            </p>
          </div>

          <div>
            <Label htmlFor="home-image-size">Image Max Width (pixels)</Label>
            <Input
              id="home-image-size"
              type="number"
              value={heroImageSettings?.maxWidth || 500}
              onChange={handleHeroImageSizeChange}
              min="200"
              max="800"
              disabled={uploading}
            />
          </div>

          <div>
            <Label htmlFor="home-image-alt">Image Alt Text</Label>
            <Input
              id="home-image-alt"
              type="text"
              value={heroImageSettings?.altText || ''}
              onChange={handleHeroImageAltChange}
              placeholder="Describe the image for accessibility"
              disabled={uploading}
            />
          </div>
        </CardContent>
      </Card>

      {uploading && (
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">Uploading and clearing cache...</p>
        </div>
      )}
    </div>
  );
};

export default HomepageLogoSettings;