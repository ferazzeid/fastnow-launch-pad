import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { SupabaseAuthService } from '@/services/SupabaseAuthService';
import { SiteSettingsService } from '@/services/SiteSettingsService';
import { toast } from "@/components/ui/sonner";

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
    downloadDescription: 'Start your intermittent fasting journey today with FastNow - the most comprehensive fasting companion.'
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await SupabaseAuthService.getCurrentSession();
        if (session?.user) {
          const isAdmin = await SupabaseAuthService.hasAdminRole(session.user.id);
          if (isAdmin) {
            setIsAuthenticated(true);
            await loadContent();
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

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await SiteSettingsService.setSetting('aboutAppContent', content);
      toast.success('About App content saved successfully!');
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Failed to save content');
    } finally {
      setIsSaving(false);
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
              <CardContent>
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
                <CardTitle>Download Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Download Title</label>
                  <input
                    type="text"
                    value={content.downloadTitle}
                    onChange={(e) => setContent({ ...content, downloadTitle: e.target.value })}
                    className="w-full p-3 border rounded-md"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Download Description</label>
                  <textarea
                    value={content.downloadDescription}
                    onChange={(e) => setContent({ ...content, downloadDescription: e.target.value })}
                    rows={3}
                    className="w-full p-3 border rounded-md"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminAboutFastNowApp;