
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLogin from './AdminLogin';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Settings, Users, FileText, BookOpen, Calendar, Heart, Clock, LogOut } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import ContentExport from "@/components/admin/ContentExport";

const Admin = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('Admin component mounted');
    
    // Initialize default admin user if no users exist
    const savedUsers = localStorage.getItem('fastingApp_users');
    if (!savedUsers) {
      const defaultUsers = [
        {
          id: '1',
          username: 'admin',
          role: 'admin',
          dateAdded: new Date().toISOString()
        }
      ];
      localStorage.setItem('fastingApp_users', JSON.stringify(defaultUsers));
      localStorage.setItem('fastingApp_user_admin', 'admin');
      console.log('Initialized default admin user');
    }
    
    const authStatus = localStorage.getItem('fastingApp_auth');
    console.log('Auth status:', authStatus);
    
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('fastingApp_auth');
    localStorage.removeItem('fastingApp_currentUser');
    setIsAuthenticated(false);
    toast.success("Logged out successfully");
    navigate('/admin');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-2">
            <Link to="/">
              <Button variant="outline">Back to Site</Button>
            </Link>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut size={16} className="mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Content Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText size={20} />
                Content Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/admin/general">
                <Button variant="outline" className="w-full justify-start">
                  <Settings size={16} className="mr-2" />
                  General Settings
                </Button>
              </Link>
              <Link to="/admin/pages">
                <Button variant="outline" className="w-full justify-start">
                  <FileText size={16} className="mr-2" />
                  Page Content Manager
                </Button>
              </Link>
              <Link to="/admin/design">
                <Button variant="outline" className="w-full justify-start">
                  <Settings size={16} className="mr-2" />
                  Design Settings
                </Button>
              </Link>
              <Link to="/admin/page-images">
                <Button variant="outline" className="w-full justify-start">
                  <FileText size={16} className="mr-2" />
                  Page Featured Images
                </Button>
              </Link>
              <Link to="/admin/faq">
                <Button variant="outline" className="w-full justify-start">
                  <FileText size={16} className="mr-2" />
                  FAQ Management
                </Button>
              </Link>
              <Link to="/admin/email">
                <Button variant="outline" className="w-full justify-start">
                  <FileText size={16} className="mr-2" />
                  Email Settings
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Admin Account */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users size={20} />
                Admin Account
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Link to="/admin/users">
                <Button variant="outline" className="w-full justify-start">
                  <Users size={16} className="mr-2" />
                  Manage Admin Account
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Blog Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen size={20} />
                Blog Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/admin/blog">
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen size={16} className="mr-2" />
                  Manage Posts
                </Button>
              </Link>
              <Link to="/admin/blog/new">
                <Button variant="outline" className="w-full justify-start">
                  <FileText size={16} className="mr-2" />
                  Create New Post
                </Button>
              </Link>
            </CardContent>
          </Card>


          {/* SEO Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings size={20} />
                SEO & Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/admin/seo">
                <Button variant="outline" className="w-full justify-start">
                  <Settings size={16} className="mr-2" />
                  SEO Settings
                </Button>
              </Link>
              <Link to="/admin/contact">
                <Button variant="outline" className="w-full justify-start">
                  <Settings size={16} className="mr-2" />
                  Contact Form Settings
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Content Export/Import Section */}
        <div className="mt-8">
          <ContentExport />
        </div>
      </main>
    </div>
  );
};

export default Admin;
