import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Upload, X, User, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { SiteSettingsService } from '@/services/SiteSettingsService';
import { ImageUploadService } from '@/services/ImageUploadService';

interface AuthorProfile {
  name: string;
  bio: string;
  photo_url: string;
  social_links: {
    website: string;
    twitter: string;
    linkedin: string;
  };
}

interface AuthorBoxSettings {
  show_by_default: boolean;
  enabled: boolean;
}

interface AuthorProfileSettingsProps {
  onSettingsChange?: () => void;
}

export const AuthorProfileSettings: React.FC<AuthorProfileSettingsProps> = ({ onSettingsChange }) => {
  const [profile, setProfile] = useState<AuthorProfile>({
    name: '',
    bio: '',
    photo_url: '',
    social_links: {
      website: '',
      twitter: '',
      linkedin: ''
    }
  });
  
  const [settings, setSettings] = useState<AuthorBoxSettings>({
    show_by_default: true,
    enabled: true
  });
  
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const [profileData, settingsData] = await Promise.all([
        SiteSettingsService.getSetting('author_profile'),
        SiteSettingsService.getSetting('author_box_settings')
      ]);

      if (profileData) {
        setProfile(profileData as unknown as AuthorProfile);
      }

      if (settingsData) {
        setSettings(settingsData as unknown as AuthorBoxSettings);
      }
    } catch (error) {
      console.error('Error loading author settings:', error);
      toast({
        title: "Error",
        description: "Failed to load author settings",
        variant: "destructive"
      });
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await ImageUploadService.uploadImage(
        file,
        'blog-images',
        'author-profile'
      );

      setProfile(prev => ({ ...prev, photo_url: result.url }));
      toast({
        title: "Success",
        description: "Author photo uploaded successfully"
      });
    } catch (error) {
      console.error('Error uploading author photo:', error);
      toast({
        title: "Error",
        description: "Failed to upload author photo",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    setProfile(prev => ({ ...prev, photo_url: '' }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await Promise.all([
        SiteSettingsService.setSetting('author_profile', profile),
        SiteSettingsService.setSetting('author_box_settings', settings)
      ]);

      toast({
        title: "Success",
        description: "Author settings saved successfully"
      });
      
      onSettingsChange?.();
    } catch (error) {
      console.error('Error saving author settings:', error);
      toast({
        title: "Error",
        description: "Failed to save author settings",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Author Profile
          </CardTitle>
          <CardDescription>
            Configure the author information that will be displayed in blog post author boxes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Author Photo */}
          <div className="space-y-3">
            <Label>Author Photo</Label>
            <div className="flex items-center gap-4">
              {profile.photo_url ? (
                <div className="relative">
                  <img
                    src={profile.photo_url}
                    alt="Author"
                    className="w-20 h-20 rounded-full object-cover border-2 border-border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                    onClick={handleRemovePhoto}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-border">
                  <User className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
              
              <div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  className="hidden"
                  id="author-photo-upload"
                />
                <Label htmlFor="author-photo-upload" className="cursor-pointer">
                  <Button type="button" variant="outline" disabled={isUploading} asChild>
                    <span>
                      <Upload className="w-4 h-4 mr-2" />
                      {isUploading ? 'Uploading...' : 'Upload Photo'}
                    </span>
                  </Button>
                </Label>
              </div>
            </div>
          </div>

          {/* Author Name */}
          <div className="space-y-2">
            <Label htmlFor="author-name">Author Name</Label>
            <Input
              id="author-name"
              value={profile.name}
              onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter author name"
            />
          </div>

          {/* Author Bio */}
          <div className="space-y-2">
            <Label htmlFor="author-bio">Author Bio</Label>
            <Textarea
              id="author-bio"
              value={profile.bio}
              onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Enter a brief bio about the author"
              rows={4}
            />
          </div>

          <Separator />

          {/* Social Links */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Social Media Links</Label>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={profile.social_links.website}
                  onChange={(e) => setProfile(prev => ({
                    ...prev,
                    social_links: { ...prev.social_links, website: e.target.value }
                  }))}
                  placeholder="https://example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  value={profile.social_links.twitter}
                  onChange={(e) => setProfile(prev => ({
                    ...prev,
                    social_links: { ...prev.social_links, twitter: e.target.value }
                  }))}
                  placeholder="https://twitter.com/username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={profile.social_links.linkedin}
                  onChange={(e) => setProfile(prev => ({
                    ...prev,
                    social_links: { ...prev.social_links, linkedin: e.target.value }
                  }))}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Author Box Display Settings</CardTitle>
          <CardDescription>
            Control when and how the author box appears on blog posts.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Author Box</Label>
              <p className="text-sm text-muted-foreground">
                Globally enable or disable the author box feature
              </p>
            </div>
            <Switch
              checked={settings.enabled}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enabled: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Show by Default</Label>
              <p className="text-sm text-muted-foreground">
                Show author box by default on new blog posts
              </p>
            </div>
            <Switch
              checked={settings.show_by_default}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, show_by_default: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
};