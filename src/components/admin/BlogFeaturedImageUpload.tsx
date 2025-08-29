import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Upload, Image, X, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface BlogFeaturedImageUploadProps {
  currentImageUrl: string;
  onImageChange: (imageUrl: string) => void;
}

const BlogFeaturedImageUpload: React.FC<BlogFeaturedImageUploadProps> = ({ 
  currentImageUrl, 
  onImageChange 
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(currentImageUrl);

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
      const { BlogImageService } = await import('@/services/BlogImageService');
      
      const fileName = `blog-featured-${Date.now()}`;
      
      // Check if current image is one of our predefined featured images
      const predefinedImages = [
        'blog-featured-1.jpg', 'blog-featured-2.jpg', 'blog-featured-3.jpg', 
        'blog-featured-4.jpg', 'blog-featured-5.jpg'
      ];
      const shouldDeleteOld = currentImageUrl && !predefinedImages.some(img => currentImageUrl.includes(img));
      
      // Upload new image (with old image deletion if applicable)
      const result = await BlogImageService.uploadBlogImage(file, fileName);

      // Delete old image if it's not a predefined one and exists
      if (shouldDeleteOld) {
        try {
          const { ImageUploadService } = await import('@/services/ImageUploadService');
          const oldPath = ImageUploadService.extractPathFromUrl(currentImageUrl);
          if (oldPath) {
            await ImageUploadService.deleteImage(oldPath);
          }
        } catch (error) {
          console.warn('Failed to delete old image:', error);
        }
      }

      setImageUrl(result.url);
      onImageChange(result.url);
      toast.success('Featured image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlChange = (url: string) => {
    setImageUrl(url);
    onImageChange(url);
  };

  const removeImage = () => {
    setImageUrl('');
    onImageChange('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image size={20} />
          Featured Image
        </CardTitle>
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
              alt="Featured image preview" 
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
        <div>
          <Label htmlFor="blog-featured-upload">Upload New Image</Label>
          <div className="flex items-center gap-2 mt-1">
            <Input
              id="blog-featured-upload"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
            />
            {isUploading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                Uploading...
              </div>
            )}
          </div>
        </div>

        {/* URL Input */}
        <div>
          <Label htmlFor="blog-featured-url">Or Enter Image URL</Label>
          <Input
            id="blog-featured-url"
            value={imageUrl}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="mt-1"
          />
        </div>

        {/* Image Size Info */}
        {imageUrl && (
          <div className="text-sm text-muted-foreground bg-muted p-3 rounded">
            <strong>Tip:</strong> For best results on social media and blog feeds, use a 16:9 aspect ratio image at 1200×630px or larger.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BlogFeaturedImageUpload;