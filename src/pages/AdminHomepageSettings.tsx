import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HomepageLogoSettings from "@/components/admin/HomepageLogoSettings";
import HomepageContentSettings from "@/components/admin/HomepageContentSettings";
import HomeStepsSettings from "@/components/admin/HomeStepsSettings";
import TestimonialsSettings from "@/components/admin/TestimonialsSettings";
import SocialProofSettings from "@/components/admin/SocialProofSettings";

const AdminHomepageSettings = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authStatus = localStorage.getItem('fastingApp_auth');
    if (authStatus !== 'true') {
      navigate('/admin');
      return;
    }
    setIsAuthenticated(true);
    setIsLoading(false);
  }, [navigate]);

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
            <h1 className="text-3xl font-bold">Homepage Settings</h1>
          </div>
          <Tabs defaultValue="logo-images" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="logo-images">Logo & Images</TabsTrigger>
              <TabsTrigger value="content">Hero Content</TabsTrigger>
              <TabsTrigger value="steps">Steps</TabsTrigger>
              <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
              <TabsTrigger value="social-proof">Social Proof</TabsTrigger>
            </TabsList>
            
            <TabsContent value="logo-images" className="space-y-6">
              <HomepageLogoSettings />
            </TabsContent>
            
            <TabsContent value="content" className="space-y-6">
              <HomepageContentSettings />
            </TabsContent>

            <TabsContent value="steps" className="space-y-6">
              <HomeStepsSettings />
            </TabsContent>

            <TabsContent value="testimonials" className="space-y-6">
              <TestimonialsSettings />
            </TabsContent>

            <TabsContent value="social-proof" className="space-y-6">
              <SocialProofSettings />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AdminHomepageSettings;