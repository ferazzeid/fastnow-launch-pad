import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { ImageUploadService, UploadResult } from '@/services/ImageUploadService';
import { SiteSettingsService } from '@/services/SiteSettingsService';
import { Trash2, MoveUp, MoveDown, Plus } from 'lucide-react';

interface SlideshowImage {
  id: string;
  src: string;
  alt: string;
  order: number;
}

interface SlideshowSettings {
  title: string;
  images: SlideshowImage[];
}

const SlideshowAdminSettings: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<SlideshowSettings>({
    title: "Aren't you tired of this?",
    images: []
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await SiteSettingsService.getSetting('slideshow_gallery_settings');
      if (savedSettings && typeof savedSettings === 'object' && !Array.isArray(savedSettings)) {
        setSettings(savedSettings as unknown as SlideshowSettings);
      } else {
        // Initialize with default images if no settings exist
        setSettings({
          title: "Aren't you tired of this?",
          images: [
            {
              id: '1',
              src: '/lovable-uploads/a692b963-f764-48e1-bcce-3e8fcc088664.png',
              alt: 'Struggling with loose clothes',
              order: 1
            },
            {
              id: '2',
              src: '/lovable-uploads/62548454-bd7e-4abe-ad5b-8c0e94ffcfee.png',
              alt: 'Feeling self-conscious at restaurants',
              order: 2
            },
            {
              id: '3',
              src: '/lovable-uploads/fbd5bcda-a4f6-4c7d-a715-9296283c6e79.png',
              alt: 'Difficulty at the gym',
              order: 3
            },
            {
              id: '4',
              src: '/lovable-uploads/3c1b9262-ae67-4093-b76b-f09bc99170c2.png',
              alt: 'Returning clothes that don\'t fit',
              order: 4
            },
            {
              id: '5',
              src: '/lovable-uploads/7ab8d747-9c05-46b7-8cf1-ecf01dc91aa8.png',
              alt: 'Struggling with exercise',
              order: 5
            },
            {
              id: '6',
              src: '/lovable-uploads/55fd8231-9516-4cb3-a6f8-3534c7e08a9b.png',
              alt: 'Clothes shopping difficulties',
              order: 6
            },
            {
              id: '7',
              src: '/lovable-uploads/6d39dc89-c8e2-4796-889d-385a77164cd0.png',
              alt: 'Uncomfortable airline seats',
              order: 7
            }
          ]
        });
      }
    } catch (error) {
      console.error('Error loading slideshow settings:', error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image file size must be less than 10MB');
      return;
    }

    setIsUploading(true);

    try {
      const result: UploadResult = await ImageUploadService.uploadImage(
        file, 
        'slideshow-images', 
        `slideshow-${Date.now()}`
      );

      const newImage: SlideshowImage = {
        id: Date.now().toString(),
        src: result.url,
        alt: 'New slideshow image',
        order: settings.images.length + 1
      };

      setSettings(prev => ({
        ...prev,
        images: [...prev.images, newImage]
      }));
      
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const updateImageAlt = (imageId: string, newAlt: string) => {
    setSettings(prev => ({
      ...prev,
      images: prev.images.map(img => 
        img.id === imageId ? { ...img, alt: newAlt } : img
      )
    }));
  };

  const removeImage = (imageId: string) => {
    setSettings(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== imageId)
        .map((img, index) => ({ ...img, order: index + 1 }))
    }));
  };

  const moveImage = (imageId: string, direction: 'up' | 'down') => {
    setSettings(prev => {
      const images = [...prev.images].sort((a, b) => a.order - b.order);
      const currentIndex = images.findIndex(img => img.id === imageId);
      
      if (
        (direction === 'up' && currentIndex === 0) ||
        (direction === 'down' && currentIndex === images.length - 1)
      ) {
        return prev;
      }

      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      
      // Swap the images
      [images[currentIndex], images[newIndex]] = [images[newIndex], images[currentIndex]];
      
      // Update order numbers
      const updatedImages = images.map((img, index) => ({
        ...img,
        order: index + 1
      }));

      return {
        ...prev,
        images: updatedImages
      };
    });
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      const success = await SiteSettingsService.setSetting('slideshow_gallery_settings', settings);
      
      if (success) {
        toast.success('Slideshow settings saved successfully');
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving slideshow settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Slideshow Gallery Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Title Setting */}
        <div className="space-y-2">
          <Label htmlFor="slideshow-title">Section Title</Label>
          <Input
            id="slideshow-title"
            value={settings.title}
            onChange={(e) => setSettings(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Section title"
          />
        </div>

        {/* Add New Image */}
        <div className="space-y-2">
          <Label htmlFor="new-image">Add New Image</Label>
          <Input
            id="new-image"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={isUploading}
            className="cursor-pointer"
          />
          <p className="text-xs text-muted-foreground">
            Upload images for the slideshow gallery. Recommended: High quality, max 10MB.
          </p>
        </div>

        {/* Current Images */}
        <div className="space-y-4">
          <Label>Current Images ({settings.images.length})</Label>
          {settings.images.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No images uploaded yet.</p>
          ) : (
            <div className="space-y-4">
              {settings.images
                .sort((a, b) => a.order - b.order)
                .map((image, index) => (
                <div key={image.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start gap-4">
                    {/* Image Preview */}
                    <div className="flex-shrink-0">
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    </div>
                    
                    {/* Image Details */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Image {image.order}</span>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => moveImage(image.id, 'up')}
                            disabled={index === 0}
                          >
                            <MoveUp size={16} />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => moveImage(image.id, 'down')}
                            disabled={index === settings.images.length - 1}
                          >
                            <MoveDown size={16} />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeImage(image.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor={`alt-${image.id}`} className="text-xs">Alt Text</Label>
                        <Textarea
                          id={`alt-${image.id}`}
                          value={image.alt}
                          onChange={(e) => updateImageAlt(image.id, e.target.value)}
                          placeholder="Describe this image for accessibility"
                          rows={2}
                          className="text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Save Button */}
        <Button 
          onClick={saveSettings} 
          disabled={isSaving || isUploading}
          className="w-full"
        >
          {isSaving ? 'Saving...' : 'Save Slideshow Settings'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SlideshowAdminSettings;