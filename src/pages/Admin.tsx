
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/sonner";
import LoginForm from "@/components/admin/LoginForm";
import GeneralSettings from "@/components/admin/GeneralSettings";
import ContentSettings from "@/components/admin/ContentSettings";
import FeaturesSettings from "@/components/admin/FeaturesSettings";
import SeoSettings from "@/components/admin/SeoSettings";
import PagesSettings from "@/components/admin/PagesSettings";
import DesignSettings from "@/components/admin/DesignSettings";

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Check if already authenticated
  useEffect(() => {
    const authStatus = localStorage.getItem('fastingApp_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Simple login handling
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username === 'admin' && password === 'admin') {
      localStorage.setItem('fastingApp_auth', 'true');
      setIsAuthenticated(true);
      toast.success("Logged in successfully");
    } else {
      toast.error("Invalid credentials");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('fastingApp_auth');
    setIsAuthenticated(false);
    toast.success("Logged out successfully");
  };

  // Return login form if not authenticated
  if (!isAuthenticated) {
    return (
      <LoginForm 
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        handleLogin={handleLogin}
      />
    );
  }

  // Return admin dashboard if authenticated
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold">FastNow Admin</h1>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>
      </header>
      
      <main className="container py-8">
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full md:w-auto md:inline-flex grid-cols-6 mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="pages">Pages</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <GeneralSettings />
          </TabsContent>
          
          <TabsContent value="content">
            <ContentSettings />
          </TabsContent>
          
          <TabsContent value="features">
            <FeaturesSettings />
          </TabsContent>
          
          <TabsContent value="design">
            <DesignSettings />
          </TabsContent>
          
          <TabsContent value="seo">
            <SeoSettings />
          </TabsContent>
          
          <TabsContent value="pages">
            <PagesSettings />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
