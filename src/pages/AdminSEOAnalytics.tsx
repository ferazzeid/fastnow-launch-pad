import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Link } from "react-router-dom";
import { ArrowLeft, Save, Globe, BarChart3 } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface SEOAnalyticsSettings {
  googleAnalyticsId: string;
  defaultIndexable: boolean;
}

const AdminSEOAnalytics = () => {
  const [settings, setSettings] = useState<SEOAnalyticsSettings>({
    googleAnalyticsId: '',
    defaultIndexable: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('fastingApp_generalSettings');
    if (savedSettings) {
      try {
        const generalSettings = JSON.parse(savedSettings);
        setSettings({
          googleAnalyticsId: generalSettings.googleAnalyticsId || '',
          defaultIndexable: generalSettings.defaultIndexable ?? true,
        });
      } catch (error) {
        console.error('Error loading SEO analytics settings:', error);
      }
    }
  }, []);

  const handleInputChange = (field: keyof SEOAnalyticsSettings, value: string | boolean) => {
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
        defaultIndexable: settings.defaultIndexable,
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
        <div className="max-w-4xl mx-auto space-y-6">
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

          {/* SEO Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe size={20} />
                SEO Settings
              </CardTitle>
              <CardDescription>
                Configure search engine optimization settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="defaultIndexable">Default Page Indexing</Label>
                  <p className="text-sm text-muted-foreground">
                    Make all pages indexable by search engines by default. You can override this on individual pages.
                  </p>
                </div>
                <Switch
                  id="defaultIndexable"
                  checked={settings.defaultIndexable}
                  onCheckedChange={(checked) => handleInputChange('defaultIndexable', checked)}
                />
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

          {/* Save Settings */}
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isLoading}>
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminSEOAnalytics;