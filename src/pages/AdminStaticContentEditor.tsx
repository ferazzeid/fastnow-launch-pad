import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Save, FileText, Shield, Users, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { pageContentService } from '@/services/PageContentService';
import SeoSectionEditor from '@/components/admin/SeoSectionEditor';

const AdminStaticContentEditor = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Privacy Policy
  const [privacyMetaTitle, setPrivacyMetaTitle] = useState('');
  const [privacyMetaDescription, setPrivacyMetaDescription] = useState('');
  const [privacyIsIndexed, setPrivacyIsIndexed] = useState(false);
  const [privacyTitle, setPrivacyTitle] = useState('');
  const [privacyContent, setPrivacyContent] = useState('');
  
  // Terms of Service
  const [termsMetaTitle, setTermsMetaTitle] = useState('');
  const [termsMetaDescription, setTermsMetaDescription] = useState('');
  const [termsIsIndexed, setTermsIsIndexed] = useState(false);
  const [termsTitle, setTermsTitle] = useState('');
  const [termsContent, setTermsContent] = useState('');
  
  // Contact Page
  const [contactMetaTitle, setContactMetaTitle] = useState('');
  const [contactMetaDescription, setContactMetaDescription] = useState('');
  const [contactIsIndexed, setContactIsIndexed] = useState(true);
  const [contactTitle, setContactTitle] = useState('');
  const [contactContent, setContactContent] = useState('');

  useEffect(() => {
    if (isAdmin === false) {
      setTimeout(() => {
        navigate('/admin');
      }, 1000);
      return;
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    loadAllContent();
  }, []);

  const loadAllContent = async () => {
    try {
      // Load Privacy Policy
      const privacyContent = await pageContentService.getPageContent('privacy-policy');
      if (privacyContent) {
        setPrivacyMetaTitle(privacyContent.meta_title || 'Privacy Policy - FastNow');
        setPrivacyMetaDescription(privacyContent.meta_description || 'Read our privacy policy to understand how we protect your data.');
        setPrivacyTitle(privacyContent.title || 'Privacy Policy');
        setPrivacyContent(privacyContent.content || '');
      }

      // Load Terms of Service
      const termsContent = await pageContentService.getPageContent('terms-of-service');
      if (termsContent) {
        setTermsMetaTitle(termsContent.meta_title || 'Terms of Service - FastNow');
        setTermsMetaDescription(termsContent.meta_description || 'Read our terms of service and usage policies.');
        setTermsTitle(termsContent.title || 'Terms of Service');
        setTermsContent(termsContent.content || '');
      }

      // Load Contact Page
      const contactContent = await pageContentService.getPageContent('contact');
      if (contactContent) {
        setContactMetaTitle(contactContent.meta_title || 'Contact Us - FastNow');
        setContactMetaDescription(contactContent.meta_description || 'Get in touch with us for support, questions, or feedback.');
        setContactTitle(contactContent.title || 'Contact Us');
        setContactContent(contactContent.content || '');
      }
    } catch (error) {
      console.error('Error loading static content:', error);
    }
  };

  const savePrivacyPolicy = async () => {
    setIsLoading(true);
    try {
      await pageContentService.savePageContent({
        page_key: 'privacy-policy',
        title: privacyTitle,
        content: privacyContent,
        meta_title: privacyMetaTitle,
        meta_description: privacyMetaDescription,
        is_published: true
      });
      toast.success('Privacy Policy saved successfully!');
    } catch (error) {
      console.error('Error saving privacy policy:', error);
      toast.error('Failed to save privacy policy');
    } finally {
      setIsLoading(false);
    }
  };

  const saveTermsOfService = async () => {
    setIsLoading(true);
    try {
      await pageContentService.savePageContent({
        page_key: 'terms-of-service',
        title: termsTitle,
        content: termsContent,
        meta_title: termsMetaTitle,
        meta_description: termsMetaDescription,
        is_published: true
      });
      toast.success('Terms of Service saved successfully!');
    } catch (error) {
      console.error('Error saving terms of service:', error);
      toast.error('Failed to save terms of service');
    } finally {
      setIsLoading(false);
    }
  };

  const saveContactPage = async () => {
    setIsLoading(true);
    try {
      await pageContentService.savePageContent({
        page_key: 'contact',
        title: contactTitle,
        content: contactContent,
        meta_title: contactMetaTitle,
        meta_description: contactMetaDescription,
        is_published: true
      });
      toast.success('Contact page saved successfully!');
    } catch (error) {
      console.error('Error saving contact page:', error);
      toast.error('Failed to save contact page');
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
          <h1 className="text-3xl font-bold text-gray-900">Static Content Editor</h1>
          <p className="text-gray-600 mt-2">
            Manage privacy policy, terms of service, and contact page content.
          </p>
        </div>

        <Tabs defaultValue="privacy" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield size={16} />
              Privacy Policy
            </TabsTrigger>
            <TabsTrigger value="terms" className="flex items-center gap-2">
              <FileText size={16} />
              Terms of Service
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <Mail size={16} />
              Contact Page
            </TabsTrigger>
          </TabsList>

          <TabsContent value="privacy">
            <div className="space-y-6">
              <SeoSectionEditor
                metaTitle={privacyMetaTitle}
                setMetaTitle={setPrivacyMetaTitle}
                metaDescription={privacyMetaDescription}
                setMetaDescription={setPrivacyMetaDescription}
                isIndexed={privacyIsIndexed}
                setIsIndexed={setPrivacyIsIndexed}
                pageName="Privacy Policy"
              />

              <Card>
                <CardHeader>
                  <CardTitle>Privacy Policy Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="privacy-title">Page Title</Label>
                    <Input
                      id="privacy-title"
                      value={privacyTitle}
                      onChange={(e) => setPrivacyTitle(e.target.value)}
                      placeholder="Privacy Policy"
                    />
                  </div>

                  <div>
                    <Label htmlFor="privacy-content">Content</Label>
                    <Textarea
                      id="privacy-content"
                      value={privacyContent}
                      onChange={(e) => setPrivacyContent(e.target.value)}
                      placeholder="Enter the privacy policy content (use \n\n for paragraph breaks)"
                      rows={16}
                    />
                  </div>

                  <Button 
                    onClick={savePrivacyPolicy} 
                    disabled={isLoading}
                    className="w-full"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isLoading ? 'Saving...' : 'Save Privacy Policy'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="terms">
            <div className="space-y-6">
              <SeoSectionEditor
                metaTitle={termsMetaTitle}
                setMetaTitle={setTermsMetaTitle}
                metaDescription={termsMetaDescription}
                setMetaDescription={setTermsMetaDescription}
                isIndexed={termsIsIndexed}
                setIsIndexed={setTermsIsIndexed}
                pageName="Terms of Service"
              />

              <Card>
                <CardHeader>
                  <CardTitle>Terms of Service Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="terms-title">Page Title</Label>
                    <Input
                      id="terms-title"
                      value={termsTitle}
                      onChange={(e) => setTermsTitle(e.target.value)}
                      placeholder="Terms of Service"
                    />
                  </div>

                  <div>
                    <Label htmlFor="terms-content">Content</Label>
                    <Textarea
                      id="terms-content"
                      value={termsContent}
                      onChange={(e) => setTermsContent(e.target.value)}
                      placeholder="Enter the terms of service content (use \n\n for paragraph breaks)"
                      rows={16}
                    />
                  </div>

                  <Button 
                    onClick={saveTermsOfService} 
                    disabled={isLoading}
                    className="w-full"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isLoading ? 'Saving...' : 'Save Terms of Service'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="contact">
            <div className="space-y-6">
              <SeoSectionEditor
                metaTitle={contactMetaTitle}
                setMetaTitle={setContactMetaTitle}
                metaDescription={contactMetaDescription}
                setMetaDescription={setContactMetaDescription}
                isIndexed={contactIsIndexed}
                setIsIndexed={setContactIsIndexed}
                pageName="Contact"
              />

              <Card>
                <CardHeader>
                  <CardTitle>Contact Page Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="contact-title">Page Title</Label>
                    <Input
                      id="contact-title"
                      value={contactTitle}
                      onChange={(e) => setContactTitle(e.target.value)}
                      placeholder="Contact Us"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contact-content">Content</Label>
                    <Textarea
                      id="contact-content"
                      value={contactContent}
                      onChange={(e) => setContactContent(e.target.value)}
                      placeholder="Enter the contact page content (use \n\n for paragraph breaks)"
                      rows={8}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Note: Contact form settings are managed separately below.
                    </p>
                  </div>

                  <Button 
                    onClick={saveContactPage} 
                    disabled={isLoading}
                    className="w-full"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isLoading ? 'Saving...' : 'Save Contact Page'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminStaticContentEditor;