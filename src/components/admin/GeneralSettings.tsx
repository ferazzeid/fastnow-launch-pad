import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/components/ui/sonner";
import { Input } from "@/components/ui/input";
import { ImageUploadService } from "@/services/ImageUploadService";

const GeneralSettings: React.FC = () => {
  const [logo, setLogo] = useState<File | null>(null);
  const [appImage, setAppImage] = useState<File | null>(null);
  const [favicon, setFavicon] = useState<File | null>(null);
  const [appStoreLink, setAppStoreLink] = useState(localStorage.getItem('fastingApp_appStoreLink') || 'https://apps.apple.com');
  const [googlePlayLink, setGooglePlayLink] = useState(localStorage.getItem('fastingApp_googlePlayLink') || 'https://play.google.com');
  const [logoPreview, setLogoPreview] = useState(localStorage.getItem('fastingApp_logoUrl') || '');
  const [mockupPreview, setMockupPreview] = useState(localStorage.getItem('fastingApp_mockupUrl') || '');
  const [faviconPreview, setFaviconPreview] = useState(localStorage.getItem('fastingApp_faviconUrl') || '');
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
        const result = await ImageUploadService.uploadImage(file, 'logos', `logo-${Date.now()}`);
        setLogoPreview(result.url);
        localStorage.setItem('fastingApp_logoUrl', result.url);
        localStorage.setItem('fastingApp_logoPath', result.path);
        toast.success("Logo uploaded successfully");
      } catch (error) {
        toast.error("Failed to upload logo image");
        console.error("Error uploading logo:", error);
      }
    }
  };

  const handleAppImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAppImage(file);
      
      try {
        const result = await ImageUploadService.uploadImage(file, 'app-images', `app-image-${Date.now()}`);
        setMockupPreview(result.url);
        localStorage.setItem('fastingApp_mockupUrl', result.url);
        localStorage.setItem('fastingApp_mockupPath', result.path);
        toast.success("App image uploaded successfully");
      } catch (error) {
        toast.error("Failed to upload app image");
        console.error("Error uploading app image:", error);
      }
    }
  };

  const handleFaviconChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFavicon(file);
      
      try {
        const result = await ImageUploadService.uploadImage(file, 'favicons', `favicon-${Date.now()}`);
        setFaviconPreview(result.url);
        localStorage.setItem('fastingApp_faviconUrl', result.url);
        localStorage.setItem('fastingApp_faviconPath', result.path);
        
        // Update favicon in real-time
        const linkElement = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
        if (linkElement) {
          linkElement.href = result.url;
        } else {
          const newLink = document.createElement('link');
          newLink.rel = 'icon';
          newLink.href = result.url;
          document.head.appendChild(newLink);
        }
        
        toast.success("Favicon uploaded successfully");
      } catch (error) {
        toast.error("Failed to upload favicon image");
        console.error("Error uploading favicon:", error);
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
                This will replace "fastnow.app" in the header. Hover to preview.
              </p>
            </div>
            <div>
              {logoPreview && (
                <div className="border rounded p-4 flex justify-center group">
                  <img 
                    src={logoPreview} 
                    alt="Logo preview" 
                    className="max-h-16 transition-transform hover:scale-150 cursor-pointer" 
                    style={{ height: `${logoSize}px` }}
                    title="Hover to zoom"
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
          <CardTitle>Favicon Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="favicon-upload">Upload Favicon</Label>
              <input 
                id="favicon-upload" 
                type="file" 
                accept="image/*" 
                onChange={handleFaviconChange} 
                className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
              />
              <p className="text-sm text-muted-foreground mt-1">
                This will be displayed in browser tabs
              </p>
            </div>
            <div>
              {faviconPreview && (
                <div className="border rounded p-4 flex justify-center">
                  <img 
                    src={faviconPreview} 
                    alt="Favicon preview" 
                    className="max-h-16" 
                  />
                </div>
              )}
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
                This will replace the phone image on the landing page. Hover to preview.
              </p>
            </div>
            <div>
              {mockupPreview && (
                <div className="border rounded p-4 flex justify-center group">
                  <img 
                    src={mockupPreview} 
                    alt="App image preview" 
                    className="max-h-40 transition-transform hover:scale-150 cursor-pointer" 
                    title="Hover to zoom"
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
