import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { ImageUploadService } from "@/services/ImageUploadService";
import { Upload, X } from "lucide-react";

interface PageImageSettings {
  [key: string]: string;
}

const PAGES = [
  { key: 'myFoodSelection', label: 'My Food Selection' },
  { key: 'myWeightStory', label: 'My Weight Story' },
  { key: 'aboutFastNowApp', label: 'About Fast Now App' },
  { key: 'fastNowProtocol', label: 'FastNow Protocol' },
  { key: 'home', label: 'Home Page' },
  { key: 'blog', label: 'Blog Page' }
];

const PageImageSettings: React.FC = () => {
  const [pageImages, setPageImages] = useState<PageImageSettings>({});
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    // Load existing page images from localStorage
    const savedImages = localStorage.getItem('fastingApp_pageImages');
    if (savedImages) {
      setPageImages(JSON.parse(savedImages));
    }
  }, []);

  const handleImageUpload = async (pageKey: string, file: File) => {
    if (!file) return;

    try {
      setUploading(pageKey);
      const result = await ImageUploadService.uploadImage(file, 'page-featured', `${pageKey}-featured.${file.name.split('.').pop()}`);
      
      const updatedImages = {
        ...pageImages,
        [pageKey]: result.url
      };
      
      setPageImages(updatedImages);
      localStorage.setItem('fastingApp_pageImages', JSON.stringify(updatedImages));
      
      toast.success(`Featured image uploaded for ${PAGES.find(p => p.key === pageKey)?.label}`);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(null);
    }
  };

  const handleRemoveImage = (pageKey: string) => {
    const updatedImages = { ...pageImages };
    delete updatedImages[pageKey];
    
    setPageImages(updatedImages);
    localStorage.setItem('fastingApp_pageImages', JSON.stringify(updatedImages));
    
    toast.success(`Featured image removed for ${PAGES.find(p => p.key === pageKey)?.label}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Page Featured Images</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {PAGES.map((page) => (
            <div key={page.key} className="space-y-3">
              <Label className="text-sm font-medium">{page.label}</Label>
              
              {pageImages[page.key] ? (
                <div className="space-y-3">
                  <div className="relative">
                    <img 
                      src={pageImages[page.key]} 
                      alt={`${page.label} featured image`}
                      className="w-full h-32 object-cover rounded-md border"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => handleRemoveImage(page.key)}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <p className="text-gray-500 mb-3">No featured image set</p>
                  <Button
                    variant="outline"
                    disabled={uploading === page.key}
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) handleImageUpload(page.key, file);
                      };
                      input.click();
                    }}
                  >
                    <Upload size={16} className="mr-2" />
                    {uploading === page.key ? 'Uploading...' : 'Upload Image'}
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PageImageSettings;