import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { ImageUploadService, UploadResult } from '@/services/ImageUploadService';
import { SiteSettingsService } from '@/services/SiteSettingsService';
import InfoTooltip from '@/components/InfoTooltip';

interface InfoTooltipSettingsProps {
  onSettingsChange?: () => void;
}

const InfoTooltipSettings: React.FC<InfoTooltipSettingsProps> = ({ onSettingsChange }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [authorImage, setAuthorImage] = useState<string>('');
  const [authorName, setAuthorName] = useState<string>('Author');
  const [tooltipTitle, setTooltipTitle] = useState<string>('Thinking Out Loud');
  const [sampleContent, setSampleContent] = useState<string>('This is a sample tooltip content that shows how your InfoTooltip will look with the uploaded author image.');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await SiteSettingsService.getSetting('info_tooltip_settings');
      if (settings && typeof settings === 'object') {
        const tooltipSettings = settings as {
          authorImage?: string;
          authorName?: string;
          tooltipTitle?: string;
        };
        
        setAuthorImage(tooltipSettings.authorImage || '');
        setAuthorName(tooltipSettings.authorName || 'Author');
        setTooltipTitle(tooltipSettings.tooltipTitle || 'Thinking Out Loud');
      }
    } catch (error) {
      console.error('Error loading InfoTooltip settings:', error);
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

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image file size must be less than 5MB');
      return;
    }

    setIsUploading(true);

    try {
      const result: UploadResult = await ImageUploadService.uploadImage(
        file, 
        'tooltip-authors', 
        `author-${Date.now()}`
      );

      setAuthorImage(result.url);
      await saveSettings(result.url, authorName, tooltipTitle);
      
      toast.success('Author image uploaded successfully');
      onSettingsChange?.();
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const saveSettings = async (imageUrl?: string, name?: string, title?: string) => {
    try {
      const settings = {
        authorImage: imageUrl || authorImage,
        authorName: name || authorName,
        tooltipTitle: title || tooltipTitle,
      };

      const success = await SiteSettingsService.setSetting('info_tooltip_settings', settings);
      
      if (success) {
        console.log('InfoTooltip settings saved successfully');
        onSettingsChange?.();
        return true;
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving InfoTooltip settings:', error);
      toast.error('Failed to save settings');
      return false;
    }
  };

  const handleSaveSettings = async () => {
    const success = await saveSettings();
    if (success) {
      toast.success('InfoTooltip settings saved successfully');
    }
  };

  const handleRemoveImage = async () => {
    try {
      setAuthorImage('');
      await saveSettings('', authorName, tooltipTitle);
      toast.success('Author image removed');
      onSettingsChange?.();
    } catch (error) {
      console.error('Error removing image:', error);
      toast.error('Failed to remove image');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>InfoTooltip Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Author Image Upload */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="author-image">Author Image</Label>
            <Input
              id="author-image"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isUploading}
              className="cursor-pointer"
            />
            <p className="text-xs text-muted-foreground">
              Upload an image for the InfoTooltip author. Recommended: Square image, max 5MB.
            </p>
          </div>

          {/* Current Image Preview */}
          {authorImage && (
            <div className="space-y-2">
              <Label>Current Author Image</Label>
              <div className="flex items-center gap-4">
                <img 
                  src={authorImage} 
                  alt="Author"
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                />
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

        {/* Author Name */}
        <div className="space-y-2">
          <Label htmlFor="author-name">Author Name</Label>
          <Input
            id="author-name"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Enter author name"
          />
        </div>

        {/* Tooltip Title */}
        <div className="space-y-2">
          <Label htmlFor="tooltip-title">Tooltip Title</Label>
          <Input
            id="tooltip-title"
            value={tooltipTitle}
            onChange={(e) => setTooltipTitle(e.target.value)}
            placeholder="Enter tooltip title"
          />
        </div>

        {/* Live Preview */}
        <div className="space-y-4">
          <Label>Live Preview</Label>
          <div className="border rounded-lg p-6 bg-gray-50 flex items-center justify-center">
            <InfoTooltip
              title={tooltipTitle}
              content={sampleContent}
              authorImage={authorImage || undefined}
              authorName={authorName}
              size="md"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            This is how your InfoTooltip will appear on the website. Click it to test the tooltip!
          </p>
        </div>

        {/* Sample Content Editor */}
        <div className="space-y-2">
          <Label htmlFor="sample-content">Preview Content (for testing only)</Label>
          <textarea
            id="sample-content"
            value={sampleContent}
            onChange={(e) => setSampleContent(e.target.value)}
            className="w-full p-3 border rounded-md resize-none"
            rows={3}
            placeholder="Enter sample content to test the tooltip"
          />
        </div>

        {/* Save Button */}
        <Button 
          onClick={handleSaveSettings} 
          disabled={isUploading}
          className="w-full"
        >
          {isUploading ? 'Uploading...' : 'Save InfoTooltip Settings'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default InfoTooltipSettings;