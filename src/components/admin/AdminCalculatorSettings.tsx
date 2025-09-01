import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { CalculatorSettingsService, CalculatorSettings } from '@/services/CalculatorSettingsService';
import { ImageUploadService } from '@/services/ImageUploadService';

export const AdminCalculatorSettings: React.FC = () => {
  const [walkingSettings, setWalkingSettings] = useState<CalculatorSettings | null>(null);
  const [weightLossSettings, setWeightLossSettings] = useState<CalculatorSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const [walking, weightLoss] = await Promise.all([
        CalculatorSettingsService.getCalculatorSettings('walking'),
        CalculatorSettingsService.getCalculatorSettings('weight_loss')
      ]);
      
      setWalkingSettings(walking);
      setWeightLossSettings(weightLoss);
    } catch (error) {
      console.error('Error loading calculator settings:', error);
      toast.error('Failed to load calculator settings');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File, calculatorType: 'walking' | 'weight_loss') => {
    try {
      setSaving(true);
      
    const uploadedUrl = await CalculatorSettingsService.uploadAndSetBackground(calculatorType, file);
      
    // Update local state
    if (calculatorType === 'walking') {
      const updatedSettings = await CalculatorSettingsService.getCalculatorSettings('walking');
      setWalkingSettings(updatedSettings);
    } else {
      const updatedSettings = await CalculatorSettingsService.getCalculatorSettings('weight_loss');  
      setWeightLossSettings(updatedSettings);
    }
      
      toast.success('Background image updated successfully');
    } catch (error) {
      console.error('Error uploading background image:', error);
      toast.error('Failed to upload background image');
    } finally {
      setSaving(false);
    }
  };

  const handleColorUpdate = async (calculatorType: 'walking' | 'weight_loss', color: string) => {
    try {
      setSaving(true);
      
      const updatedSettings = await CalculatorSettingsService.updateCalculatorSettings(
        calculatorType, 
        { background_color: color }
      );
      
      if (calculatorType === 'walking') {
        setWalkingSettings(updatedSettings);
      } else {
        setWeightLossSettings(updatedSettings);
      }
      
      toast.success('Background color updated successfully');
    } catch (error) {
      console.error('Error updating background color:', error);
      toast.error('Failed to update background color');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Calculator Background Settings</h2>
        <p className="text-gray-600 mt-2">
          Manage background images and colors for the walking and weight loss calculators.
        </p>
      </div>

      <Tabs defaultValue="walking" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="walking">Walking Calculator</TabsTrigger>
          <TabsTrigger value="weight_loss">Weight Loss Calculator</TabsTrigger>
        </TabsList>

        <TabsContent value="walking" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Walking Calculator Background</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="walking-bg-color">Background Color</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="walking-bg-color"
                    type="color"
                    value={walkingSettings?.background_color || '#f8fafc'}
                    onChange={(e) => handleColorUpdate('walking', e.target.value)}
                    className="w-20 h-10"
                  />
                  <Input
                    type="text"
                    value={walkingSettings?.background_color || '#f8fafc'}
                    onChange={(e) => handleColorUpdate('walking', e.target.value)}
                    placeholder="#f8fafc"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="walking-bg-image">Background Image</Label>
                <div className="mt-2 space-y-2">
                  {walkingSettings?.background_image_url && (
                    <div className="w-32 h-20 rounded-lg overflow-hidden border">
                      <img 
                        src={walkingSettings.background_image_url} 
                        alt="Walking calculator background"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <Input
                    id="walking-bg-image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, 'walking');
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weight_loss" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Weight Loss Calculator Background</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="weightloss-bg-color">Background Color</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="weightloss-bg-color"
                    type="color"
                    value={weightLossSettings?.background_color || '#f8fafc'}
                    onChange={(e) => handleColorUpdate('weight_loss', e.target.value)}
                    className="w-20 h-10"
                  />
                  <Input
                    type="text"
                    value={weightLossSettings?.background_color || '#f8fafc'}
                    onChange={(e) => handleColorUpdate('weight_loss', e.target.value)}
                    placeholder="#f8fafc"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="weightloss-bg-image">Background Image</Label>
                <div className="mt-2 space-y-2">
                  {weightLossSettings?.background_image_url && (
                    <div className="w-32 h-20 rounded-lg overflow-hidden border">
                      <img 
                        src={weightLossSettings.background_image_url} 
                        alt="Weight loss calculator background"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <Input
                    id="weightloss-bg-image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, 'weight_loss');
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {saving && (
        <div className="text-center text-sm text-muted-foreground">
          Saving changes...
        </div>
      )}
    </div>
  );
};