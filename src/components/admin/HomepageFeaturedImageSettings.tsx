import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SiteSettingsService } from '@/services/SiteSettingsService';
import { toast } from 'sonner';

const HomepageFeaturedImageSettings = () => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const setting = await SiteSettingsService.getSetting('homepage_featured_image');
      if (setting && typeof setting === 'string') {
        setImageUrl(setting);
      }
    } catch (error) {
      console.error('Error loading homepage featured image settings:', error);
      toast.error('Failed to load homepage featured image settings');
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      await SiteSettingsService.setSetting('homepage_featured_image', imageUrl);
      toast.success('Homepage featured image settings saved successfully');
    } catch (error) {
      console.error('Error saving homepage featured image settings:', error);
      toast.error('Failed to save homepage featured image settings');
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Homepage Featured Image</CardTitle>
        <CardDescription>
          Set the background image for the homepage hero section
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Enter image URL"
          />
        </div>
        
        {imageUrl && (
          <div>
            <Label>Preview</Label>
            <div className="mt-2 border rounded-lg overflow-hidden max-w-md">
              <img 
                src={imageUrl} 
                alt="Homepage featured image preview"
                className="w-full h-32 object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIxIDlWN0EyIDIgMCAwIDAgMTkgNUg1QTIgMiAwIDAgMCAzIDdWOSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik0yMSAxNlYxOUEyIDIgMCAwIDEgMTkgMjFINUEyIDIgMCAwIDEgMyAxOVYxNiIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=';
                }}
              />
            </div>
          </div>
        )}
        
        <Button onClick={saveSettings}>
          Save Settings
        </Button>
      </CardContent>
    </Card>
  );
};

export default HomepageFeaturedImageSettings;