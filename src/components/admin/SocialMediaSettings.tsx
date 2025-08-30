import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, ExternalLink } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { SiteSettingsService } from '@/services/SiteSettingsService';

interface SocialMediaLink {
  id: string;
  platform: string;
  url: string;
  isActive: boolean;
  icon: string;
  displayName: string;
}

const SOCIAL_PLATFORMS = [
  { key: 'tiktok', name: 'TikTok', icon: 'Music', color: '#000000' },
  { key: 'youtube', name: 'YouTube', icon: 'Youtube', color: '#FF0000' },
  { key: 'instagram', name: 'Instagram', icon: 'Instagram', color: '#E4405F' },
  { key: 'twitter', name: 'X (Twitter)', icon: 'Twitter', color: '#000000' },
  { key: 'facebook', name: 'Facebook', icon: 'Facebook', color: '#1877F2' },
  { key: 'linkedin', name: 'LinkedIn', icon: 'Linkedin', color: '#0A66C2' },
  { key: 'discord', name: 'Discord', icon: 'MessageCircle', color: '#5865F2' },
  { key: 'twitch', name: 'Twitch', icon: 'Tv', color: '#9146FF' },
  { key: 'pinterest', name: 'Pinterest', icon: 'MapPin', color: '#BD081C' },
  { key: 'reddit', name: 'Reddit', icon: 'MessageSquare', color: '#FF4500' }
];

