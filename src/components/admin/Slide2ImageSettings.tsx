import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { ImageUploadService, UploadResult } from '@/services/ImageUploadService';
import { pageContentService } from '@/services/PageContentService';

interface Slide2ImageSettingsProps {
  onSettingsChange?: () => void;
}

const Slide2ImageSettings: React.FC<Slide2ImageSettingsProps> = ({ onSettingsChange }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imageAlignment, setImageAlignment] = useState<'left' | 'right'>('right');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const content = await pageContentService.getPageContent('home-slide2');
      if (content) {
        setImageUrl(content.featured_image_url || '');
        // Load alignment from content metadata if needed
        setImageAlignment('right'); // Default
      }
    } catch (error) {
      console.error('Error loading slide 2 image settings:', error);
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
        'slide-images', 
        `slide2-image-${Date.now()}`
      );

      setImageUrl(result.url);
      await saveSettings(result.url, imageAlignment);
      
      toast.success('Slide 2 image uploaded successfully');
      onSettingsChange?.();
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const saveSettings = async (imageUrl?: string, alignment?: 'left' | 'right') => {
    try {
      // Load existing content first
      const existingContent = await pageContentService.getPageContent('home-slide2');
      
      const content = {
        page_key: 'home-slide2',
        title: existingContent?.title || 'This Isn\'t for Fitness Models',
        content: existingContent?.content || '',
        featured_image_url: imageUrl || imageUrl,
        is_published: true,
        meta_title: 'This Isn\'t for Fitness Models - FastNow',
        meta_description: 'Real weight loss for real people, not fitness models.'
      };

      const success = await pageContentService.savePageContent(content);
      
      if (success) {
        console.log('Slide 2 image settings saved successfully');
        onSettingsChange?.();
        return true;
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving slide 2 image settings:', error);
      toast.error('Failed to save settings');
      return false;
    }
  };

  const handleSaveSettings = async () => {
    const success = await saveSettings(imageUrl, imageAlignment);
    if (success) {
      toast.success('Slide 2 image settings saved successfully');
    }
  };

  const handleRemoveImage = async () => {
    try {
      setImageUrl('');
      await saveSettings('', imageAlignment);
      toast.success('Slide 2 image removed');
      onSettingsChange?.();
    } catch (error) {
      console.error('Error removing image:', error);
      toast.error('Failed to remove image');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>"This Isn't for Fitness Models" Section Image</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Image Upload */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="slide2-image">Section Image</Label>
            <Input
              id="slide2-image"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isUploading}
              className="cursor-pointer"
            />
            <p className="text-xs text-muted-foreground">
              Upload an image to display alongside the "This isn't for fitness models" section content.
              Recommended: High quality, max 10MB. Image will be displayed without container constraints.
            </p>
          </div>

          {/* Current Image Preview */}
          {imageUrl && (
            <div className="space-y-4">
              <Label>Current Section Image</Label>
              <div className="flex flex-col gap-4">
                <div className="max-w-xs mx-auto border rounded-lg overflow-hidden">
                  <img 
                    src={imageUrl} 
                    alt="Slide 2 section image"
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
          <Label htmlFor="image-alignment">Image Position</Label>
          <select
            id="image-alignment"
            value={imageAlignment}
            onChange={(e) => setImageAlignment(e.target.value as 'left' | 'right')}
            className="w-full p-2 border rounded-md"
          >
            <option value="left">Left Side</option>
            <option value="right">Right Side</option>
          </select>
          <p className="text-xs text-muted-foreground">
            Choose whether the image appears on the left or right side of the text content.
          </p>
        </div>

        {/* Save Button */}
        <Button 
          onClick={handleSaveSettings} 
          disabled={isUploading}
          className="w-full"
        >
          {isUploading ? 'Uploading...' : 'Save Section Image Settings'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default Slide2ImageSettings;