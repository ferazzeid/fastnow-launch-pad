import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ImageUploadService } from "@/services/ImageUploadService";
import { FeatureScreenshotService, FeatureScreenshot } from "@/services/FeatureScreenshotService";
import { FeatureScreenshotMockup } from "@/components/FeatureScreenshotMockup";
import { Upload, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const FEATURE_LABELS = {
  'fasting-timer': 'Fasting Timer',
  'walking-tracker': 'Walking Tracker', 
  'food-log': 'Food Log',
  'motivators': 'Motivators',
  'ai-assistant': 'AI Assistant'
};

export default function FeatureScreenshotSettings() {
  const [screenshots, setScreenshots] = useState<FeatureScreenshot[]>([]);
  const [uploadingFeature, setUploadingFeature] = useState<string | null>(null);
  const [savingFeature, setSavingFeature] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadScreenshots();
  }, []);

  const loadScreenshots = async () => {
    try {
      const data = await FeatureScreenshotService.getFeatureScreenshots();
      setScreenshots(data);
    } catch (error) {
      console.error('Error loading feature screenshots:', error);
      toast({
        title: "Error",
        description: "Failed to load feature screenshots",
        variant: "destructive"
      });
    }
  };

  const handleFileUpload = async (featureKey: string, event: React.ChangeEvent<HTMLInputElement>) => {
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

    setUploadingFeature(featureKey);
    try {
      const uploadResult = await ImageUploadService.uploadImage(
        file, 
        'feature-screenshots', 
        `${featureKey}-${Date.now()}`
      );
      
      setScreenshots(prev => prev.map(screenshot => 
        screenshot.feature_key === featureKey 
          ? { ...screenshot, image_url: uploadResult.url }
          : screenshot
      ));

      toast({
        title: "Success",
        description: "Screenshot uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading screenshot:', error);
      toast({
        title: "Error",
        description: "Failed to upload screenshot",
        variant: "destructive"
      });
    } finally {
      setUploadingFeature(null);
    }
  };

  const handleTitleChange = (featureKey: string, newTitle: string) => {
    setScreenshots(prev => prev.map(screenshot => 
      screenshot.feature_key === featureKey 
        ? { ...screenshot, title: newTitle }
        : screenshot
    ));
  };

  const handleSave = async (featureKey: string) => {
    const screenshot = screenshots.find(s => s.feature_key === featureKey);
    if (!screenshot) return;

    setSavingFeature(featureKey);
    try {
      await FeatureScreenshotService.updateFeatureScreenshot(
        featureKey, 
        screenshot.image_url, 
        screenshot.title
      );
      
      toast({
        title: "Success",
        description: `${screenshot.title} updated successfully`,
      });
    } catch (error) {
      console.error('Error saving screenshot:', error);
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive"
      });
    } finally {
      setSavingFeature(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feature Screenshots</CardTitle>
        <CardDescription>
          Upload and manage screenshots for each app feature. These will be displayed in the About FastNow App page.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {screenshots.map((screenshot) => (
          <div key={screenshot.feature_key} className="border rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold">{FEATURE_LABELS[screenshot.feature_key as keyof typeof FEATURE_LABELS]}</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left side - Controls */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor={`title-${screenshot.feature_key}`}>Feature Title</Label>
                  <Input
                    id={`title-${screenshot.feature_key}`}
                    value={screenshot.title}
                    onChange={(e) => handleTitleChange(screenshot.feature_key, e.target.value)}
                    placeholder="Enter feature title"
                  />
                </div>

                <div>
                  <Label htmlFor={`file-${screenshot.feature_key}`}>Screenshot</Label>
                  <div className="flex gap-2">
                    <Input
                      id={`file-${screenshot.feature_key}`}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(screenshot.feature_key, e)}
                      disabled={uploadingFeature === screenshot.feature_key}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      disabled={uploadingFeature === screenshot.feature_key}
                    >
                      <Upload size={16} />
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={() => handleSave(screenshot.feature_key)}
                  disabled={savingFeature === screenshot.feature_key}
                  className="w-full"
                >
                  <Save size={16} className="mr-2" />
                  {savingFeature === screenshot.feature_key ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>

              {/* Right side - Preview */}
              <div className="flex justify-center">
                <div className="w-48">
                  <FeatureScreenshotMockup
                    imageUrl={screenshot.image_url}
                    altText={`${screenshot.title} screenshot`}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {screenshots.length === 0 && (
          <Alert>
            <AlertDescription>
              No feature screenshots found. They should be automatically created when the database is set up.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}