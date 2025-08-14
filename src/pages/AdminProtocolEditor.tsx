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

const AdminProtocolEditor = () => {
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

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const protocolContent = await pageContentService.getPageContent('fast-now-protocol');
      if (protocolContent) {
        setMetaTitle(protocolContent.meta_title || 'FastNow Protocol - Intermittent Fasting Guide');
        setMetaDescription(protocolContent.meta_description || 'Learn the proven FastNow intermittent fasting protocol for effective fat loss and health benefits.');
        setTitle(protocolContent.title || 'The FastNow Protocol');
        setSubtitle(protocolContent.subtitle || '');
        setContent(protocolContent.content || '');
      }
    } catch (error) {
      console.error('Error loading protocol content:', error);
    }
  };

  const saveContent = async () => {
    setIsSaving(true);
    try {
      await pageContentService.savePageContent({
        page_key: 'fast-now-protocol',
        title,
        subtitle,
        content,
        meta_title: metaTitle,
        meta_description: metaDescription,
        is_published: true
      });
      toast.success('Protocol page content saved successfully!');
    } catch (error) {
      console.error('Error saving protocol content:', error);
      toast.error('Failed to save protocol content');
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
          <h1 className="text-3xl font-bold text-gray-900">Edit Protocol Page</h1>
          <p className="text-gray-600 mt-2">
            Manage the content for the FastNow Protocol page.
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
            pageName="Protocol"
          />

          <Card>
            <CardHeader>
              <CardTitle>Protocol Page Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="title">Page Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="The FastNow Protocol"
                />
              </div>

              <div>
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="A proven approach to intermittent fasting"
                />
              </div>

              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter the full protocol content (use \n\n for paragraph breaks)"
                  rows={16}
                />
              </div>

              <Button 
                onClick={saveContent} 
                disabled={isSaving}
                className="w-full"
              >
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save Protocol Content'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminProtocolEditor;