import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { ImageUploadService, UploadResult } from '@/services/ImageUploadService';
import { SiteSettingsService } from '@/services/SiteSettingsService';

interface HeroSideImageSettingsProps {
  onSettingsChange?: () => void;
}

const HeroSideImageSettings: React.FC<HeroSideImageSettingsProps> = ({ onSettingsChange }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [sideImageUrl, setSideImageUrl] = useState<string>('');
  const [imageAlignment, setImageAlignment] = useState<'top' | 'center' | 'bottom'>('center');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await SiteSettingsService.getSetting('hero_side_image_settings');
      if (settings && typeof settings === 'object') {
        const imageSettings = settings as {
          sideImageUrl?: string;
          imageAlignment?: 'top' | 'center' | 'bottom';
        };
        
        setSideImageUrl(imageSettings.sideImageUrl || '');
        setImageAlignment(imageSettings.imageAlignment || 'center');
      }
    } catch (error) {
      console.error('Error loading hero side image settings:', error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (10MB limit for high-quality images)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image file size must be less than 10MB');
      return;
    }

    setIsUploading(true);

    try {
      const result: UploadResult = await ImageUploadService.uploadImage(
        file, 
        'hero-images', 
        `side-image-${Date.now()}`
      );

      setSideImageUrl(result.url);
      await saveSettings(result.url, imageAlignment);
      
      toast.success('Hero side image uploaded successfully');
      onSettingsChange?.();
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const saveSettings = async (imageUrl?: string, alignment?: 'top' | 'center' | 'bottom') => {
    try {
      const settings = {
        sideImageUrl: imageUrl || sideImageUrl,
        imageAlignment: alignment || imageAlignment,
      };

      const success = await SiteSettingsService.setSetting('hero_side_image_settings', settings);
      
      if (success) {
        console.log('Hero side image settings saved successfully');
        onSettingsChange?.();
        return true;
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving hero side image settings:', error);
      toast.error('Failed to save settings');
      return false;
    }
  };

  const handleSaveSettings = async () => {
    const success = await saveSettings();
    if (success) {
      toast.success('Hero side image settings saved successfully');
    }
  };

  const handleRemoveImage = async () => {
    try {
      setSideImageUrl('');
      await saveSettings('', imageAlignment);
      toast.success('Hero side image removed');
      onSettingsChange?.();
    } catch (error) {
      console.error('Error removing image:', error);
      toast.error('Failed to remove image');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hero Side Image</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Image Upload */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="side-image">Side Image</Label>
            <Input
              id="side-image"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isUploading}
              className="cursor-pointer"
            />
            <p className="text-xs text-muted-foreground">
              Upload a tall image to display on the right side of the hero section. 
              Recommended: Tall/portrait orientation, high quality, max 10MB.
            </p>
          </div>

          {/* Current Image Preview */}
          {sideImageUrl && (
            <div className="space-y-4">
              <Label>Current Side Image</Label>
              <div className="flex flex-col gap-4">
                <div className="max-w-xs mx-auto border rounded-lg overflow-hidden">
                  <img 
                    src={sideImageUrl} 
                    alt="Hero side image"
                    className="w-full h-64 object-cover"
                  />
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRemoveImage}
                  disabled={isUploading}
                >
                  Remove Image
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Image Alignment */}
        <div className="space-y-2">
          <Label htmlFor="image-alignment">Image Vertical Alignment</Label>
          <select
            id="image-alignment"
            value={imageAlignment}
            onChange={(e) => setImageAlignment(e.target.value as 'top' | 'center' | 'bottom')}
            className="w-full p-2 border rounded-md"
          >
            <option value="top">Top</option>
            <option value="center">Center</option>
            <option value="bottom">Bottom</option>
          </select>
          <p className="text-xs text-muted-foreground">
            Choose how the image should be aligned vertically within the hero section.
          </p>
        </div>

        {/* Live Preview Info */}
        <div className="space-y-2">
          <Label>Layout Preview</Label>
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex gap-4">
              <div className="flex-1 bg-blue-100 p-3 rounded text-center text-sm">
                Hero Content (75%)
              </div>
              <div className="w-1/4 bg-green-100 p-3 rounded text-center text-sm">
                Side Image (25%)
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            The image will appear on the right side, taking up 25% of the hero section width.
          </p>
        </div>

        {/* Save Button */}
        <Button 
          onClick={handleSaveSettings} 
          disabled={isUploading}
          className="w-full"
        >
          {isUploading ? 'Uploading...' : 'Save Hero Side Image Settings'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default HeroSideImageSettings;