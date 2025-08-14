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
import HeroSideImageSettings from './HeroSideImageSettings';
import Slide2ImageSettings from './Slide2ImageSettings';
import SlideshowAdminSettings from './SlideshowAdminSettings';

const UnifiedHomepageEditor = () => {
  // SEO Settings
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [isIndexed, setIsIndexed] = useState(true);
  
  // Hero Content
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [heroDescription, setHeroDescription] = useState('');
  const [ctaText, setCtaText] = useState('Launch App');
  const [ctaUrl, setCtaUrl] = useState('https://go.fastnow.app');
  
  // Slide Content
  const [slide2Title, setSlide2Title] = useState('');
  const [slide2Content, setSlide2Content] = useState('');
  const [slide3Title, setSlide3Title] = useState('');
  const [slide3Content, setSlide3Content] = useState('');
  const [slide4Title, setSlide4Title] = useState('');
  const [slide4Content, setSlide4Content] = useState('');
  
  // Ring Bell Section
  const [ringBellTitle, setRingBellTitle] = useState('');
  const [ringBellContent, setRingBellContent] = useState('');
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAllContent();
  }, []);

  const loadAllContent = async () => {
    try {
      // Load main homepage content
      const homeContent = await pageContentService.getPageContent('home');
      if (homeContent) {
        setMetaTitle(homeContent.meta_title || 'FastNow - Intermittent Fasting Protocol');
        setMetaDescription(homeContent.meta_description || 'Discover an effective intermittent fasting protocol that actually works for fat loss');
        setHeroTitle(homeContent.title || '');
        setHeroSubtitle(homeContent.subtitle || '');
        setHeroDescription(homeContent.content || '');
        setCtaText(homeContent.button_text || 'Launch App');
        setCtaUrl(homeContent.button_url || 'https://go.fastnow.app');
      }

      // Load slide content
      const slide2 = await pageContentService.getPageContent('home-slide2');
      if (slide2) {
        setSlide2Title(slide2.title || 'This Isn\'t for Fitness Models');
        setSlide2Content(slide2.content || '');
      }

      const slide3 = await pageContentService.getPageContent('home-slide3');
      if (slide3) {
        setSlide3Title(slide3.title || 'New Slide');
        setSlide3Content(slide3.content || '');
      }

      const slide4 = await pageContentService.getPageContent('home-slide4');
      if (slide4) {
        setSlide4Title(slide4.title || 'New Slide');
        setSlide4Content(slide4.content || '');
      }

      // Load ring bell content
      const ringBell = await pageContentService.getPageContent('ring-bell-section');
      if (ringBell) {
        setRingBellTitle(ringBell.title || 'Ready to Transform Your Health?');
        setRingBellContent(ringBell.content || 'Join thousands who have already transformed their lives with this proven fasting protocol.');
      }
    } catch (error) {
      console.error('Error loading homepage content:', error);
      toast.error('Failed to load homepage content');
    }
  };

  const saveAllContent = async () => {
    setLoading(true);
    try {
      // Save main homepage content
      await pageContentService.savePageContent({
        page_key: 'home',
        title: heroTitle,
        subtitle: heroSubtitle,
        content: heroDescription,
        button_text: ctaText,
        button_url: ctaUrl,
        meta_title: metaTitle,
        meta_description: metaDescription,
        is_published: true
      });

      // Save slide content
      await pageContentService.savePageContent({
        page_key: 'home-slide2',
        title: slide2Title,
        content: slide2Content,
        is_published: true
      });

      await pageContentService.savePageContent({
        page_key: 'home-slide3',
        title: slide3Title,
        content: slide3Content,
        is_published: true
      });

      await pageContentService.savePageContent({
        page_key: 'home-slide4',
        title: slide4Title,
        content: slide4Content,
        is_published: true
      });

      // Save ring bell content
      await pageContentService.savePageContent({
        page_key: 'ring-bell-section',
        title: ringBellTitle,
        content: ringBellContent,
        is_published: true
      });

      toast.success('All homepage content saved successfully!');
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
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="seo">SEO Settings</TabsTrigger>
          <TabsTrigger value="hero">Hero Content</TabsTrigger>
          <TabsTrigger value="slides">Slide Content</TabsTrigger>
          <TabsTrigger value="images">Images & Media</TabsTrigger>
          <TabsTrigger value="ringbell">Ring Bell</TabsTrigger>
          <TabsTrigger value="save">Save All</TabsTrigger>
        </TabsList>

        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search size={20} />
                SEO Settings - Homepage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="meta-title">Meta Title</Label>
                <Input
                  id="meta-title"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="FastNow - Intermittent Fasting Protocol"
                  maxLength={60}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  {metaTitle.length}/60 characters - Appears in search results and browser tabs
                </p>
              </div>

              <div>
                <Label htmlFor="meta-description">Meta Description</Label>
                <Textarea
                  id="meta-description"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Discover an effective intermittent fasting protocol that actually works for fat loss"
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
                <Label htmlFor="hero-title">Main Title (H1)</Label>
                <Input
                  id="hero-title"
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  placeholder="My Fasting Protocol for Fat Loss"
                />
              </div>

              <div>
                <Label htmlFor="hero-subtitle">Subtitle</Label>
                <Input
                  id="hero-subtitle"
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  placeholder="(That Actually Worked)"
                />
              </div>

              <div>
                <Label htmlFor="hero-description">Description Text</Label>
                <Textarea
                  id="hero-description"
                  value={heroDescription}
                  onChange={(e) => setHeroDescription(e.target.value)}
                  placeholder="After years of trying and failing with generalized advice..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cta-text">Launch App Button Text</Label>
                  <Input
                    id="cta-text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    placeholder="Launch App"
                  />
                </div>

                <div>
                  <Label htmlFor="cta-url">Launch App Button URL</Label>
                  <Input
                    id="cta-url"
                    value={ctaUrl}
                    onChange={(e) => setCtaUrl(e.target.value)}
                    placeholder="https://go.fastnow.app"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="slides">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Slide 2 Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="slide2-title">Title</Label>
                  <Input
                    id="slide2-title"
                    value={slide2Title}
                    onChange={(e) => setSlide2Title(e.target.value)}
                    placeholder="This Isn't for Fitness Models"
                  />
                </div>
                <div>
                  <Label htmlFor="slide2-content">Content</Label>
                  <Textarea
                    id="slide2-content"
                    value={slide2Content}
                    onChange={(e) => setSlide2Content(e.target.value)}
                    placeholder="Enter slide content (use \n\n for paragraph breaks)"
                    rows={6}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Slide 3 Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="slide3-title">Title</Label>
                  <Input
                    id="slide3-title"
                    value={slide3Title}
                    onChange={(e) => setSlide3Title(e.target.value)}
                    placeholder="New Slide"
                  />
                </div>
                <div>
                  <Label htmlFor="slide3-content">Content</Label>
                  <Textarea
                    id="slide3-content"
                    value={slide3Content}
                    onChange={(e) => setSlide3Content(e.target.value)}
                    placeholder="Enter slide content (use \n\n for paragraph breaks)"
                    rows={6}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Slide 4 Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="slide4-title">Title</Label>
                  <Input
                    id="slide4-title"
                    value={slide4Title}
                    onChange={(e) => setSlide4Title(e.target.value)}
                    placeholder="New Slide"
                  />
                </div>
                <div>
                  <Label htmlFor="slide4-content">Content</Label>
                  <Textarea
                    id="slide4-content"
                    value={slide4Content}
                    onChange={(e) => setSlide4Content(e.target.value)}
                    placeholder="Enter slide content (use \n\n for paragraph breaks)"
                    rows={6}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="images">
          <div className="space-y-6">
            <HeroSideImageSettings />
            <Slide2ImageSettings />
            <SlideshowAdminSettings />
          </div>
        </TabsContent>

        <TabsContent value="ringbell">
          <Card>
            <CardHeader>
              <CardTitle>Ring Bell Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="ringbell-title">Title</Label>
                <Input
                  id="ringbell-title"
                  value={ringBellTitle}
                  onChange={(e) => setRingBellTitle(e.target.value)}
                  placeholder="Ready to Transform Your Health?"
                />
              </div>
              <div>
                <Label htmlFor="ringbell-content">Content</Label>
                <Textarea
                  id="ringbell-content"
                  value={ringBellContent}
                  onChange={(e) => setRingBellContent(e.target.value)}
                  placeholder="Join thousands who have already transformed their lives with this proven fasting protocol."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="save">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Save size={20} />
                Save All Homepage Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                This will save all changes made across all tabs. Make sure you've reviewed your content before saving.
              </p>
              <Button onClick={saveAllContent} className="w-full" disabled={loading} size="lg">
                <Save size={16} className="mr-2" />
                {loading ? 'Saving All Content...' : 'Save All Homepage Content'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UnifiedHomepageEditor;