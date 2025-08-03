import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/sonner";

const AdminSeo = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState('');
  const [googleSearchConsole, setGoogleSearchConsole] = useState('');
  const [enableSitemap, setEnableSitemap] = useState(true);
  const [enableRobotsTxt, setEnableRobotsTxt] = useState(true);

  useEffect(() => {
    const authStatus = localStorage.getItem('fastingApp_auth');
    if (authStatus !== 'true') {
      navigate('/admin');
      return;
    }
    setIsAuthenticated(true);

    // Load existing SEO settings
    const settings = localStorage.getItem('fastingApp_seo_settings');
    if (settings) {
      const parsed = JSON.parse(settings);
      setMetaTitle(parsed.metaTitle || '');
      setMetaDescription(parsed.metaDescription || '');
      setMetaKeywords(parsed.metaKeywords || '');
      setGoogleAnalyticsId(parsed.googleAnalyticsId || '');
      setGoogleSearchConsole(parsed.googleSearchConsole || '');
      setEnableSitemap(parsed.enableSitemap ?? true);
      setEnableRobotsTxt(parsed.enableRobotsTxt ?? true);
    }
  }, [navigate]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    const settings = {
      metaTitle,
      metaDescription,
      metaKeywords,
      googleAnalyticsId,
      googleSearchConsole,
      enableSitemap,
      enableRobotsTxt,
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem('fastingApp_seo_settings', JSON.stringify(settings));
    toast.success("SEO settings saved successfully. Refresh the page to activate Google Analytics tracking.");
  };

  const handleBack = () => {
    navigate('/admin');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold">SEO & Analytics Settings</h1>
          <Button variant="outline" onClick={handleBack}>Back to Admin</Button>
        </div>
      </header>
      
      <main className="container py-8">
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Meta Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <Input
                    id="metaTitle"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    placeholder="Your site title for search engines"
                    maxLength={60}
                  />
                  <p className="text-sm text-gray-500">{metaTitle.length}/60 characters</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="Brief description of your site"
                    maxLength={160}
                    rows={3}
                  />
                  <p className="text-sm text-gray-500">{metaDescription.length}/160 characters</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="metaKeywords">Meta Keywords</Label>
                  <Input
                    id="metaKeywords"
                    value={metaKeywords}
                    onChange={(e) => setMetaKeywords(e.target.value)}
                    placeholder="fasting, health, wellness, nutrition"
                  />
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analytics & Tracking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
                <Input
                  id="googleAnalyticsId"
                  value={googleAnalyticsId}
                  onChange={(e) => setGoogleAnalyticsId(e.target.value)}
                  placeholder="G-XXXXXXXXXX or UA-XXXXXXXX-X"
                />
                <p className="text-sm text-gray-500">
                  Enter your Google Analytics Measurement ID (e.g., G-XXXXXXXXXX). 
                  Once saved and the page is refreshed, tracking will be active on all pages.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="googleSearchConsole">Google Search Console</Label>
                <Input
                  id="googleSearchConsole"
                  value={googleSearchConsole}
                  onChange={(e) => setGoogleSearchConsole(e.target.value)}
                  placeholder="Verification meta tag content"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="enableRobotsTxt">Enable Robots.txt</Label>
                    <p className="text-sm text-muted-foreground">
                      Currently using static robots.txt file
                    </p>
                  </div>
                  <Switch
                    id="enableRobotsTxt"
                    checked={enableRobotsTxt}
                    onCheckedChange={setEnableRobotsTxt}
                  />
                </div>
                
                <div className="pl-4 space-y-2">
                  <p className="text-sm text-muted-foreground">
                    📄 <strong>Current robots.txt:</strong>
                  </p>
                  <div className="bg-muted p-3 rounded-md text-sm font-mono">
                    <div>User-agent: *</div>
                    <div>Allow: /</div>
                    <div>Disallow: /admin/</div>
                    <div className="text-muted-foreground">
                      (Static file in public/robots.txt)
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open('/robots.txt', '_blank')}
                  >
                    🔗 View Current robots.txt
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="enableSitemap">Enable XML Sitemap</Label>
                    <p className="text-sm text-muted-foreground">
                      Auto-generate sitemap.xml for search engines
                    </p>
                  </div>
                  <Switch
                    id="enableSitemap"
                    checked={enableSitemap}
                    onCheckedChange={setEnableSitemap}
                  />
                </div>
                
                {enableSitemap && (
                  <div className="pl-4 space-y-2">
                    <p className="text-sm text-success-foreground">
                      ✅ <strong>Sitemap Status:</strong> {enableSitemap ? 'Enabled' : 'Disabled'}
                    </p>
                    <div className="space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open('/sitemap.xml', '_blank')}
                      >
                        🔗 View Sitemap.xml
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/sitemap.xml`);
                          toast.success('Sitemap URL copied to clipboard!');
                        }}
                      >
                        📋 Copy Sitemap URL
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Note: Sitemap generation needs to be implemented
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleSave} className="w-full">Save SEO Settings</Button>
        </div>
      </main>
    </div>
  );
};

export default AdminSeo;
