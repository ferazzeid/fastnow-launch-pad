import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { SiteSettingsService } from "@/services/SiteSettingsService";

interface SiteConfig {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  companyName: string;
  timezone: string;
  supportUrl: string;
  appStoreLink: string;
  googlePlayLink: string;
}

const SiteConfigSettings: React.FC = () => {
  const [settings, setSettings] = useState<SiteConfig>({
    siteName: 'FastNow',
    siteDescription: 'Advanced intermittent fasting tracker',
    contactEmail: 'support@fastnow.app',
    companyName: 'FastNow',
    timezone: 'UTC',
    supportUrl: 'https://fastnow.app/support',
    appStoreLink: 'https://apps.apple.com',
    googlePlayLink: 'https://play.google.com'
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const allSettings = await SiteSettingsService.getAllSettings();
      
      setSettings(prev => ({
        ...prev,
        siteName: allSettings.site_name || prev.siteName,
        siteDescription: allSettings.site_description || prev.siteDescription,
        contactEmail: allSettings.contact_email || prev.contactEmail,
        companyName: allSettings.company_name || prev.companyName,
        timezone: allSettings.timezone || prev.timezone,
        supportUrl: allSettings.support_url || prev.supportUrl,
        appStoreLink: allSettings.app_store_link || prev.appStoreLink,
        googlePlayLink: allSettings.google_play_link || prev.googlePlayLink,
      }));
    } catch (error) {
      console.error('Error loading site settings:', error);
    }
  };

  const handleInputChange = (field: keyof SiteConfig, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      // Save all settings to database
      await Promise.all([
        SiteSettingsService.setSetting('site_name', settings.siteName),
        SiteSettingsService.setSetting('site_description', settings.siteDescription),
        SiteSettingsService.setSetting('contact_email', settings.contactEmail),
        SiteSettingsService.setSetting('company_name', settings.companyName),
        SiteSettingsService.setSetting('timezone', settings.timezone),
        SiteSettingsService.setSetting('support_url', settings.supportUrl),
        SiteSettingsService.setSetting('app_store_link', settings.appStoreLink),
        SiteSettingsService.setSetting('google_play_link', settings.googlePlayLink),
      ]);

      toast.success("Settings saved successfully");
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error("Failed to save settings");
    }
  };

  return (
    <div className="space-y-8">
      {/* Site Identity */}
      <Card>
        <CardHeader>
          <CardTitle>Site Identity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="site-name">Site Name</Label>
              <Input
                id="site-name"
                value={settings.siteName}
                onChange={(e) => handleInputChange('siteName', e.target.value)}
                placeholder="Your site name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input
                id="company-name"
                value={settings.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                placeholder="Your company name"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="site-description">Site Description</Label>
            <Input
              id="site-description"
              value={settings.siteDescription}
              onChange={(e) => handleInputChange('siteDescription', e.target.value)}
              placeholder="Brief description of your site"
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="contact-email">Contact Email</Label>
              <Input
                id="contact-email"
                type="email"
                value={settings.contactEmail}
                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                placeholder="contact@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="support-url">Support URL</Label>
              <Input
                id="support-url"
                value={settings.supportUrl}
                onChange={(e) => handleInputChange('supportUrl', e.target.value)}
                placeholder="https://example.com/support"
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
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="app-store">App Store Link</Label>
              <Input 
                id="app-store" 
                value={settings.appStoreLink} 
                onChange={(e) => handleInputChange('appStoreLink', e.target.value)} 
                placeholder="https://apps.apple.com/..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="google-play">Google Play Link</Label>
              <Input 
                id="google-play" 
                value={settings.googlePlayLink} 
                onChange={(e) => handleInputChange('googlePlayLink', e.target.value)} 
                placeholder="https://play.google.com/..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Technical Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="timezone">Default Timezone</Label>
            <Input
              id="timezone"
              value={settings.timezone}
              onChange={(e) => handleInputChange('timezone', e.target.value)}
              placeholder="UTC"
            />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="w-full">
        Save Settings
      </Button>
    </div>
  );
};

export default SiteConfigSettings;