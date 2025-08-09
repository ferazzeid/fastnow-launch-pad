import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { SupabaseAuthService } from '@/services/SupabaseAuthService';
import { SiteSettingsService } from '@/services/SiteSettingsService';
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ImageUploadService } from "@/services/ImageUploadService";
import { FeatureScreenshotService, FeatureScreenshot } from "@/services/FeatureScreenshotService";
import { FeatureScreenshotMockup } from "@/components/FeatureScreenshotMockup";
import { Upload, Save, Camera } from "lucide-react";

const AdminAboutFastNowApp = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [content, setContent] = useState({
    heroTitle: 'About FastNow App',
    heroDescription: 'Your ultimate companion for intermittent fasting, health tracking, and achieving your wellness goals. FastNow combines science-backed fasting protocols with modern technology to help you transform your health.',
    featuresTitle: 'Discover FastNow Features',
    downloadTitle: 'Download FastNow App',
    downloadDescription: 'Start your intermittent fasting journey today with FastNow - the most comprehensive fasting companion.',
    featuredImage: ''
  });
  const [isUploadingFeatured, setIsUploadingFeatured] = useState(false);
  const [screenshots, setScreenshots] = useState<FeatureScreenshot[]>([]);
  const [uploadingFeature, setUploadingFeature] = useState<string | null>(null);
  const [savingFeature, setSavingFeature] = useState<string | null>(null);

  const FEATURE_LABELS = {
    'fasting-timer': 'Fasting Timer',
    'walking-tracker': 'Walking Tracker', 
    'food-log': 'Food Log',
    'motivators': 'Motivators',
    'ai-assistant': 'AI Assistant'
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await SupabaseAuthService.getCurrentSession();
        if (session?.user) {
          const isAdmin = await SupabaseAuthService.hasAdminRole(session.user.id);
          if (isAdmin) {
            setIsAuthenticated(true);
            await loadContent();
            await loadScreenshots();
          } else {
            setIsAuthenticated(false);
            navigate('/');
            toast.error("Access denied. Admin privileges required.");
          }
        } else {
          setIsAuthenticated(false);
          navigate('/admin/login');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
        navigate('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);

  const loadContent = async () => {
    try {
      const settings = await SiteSettingsService.getAllSettings();
      
      if (settings.aboutAppContent) {
        setContent(settings.aboutAppContent);
      }
    } catch (error) {
      console.error('Error loading content:', error);
    }
  };

  const loadScreenshots = async () => {
    try {
      const data = await FeatureScreenshotService.getFeatureScreenshots();
      setScreenshots(data);
    } catch (error) {
      console.error('Error loading feature screenshots:', error);
      toast.error('Failed to load feature screenshots');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await SiteSettingsService.setSetting('aboutAppContent', content);
      
      // Clear image cache to force reload on frontend
      if (typeof window !== 'undefined') {
        try {
          const pageImages = localStorage.getItem('fastingApp_pageImages');
          if (pageImages) {
            const images = JSON.parse(pageImages);
            if (content.featuredImage) {
              images['about-fastnow-app'] = content.featuredImage;
            } else {
              delete images['about-fastnow-app'];
            }
            localStorage.setItem('fastingApp_pageImages', JSON.stringify(images));
          } else if (content.featuredImage) {
            localStorage.setItem('fastingApp_pageImages', JSON.stringify({
              'about-fastnow-app': content.featuredImage
            }));
          }
        } catch (e) {
          console.error('Error updating image cache:', e);
        }
      }
      
      toast.success('About App content saved successfully!');
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Failed to save content');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFeaturedImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingFeatured(true);
    try {
      const result = await ImageUploadService.uploadImage(file, 'page-images');
      const newContent = { ...content, featuredImage: result.url };
      setContent(newContent);
      
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
    setContent({ ...content, featuredImage: '' });
    
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-accent-green hover:opacity-80 transition-opacity">
            FastNow
          </Link>
          <Button variant="outline" onClick={() => navigate('/admin')}>
            <ArrowLeft size={16} className="mr-2" />
            Back to Admin
          </Button>
        </div>
      </header>
      
      <main className="container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">About FastNow App Content</h1>
            <p className="text-muted-foreground mt-2">
              Edit the content displayed on the About FastNow App page.
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hero Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Hero Title</label>
                  <input
                    type="text"
                    value={content.heroTitle}
                    onChange={(e) => setContent({ ...content, heroTitle: e.target.value })}
                    className="w-full p-3 border rounded-md"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Hero Description</label>
                  <textarea
                    value={content.heroDescription}
                    onChange={(e) => setContent({ ...content, heroDescription: e.target.value })}
                    rows={4}
                    className="w-full p-3 border rounded-md"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Features Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Features Section Title</label>
                  <input
                    type="text"
                    value={content.featuresTitle}
                    onChange={(e) => setContent({ ...content, featuresTitle: e.target.value })}
                    className="w-full p-3 border rounded-md"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Featured Image</CardTitle>
                <CardDescription>Upload a featured image for the About FastNow App page</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {content.featuredImage ? (
                  <div className="space-y-2">
                    <img 
                      src={content.featuredImage} 
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

            {/* Feature Screenshots Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera size={20} />
                  Feature Screenshots
                </CardTitle>
                <CardDescription>
                  Upload and manage screenshots for each app feature displayed on this page.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {screenshots.map((screenshot) => (
                  <div key={screenshot.feature_key} className="border rounded-lg p-6 space-y-4">
                    <h3 className="text-lg font-semibold">{FEATURE_LABELS[screenshot.feature_key as keyof typeof FEATURE_LABELS]}</h3>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Left side - Controls */}
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

                      {/* Right side - Preview */}
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

            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Content Changes'}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminAboutFastNowApp;