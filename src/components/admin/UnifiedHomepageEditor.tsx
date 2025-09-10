import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { FileText, Save, Search } from "lucide-react";
import { pageContentService, PageContent } from '@/services/PageContentService';
import { HomepageSEOSyncService } from '@/services/HomepageSEOSyncService';
import HeroSideImageSettings from './HeroSideImageSettings';
import Slide2ImageSettings from './Slide2ImageSettings';
import SlideshowAdminSettings from './SlideshowAdminSettings';
import PageFeaturedImageSettings from './PageFeaturedImageSettings';

const UnifiedHomepageEditor = () => {
  // SEO Settings
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [isIndexed, setIsIndexed] = useState(true);
  
  // Hero Content
  const [heroTitle, setHeroTitle] = useState('');
  const [heroDescription, setHeroDescription] = useState('');
  const [ctaText, setCtaText] = useState('Launch App');
  const [ctaUrl, setCtaUrl] = useState('https://go.fastnow.app');

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAllContent();
  }, []);

  const loadAllContent = async () => {
    try {
      // Load main homepage content
      const homeContent = await pageContentService.getPageContent('home');
      if (homeContent) {
        setMetaTitle(homeContent.meta_title || 'FastNow - Transform Your Health');
        setMetaDescription(homeContent.meta_description || 'Effective weight loss protocol designed for real people, not fitness models');
        setHeroTitle(homeContent.title || '');
        setHeroDescription(homeContent.content || '');
        setCtaText(homeContent.button_text || 'Launch App');
        setCtaUrl(homeContent.button_url || 'https://go.fastnow.app');
      }
    } catch (error) {
      console.error('Error loading homepage content:', error);
      toast.error('Failed to load homepage content');
    }
  };

  const saveAllContent = async () => {
    setLoading(true);
    try {
      // Use the sync service to save and synchronize SEO settings
      const success = await HomepageSEOSyncService.updateHomepageContent({
        title: heroTitle,
        content: heroDescription,
        button_text: ctaText,
        button_url: ctaUrl,
        meta_title: metaTitle,
        meta_description: metaDescription
      });

      if (success) {
        toast.success('All homepage content and SEO settings saved successfully!');
      } else {
        throw new Error('Failed to save content');
      }
    } catch (error) {
      console.error('Error saving homepage content:', error);
      toast.error('Failed to save homepage content');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="seo" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="seo">SEO Settings</TabsTrigger>
          <TabsTrigger value="hero">Hero Content</TabsTrigger>
          <TabsTrigger value="images">Images & Media</TabsTrigger>
          <TabsTrigger value="save">Save All</TabsTrigger>
        </TabsList>

        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search size={20} />
                SEO & Meta Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="meta-title">Meta Title</Label>
                <Input
                  id="meta-title"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="Page title for search engines"
                  maxLength={60}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  {metaTitle.length}/60 characters - Appears in browser tabs and search results
                </p>
              </div>

              <div>
                <Label htmlFor="meta-description">Meta Description</Label>
                <Textarea
                  id="meta-description"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Brief description of your page for search engines"
                  maxLength={160}
                  rows={3}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  {metaDescription.length}/160 characters - Appears in search result descriptions
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="indexed"
                  checked={isIndexed}
                  onCheckedChange={setIsIndexed}
                />
                <Label htmlFor="indexed">
                  Allow search engines to index this page
                </Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText size={20} />
                Hero Section Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="hero-title">Hero Title</Label>
                <Input
                  id="hero-title"
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  placeholder="Main headline for your homepage"
                />
              </div>

              <div>
                <Label htmlFor="hero-description">Hero Description</Label>
                <Textarea
                  id="hero-description"
                  value={heroDescription}
                  onChange={(e) => setHeroDescription(e.target.value)}
                  placeholder="Compelling description that explains your value proposition"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="cta-text">Call-to-Action Button Text</Label>
                <Input
                  id="cta-text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  placeholder="Launch App"
                />
              </div>

              <div>
                <Label htmlFor="cta-url">Call-to-Action Button URL</Label>
                <Input
                  id="cta-url"
                  value={ctaUrl}
                  onChange={(e) => setCtaUrl(e.target.value)}
                  placeholder="https://go.fastnow.app"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images">
          <div className="space-y-6">
            <PageFeaturedImageSettings pageKey="home" />
            <HeroSideImageSettings />
            <Slide2ImageSettings />
            <SlideshowAdminSettings />
          </div>
        </TabsContent>

        <TabsContent value="save">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Save size={20} />
                Save All Changes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Click the button below to save all your homepage content and SEO settings.
              </p>
              <Button 
                onClick={saveAllContent} 
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Saving...' : 'Save All Changes'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UnifiedHomepageEditor;