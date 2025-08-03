import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { pageContentService, type PageContent } from '@/services/PageContentService';

interface PageContentManagerProps {
  selectedPage?: string;
}

const PageContentManager: React.FC<PageContentManagerProps> = ({ selectedPage = 'home' }) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pageContent, setPageContent] = useState<PageContent>({
    page_key: selectedPage,
    title: '',
    subtitle: '',
    content: '',
    meta_title: '',
    meta_description: '',
    featured_image_url: '',
    button_text: '',
    button_url: '',
    is_published: true
  });

  const [availablePages] = useState([
    { key: 'home', label: 'Home Page' },
    { key: 'fastnow-protocol', label: 'FastNow Protocol' },
    { key: 'faq', label: 'FAQ Page' },
    { key: 'about-me', label: 'About Me' },
    { key: 'privacy-policy', label: 'Privacy Policy' },
    { key: 'terms-of-service', label: 'Terms of Service' },
    { key: 'contact', label: 'Contact Page' }
  ]);

  useEffect(() => {
    loadPageContent();
  }, [selectedPage]);

  const loadPageContent = async () => {
    setLoading(true);
    try {
      const content = await pageContentService.getPageContent(selectedPage);
      
      if (content) {
        setPageContent(content);
      } else {
        // Set defaults for new page
        setPageContent({
          page_key: selectedPage,
          title: '',
          subtitle: '',
          content: '',
          meta_title: '',
          meta_description: '',
          featured_image_url: '',
          button_text: '',
          button_url: '',
          is_published: true
        });
      }
    } catch (error) {
      console.error('Error loading page content:', error);
      toast.error('Failed to load page content');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const success = await pageContentService.savePageContent(pageContent);
      
      if (success) {
        toast.success('Page content saved successfully!');
      } else {
        toast.error('Failed to save page content');
      }
    } catch (error) {
      console.error('Error saving page content:', error);
      toast.error('Failed to save page content');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof PageContent, value: string | boolean) => {
    setPageContent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePageChange = (newPageKey: string) => {
    setPageContent(prev => ({
      ...prev,
      page_key: newPageKey
    }));
    // Note: In a real implementation, you might want to emit an event or call a prop function
    // to notify the parent component about the page change
    loadPageContent();
  };

  const selectedPageInfo = availablePages.find(page => page.key === pageContent.page_key);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading page content...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Page Content Manager</CardTitle>
        <p className="text-sm text-muted-foreground">
          Manage content for your website pages
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Page Selection */}
        <div className="space-y-2">
          <Label htmlFor="page-select">Select Page</Label>
          <Select value={pageContent.page_key} onValueChange={handlePageChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a page to edit" />
            </SelectTrigger>
            <SelectContent>
              {availablePages.map((page) => (
                <SelectItem key={page.key} value={page.key}>
                  {page.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Basic Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Page Title</Label>
            <Input
              id="title"
              value={pageContent.title || ''}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter page title"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle (Optional)</Label>
            <Input
              id="subtitle"
              value={pageContent.subtitle || ''}
              onChange={(e) => handleInputChange('subtitle', e.target.value)}
              placeholder="Enter subtitle"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={pageContent.content || ''}
            onChange={(e) => handleInputChange('content', e.target.value)}
            placeholder="Enter page content"
            rows={6}
          />
        </div>

        {/* CTA Buttons (for applicable pages) */}
        {(pageContent.page_key === 'home' || pageContent.page_key === 'contact') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="button-text">Button Text</Label>
              <Input
                id="button-text"
                value={pageContent.button_text || ''}
                onChange={(e) => handleInputChange('button_text', e.target.value)}
                placeholder="Enter button text"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="button-url">Button URL</Label>
              <Input
                id="button-url"
                value={pageContent.button_url || ''}
                onChange={(e) => handleInputChange('button_url', e.target.value)}
                placeholder="Enter button URL"
              />
            </div>
          </div>
        )}

        {/* Featured Image */}
        <div className="space-y-2">
          <Label htmlFor="featured-image">Featured Image URL (Optional)</Label>
          <Input
            id="featured-image"
            value={pageContent.featured_image_url || ''}
            onChange={(e) => handleInputChange('featured_image_url', e.target.value)}
            placeholder="Enter image URL"
          />
        </div>

        {/* SEO Settings */}
        <div className="space-y-4 border-t pt-4">
          <h4 className="font-medium">SEO Settings</h4>
          
          <div className="space-y-2">
            <Label htmlFor="meta-title">Meta Title</Label>
            <Input
              id="meta-title"
              value={pageContent.meta_title || ''}
              onChange={(e) => handleInputChange('meta_title', e.target.value)}
              placeholder="Enter meta title for search engines"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="meta-description">Meta Description</Label>
            <Textarea
              id="meta-description"
              value={pageContent.meta_description || ''}
              onChange={(e) => handleInputChange('meta_description', e.target.value)}
              placeholder="Enter meta description for search engines"
              rows={3}
            />
          </div>
        </div>

        {/* Publishing */}
        <div className="flex items-center space-x-2 border-t pt-4">
          <Switch
            id="published"
            checked={pageContent.is_published}
            onCheckedChange={(checked) => handleInputChange('is_published', checked)}
          />
          <Label htmlFor="published">
            Published (visible to visitors)
          </Label>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
          
          <Button variant="outline" onClick={loadPageContent} disabled={loading}>
            Reset
          </Button>
          
          {pageContent.page_key && (
            <Button variant="outline" asChild>
              <a 
                href={`/${pageContent.page_key === 'home' ? '' : pageContent.page_key}`} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Preview Page
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PageContentManager;