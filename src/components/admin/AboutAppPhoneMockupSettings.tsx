import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImageUploadService } from "@/services/ImageUploadService";
import { pageContentService } from "@/services/PageContentService";
import { FeatureScreenshotMockup } from "@/components/FeatureScreenshotMockup";
import { Upload, Save, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AboutAppPhoneMockupSettings() {
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadCurrentImage();
  }, []);

  const loadCurrentImage = async () => {
    try {
      const content = await pageContentService.getPageContent('about-fastnow-app');
      if (content && content.button_url) {
        setImageUrl(content.button_url); // Using button_url field to store phone mockup image
      }
    } catch (error) {
      console.error('Error loading phone mockup image:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "Error", 
        description: "Image must be smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    try {
      const uploadResult = await ImageUploadService.uploadImage(
        file,
        'about-app-phone-mockups',
        `phone-mockup-${Date.now()}`
      );
      
      setImageUrl(uploadResult.url);
      
      toast({
        title: "Success",
        description: "Phone mockup image uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Get current content first
      const currentContent = await pageContentService.getPageContent('about-fastnow-app');
      
      // Update with phone mockup image URL in button_url field
      await pageContentService.savePageContent({
        page_key: 'about-fastnow-app',
        title: currentContent?.title || 'About the FastNow App',
        subtitle: currentContent?.subtitle || '',
        content: currentContent?.content || '',
        meta_title: currentContent?.meta_title || '',
        meta_description: currentContent?.meta_description || '',
        button_url: imageUrl, // Store phone mockup image URL
        is_published: true
      });

      toast({
        title: "Success",
        description: "Phone mockup image saved successfully",
      });
    } catch (error) {
      console.error('Error saving phone mockup image:', error);
      toast({
        title: "Error",
        description: "Failed to save phone mockup image",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    setImageUrl('');
    await handleSave();
    toast({
      title: "Success",
      description: "Phone mockup image removed",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>About App Phone Mockup</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left side - Controls */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="phone-mockup-upload">Upload Phone Mockup Image</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="phone-mockup-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  disabled={isUploading}
                >
                  <Upload size={16} />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Recommended: 9:19.5 aspect ratio, max 5MB
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                disabled={isSaving || !imageUrl}
                className="flex-1"
              >
                <Save size={16} className="mr-2" />
                {isSaving ? 'Saving...' : 'Save Phone Mockup'}
              </Button>
              
              {imageUrl && (
                <Button
                  onClick={handleRemove}
                  variant="outline"
                  size="icon"
                  disabled={isSaving}
                >
                  <Trash2 size={16} />
                </Button>
              )}
            </div>
          </div>

          {/* Right side - Preview */}
          <div className="flex justify-center">
            <div className="w-48">
              <FeatureScreenshotMockup
                imageUrl={imageUrl}
                altText="About App phone mockup"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}