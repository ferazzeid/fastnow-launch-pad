import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HomepageLogoSettings from "@/components/admin/HomepageLogoSettings";
import HomepageContentSettings from "@/components/admin/HomepageContentSettings";

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
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">Homepage & Logo Settings</h1>
            <Button variant="outline" onClick={() => navigate('/admin')}>
              <ArrowLeft size={16} className="mr-2" />
              Back to Admin
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container py-8">
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="logo-images" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="logo-images">Logo & Images</TabsTrigger>
              <TabsTrigger value="content">Homepage Content</TabsTrigger>
            </TabsList>
            
            <TabsContent value="logo-images" className="space-y-6">
              <HomepageLogoSettings />
            </TabsContent>
            
            <TabsContent value="content" className="space-y-6">
              <HomepageContentSettings />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AdminHomepageSettings;