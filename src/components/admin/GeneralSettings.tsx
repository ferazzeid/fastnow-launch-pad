import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/components/ui/sonner";
import { Input } from "@/components/ui/input";

const GeneralSettings: React.FC = () => {
  const [logo, setLogo] = useState<File | null>(null);
  const [appImage, setAppImage] = useState<File | null>(null);
  const [appStoreLink, setAppStoreLink] = useState(localStorage.getItem('fastingApp_appStoreLink') || 'https://apps.apple.com');
  const [googlePlayLink, setGooglePlayLink] = useState(localStorage.getItem('fastingApp_googlePlayLink') || 'https://play.google.com');
  const [logoPreview, setLogoPreview] = useState(localStorage.getItem('fastingApp_logoUrl') || '');
  const [mockupPreview, setMockupPreview] = useState(localStorage.getItem('fastingApp_mockupUrl') || '');
  const [imageSize, setImageSize] = useState(
    parseInt(localStorage.getItem('fastingApp_imageSize') || '300')
  );
  const [logoSize, setLogoSize] = useState(
    parseInt(localStorage.getItem('fastingApp_logoSize') || '32')
  );
  const [imageAlt, setImageAlt] = useState(
    localStorage.getItem('fastingApp_imageAlt') || 'Fasting app interface preview'
  );
  
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogo(file);
      
      try {
        // Convert to base64
        const base64String = await convertFileToBase64(file);
        setLogoPreview(base64String);
        localStorage.setItem('fastingApp_logoUrl', base64String);
        toast.success("Logo uploaded successfully");
      } catch (error) {
        toast.error("Failed to process logo image");
        console.error("Error processing logo:", error);
      }
    }
  };

  const handleAppImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAppImage(file);
      
      try {
        // Convert to base64
        const base64String = await convertFileToBase64(file);
        setMockupPreview(base64String);
        localStorage.setItem('fastingApp_mockupUrl', base64String);
        toast.success("App image uploaded successfully");
      } catch (error) {
        toast.error("Failed to process app image");
        console.error("Error processing app image:", error);
      }
    }
  };

  const handleLinksUpdate = () => {
    localStorage.setItem('fastingApp_appStoreLink', appStoreLink);
    localStorage.setItem('fastingApp_googlePlayLink', googlePlayLink);
    toast.success("Links updated successfully");
  };

  const handleImageSizeChange = (value: number[]) => {
    const newSize = value[0];
    setImageSize(newSize);
    localStorage.setItem('fastingApp_imageSize', newSize.toString());
    toast.success("Image size updated");
  };
  
  const handleLogoSizeChange = (value: number[]) => {
    const newSize = value[0];
    setLogoSize(newSize);
    localStorage.setItem('fastingApp_logoSize', newSize.toString());
    toast.success("Logo size updated");
  };
  
  const handleAltTextUpdate = () => {
    localStorage.setItem('fastingApp_imageAlt', imageAlt);
    toast.success("Alt text updated successfully");
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Logo Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="logo-upload">Upload Logo</Label>
              <input 
                id="logo-upload" 
                type="file" 
                accept="image/*" 
                onChange={handleLogoChange} 
                className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
              />
              <p className="text-sm text-muted-foreground mt-1">
                This will replace "fastnow.app" in the header
              </p>
            </div>
            <div>
              {logoPreview && (
                <div className="border rounded p-4 flex justify-center">
                  <img 
                    src={logoPreview} 
                    alt="Logo preview" 
                    className="max-h-16" 
                    style={{ height: `${logoSize}px` }}
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-2 pt-4">
            <Label htmlFor="logo-size">Logo Size (px)</Label>
            <div className="flex items-center gap-4">
              <Slider
                id="logo-size"
                defaultValue={[logoSize]}
                min={16}
                max={64}
                step={2}
                onValueChange={handleLogoSizeChange}
                className="flex-1"
              />
              <span className="w-12 text-center">{logoSize}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>App Image</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="mockup-upload">Upload App Image</Label>
              <input 
                id="mockup-upload" 
                type="file" 
                accept="image/*" 
                onChange={handleAppImageChange}
                className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
              />
              <p className="text-sm text-muted-foreground mt-1">
                This will replace the phone image on the landing page
              </p>
            </div>
            <div>
              {mockupPreview && (
                <div className="border rounded p-4 flex justify-center">
                  <img 
                    src={mockupPreview} 
                    alt="App image preview" 
                    className="max-h-40" 
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-2 pt-4">
            <Label htmlFor="image-size">App Image Size (px)</Label>
            <div className="flex items-center gap-4">
              <Slider
                id="image-size"
                defaultValue={[imageSize]}
                min={200}
                max={600}
                step={10}
                onValueChange={handleImageSizeChange}
                className="flex-1"
              />
              <span className="w-12 text-center">{imageSize}</span>
            </div>
          </div>
          
          <div className="space-y-2 pt-4">
            <Label htmlFor="image-alt">App Image Alt Text</Label>
            <Input
              id="image-alt"
              value={imageAlt}
              onChange={(e) => setImageAlt(e.target.value)}
              placeholder="Descriptive alt text for the app image"
            />
            <p className="text-xs text-muted-foreground">
              Important for accessibility and SEO
            </p>
            <Button onClick={handleAltTextUpdate} className="mt-2">Save Alt Text</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>App Store Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="app-store">App Store Link</Label>
              <Input 
                id="app-store" 
                value={appStoreLink} 
                onChange={(e) => setAppStoreLink(e.target.value)} 
                placeholder="https://apps.apple.com/..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="google-play">Google Play Link</Label>
              <Input 
                id="google-play" 
                value={googlePlayLink} 
                onChange={(e) => setGooglePlayLink(e.target.value)} 
                placeholder="https://play.google.com/..."
              />
            </div>
          </div>
          <Button onClick={handleLinksUpdate}>Save Links</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeneralSettings;
