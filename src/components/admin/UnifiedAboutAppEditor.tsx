import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { FileText, Save, Search, Camera, Upload } from "lucide-react";
import { SiteSettingsService } from '@/services/SiteSettingsService';
import { FeatureScreenshotService, FeatureScreenshot } from '@/services/FeatureScreenshotService';
import { FeatureScreenshotMockup } from '@/components/FeatureScreenshotMockup';
import { ImageUploadService } from '@/services/ImageUploadService';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { pageContentService } from '@/services/PageContentService';

const UnifiedAboutAppEditor = () => {
  // SEO Settings
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [isIndexed, setIsIndexed] = useState(true);
  
  // Hero Content
  const [heroTitle, setHeroTitle] = useState('');
  const [heroDescription, setHeroDescription] = useState('');
  const [featuresTitle, setFeaturesTitle] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  
  // Feature Screenshots
  const [screenshots, setScreenshots] = useState<FeatureScreenshot[]>([]);
  const [uploadingFeature, setUploadingFeature] = useState<string | null>(null);
  const [savingFeature, setSavingFeature] = useState<string | null>(null);
  const [isUploadingFeatured, setIsUploadingFeatured] = useState(false);
  
  const [loading, setLoading] = useState(false);

  const FEATURE_LABELS = {
    'fasting-timer': 'Fasting Timer',
    'walking-tracker': 'Walking Tracker', 
    'food-log': 'Food Log',
    'motivators': 'Motivators',
    'ai-assistant': 'AI Assistant'
  };

  useEffect(() => {
    loadAllContent();
  }, []);

  const loadAllContent = async () => {
    try {
      const [settings, screenshots, pageContent] = await Promise.all([
        SiteSettingsService.getAllSettings(),
        FeatureScreenshotService.getFeatureScreenshots(),
        pageContentService.getPageContent('about-fastnow-app')
      ]);

      // Load hero content from site settings
      if (settings.aboutAppContent) {
        const content = settings.aboutAppContent;
        setHeroTitle(content.heroTitle || 'Why the App Matters');
        setHeroDescription(content.heroDescription || '');
        setFeaturesTitle(content.featuresTitle || 'Discover FastNow Features');
        setFeaturedImage(content.featuredImage || '');
      }

      // Load SEO from page content
      if (pageContent) {
        setMetaTitle(pageContent.meta_title || 'About FastNow App | FastNow');
        setMetaDescription(pageContent.meta_description || 'Discover the FastNow app features for intermittent fasting, food tracking, and health monitoring.');
      }

      setScreenshots(screenshots);
    } catch (error) {
      console.error('Error loading about app content:', error);
      toast.error('Failed to load about app content');
    }
  };

  const saveAllContent = async () => {
    setLoading(true);
    try {
      // Save hero content to site settings
      const content = {
        heroTitle,
        heroDescription,
        featuresTitle,
        featuredImage
      };
      
      await SiteSettingsService.setSetting('aboutAppContent', content);

      // Save SEO content to page content
      await pageContentService.savePageContent({
        page_key: 'about-fastnow-app',
        title: heroTitle,
        content: heroDescription,
        meta_title: metaTitle,
        meta_description: metaDescription,
        is_published: true
      });

      // Update localStorage cache for featured image
      if (typeof window !== 'undefined') {
        try {
          const pageImages = localStorage.getItem('fastingApp_pageImages');
          const images = pageImages ? JSON.parse(pageImages) : {};
          if (featuredImage) {
            images['about-fastnow-app'] = featuredImage;
          } else {
            delete images['about-fastnow-app'];
          }
          localStorage.setItem('fastingApp_pageImages', JSON.stringify(images));
        } catch (e) {
          console.error('Error updating image cache:', e);
        }
      }

      toast.success('All about app content saved successfully!');
    } catch (error) {
      console.error('Error saving about app content:', error);
      toast.error('Failed to save about app content');
    } finally {
      setLoading(false);
    }
  };

  const handleFeaturedImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingFeatured(true);
    try {
      const result = await ImageUploadService.uploadImage(file, 'page-images');
      setFeaturedImage(result.url);
      
      // Update localStorage immediately for preview
      if (typeof window !== 'undefined') {
        try {
          const pageImages = localStorage.getItem('fastingApp_pageImages');
          const images = pageImages ? JSON.parse(pageImages) : {};
          images['about-fastnow-app'] = result.url;
          localStorage.setItem('fastingApp_pageImages', JSON.stringify(images));
        } catch (e) {
          console.error('Error updating image cache:', e);
        }
      }
      
      toast.success('Featured image uploaded successfully! Don\'t forget to save your changes.');
    } catch (error) {
      console.error('Error uploading featured image:', error);
      toast.error('Failed to upload featured image');
    } finally {
      setIsUploadingFeatured(false);
    }
  };

  const handleRemoveFeaturedImage = () => {
    setFeaturedImage('');
    
    // Remove from localStorage cache immediately
    if (typeof window !== 'undefined') {
      try {
        const pageImages = localStorage.getItem('fastingApp_pageImages');
        if (pageImages) {
          const images = JSON.parse(pageImages);
          delete images['about-fastnow-app'];
          localStorage.setItem('fastingApp_pageImages', JSON.stringify(images));
        }
      } catch (e) {
        console.error('Error updating image cache:', e);
      }
    }
    
    toast.success('Featured image removed. Don\'t forget to save your changes.');
  };

  const handleFileUpload = async (featureKey: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setUploadingFeature(featureKey);
    try {
      const uploadResult = await ImageUploadService.uploadImage(
        file, 
        'feature-screenshots', 
        `${featureKey}-${Date.now()}`
      );
      
      setScreenshots(prev => prev.map(screenshot => 
        screenshot.feature_key === featureKey 
          ? { ...screenshot, image_url: uploadResult.url }
          : screenshot
      ));

      toast.success('Screenshot uploaded successfully');
    } catch (error) {
      console.error('Error uploading screenshot:', error);
      toast.error('Failed to upload screenshot');
    } finally {
      setUploadingFeature(null);
    }
  };

  const handleTitleChange = (featureKey: string, newTitle: string) => {
    setScreenshots(prev => prev.map(screenshot => 
      screenshot.feature_key === featureKey 
        ? { ...screenshot, title: newTitle }
        : screenshot
    ));
  };

  const handleScreenshotSave = async (featureKey: string) => {
    const screenshot = screenshots.find(s => s.feature_key === featureKey);
    if (!screenshot) return;

    setSavingFeature(featureKey);
    try {
      await FeatureScreenshotService.updateFeatureScreenshot(
        featureKey, 
        screenshot.image_url, 
        screenshot.title
      );
      
      toast.success(`${screenshot.title} updated successfully`);
    } catch (error) {
      console.error('Error saving screenshot:', error);
      toast.error('Failed to save changes');
    } finally {
      setSavingFeature(null);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="seo" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="seo">SEO Settings</TabsTrigger>
          <TabsTrigger value="hero">Hero Content</TabsTrigger>
          <TabsTrigger value="features">Feature Screenshots</TabsTrigger>
          <TabsTrigger value="images">Featured Image</TabsTrigger>
          <TabsTrigger value="save">Save All</TabsTrigger>
        </TabsList>

        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search size={20} />
                SEO Settings - About App Page
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="meta-title">Meta Title</Label>
                <Input
                  id="meta-title"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="About FastNow App | FastNow"
                  maxLength={60}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  {metaTitle.length}/60 characters
                </p>
              </div>

              <div>
                <Label htmlFor="meta-description">Meta Description</Label>
                <Textarea
                  id="meta-description"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Discover the FastNow app features for intermittent fasting, food tracking, and health monitoring."
                  maxLength={160}
                  rows={3}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  {metaDescription.length}/160 characters
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
                  placeholder="Why the App Matters"
                />
              </div>

              <div>
                <Label htmlFor="hero-description">Hero Description</Label>
                <Textarea
                  id="hero-description"
                  value={heroDescription}
                  onChange={(e) => setHeroDescription(e.target.value)}
                  placeholder="Describe why the app is essential for success..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="features-title">Features Section Title</Label>
                <Input
                  id="features-title"
                  value={featuresTitle}
                  onChange={(e) => setFeaturesTitle(e.target.value)}
                  placeholder="Discover FastNow Features"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera size={20} />
                Feature Screenshots
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {screenshots.map((screenshot) => (
                <div key={screenshot.feature_key} className="border rounded-lg p-6 space-y-4">
                  <h3 className="text-lg font-semibold">{FEATURE_LABELS[screenshot.feature_key as keyof typeof FEATURE_LABELS]}</h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor={`title-${screenshot.feature_key}`}>Feature Title</Label>
                        <Input
                          id={`title-${screenshot.feature_key}`}
                          value={screenshot.title}
                          onChange={(e) => handleTitleChange(screenshot.feature_key, e.target.value)}
                          placeholder="Enter feature title"
                        />
                      </div>

                      <div>
                        <Label htmlFor={`file-${screenshot.feature_key}`}>Screenshot</Label>
                        <div className="flex gap-2">
                          <Input
                            id={`file-${screenshot.feature_key}`}
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(screenshot.feature_key, e)}
                            disabled={uploadingFeature === screenshot.feature_key}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            disabled={uploadingFeature === screenshot.feature_key}
                          >
                            <Upload size={16} />
                          </Button>
                        </div>
                      </div>

                      <Button
                        onClick={() => handleScreenshotSave(screenshot.feature_key)}
                        disabled={savingFeature === screenshot.feature_key}
                        variant="outline"
                        className="w-full"
                      >
                        <Save size={16} className="mr-2" />
                        {savingFeature === screenshot.feature_key ? 'Saving...' : 'Save Screenshot'}
                      </Button>
                    </div>

                    <div className="flex justify-center">
                      <div className="w-48">
                        <FeatureScreenshotMockup
                          imageUrl={screenshot.image_url}
                          altText={`${screenshot.title} screenshot`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {screenshots.length === 0 && (
                <Alert>
                  <AlertDescription>
                    No feature screenshots found. They should be automatically created when the database is set up.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images">
          <Card>
            <CardHeader>
              <CardTitle>Featured Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                    onClick={handleRemoveFeaturedImage}
                    className="w-full"
                  >
                    Remove Featured Image
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFeaturedImageUpload}
                    disabled={isUploadingFeatured}
                    className="hidden"
                    id="featured-image"
                  />
                  <Label htmlFor="featured-image" className="cursor-pointer">
                    <div className="text-gray-500">
                      {isUploadingFeatured ? 'Uploading...' : 'Click to upload featured image'}
                    </div>
                  </Label>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="save">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Save size={20} />
                Save All About App Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                This will save all changes made across all tabs. Make sure you've reviewed your content before saving.
              </p>
              <Button onClick={saveAllContent} className="w-full" disabled={loading} size="lg">
                <Save size={16} className="mr-2" />
                {loading ? 'Saving All Content...' : 'Save All About App Content'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UnifiedAboutAppEditor;