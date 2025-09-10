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
import { SiteSettingsService } from '@/services/SiteSettingsService';
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
  
  // Coupon Widget Settings
  const [showCouponSection, setShowCouponSection] = useState(true);
  const [couponCode, setCouponCode] = useState('FASTNOW90');
  const [couponDays, setCouponDays] = useState(90);

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

      // Load coupon widget settings
      const [showCoupon, code, days] = await Promise.all([
        SiteSettingsService.getSetting('homepage_show_coupon_section'),
        SiteSettingsService.getSetting('homepage_coupon_code'),
        SiteSettingsService.getSetting('homepage_coupon_days')
      ]);

      // Handle boolean properly - if the setting doesn't exist, default to true
      // If it exists and is explicitly false, respect that
      setShowCouponSection(showCoupon === null || showCoupon === undefined ? true : Boolean(showCoupon));
      setCouponCode(String(code || 'FASTNOW90'));
      setCouponDays(Number(days) || 90);

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

      // Save coupon widget settings
      await Promise.all([
        SiteSettingsService.setSetting('homepage_show_coupon_section', showCouponSection),
        SiteSettingsService.setSetting('homepage_coupon_code', couponCode),
        SiteSettingsService.setSetting('homepage_coupon_days', couponDays)
      ]);

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
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="seo">SEO Settings</TabsTrigger>
          <TabsTrigger value="hero">Hero Content</TabsTrigger>
          <TabsTrigger value="widgets">Widgets</TabsTrigger>
          <TabsTrigger value="images">Images & Media</TabsTrigger>
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
                  placeholder="The No-BS Fat Loss Protocol - FastNow"
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
                  placeholder="Transform your body with a concentrated, results-driven weight loss protocol - built for everyday people, not fitness models."
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

        <TabsContent value="widgets">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText size={20} />
                Coupon Widget Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-coupon"
                  checked={showCouponSection}
                  onCheckedChange={setShowCouponSection}
                />
                <Label htmlFor="show-coupon">
                  Show coupon section on homepage
                </Label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="coupon-code">Coupon Code</Label>
                  <Input
                    id="coupon-code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="FASTNOW90"
                  />
                </div>

                <div>
                  <Label htmlFor="coupon-days">Trial Days</Label>
                  <Input
                    id="coupon-days"
                    type="number"
                    value={couponDays}
                    onChange={(e) => setCouponDays(parseInt(e.target.value) || 90)}
                    placeholder="90"
                    min="1"
                    max="365"
                  />
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                This controls the coupon widget displayed on the homepage. When enabled, visitors can copy the coupon code and launch the app.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images">
          <div className="space-y-6">
            <PageFeaturedImageSettings pageKey="home" title="Homepage Featured Image" />
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