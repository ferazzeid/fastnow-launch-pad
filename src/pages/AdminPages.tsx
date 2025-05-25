
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/sonner";

const AdminPages = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [homeContent, setHomeContent] = useState('');
  const [aboutContent, setAboutContent] = useState('');
  const [privacyContent, setPrivacyContent] = useState('');
  const [termsContent, setTermsContent] = useState('');

  useEffect(() => {
    const authStatus = localStorage.getItem('fastingApp_auth');
    if (authStatus !== 'true') {
      navigate('/admin');
      return;
    }
    setIsAuthenticated(true);

    // Load existing page content
    const pages = localStorage.getItem('fastingApp_page_content');
    if (pages) {
      const parsed = JSON.parse(pages);
      setHomeContent(parsed.home || '');
      setAboutContent(parsed.about || '');
      setPrivacyContent(parsed.privacy || '');
      setTermsContent(parsed.terms || '');
    }
  }, [navigate]);

  const handleSave = (page: string, content: string) => {
    const existingPages = localStorage.getItem('fastingApp_page_content');
    const pages = existingPages ? JSON.parse(existingPages) : {};
    
    pages[page] = content;
    pages.updatedAt = new Date().toISOString();
    
    localStorage.setItem('fastingApp_page_content', JSON.stringify(pages));
    toast.success(`${page.charAt(0).toUpperCase() + page.slice(1)} page content saved`);
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
          <h1 className="text-2xl font-bold">Page Content Management</h1>
          <Button variant="outline" onClick={handleBack}>Back to Admin</Button>
        </div>
      </header>
      
      <main className="container py-8">
        <Card>
          <CardHeader>
            <CardTitle>Edit Page Content</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="home" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="home">Home</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="privacy">Privacy</TabsTrigger>
                <TabsTrigger value="terms">Terms</TabsTrigger>
              </TabsList>
              
              <TabsContent value="home" className="space-y-4">
                <Label htmlFor="homeContent">Home Page Content</Label>
                <Textarea
                  id="homeContent"
                  value={homeContent}
                  onChange={(e) => setHomeContent(e.target.value)}
                  placeholder="Enter home page content..."
                  rows={10}
                />
                <Button onClick={() => handleSave('home', homeContent)}>Save Home Content</Button>
              </TabsContent>
              
              <TabsContent value="about" className="space-y-4">
                <Label htmlFor="aboutContent">About Page Content</Label>
                <Textarea
                  id="aboutContent"
                  value={aboutContent}
                  onChange={(e) => setAboutContent(e.target.value)}
                  placeholder="Enter about page content..."
                  rows={10}
                />
                <Button onClick={() => handleSave('about', aboutContent)}>Save About Content</Button>
              </TabsContent>
              
              <TabsContent value="privacy" className="space-y-4">
                <Label htmlFor="privacyContent">Privacy Policy Content</Label>
                <Textarea
                  id="privacyContent"
                  value={privacyContent}
                  onChange={(e) => setPrivacyContent(e.target.value)}
                  placeholder="Enter privacy policy content..."
                  rows={10}
                />
                <Button onClick={() => handleSave('privacy', privacyContent)}>Save Privacy Content</Button>
              </TabsContent>
              
              <TabsContent value="terms" className="space-y-4">
                <Label htmlFor="termsContent">Terms of Service Content</Label>
                <Textarea
                  id="termsContent"
                  value={termsContent}
                  onChange={(e) => setTermsContent(e.target.value)}
                  placeholder="Enter terms of service content..."
                  rows={10}
                />
                <Button onClick={() => handleSave('terms', termsContent)}>Save Terms Content</Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminPages;
