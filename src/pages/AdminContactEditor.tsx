import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useAuth } from '@/hooks/useAuth';
import { ImageUploadService } from '@/services/ImageUploadService';
import { pageContentService } from '@/services/PageContentService';

const AdminContactEditor = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [buttonText, setButtonText] = useState('');
  const [buttonUrl, setButtonUrl] = useState('');
  const [isPublished, setIsPublished] = useState(true);

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
    setIsLoading(true);
    try {
      const content = await pageContentService.getPageContent('contact');
      
      if (content) {
        setTitle(content.title || '');
        setSubtitle(content.subtitle || '');
        setContent(content.content || '');
        setMetaTitle(content.meta_title || '');
        setMetaDescription(content.meta_description || '');
        setFeaturedImage(content.featured_image_url || '');
        setButtonText(content.button_text || '');
        setButtonUrl(content.button_url || '');
        setIsPublished(content.is_published ?? true);
      }
    } catch (error) {
      console.error('Error loading content:', error);
      toast.error('Failed to load content');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const pageContent = {
        page_key: 'contact',
        title,
        subtitle,
        content,
        meta_title: metaTitle,
        meta_description: metaDescription,
        featured_image_url: featuredImage,
        button_text: buttonText,
        button_url: buttonUrl,
        is_published: isPublished
      };

      const success = await pageContentService.savePageContent(pageContent);
      
      if (success) {
        toast.success('Contact page updated successfully!');
      } else {
        toast.error('Failed to save contact page');
      }
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Failed to save content');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await ImageUploadService.uploadImage(file, 'page-images');
      setFeaturedImage(result.url);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFeaturedImage('');
    toast.success('Image removed');
  };

  if (authLoading || isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Edit Contact Page</h1>
          <p className="text-gray-600 mt-2">Manage the content of your contact page</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/admin')}>
          Back to Admin
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contact Page Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Enter subtitle"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Page Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter the main content for the contact page"
              className="min-h-[300px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="button-text">Button Text</Label>
              <Input
                id="button-text"
                value={buttonText}
                onChange={(e) => setButtonText(e.target.value)}
                placeholder="Enter button text"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="button-url">Button URL</Label>
              <Input
                id="button-url"
                value={buttonUrl}
                onChange={(e) => setButtonUrl(e.target.value)}
                placeholder="Enter button URL"
              />
            </div>
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

          <div className="space-y-4 border-t pt-4">
            <h4 className="font-medium">SEO Settings</h4>
            
            <div className="space-y-2">
              <Label htmlFor="meta-title">Meta Title</Label>
              <Input
                id="meta-title"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="Enter meta title for search engines"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="meta-description">Meta Description</Label>
              <Textarea
                id="meta-description"
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="Enter meta description for search engines"
                rows={3}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 border-t pt-4">
            <Switch
              id="published"
              checked={isPublished}
              onCheckedChange={setIsPublished}
            />
            <Label htmlFor="published">
              Published (visible to visitors)
            </Label>
          </div>

          <div className="flex gap-4">
            <Button onClick={handleSave} disabled={isSaving || isUploading}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button variant="outline" onClick={() => window.open('/contact', '_blank')}>
              Preview Page
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminContactEditor;