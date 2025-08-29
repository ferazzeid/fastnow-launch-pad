import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Upload, Image, X, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ImageUploadService } from '@/services/ImageUploadService';

interface FAQImageUploadProps {
  currentImageUrl: string;
  onImageChange: (imageUrl: string) => void;
}

const FAQImageUpload: React.FC<FAQImageUploadProps> = ({ 
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

    // Validate file size (max 1MB for FAQ images)
    if (file.size > 1 * 1024 * 1024) {
      toast.error('Image size should be less than 1MB for optimal performance');
      return;
    }

    setIsUploading(true);
    try {
      const result = await ImageUploadService.uploadImage(file, 'faq');
      
      setImageUrl(result.url);
      onImageChange(result.url);
      toast.success('FAQ image uploaded successfully!');
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
          FAQ Image (Optional)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Recommended size:</strong> 400×300px to 600×400px (4:3 ratio)<br />
            <strong>File size:</strong> Under 1MB<br />
            <strong>Formats:</strong> JPG, PNG, WebP<br />
            <strong>Purpose:</strong> Supporting visuals, diagrams, or screenshots
          </AlertDescription>
        </Alert>

        {/* Current Image Preview */}
        {imageUrl && (
          <div className="relative">
            <img 
              src={imageUrl} 
              alt="FAQ image preview" 
              className="w-full max-w-md h-48 object-cover rounded-lg border"
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
          <Label htmlFor="faq-image-upload">Upload New Image</Label>
          <div className="flex items-center gap-2 mt-1">
            <Input
              id="faq-image-upload"
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
          <Label htmlFor="faq-image-url">Or Enter Image URL</Label>
          <Input
            id="faq-image-url"
            value={imageUrl}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="mt-1"
          />
        </div>

        {/* Image Size Info */}
        {imageUrl && (
          <div className="text-sm text-muted-foreground bg-muted p-3 rounded">
            <strong>Tip:</strong> Images will appear alongside the FAQ answer. Choose images that help explain or illustrate your content.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FAQImageUpload;