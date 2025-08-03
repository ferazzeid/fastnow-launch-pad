import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { Upload, X, RefreshCw } from "lucide-react";
import { ImageUploadService } from "@/services/ImageUploadService";

const HomepageLogoSettings = () => {
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [logoSize, setLogoSize] = useState<number>(32);
  const [uploading, setUploading] = useState(false);

  const [homeImageUrl, setHomeImageUrl] = useState<string>('');
  const [homeImageFile, setHomeImageFile] = useState<File | null>(null);
  const [homeImagePreview, setHomeImagePreview] = useState<string>('');
  const [homeImageSize, setHomeImageSize] = useState<number>(300);
  const [homeImageAlt, setHomeImageAlt] = useState<string>('Fasting app interface preview');

  useEffect(() => {
    // Load existing settings
    const savedLogoUrl = localStorage.getItem('fastingApp_logoUrl');
    const savedLogoSize = localStorage.getItem('fastingApp_logoSize');
    const savedHomeImageUrl = localStorage.getItem('fastingApp_mockupUrl');
    const savedHomeImageSize = localStorage.getItem('fastingApp_imageSize');
    const savedHomeImageAlt = localStorage.getItem('fastingApp_imageAlt');

    if (savedLogoUrl) {
      setLogoUrl(savedLogoUrl);
      setLogoPreview(savedLogoUrl);
    }
    if (savedLogoSize) setLogoSize(parseInt(savedLogoSize));
    if (savedHomeImageUrl) {
      setHomeImageUrl(savedHomeImageUrl);
      setHomeImagePreview(savedHomeImageUrl);
    }
    if (savedHomeImageSize) setHomeImageSize(parseInt(savedHomeImageSize));
    if (savedHomeImageAlt) setHomeImageAlt(savedHomeImageAlt);
  }, []);

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('File size must be less than 5MB');
      return;
    }

    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));

    setUploading(true);
    try {
      const result = await ImageUploadService.uploadImage(file, 'logos');
      setLogoUrl(result.url);
      localStorage.setItem('fastingApp_logoUrl', result.url);
      toast.success('Logo uploaded successfully');
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Failed to upload logo');
    } finally {
      setUploading(false);
    }
  };

  const handleHomeImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('File size must be less than 10MB');
      return;
    }

    setHomeImageFile(file);
    setHomeImagePreview(URL.createObjectURL(file));

    setUploading(true);
    try {
      const result = await ImageUploadService.uploadImage(file, 'homepage');
      setHomeImageUrl(result.url);
      localStorage.setItem('fastingApp_mockupUrl', result.url);
      toast.success('Homepage image uploaded successfully');
    } catch (error) {
      console.error('Error uploading homepage image:', error);
      toast.error('Failed to upload homepage image');
    } finally {
      setUploading(false);
    }
  };

  const handleLogoSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const size = parseInt(e.target.value);
    setLogoSize(size);
    localStorage.setItem('fastingApp_logoSize', size.toString());
  };

  const handleHomeImageSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const size = parseInt(e.target.value);
    setHomeImageSize(size);
    localStorage.setItem('fastingApp_imageSize', size.toString());
  };

  const handleHomeImageAltChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const alt = e.target.value;
    setHomeImageAlt(alt);
    localStorage.setItem('fastingApp_imageAlt', alt);
  };

  const removeLogo = () => {
    setLogoUrl('');
    setLogoPreview('');
    setLogoFile(null);
    localStorage.removeItem('fastingApp_logoUrl');
    toast.success('Logo removed');
  };

  const removeHomeImage = () => {
    setHomeImageUrl('');
    setHomeImagePreview('');
    setHomeImageFile(null);
    localStorage.removeItem('fastingApp_mockupUrl');
    toast.success('Homepage image removed');
  };

  const clearAllCache = () => {
    // Clear all logo and image related localStorage items
    localStorage.removeItem('fastingApp_logoUrl');
    localStorage.removeItem('fastingApp_mockupUrl');
    localStorage.removeItem('fastingApp_customElements');
    
    // Reset state
    setLogoUrl('');
    setLogoPreview('');
    setLogoFile(null);
    setHomeImageUrl('');
    setHomeImagePreview('');
    setHomeImageFile(null);
    
    toast.success('All cached images cleared. Please refresh the page to see changes.');
  };

  return (
    <div className="space-y-6">
      {/* Clear Cache Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw size={20} />
            Clear Stuck Images
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            If you're seeing old images that won't update, use this button to clear all cached images and start fresh.
          </p>
          <Button onClick={clearAllCache} variant="destructive">
            <RefreshCw size={16} className="mr-2" />
            Clear All Cached Images
          </Button>
        </CardContent>
      </Card>

      {/* Logo Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload size={20} />
            Site Logo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {logoPreview && (
            <div className="flex items-center gap-4">
              <img 
                src={logoPreview} 
                alt="Logo preview" 
                style={{ height: `${logoSize}px` }}
                className="border rounded"
              />
              <Button onClick={removeLogo} variant="outline" size="sm">
                <X size={16} className="mr-2" />
                Remove
              </Button>
            </div>
          )}
          
          <div>
            <Label htmlFor="logo-upload">Upload Logo</Label>
            <Input
              id="logo-upload"
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              disabled={uploading}
            />
            <p className="text-sm text-muted-foreground mt-1">
              Recommended: PNG or SVG format, max 5MB
            </p>
          </div>

          <div>
            <Label htmlFor="logo-size">Logo Height (pixels)</Label>
            <Input
              id="logo-size"
              type="number"
              value={logoSize}
              onChange={handleLogoSizeChange}
              min="16"
              max="200"
            />
          </div>
        </CardContent>
      </Card>

      {/* Homepage Image Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload size={20} />
            Homepage Hero Image
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {homeImagePreview && (
            <div className="flex items-center gap-4">
              <img 
                src={homeImagePreview} 
                alt="Homepage image preview" 
                style={{ maxWidth: `${homeImageSize}px` }}
                className="border rounded max-h-48 object-contain"
              />
              <Button onClick={removeHomeImage} variant="outline" size="sm">
                <X size={16} className="mr-2" />
                Remove
              </Button>
            </div>
          )}
          
          <div>
            <Label htmlFor="home-image-upload">Upload Homepage Image</Label>
            <Input
              id="home-image-upload"
              type="file"
              accept="image/*"
              onChange={handleHomeImageChange}
              disabled={uploading}
            />
            <p className="text-sm text-muted-foreground mt-1">
              This image appears on the right side of the homepage hero section. Max 10MB
            </p>
          </div>

          <div>
            <Label htmlFor="home-image-size">Image Max Width (pixels)</Label>
            <Input
              id="home-image-size"
              type="number"
              value={homeImageSize}
              onChange={handleHomeImageSizeChange}
              min="200"
              max="800"
            />
          </div>

          <div>
            <Label htmlFor="home-image-alt">Image Alt Text</Label>
            <Input
              id="home-image-alt"
              type="text"
              value={homeImageAlt}
              onChange={handleHomeImageAltChange}
              placeholder="Describe the image for accessibility"
            />
          </div>
        </CardContent>
      </Card>

      {uploading && (
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">Uploading...</p>
        </div>
      )}
    </div>
  );
};

export default HomepageLogoSettings;