import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Upload, Image, X, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';

interface ProtocolImageUploadProps {
  imageKey: string;
  altKey: string;
  title: string;
  description?: string;
  onImageChange?: (imageUrl: string, altText: string) => void;
}

const ProtocolImageUpload: React.FC<ProtocolImageUploadProps> = ({ 
  imageKey, 
  altKey,
  title, 
  description,
  onImageChange 
}) => {
  const [imageUrl, setImageUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadImage();
  }, [imageKey, altKey]);

  const loadImage = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_key, setting_value')
        .in('setting_key', [imageKey, altKey]);

      if (error) {
        console.error('Error loading image settings:', error);
        return;
      }

      const settings = data?.reduce((acc, item) => {
        const value = item.setting_value;
        try {
          acc[item.setting_key] = typeof value === 'string' ? JSON.parse(value || '""') : String(value || '');
        } catch {
          acc[item.setting_key] = String(value || '');
        }
        return acc;
      }, {} as Record<string, string>) || {};

      setImageUrl(settings[imageKey] || '');
      setAltText(settings[altKey] || '');
    } catch (error) {
      console.error('Error loading protocol image:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (JPG, PNG, WebP, etc.)');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB for optimal performance');
      return;
    }

    setIsUploading(true);
    try {
      const { ImageUploadService } = await import('@/services/ImageUploadService');
      
      const fileName = `protocol-${imageKey.replace('protocol_', '').replace('_image', '')}-${Date.now()}`;
      const result = await ImageUploadService.uploadImage(file, 'website-images', fileName);

      const newImageUrl = result.url;
      setImageUrl(newImageUrl);
      
      // Auto-save the image to database
      await saveImageToDatabase(newImageUrl, altText);
      
      if (onImageChange) {
        onImageChange(newImageUrl, altText);
      }
      
      toast.success('Image uploaded and saved successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAltTextChange = (value: string) => {
    setAltText(value);
  };

  const saveImageToDatabase = async (url: string, alt: string) => {
    try {
      const updates = [
        { setting_key: imageKey, setting_value: JSON.stringify(url) },
        { setting_key: altKey, setting_value: JSON.stringify(alt) }
      ];

      for (const update of updates) {
        await supabase
          .from('site_settings')
          .upsert(update, { onConflict: 'setting_key' });
      }
    } catch (error) {
      console.error('Error saving to database:', error);
      throw error;
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveImageToDatabase(imageUrl, altText);
      
      if (onImageChange) {
        onImageChange(imageUrl, altText);
      }
      
      toast.success('Image settings saved successfully!');
    } catch (error) {
      console.error('Error saving image settings:', error);
      toast.error('Failed to save image settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUrlChange = (url: string) => {
    setImageUrl(url);
  };

  const removeImage = () => {
    setImageUrl('');
    setAltText('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image size={20} />
          {title}
        </CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Recommended size:</strong> 1200×630px (16:9 ratio)<br />
            <strong>File size:</strong> Under 2MB<br />
            <strong>Formats:</strong> JPG, PNG, WebP
          </AlertDescription>
        </Alert>

        {/* Current Image Preview */}
        {imageUrl && (
          <div className="relative">
            <img 
              src={imageUrl} 
              alt={altText || title} 
              className="w-full h-48 object-cover rounded-lg border"
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={removeImage}
            >
              <X size={16} />
            </Button>
            <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
              Preview
            </div>
          </div>
        )}

        {/* File Upload */}
        <div className="space-y-2">
          <Label htmlFor={`protocol-upload-${imageKey}`}>Upload New Image</Label>
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 hover:border-muted-foreground/50 transition-colors">
            <div className="flex flex-col items-center gap-3">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <div className="text-center">
                <Input
                  id={`protocol-upload-${imageKey}`}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80 cursor-pointer"
                />
                {isUploading && (
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-2">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    Uploading...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* URL Input */}
        <div>
          <Label htmlFor={`protocol-url-${imageKey}`}>Or Enter Image URL</Label>
          <Input
            id={`protocol-url-${imageKey}`}
            value={imageUrl}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="mt-1"
          />
        </div>

        {/* Alt Text Input */}
        {imageUrl && (
          <div>
            <Label htmlFor={`protocol-alt-${imageKey}`}>Image Alt Text (SEO)</Label>
            <Input
              id={`protocol-alt-${imageKey}`}
              value={altText}
              onChange={(e) => handleAltTextChange(e.target.value)}
              placeholder="Describe the image for accessibility and SEO"
              className="mt-1"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Alt text improves SEO and accessibility. Describe what's shown in the image.
            </p>
          </div>
        )}

        {/* Save Button */}
        {(imageUrl || altText) && (
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="w-full"
          >
            <Upload size={16} className="mr-2" />
            {isSaving ? 'Saving...' : 'Save Image Settings'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ProtocolImageUpload;