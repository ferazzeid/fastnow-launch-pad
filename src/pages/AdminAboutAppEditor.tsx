import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { pageContentService } from '@/services/PageContentService';
import SeoSectionEditor from '@/components/admin/SeoSectionEditor';
import PageFeaturedImageSettings from '@/components/admin/PageFeaturedImageSettings';
import AboutAppPhoneMockupSettings from '@/components/admin/AboutAppPhoneMockupSettings';

const AdminAboutAppEditor = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isLoading } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  
  // SEO Settings
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [isIndexed, setIsIndexed] = useState(true);
  
  // Content
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');

  React.useEffect(() => {
    // Only redirect if we're sure about the auth state (not loading)
    if (!isLoading) {
      if (!user) {
        navigate('/admin/login');
        return;
      }
      
      // Give admin check more time - don't redirect immediately
      if (!isAdmin) {
        // Set a small delay to let admin status resolve
        const timeout = setTimeout(() => {
          if (!isAdmin) {
            navigate('/admin');
          }
        }, 1000);
        
        return () => clearTimeout(timeout);
      }
    }
  }, [user, isAdmin, isLoading, navigate]);

  React.useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const appContent = await pageContentService.getPageContent('about-fastnow-app');
      if (appContent) {
        setMetaTitle(appContent.meta_title || 'About FastNow App - Intermittent Fasting Tracker');
        setMetaDescription(appContent.meta_description || 'Learn about the FastNow app and how it helps you track your intermittent fasting journey effectively.');
        setTitle(appContent.title || 'About the FastNow App');
        setSubtitle(appContent.subtitle || '');
        setContent(appContent.content || '');
      }
    } catch (error) {
      console.error('Error loading app content:', error);
    }
  };

  const saveContent = async () => {
    setIsSaving(true);
    try {
      await pageContentService.savePageContent({
        page_key: 'about-fastnow-app',
        title,
        subtitle,
        content,
        meta_title: metaTitle,
        meta_description: metaDescription,
        is_published: true
      });
      toast.success('About App page content saved successfully!');
    } catch (error) {
      console.error('Error saving app content:', error);
      toast.error('Failed to save app content');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show loading while auth is being determined OR while admin status is being checked
  if (!user || !isAdmin) {
    return null; // Prevent flash of content before redirect or while checking admin status
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Admin
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Edit About App Page</h1>
          <p className="text-gray-600 mt-2">
            Manage the content for the About FastNow App page.
          </p>
        </div>

        <div className="space-y-6">
          <SeoSectionEditor
            metaTitle={metaTitle}
            setMetaTitle={setMetaTitle}
            metaDescription={metaDescription}
            setMetaDescription={setMetaDescription}
            isIndexed={isIndexed}
            setIsIndexed={setIsIndexed}
            pageName="About App"
          />

          <PageFeaturedImageSettings pageKey="about-fastnow-app" title="About App Page Featured Image" />

          <AboutAppPhoneMockupSettings />

          <Card>
            <CardHeader>
              <CardTitle>About App Page Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="title">Page Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="About the FastNow App"
                />
              </div>

              <div>
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Your companion for intermittent fasting success"
                />
              </div>

              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter the full about app content (use \n\n for paragraph breaks)"
                  rows={16}
                />
              </div>

              <Button 
                onClick={saveContent} 
                disabled={isSaving}
                className="w-full"
              >
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save About App Content'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminAboutAppEditor;