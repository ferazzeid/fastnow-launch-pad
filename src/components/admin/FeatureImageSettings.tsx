import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { ImageUploadService } from "@/services/ImageUploadService";
import { Upload, X } from "lucide-react";

interface FeatureImageSettings {
  [key: string]: string;
}

const FEATURES = [
  { key: 'fasting-timer', label: 'Fasting Timer' },
  { key: 'walking-tracker', label: 'Walking Tracker' },
  { key: 'food-log', label: 'Food Log' },
  { key: 'motivators', label: 'Motivators' },
];

const FeatureImageSettings: React.FC = () => {
  const [featureImages, setFeatureImages] = useState<FeatureImageSettings>({});
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    // Load existing feature images from localStorage
    const savedImages = localStorage.getItem('fastingApp_featureImages');
    if (savedImages) {
      setFeatureImages(JSON.parse(savedImages));
    }
  }, []);

  const handleImageUpload = async (featureKey: string, file: File) => {
    if (!file) return;

    try {
      setUploading(featureKey);
      const result = await ImageUploadService.uploadImage(file, 'feature-images', `${featureKey}-image.${file.name.split('.').pop()}`);
      
      const updatedImages = {
        ...featureImages,
        [featureKey]: result.url
      };
      
      setFeatureImages(updatedImages);
      localStorage.setItem('fastingApp_featureImages', JSON.stringify(updatedImages));
      
      toast.success(`Feature image uploaded for ${FEATURES.find(f => f.key === featureKey)?.label}`);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(null);
    }
  };

  const handleRemoveImage = (featureKey: string) => {
    const updatedImages = { ...featureImages };
    delete updatedImages[featureKey];
    
    setFeatureImages(updatedImages);
    localStorage.setItem('fastingApp_featureImages', JSON.stringify(updatedImages));
    
    toast.success(`Feature image removed for ${FEATURES.find(f => f.key === featureKey)?.label}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feature Images</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {FEATURES.map((feature) => (
            <div key={feature.key} className="space-y-3">
              <Label className="text-sm font-medium">{feature.label}</Label>
              
              {featureImages[feature.key] ? (
                <div className="space-y-3">
                  <div className="relative">
                    <img 
                      src={featureImages[feature.key]} 
                      alt={`${feature.label} feature image`}
                      className="w-full h-32 object-cover rounded-md border"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => handleRemoveImage(feature.key)}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <p className="text-gray-500 mb-3">No feature image set</p>
                  <Button
                    variant="outline"
                    disabled={uploading === feature.key}
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) handleImageUpload(feature.key, file);
                      };
                      input.click();
                    }}
                  >
                    <Upload size={16} className="mr-2" />
                    {uploading === feature.key ? 'Uploading...' : 'Upload Image'}
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

export default FeatureImageSettings;