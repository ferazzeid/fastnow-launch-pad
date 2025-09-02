import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { ArrowLeft, Save, Globe, BarChart3, Settings, Building } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { PageSEOService, PageSEOSetting } from '@/services/PageSEOService';
import PageIndexingTable from '@/components/admin/PageIndexingTable';
import SiteSEOSettings from '@/components/admin/SiteSEOSettings';

interface SEOAnalyticsSettings {
  googleAnalyticsId: string;
}

const AdminSEOAnalytics = () => {
  const [settings, setSettings] = useState<SEOAnalyticsSettings>({
    googleAnalyticsId: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [pageSettings, setPageSettings] = useState<PageSEOSetting[]>([]);
  const [isLoadingPages, setIsLoadingPages] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('fastingApp_generalSettings');
    if (savedSettings) {
      try {
        const generalSettings = JSON.parse(savedSettings);
        setSettings({
          googleAnalyticsId: generalSettings.googleAnalyticsId || '',
        });
      } catch (error) {
        console.error('Error loading SEO analytics settings:', error);
      }
    }

    // Load page SEO settings
    loadPageSettings();
  }, []);

  const loadPageSettings = async () => {
    setIsLoadingPages(true);
    try {
      const pages = await PageSEOService.getAllPageSettings();
      setPageSettings(pages);
    } catch (error) {
      console.error('Error loading page SEO settings:', error);
      toast.error('Failed to load page settings');
    } finally {
      setIsLoadingPages(false);
    }
  };

  const handleInputChange = (field: keyof SEOAnalyticsSettings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Load existing general settings and update with SEO analytics settings
      const savedSettings = localStorage.getItem('fastingApp_generalSettings');
      let generalSettings = {};
      
      if (savedSettings) {
        generalSettings = JSON.parse(savedSettings);
      }
      
      const updatedSettings = {
        ...generalSettings,
        googleAnalyticsId: settings.googleAnalyticsId,
      };
      
      localStorage.setItem('fastingApp_generalSettings', JSON.stringify(updatedSettings));
      toast.success("SEO & Analytics settings saved successfully!");
    } catch (error) {
      console.error('Error saving SEO analytics settings:', error);
      toast.error("Failed to save settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container flex justify-between items-center py-4">
          <div className="flex justify-between items-center w-full">
            <Link to="/" className="text-2xl font-bold text-accent-green hover:opacity-80 transition-opacity">
              FastNow
            </Link>
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">SEO & Analytics</h1>
              <Link to="/admin">
                <Button variant="outline" size="sm">
                  <ArrowLeft size={16} className="mr-2" />
                  Back to Admin
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="analytics" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 size={16} />
                Analytics & Pages
              </TabsTrigger>
              <TabsTrigger value="site-seo" className="flex items-center gap-2">
                <Globe size={16} />
                Site SEO Settings
              </TabsTrigger>
              <TabsTrigger value="structured-data" className="flex items-center gap-2">
                <Building size={16} />
                Structured Data Preview
              </TabsTrigger>
            </TabsList>

            <TabsContent value="analytics" className="space-y-6">
              {/* Google Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 size={20} />
                    Google Analytics
                  </CardTitle>
                  <CardDescription>
                    Configure Google Analytics tracking for your website
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
                    <Input
                      id="googleAnalyticsId"
                      value={settings.googleAnalyticsId}
                      onChange={(e) => handleInputChange('googleAnalyticsId', e.target.value)}
                      placeholder="G-XXXXXXXXXX or UA-XXXXXXXX-X"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Enter your Google Analytics Measurement ID to enable tracking on all pages.
                    </p>
                  </div>
                </CardContent>
              </Card>


              {/* Motivator URL Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings size={20} />
                    Motivator URL Management
                  </CardTitle>
                  <CardDescription>
                    Sync and manage SEO settings for all motivator pages
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Automatically sync all published motivator URLs to the SEO management system for better search engine indexing.
                    </p>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={async () => {
                        try {
                          await PageSEOService.syncMotivatorURLsToSEO();
                          toast.success('Motivator URLs synced successfully!');
                          loadPageSettings(); // Refresh the page list
                        } catch (error) {
                          console.error('Error syncing motivator URLs:', error);
                          toast.error('Failed to sync motivator URLs');
                        }
                      }}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Sync Motivator URLs
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Sitemap */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe size={20} />
                    Sitemap Generator
                  </CardTitle>
                  <CardDescription>
                    Generate and manage your website's sitemap for search engines
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Generate an XML sitemap that includes all your pages and blog posts for better search engine indexing.
                    </p>
                    <Link to="/admin/sitemap">
                      <Button variant="outline" className="w-full justify-start">
                        <Globe className="mr-2 h-4 w-4" />
                        Generate Sitemap
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Page Indexing Management */}
              {isLoadingPages ? (
                <Card>
                  <CardContent className="p-8">
                    <div className="text-center">Loading page settings...</div>
                  </CardContent>
                </Card>
              ) : (
                <PageIndexingTable 
                  pages={pageSettings} 
                  onRefresh={loadPageSettings}
                />
              )}

              {/* Save Settings */}
              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isLoading}>
                  <Save className="mr-2 h-4 w-4" />
                  {isLoading ? 'Saving...' : 'Save Settings'}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="site-seo">
              <SiteSEOSettings />
            </TabsContent>

            <TabsContent value="structured-data" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building size={20} />
                    Structured Data Preview
                  </CardTitle>
                  <CardDescription>
                    Preview how your site's structured data will appear to search engines
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    This section will show a live preview of your site's JSON-LD structured data based on your current settings.
                    Coming soon...
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AdminSEOAnalytics;