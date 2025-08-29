import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Upload, Image, X } from 'lucide-react';

interface PageFeaturedImageSettingsProps {
  pageKey: string;
  title?: string;
}

const PageFeaturedImageSettings: React.FC<PageFeaturedImageSettingsProps> = ({ 
  pageKey, 
  title = "Featured Image" 
}) => {
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadFeaturedImage();
  }, [pageKey]);

  const loadFeaturedImage = async () => {
    try {
      const { pageContentService } = await import('@/services/PageContentService');
      
      const content = await pageContentService.getPageContent(pageKey);
      if (content?.featured_image_url) {
        setImageUrl(content.featured_image_url);
      }
    } catch (error) {
      console.error('Error loading featured image:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setIsUploading(true);
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${pageKey}-featured-${Date.now()}.${fileExt}`;
      const filePath = `featured-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('website-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('website-images')
        .getPublicUrl(filePath);

      setImageUrl(publicUrl);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlChange = (url: string) => {
    setImageUrl(url);
  };

  const saveFeaturedImage = async () => {
    setIsSaving(true);
    try {
      const { pageContentService } = await import('@/services/PageContentService');
      
      // Get existing content and update only the featured image
      const existingContent = await pageContentService.getPageContent(pageKey);
      
      await pageContentService.savePageContent({
        page_key: pageKey,
        title: existingContent?.title || '',
        content: existingContent?.content || '',
        button_text: existingContent?.button_text || '',
        button_url: existingContent?.button_url || '',
        meta_title: existingContent?.meta_title || '',
        meta_description: existingContent?.meta_description || '',
        featured_image_url: imageUrl,
        is_published: existingContent?.is_published ?? true
      });

      toast.success('Featured image saved successfully!');
    } catch (error) {
      console.error('Error saving featured image:', error);
      toast.error('Failed to save featured image');
    } finally {
      setIsSaving(false);
    }
  };

  const removeFeaturedImage = () => {
    setImageUrl('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image size={20} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Upload or set a featured image that will appear at the top of this page.
        </p>

        {/* Current Image Preview */}
        {imageUrl && (
          <div className="relative">
            <img 
              src={imageUrl} 
              alt="Featured image preview" 
              className="w-full h-48 object-cover rounded-lg border"
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={removeFeaturedImage}
            >
              <X size={16} />
            </Button>
          </div>
        )}

        {/* File Upload */}
        <div>
          <Label htmlFor={`featured-upload-${pageKey}`}>Upload New Image</Label>
          <div className="flex items-center gap-2 mt-1">
            <Input
              id={`featured-upload-${pageKey}`}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
            />
            {isUploading && (
              <div className="text-sm text-muted-foreground">Uploading...</div>
            )}
          </div>
        </div>

        {/* URL Input */}
        <div>
          <Label htmlFor={`featured-url-${pageKey}`}>Or Enter Image URL</Label>
          <Input
            id={`featured-url-${pageKey}`}
            value={imageUrl}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="mt-1"
          />
        </div>

        {/* Save Button */}
        <Button 
          onClick={saveFeaturedImage}
          disabled={isSaving || !imageUrl}
          className="w-full"
        >
          <Upload size={16} className="mr-2" />
          {isSaving ? 'Saving...' : 'Save Featured Image'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PageFeaturedImageSettings;