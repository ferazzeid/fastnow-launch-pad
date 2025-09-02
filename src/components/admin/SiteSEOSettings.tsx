import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Globe, Building, Share2, Palette, Save } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { SiteSettingsService } from '@/services/SiteSettingsService';

interface SiteSEOData {
  siteTitle: string;
  siteDescription: string;
  siteKeywords: string;
  siteAuthor: string;
  baseUrl: string;
  defaultImage: string;
  organizationName: string;
  organizationDescription: string;
  organizationUrl: string;
  organizationLogo: string;
  organizationEmail: string;
  socialFacebook: string;
  socialTwitter: string;
  socialInstagram: string;
  socialYoutube: string;
  socialLinkedin: string;
  socialTiktok: string;
  themeColor: string;
  robotsDefault: string;
}

const SiteSEOSettings = () => {
  const [settings, setSettings] = useState<SiteSEOData>({
    siteTitle: '',
    siteDescription: '',
    siteKeywords: '',
    siteAuthor: '',
    baseUrl: '',
    defaultImage: '',
    organizationName: '',
    organizationDescription: '',
    organizationUrl: '',
    organizationLogo: '',
    organizationEmail: '',
    socialFacebook: '',
    socialTwitter: '',
    socialInstagram: '',
    socialYoutube: '',
    socialLinkedin: '',
    socialTiktok: '',
    themeColor: '',
    robotsDefault: '',
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const [
        siteTitle, siteDescription, siteKeywords, siteAuthor, baseUrl, defaultImage,
        organizationName, organizationDescription, organizationUrl, organizationLogo, organizationEmail,
        socialFacebook, socialTwitter, socialInstagram, socialYoutube, socialLinkedin, socialTiktok,
        themeColor, robotsDefault
      ] = await Promise.all([
        SiteSettingsService.getSetting('seo_site_title'),
        SiteSettingsService.getSetting('seo_site_description'),
        SiteSettingsService.getSetting('seo_site_keywords'),
        SiteSettingsService.getSetting('seo_site_author'),
        SiteSettingsService.getSetting('seo_base_url'),
        SiteSettingsService.getSetting('seo_default_image'),
        SiteSettingsService.getSetting('seo_organization_name'),
        SiteSettingsService.getSetting('seo_organization_description'),
        SiteSettingsService.getSetting('seo_organization_url'),
        SiteSettingsService.getSetting('seo_organization_logo'),
        SiteSettingsService.getSetting('seo_organization_email'),
        SiteSettingsService.getSetting('seo_social_facebook'),
        SiteSettingsService.getSetting('seo_social_twitter'),
        SiteSettingsService.getSetting('seo_social_instagram'),
        SiteSettingsService.getSetting('seo_social_youtube'),
        SiteSettingsService.getSetting('seo_social_linkedin'),
        SiteSettingsService.getSetting('seo_social_tiktok'),
        SiteSettingsService.getSetting('seo_theme_color'),
        SiteSettingsService.getSetting('seo_robots_default')
      ]);

      setSettings({
        siteTitle: String(siteTitle || ''),
        siteDescription: String(siteDescription || ''),
        siteKeywords: String(siteKeywords || ''),
        siteAuthor: String(siteAuthor || ''),
        baseUrl: String(baseUrl || ''),
        defaultImage: String(defaultImage || ''),
        organizationName: String(organizationName || ''),
        organizationDescription: String(organizationDescription || ''),
        organizationUrl: String(organizationUrl || ''),
        organizationLogo: String(organizationLogo || ''),
        organizationEmail: String(organizationEmail || ''),
        socialFacebook: String(socialFacebook || ''),
        socialTwitter: String(socialTwitter || ''),
        socialInstagram: String(socialInstagram || ''),
        socialYoutube: String(socialYoutube || ''),
        socialLinkedin: String(socialLinkedin || ''),
        socialTiktok: String(socialTiktok || ''),
        themeColor: String(themeColor || '#6366F1'),
        robotsDefault: String(robotsDefault || 'index, follow'),
      });
    } catch (error) {
      console.error('Error loading SEO settings:', error);
      toast.error('Failed to load SEO settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof SiteSEOData, value: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await Promise.all([
        SiteSettingsService.setSetting('seo_site_title', settings.siteTitle),
        SiteSettingsService.setSetting('seo_site_description', settings.siteDescription),
        SiteSettingsService.setSetting('seo_site_keywords', settings.siteKeywords),
        SiteSettingsService.setSetting('seo_site_author', settings.siteAuthor),
        SiteSettingsService.setSetting('seo_base_url', settings.baseUrl),
        SiteSettingsService.setSetting('seo_default_image', settings.defaultImage),
        SiteSettingsService.setSetting('seo_organization_name', settings.organizationName),
        SiteSettingsService.setSetting('seo_organization_description', settings.organizationDescription),
        SiteSettingsService.setSetting('seo_organization_url', settings.organizationUrl),
        SiteSettingsService.setSetting('seo_organization_logo', settings.organizationLogo),
        SiteSettingsService.setSetting('seo_organization_email', settings.organizationEmail),
        SiteSettingsService.setSetting('seo_social_facebook', settings.socialFacebook),
        SiteSettingsService.setSetting('seo_social_twitter', settings.socialTwitter),
        SiteSettingsService.setSetting('seo_social_instagram', settings.socialInstagram),
        SiteSettingsService.setSetting('seo_social_youtube', settings.socialYoutube),
        SiteSettingsService.setSetting('seo_social_linkedin', settings.socialLinkedin),
        SiteSettingsService.setSetting('seo_social_tiktok', settings.socialTiktok),
        SiteSettingsService.setSetting('seo_theme_color', settings.themeColor),
        SiteSettingsService.setSetting('seo_robots_default', settings.robotsDefault)
      ]);

      toast.success('Site SEO settings saved successfully!');
    } catch (error) {
      console.error('Error saving SEO settings:', error);
      toast.error('Failed to save SEO settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">Loading SEO settings...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Site Defaults */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe size={20} />
            Site Defaults
          </CardTitle>
          <CardDescription>
            Default SEO settings that will be used across your site unless overridden on specific pages
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="siteTitle">Default Site Title</Label>
              <Input
                id="siteTitle"
                value={settings.siteTitle}
                onChange={(e) => handleInputChange('siteTitle', e.target.value)}
                placeholder="Your Site Title"
              />
            </div>
            <div>
              <Label htmlFor="baseUrl">Base URL</Label>
              <Input
                id="baseUrl"
                value={settings.baseUrl}
                onChange={(e) => handleInputChange('baseUrl', e.target.value)}
                placeholder="https://yoursite.com"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="siteDescription">Default Site Description</Label>
            <Textarea
              id="siteDescription"
              value={settings.siteDescription}
              onChange={(e) => handleInputChange('siteDescription', e.target.value)}
              placeholder="A compelling description of your site"
              className="min-h-20"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="siteKeywords">Default Keywords</Label>
              <Input
                id="siteKeywords"
                value={settings.siteKeywords}
                onChange={(e) => handleInputChange('siteKeywords', e.target.value)}
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>
            <div>
              <Label htmlFor="siteAuthor">Default Author</Label>
              <Input
                id="siteAuthor"
                value={settings.siteAuthor}
                onChange={(e) => handleInputChange('siteAuthor', e.target.value)}
                placeholder="Your Name or Company"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="defaultImage">Default Social Share Image</Label>
            <Input
              id="defaultImage"
              value={settings.defaultImage}
              onChange={(e) => handleInputChange('defaultImage', e.target.value)}
              placeholder="https://yoursite.com/default-social-image.jpg"
            />
          </div>
        </CardContent>
      </Card>

      {/* Organization/Structured Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building size={20} />
            Organization & Structured Data
          </CardTitle>
          <CardDescription>
            Organization information used in structured data markup for search engines
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="organizationName">Organization Name</Label>
              <Input
                id="organizationName"
                value={settings.organizationName}
                onChange={(e) => handleInputChange('organizationName', e.target.value)}
                placeholder="Your Organization Name"
              />
            </div>
            <div>
              <Label htmlFor="organizationUrl">Organization URL</Label>
              <Input
                id="organizationUrl"
                value={settings.organizationUrl}
                onChange={(e) => handleInputChange('organizationUrl', e.target.value)}
                placeholder="https://yourorganization.com"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="organizationDescription">Organization Description</Label>
            <Textarea
              id="organizationDescription"
              value={settings.organizationDescription}
              onChange={(e) => handleInputChange('organizationDescription', e.target.value)}
              placeholder="Brief description of your organization"
              className="min-h-20"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="organizationLogo">Organization Logo URL</Label>
              <Input
                id="organizationLogo"
                value={settings.organizationLogo}
                onChange={(e) => handleInputChange('organizationLogo', e.target.value)}
                placeholder="https://yoursite.com/logo.png"
              />
            </div>
            <div>
              <Label htmlFor="organizationEmail">Contact Email</Label>
              <Input
                id="organizationEmail"
                type="email"
                value={settings.organizationEmail}
                onChange={(e) => handleInputChange('organizationEmail', e.target.value)}
                placeholder="contact@yourorganization.com"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Media */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 size={20} />
            Social Media Profiles
          </CardTitle>
          <CardDescription>
            Social media URLs for structured data and social sharing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="socialFacebook">Facebook URL</Label>
              <Input
                id="socialFacebook"
                value={settings.socialFacebook}
                onChange={(e) => handleInputChange('socialFacebook', e.target.value)}
                placeholder="https://facebook.com/yourpage"
              />
            </div>
            <div>
              <Label htmlFor="socialTwitter">Twitter/X URL</Label>
              <Input
                id="socialTwitter"
                value={settings.socialTwitter}
                onChange={(e) => handleInputChange('socialTwitter', e.target.value)}
                placeholder="https://twitter.com/youraccount"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="socialInstagram">Instagram URL</Label>
              <Input
                id="socialInstagram"
                value={settings.socialInstagram}
                onChange={(e) => handleInputChange('socialInstagram', e.target.value)}
                placeholder="https://instagram.com/youraccount"
              />
            </div>
            <div>
              <Label htmlFor="socialYoutube">YouTube URL</Label>
              <Input
                id="socialYoutube"
                value={settings.socialYoutube}
                onChange={(e) => handleInputChange('socialYoutube', e.target.value)}
                placeholder="https://youtube.com/yourchannel"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="socialLinkedin">LinkedIn URL</Label>
              <Input
                id="socialLinkedin"
                value={settings.socialLinkedin}
                onChange={(e) => handleInputChange('socialLinkedin', e.target.value)}
                placeholder="https://linkedin.com/company/yourcompany"
              />
            </div>
            <div>
              <Label htmlFor="socialTiktok">TikTok URL</Label>
              <Input
                id="socialTiktok"
                value={settings.socialTiktok}
                onChange={(e) => handleInputChange('socialTiktok', e.target.value)}
                placeholder="https://tiktok.com/@youraccount"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette size={20} />
            Technical SEO
          </CardTitle>
          <CardDescription>
            Technical SEO settings and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="themeColor">Theme Color</Label>
              <Input
                id="themeColor"
                value={settings.themeColor}
                onChange={(e) => handleInputChange('themeColor', e.target.value)}
                placeholder="#6366F1"
              />
            </div>
            <div>
              <Label htmlFor="robotsDefault">Default Robots Directive</Label>
              <Input
                id="robotsDefault"
                value={settings.robotsDefault}
                onChange={(e) => handleInputChange('robotsDefault', e.target.value)}
                placeholder="index, follow"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? 'Saving...' : 'Save SEO Settings'}
        </Button>
      </div>
    </div>
  );
};

export default SiteSEOSettings;