const SocialMediaSettings = () => {
  const [socialLinks, setSocialLinks] = useState<SocialMediaLink[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadSocialLinks();
  }, []);

  const loadSocialLinks = async () => {
    try {
      const settings = await SiteSettingsService.getSetting('social_media_links');
      if (settings && Array.isArray(settings)) {
        // Type guard and cast the settings to SocialMediaLink[]
        const validLinks = settings.filter((item: any): boolean => {
          return typeof item === 'object' && 
                 item !== null && 
                 'id' in item && 
                 'platform' in item && 
                 'url' in item && 
                 'isActive' in item;
        }).map((item: any) => item as SocialMediaLink);
        setSocialLinks(validLinks);
      } else {
        // Initialize with default TikTok if no settings exist
        setSocialLinks([
          {
            id: 'tiktok-default',
            platform: 'tiktok',
            url: '',
            isActive: false,
            icon: 'Music',
            displayName: 'TikTok'
          }
        ]);
      }
    } catch (error) {
      console.error('Error loading social media links:', error);
    }
  };

  const saveSocialLinks = async () => {
    setIsLoading(true);
    try {
      const success = await SiteSettingsService.setSetting('social_media_links', socialLinks);
      if (success) {
        toast.success('Social media settings saved successfully!');
      } else {
        toast.error('Failed to save social media settings');
      }
    } catch (error) {
      console.error('Error saving social media links:', error);
      toast.error('Failed to save social media settings');
    } finally {
      setIsLoading(false);
    }
  };

  const addSocialLink = (platformKey: string) => {
    const platform = SOCIAL_PLATFORMS.find(p => p.key === platformKey);
    if (!platform) return;

    // Check if platform already exists
    const exists = socialLinks.some(link => link.platform === platformKey);
    if (exists) {
      toast.error(`${platform.name} link already exists`);
      return;
    }

    const newLink: SocialMediaLink = {
      id: `${platformKey}-${Date.now()}`,
      platform: platformKey,
      url: '',
      isActive: false,
      icon: platform.icon,
      displayName: platform.name
    };

    setSocialLinks(prev => [...prev, newLink]);
  };

  const updateSocialLink = (id: string, field: keyof SocialMediaLink, value: string | boolean) => {
    setSocialLinks(prev => prev.map(link => 
      link.id === id ? { ...link, [field]: value } : link
    ));
  };

  const removeSocialLink = (id: string) => {
    setSocialLinks(prev => prev.filter(link => link.id !== id));
  };

  const validateUrl = (url: string, platform: string): boolean => {
    if (!url) return false;
    
    const platformPatterns: Record<string, RegExp> = {
      tiktok: /^https?:\/\/(www\.)?tiktok\.com\/@[\w.-]+/,
      youtube: /^https?:\/\/(www\.)?(youtube\.com\/(channel\/|c\/|user\/|@)|youtu\.be\/)/,
      instagram: /^https?:\/\/(www\.)?instagram\.com\/[\w.-]+/,
      twitter: /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/[\w.-]+/,
      facebook: /^https?:\/\/(www\.)?facebook\.com\/[\w.-]+/,
      linkedin: /^https?:\/\/(www\.)?linkedin\.com\/(in|company)\/[\w.-]+/
    };

    const pattern = platformPatterns[platform];
    return pattern ? pattern.test(url) : /^https?:\/\//.test(url);
  };

  const getAvailablePlatforms = () => {
    const existingPlatforms = socialLinks.map(link => link.platform);
    return SOCIAL_PLATFORMS.filter(platform => !existingPlatforms.includes(platform.key));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Media Links</CardTitle>
        <CardDescription>
          Manage your social media presence. Active links will appear in your website footer.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Existing Social Links */}
        {socialLinks.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Your Social Media Links</h4>
            {socialLinks.map((link) => {
              const platform = SOCIAL_PLATFORMS.find(p => p.key === link.platform);
              const isValidUrl = validateUrl(link.url, link.platform);
              
              return (
                <div key={link.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded flex items-center justify-center text-white text-sm font-semibold"
                        style={{ backgroundColor: platform?.color || '#666' }}
                      >
                        {platform?.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{link.displayName}</p>
                        <Badge variant={link.isActive && isValidUrl ? 'default' : 'secondary'} className="text-xs">
                          {link.isActive && isValidUrl ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={link.isActive}
                        onCheckedChange={(checked) => updateSocialLink(link.id, 'isActive', checked)}
                        disabled={!isValidUrl}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeSocialLink(link.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor={`url-${link.id}`} className="text-sm">
                      Profile URL
                    </Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id={`url-${link.id}`}
                        value={link.url}
                        onChange={(e) => updateSocialLink(link.id, 'url', e.target.value)}
                        placeholder={`https://${platform?.key === 'twitter' ? 'x.com' : platform?.key + '.com'}/yourprofile`}
                        className={!isValidUrl && link.url ? 'border-red-300' : ''}
                      />
                      {link.url && isValidUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(link.url, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    {!isValidUrl && link.url && (
                      <p className="text-xs text-red-600 mt-1">
                        Please enter a valid {platform?.name} URL
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Add New Platform */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Add Social Media Platform</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {getAvailablePlatforms().map((platform) => (
              <Button
                key={platform.key}
                variant="outline"
                size="sm"
                onClick={() => addSocialLink(platform.key)}
                className="justify-start gap-2 h-auto p-3"
              >
                <div 
                  className="w-5 h-5 rounded flex items-center justify-center text-white text-xs font-semibold"
                  style={{ backgroundColor: platform.color }}
                >
                  {platform.name.charAt(0)}
                </div>
                <span className="text-xs">{platform.name}</span>
              </Button>
            ))}
          </div>
          {getAvailablePlatforms().length === 0 && (
            <p className="text-sm text-muted-foreground">
              All available social media platforms have been added.
            </p>
          )}
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t">
          <Button onClick={saveSocialLinks} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Social Media Settings'}
          </Button>
        </div>

        {/* Preview */}
        <div className="bg-muted/30 rounded-lg p-4">
          <h4 className="text-sm font-medium mb-3">Preview</h4>
          <p className="text-xs text-muted-foreground mb-3">
            Active social media links will appear like this in your footer:
          </p>
          <div className="flex gap-3">
            {socialLinks
              .filter(link => link.isActive && validateUrl(link.url, link.platform))
              .map((link) => {
                const platform = SOCIAL_PLATFORMS.find(p => p.key === link.platform);
                return (
                  <div
                    key={link.id}
                    className="w-8 h-8 rounded flex items-center justify-center text-white text-sm font-semibold cursor-pointer hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: platform?.color || '#666' }}
                    title={`Visit our ${link.displayName}`}
                  >
                    {platform?.name.charAt(0)}
                  </div>
                );
              })}
            {socialLinks.filter(link => link.isActive && validateUrl(link.url, link.platform)).length === 0 && (
              <p className="text-xs text-muted-foreground">No active social media links</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialMediaSettings;
