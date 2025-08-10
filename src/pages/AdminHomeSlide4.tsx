import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { pageContentService } from '@/services/PageContentService';

const AdminHomeSlide4 = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (isAdmin === false) {
      setTimeout(() => {
        navigate('/admin');
      }, 1000);
      return;
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const slide4Content = await pageContentService.getPageContent('home-slide4');
      if (slide4Content) {
        setTitle(slide4Content.title || 'New Slide');
        setContent(slide4Content.content || '');
      }
    } catch (error) {
      console.error('Error loading slide 4 content:', error);
    }
  };

  const saveContent = async () => {
    setIsLoading(true);
    try {
      await pageContentService.savePageContent({
        page_key: 'home-slide4',
        title,
        content,
        is_published: true
      });
      toast.success('Slide 4 content saved successfully!');
    } catch (error) {
      console.error('Error saving slide 4 content:', error);
      toast.error('Failed to save slide 4 content');
    } finally {
      setIsLoading(false);
    }
  };

  if (isAdmin === false) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Access denied. Redirecting...</p>
        </div>
      </div>
    );
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
          <h1 className="text-3xl font-bold text-gray-900">Edit Homepage Slide 4</h1>
          <p className="text-gray-600 mt-2">
            Manage the content for the fourth slide of your homepage.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Slide 4 Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter slide title"
              />
            </div>

            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter slide content (use \n\n for paragraph breaks)"
                rows={12}
              />
            </div>

            <Button 
              onClick={saveContent} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Saving...' : 'Save Slide 4 Content'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminHomeSlide4;