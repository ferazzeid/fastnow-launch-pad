import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { ArrowLeft, Save, Settings, Upload, Trash2, Languages } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { SiteSettingsService } from '@/services/SiteSettingsService';
import { ImageUploadService } from '@/services/ImageUploadService';
import { pageContentService } from '@/services/PageContentService';
import BlogTypographySettings from '@/components/admin/BlogTypographySettings';
import SocialMediaSettings from '@/components/admin/SocialMediaSettings';
import AdminTranslations from './AdminTranslations';

interface GeneralSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  appStoreUrl: string;
  playStoreUrl: string;
  defaultTimezone: string;
  supportUrl: string;
  companyName: string;
  googleAnalyticsId: string;
  defaultIndexable: boolean;
}

interface DesignSettings {
  primaryColor: string;
  secondaryColor: string;
}

interface LogoFaviconSettings {
  logoUrl: string;
  logoHeight: number;
  faviconUrl: string;
}

const AdminGeneral = () => {
  const [settings, setSettings] = useState<GeneralSettings>({
    siteName: 'FastingApp',
    siteDescription: 'Your personal fasting companion',
    contactEmail: 'support@fastingapp.com',
    appStoreUrl: '',
    playStoreUrl: '',
    defaultTimezone: 'UTC',
    supportUrl: '',
    companyName: 'FastingApp Inc.',
    googleAnalyticsId: '',
    defaultIndexable: true,
  });
  const [designSettings, setDesignSettings] = useState<DesignSettings>({
    primaryColor: '#10B981',
    secondaryColor: '#6B7280'
  });
  const [logoFaviconSettings, setLogoFaviconSettings] = useState<LogoFaviconSettings>({
    logoUrl: '',
    logoHeight: 40,
    faviconUrl: ''
  });
  const [uploading, setUploading] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('fastingApp_generalSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Error loading general settings:', error);
      }
    }
    // Load design settings and logo/favicon
    loadDesignSettings();
    loadLogoFaviconSettings();
  }, []);

  // Real-time preview effect for colors
  useEffect(() => {
    const previewColors = { primary: designSettings.primaryColor, secondary: designSettings.secondaryColor };
    SiteSettingsService.applyDesignColors(previewColors);
  }, [designSettings.primaryColor, designSettings.secondaryColor]);

  const loadDesignSettings = async () => {
    try {
      const settings = await SiteSettingsService.getSetting('design_colors');
      if (settings && typeof settings === 'object' && 'primary' in settings && 'secondary' in settings) {
        const colors = settings as { primary: string; secondary: string };
        setDesignSettings({
          primaryColor: colors.primary || '#10B981',
          secondaryColor: colors.secondary || '#6B7280'
        });
      }
    } catch (error) {
      console.error('Error loading design settings:', error);
    }
  };

  const loadLogoFaviconSettings = async () => {
    try {
      // Load logo settings
      const logoData = await SiteSettingsService.getSetting('logo');
      if (logoData && typeof logoData === 'object') {
        const logoSettings = logoData as { url?: string; height?: number };
        setLogoFaviconSettings(prev => ({
          ...prev,
          logoUrl: logoSettings.url || '',
          logoHeight: logoSettings.height || 40
        }));
      }

      // Load favicon settings
      const faviconData = await pageContentService.getGeneralSetting('site_favicon');
      if (faviconData?.setting_value) {
        let faviconUrl = '';
        if (typeof faviconData.setting_value === 'string') {
          faviconUrl = faviconData.setting_value;
        } else if (typeof faviconData.setting_value === 'object' && faviconData.setting_value.url) {
          faviconUrl = faviconData.setting_value.url;
        }
        
        if (faviconUrl) {
          setLogoFaviconSettings(prev => ({ ...prev, faviconUrl }));
        }
      }
    } catch (error) {
      console.error('Error loading logo/favicon settings:', error);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('Logo file size must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const result = await ImageUploadService.uploadImage(
        file, 
        'website-images', 
        `logo-${Date.now()}`
      );

      const newLogoSettings = {
        url: result.url,
        height: logoFaviconSettings.logoHeight
      };

      await SiteSettingsService.setSetting('logo', newLogoSettings);
      
      setLogoFaviconSettings(prev => ({ ...prev, logoUrl: result.url }));
      
      // Update favicon in DOM and localStorage
      updateFaviconInDOM(result.url);
      localStorage.setItem('fastingApp_logoUrl', result.url);
      
      toast.success('Logo uploaded successfully');
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Failed to upload logo');
    } finally {
      setUploading(false);
    }
  };

  const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (PNG/JPG)');
      return;
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB limit for favicon
      toast.error('Favicon file size must be less than 2MB');
      return;
    }

    setUploading(true);
    try {
      const result = await ImageUploadService.uploadImage(
        file, 
        'website-images', 
        `favicon-${Date.now()}`
      );

      // Save to database
      await pageContentService.saveGeneralSetting({
        setting_key: 'site_favicon',
        setting_value: result.url
      });

      setLogoFaviconSettings(prev => ({ ...prev, faviconUrl: result.url }));
      
      // Update favicon in DOM and localStorage
      updateFaviconInDOM(result.url);
      localStorage.setItem('fastingApp_faviconUrl', result.url);
      
      toast.success('Favicon uploaded successfully');
    } catch (error) {
      console.error('Error uploading favicon:', error);
      toast.error('Failed to upload favicon');
    } finally {
      setUploading(false);
    }
  };

  const updateFaviconInDOM = (faviconUrl: string) => {
    let linkElement = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    if (!linkElement) {
      linkElement = document.createElement('link');
      linkElement.rel = 'icon';
      document.head.appendChild(linkElement);
    }
    linkElement.href = faviconUrl;
    linkElement.type = 'image/png';
  };

  const removeLogo = async () => {
    try {
      await SiteSettingsService.setSetting('logo', { url: '', height: 40 });
      setLogoFaviconSettings(prev => ({ ...prev, logoUrl: '' }));
      localStorage.removeItem('fastingApp_logoUrl');
      toast.success('Logo removed successfully');
    } catch (error) {
      console.error('Error removing logo:', error);
      toast.error('Failed to remove logo');
    }
  };

  const removeFavicon = async () => {
    try {
      await pageContentService.saveGeneralSetting({
        setting_key: 'site_favicon',
        setting_value: ''
      });
      setLogoFaviconSettings(prev => ({ ...prev, faviconUrl: '' }));
      localStorage.removeItem('fastingApp_faviconUrl');
      
      // Remove favicon from DOM
      const linkElement = document.querySelector('link[rel="icon"]');
      if (linkElement) {
        linkElement.remove();
      }
      
      toast.success('Favicon removed successfully');
    } catch (error) {
      console.error('Error removing favicon:', error);
      toast.error('Failed to remove favicon');
    }
  };

  const handleInputChange = (field: keyof GeneralSettings, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      localStorage.setItem('fastingApp_generalSettings', JSON.stringify(settings));
      
      // Save design settings to database
      const colorSettings = {
        primary: designSettings.primaryColor,
        secondary: designSettings.secondaryColor
      };
      await SiteSettingsService.setSetting('design_colors', colorSettings);
      
      // Save logo height if changed
      if (logoFaviconSettings.logoUrl) {
        const logoSettings = {
          url: logoFaviconSettings.logoUrl,
          height: logoFaviconSettings.logoHeight
        };
        await SiteSettingsService.setSetting('logo', logoSettings);
      }
      
      toast.success("General settings saved successfully!");
    } catch (error) {
      console.error('Error saving general settings:', error);
      toast.error("Failed to save settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container flex justify-between items-center py-4">
          <div className="flex justify-between items-center w-full">
            <Link to="/" className="text-2xl font-bold text-accent-green hover:opacity-80 transition-opacity">
              FastNow
            </Link>
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">General Settings</h1>
              <Link to="/admin">
                <Button variant="outline" size="sm">
                  <ArrowLeft size={16} className="mr-2" />
                  Back to Admin
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="social">Social Media</TabsTrigger>
              <TabsTrigger value="translations">
                <Languages className="w-4 h-4 mr-2" />
                Translations
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-6">
              {/* Site Identity */}
              <Card>
                <CardHeader>
                  <CardTitle>Site Identity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="siteName">Site Name</Label>
                      <Input
                        id="siteName"
                        value={settings.siteName}
                        onChange={(e) => handleInputChange('siteName', e.target.value)}
                        placeholder="Your App Name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        value={settings.companyName}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        placeholder="Your Company Name"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="siteDescription">Site Description</Label>
                    <Input
                      id="siteDescription"
                      value={settings.siteDescription}
                      onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                      placeholder="Brief description of your app"
                    />
                  </div>

                  {/* Logo Upload Section */}
                  <div className="space-y-4 pt-6 border-t">
                    <div>
                      <Label htmlFor="logo-upload">Site Logo</Label>
                      <div className="mt-2 space-y-4">
                        <Input
                          id="logo-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          disabled={uploading}
                          className="cursor-pointer"
                        />
                        <p className="text-xs text-muted-foreground">
                          Upload a logo for your site header. Recommended: PNG/JPG, max 5MB.
                        </p>
                      </div>

                      {logoFaviconSettings.logoUrl && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <img 
                                src={logoFaviconSettings.logoUrl} 
                                alt="Current logo" 
                                className="h-10 w-auto object-contain"
                              />
                              <div>
                                <p className="text-sm font-medium">Current Logo</p>
                                <p className="text-xs text-muted-foreground">Used in header and throughout site</p>
                              </div>
                            </div>
                            <Button onClick={removeLogo} variant="outline" size="sm" disabled={uploading}>
                              <Trash2 size={14} className="mr-1" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Logo Height Setting */}
                    {logoFaviconSettings.logoUrl && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="logo-height">Logo Height (px)</Label>
                          <Input
                            id="logo-height"
                            type="number"
                            min="20"
                            max="100"
                            value={logoFaviconSettings.logoHeight}
                            onChange={(e) => setLogoFaviconSettings(prev => ({ 
                              ...prev, 
                              logoHeight: parseInt(e.target.value) || 40 
                            }))}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Favicon Upload Section */}
                  <div className="space-y-4 pt-6 border-t">
                    <div>
                      <Label htmlFor="favicon-upload">Favicon</Label>
                      <div className="mt-2 space-y-4">
                        <Input
                          id="favicon-upload"
                          type="file"
                          accept="image/png,image/jpeg,image/jpg"
                          onChange={handleFaviconUpload}
                          disabled={uploading}
                          className="cursor-pointer"
                        />
                        <p className="text-xs text-muted-foreground">
                          Upload a favicon for your site. Must be PNG/JPG (not .ico), max 2MB.
                        </p>
                      </div>

                      {logoFaviconSettings.faviconUrl && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <img 
                                src={logoFaviconSettings.faviconUrl} 
                                alt="Current favicon" 
                                className="h-8 w-8 object-contain rounded"
                              />
                              <div>
                                <p className="text-sm font-medium">Current Favicon</p>
                                <p className="text-xs text-muted-foreground">Used in browser tab and bookmarks</p>
                              </div>
                            </div>
                            <Button onClick={removeFavicon} variant="outline" size="sm" disabled={uploading}>
                              <Trash2 size={14} className="mr-1" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contactEmail">Contact Email</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={settings.contactEmail}
                        onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                        placeholder="support@yourapp.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="supportUrl">Support URL</Label>
                      <Input
                        id="supportUrl"
                        value={settings.supportUrl}
                        onChange={(e) => handleInputChange('supportUrl', e.target.value)}
                        placeholder="https://yourapp.com/support"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* App Store Links */}
              <Card>
                <CardHeader>
                  <CardTitle>App Store Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="appStoreUrl">Apple App Store URL</Label>
                      <Input
                        id="appStoreUrl"
                        value={settings.appStoreUrl}
                        onChange={(e) => handleInputChange('appStoreUrl', e.target.value)}
                        placeholder="https://apps.apple.com/..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="playStoreUrl">Google Play Store URL</Label>
                      <Input
                        id="playStoreUrl"
                        value={settings.playStoreUrl}
                        onChange={(e) => handleInputChange('playStoreUrl', e.target.value)}
                        placeholder="https://play.google.com/store/apps/..."
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Technical Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Technical Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="defaultTimezone">Default Timezone</Label>
                    <Input
                      id="defaultTimezone"
                      value={settings.defaultTimezone}
                      onChange={(e) => handleInputChange('defaultTimezone', e.target.value)}
                      placeholder="UTC"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Design Customization */}
              <Card>
                <CardHeader>
                  <CardTitle>Design Customization</CardTitle>
                  <CardDescription>
                    Customize the appearance and colors of your website
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="primaryColor">Primary Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="primaryColor"
                          type="color"
                          value={designSettings.primaryColor}
                          onChange={(e) => setDesignSettings({ ...designSettings, primaryColor: e.target.value })}
                          className="w-16 h-10"
                        />
                        <Input
                          value={designSettings.primaryColor}
                          onChange={(e) => setDesignSettings({ ...designSettings, primaryColor: e.target.value })}
                          placeholder="#10B981"
                          className="flex-1"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="secondaryColor">Secondary Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="secondaryColor"
                          type="color"
                          value={designSettings.secondaryColor}
                          onChange={(e) => setDesignSettings({ ...designSettings, secondaryColor: e.target.value })}
                          className="w-16 h-10"
                        />
                        <Input
                          value={designSettings.secondaryColor}
                          onChange={(e) => setDesignSettings({ ...designSettings, secondaryColor: e.target.value })}
                          placeholder="#6B7280"
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Blog Typography */}
              <BlogTypographySettings />

              {/* Social Media Settings */}
              <SocialMediaSettings />

              {/* Save Button at Bottom */}
              <div className="flex justify-end pt-6">
                <Button onClick={handleSave} disabled={isLoading} size="lg">
                  <Save size={16} className="mr-2" />
                  {isLoading ? "Saving..." : "Save Settings"}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="design" className="space-y-6">
              <BlogTypographySettings />
            </TabsContent>
            
            <TabsContent value="social" className="space-y-6">
              <SocialMediaSettings />
            </TabsContent>
            
            <TabsContent value="translations" className="space-y-6">
              <AdminTranslations />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AdminGeneral;
