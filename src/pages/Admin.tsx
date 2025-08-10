
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Settings, Users, FileText, BookOpen, Calendar, Heart, Clock, LogOut, TimerIcon, PaintBucket, Edit } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import ContentExport from "@/components/admin/ContentExport";
import { SupabaseAuthService } from '@/services/SupabaseAuthService';

const Admin = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await SupabaseAuthService.getCurrentSession();
        if (session?.user) {
          console.log('User found in session, checking admin role...');
          const isAdmin = await SupabaseAuthService.hasAdminRole(session.user.id);
          console.log('Admin role check result:', isAdmin);
          if (isAdmin) {
            console.log('User is admin, setting authenticated to true');
            setIsAuthenticated(true);
            setIsLoading(false);
            return; // Important: return early to prevent navigation
          } else {
            console.log('User is not admin, redirecting to home');
            setIsAuthenticated(false);
            navigate('/');
            toast.error("Access denied. Admin privileges required.");
          }
        } else {
          console.log('No user session found, redirecting to login');
          setIsAuthenticated(false);
          navigate('/admin/login');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
        navigate('/admin/login');
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    const success = await SupabaseAuthService.signOut();
    if (success) {
      setIsAuthenticated(false);
      toast.success("Logged out successfully");
      navigate('/admin/login');
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
    return null; // Will be redirected by useEffect
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-accent-green hover:opacity-80 transition-opacity">
            FastNow
          </Link>
          <div className="flex gap-2">
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
            </CardContent>
          </Card>

          {/* Page Editors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit size={20} />
                Page Editors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/admin/homepage">
                <Button variant="outline" className="w-full justify-start">
                  <Edit size={16} className="mr-2" />
                  Homepage
                </Button>
              </Link>
              
              <Link to="/admin/about-me">
                <Button variant="outline" className="w-full justify-start">
                  <Edit size={16} className="mr-2" />
                  About Me
                </Button>
              </Link>
              
              <Link to="/admin/fast-now-protocol">
                <Button variant="outline" className="w-full justify-start">
                  <Edit size={16} className="mr-2" />
                  FastNow Protocol
                </Button>
              </Link>

              <Link to="/admin/about-fastnow-app">
                <Button variant="outline" className="w-full justify-start">
                  <Edit size={16} className="mr-2" />
                  About FastNow App
                </Button>
              </Link>

              <Link to="/admin/faq">
                <Button variant="outline" className="w-full justify-start">
                  <Edit size={16} className="mr-2" />
                  FAQ Page
                </Button>
              </Link>

              <Link to="/admin/contact">
                <Button variant="outline" className="w-full justify-start">
                  <Edit size={16} className="mr-2" />
                  Contact Page
                </Button>
              </Link>

              <Link to="/admin/privacy-policy">
                <Button variant="outline" className="w-full justify-start">
                  <Edit size={16} className="mr-2" />
                  Privacy Policy
                </Button>
              </Link>

              <Link to="/admin/terms-of-service">
                <Button variant="outline" className="w-full justify-start">
                  <Edit size={16} className="mr-2" />
                  Terms of Service
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

          {/* Fasting Timeline Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TimerIcon size={20} />
                Fasting Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/admin/fasting-timeline">
                <Button variant="outline" className="w-full justify-start">
                  <Clock size={16} className="mr-2" />
                  Manage Timeline Posts
                </Button>
              </Link>
              <Link to="/admin/fasting-timeline/export">
                <Button variant="outline" className="w-full justify-start">
                  <FileText size={16} className="mr-2" />
                  Export Timeline Data
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Design & Media Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PaintBucket size={20} />
                Design & Media
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/admin/homepage-settings">
                <Button variant="outline" className="w-full justify-start">
                  <Settings size={16} className="mr-2" />
                  Logo & Favicon Settings
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

      </main>
    </div>
  );
};

export default Admin;
