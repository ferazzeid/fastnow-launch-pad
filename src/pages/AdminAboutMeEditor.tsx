import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ImageUploadService } from '@/services/ImageUploadService';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const AdminAboutMeEditor = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/admin/login');
      return;
    }

    if (user && isAdmin) {
      loadContent();
    }
  }, [user, isAdmin, authLoading, navigate]);

  const loadContent = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_key, setting_value')
        .in('setting_key', ['about_me_title', 'about_me_subtitle', 'about_me_content', 'about_me_featured_image']);

      if (error) throw error;

      const settings = data?.reduce((acc, item) => {
        const value = item.setting_value;
        try {
          acc[item.setting_key] = typeof value === 'string' ? JSON.parse(value || '""') : String(value || '');
        } catch {
          acc[item.setting_key] = String(value || '');
        }
        return acc;
      }, {} as Record<string, string>) || {};

      setTitle(settings.about_me_title || '');
      setSubtitle(settings.about_me_subtitle || '');
      setContent(settings.about_me_content || '');
      setFeaturedImage(settings.about_me_featured_image || '');
    } catch (error) {
      console.error('Error loading content:', error);
      toast.error('Failed to load content');
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const updates = [
        { setting_key: 'about_me_title', setting_value: JSON.stringify(title) },
        { setting_key: 'about_me_subtitle', setting_value: JSON.stringify(subtitle) },
        { setting_key: 'about_me_content', setting_value: JSON.stringify(content) },
        { setting_key: 'about_me_featured_image', setting_value: JSON.stringify(featuredImage) }
      ];

      for (const update of updates) {
        const { error } = await supabase
          .from('site_settings')
          .upsert(update, { 
            onConflict: 'setting_key',
            ignoreDuplicates: false 
          });
        
        if (error) throw error;
      }

      toast.success('About Me content updated successfully!');
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Failed to save content');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('Starting image upload for file:', file.name);
    setIsUploading(true);
    try {
      console.log('Calling ImageUploadService.uploadImage...');
      const result = await ImageUploadService.uploadImage(file, 'page-images');
      console.log('Upload result:', result);
      setFeaturedImage(result.url);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFeaturedImage('');
    toast.success('Image removed');
  };

  if (authLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Edit About Me Page</h1>
          <p className="text-gray-600 mt-2">Manage the content of the About Me page</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/admin')}>
          Back to Admin
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>About Me Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Page Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter page title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitle">Page Subtitle</Label>
            <Input
              id="subtitle"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Enter page subtitle"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Page Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter the main content for the About Me page"
              className="min-h-[400px]"
            />
            <p className="text-sm text-gray-500">
              Use \n\n for paragraph breaks. The content will be formatted automatically.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Featured Image</Label>
            {featuredImage ? (
              <div className="space-y-2">
                <img 
                  src={featuredImage} 
                  alt="Featured" 
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRemoveImage}
                  className="w-full"
                >
                  Remove Image
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  className="hidden"
                  id="featured-image"
                />
                <Label htmlFor="featured-image" className="cursor-pointer">
                  <div className="text-gray-500">
                    {isUploading ? 'Uploading...' : 'Click to upload featured image'}
                  </div>
                </Label>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <Button onClick={handleSave} disabled={isLoading || isUploading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button variant="outline" onClick={() => window.open('/about-me', '_blank')}>
              Preview Page
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAboutMeEditor;