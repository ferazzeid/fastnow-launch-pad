import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Settings, Users, FileText, BookOpen, Calendar, Heart, Clock, LogOut, TimerIcon, Edit, Image } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { SupabaseAuthService } from '@/services/SupabaseAuthService';
import { useAuth } from '@/hooks/useAuth';

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isLoading } = useAuth();

  React.useEffect(() => {
    console.log('Admin page: Auth state', { 
      user: !!user, 
      userEmail: user?.email,
      isAdmin, 
      isLoading,
      currentPath: window.location.pathname 
    });
    
    // Only redirect if we're sure about the auth state (not loading)
    if (!isLoading) {
      if (!user) {
        console.log('Admin page: No user, redirecting to login');
        navigate('/admin/login');
        return;
      }
      
      // Give admin check more time - don't redirect immediately  
      if (!isAdmin) {
        console.log('Admin page: User not admin, waiting for admin status...');
        // Set a longer delay to let admin status resolve properly in production
        const timeout = setTimeout(() => {
          console.log('Admin page: Checking admin status again after delay...', { isAdmin });
          // Only redirect if still not admin after extended wait
          setTimeout(() => {
            console.log('Admin page: Final admin check', { isAdmin });
            if (!isAdmin) {
              console.log('Admin page: Still not admin after extended delay, redirecting');
              navigate('/');
              toast.error("Access denied. Admin privileges required.");
            }
          }, 2000);
        }, 5000); // Increased to 5 seconds
        
        return () => clearTimeout(timeout);
      }
      
      console.log('Admin page: Access granted to admin user');
    }
  }, [user, isAdmin, isLoading, navigate]);

  const handleLogout = async () => {
    const success = await SupabaseAuthService.signOut();
    if (success) {
      toast.success("Logged out successfully");
      navigate('/admin/login');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show loading while auth is being determined OR while admin status is being checked
  if (isLoading || (user && isAdmin === false)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            {isLoading ? 'Loading...' : 'Checking admin permissions...'}
          </p>
        </div>
      </div>
    );
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
      
      <main className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Content Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings size={20} />
                Content Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/admin/general">
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="mr-2 h-4 w-4" />
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
              <Link to="/admin/homepage-unified">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Homepage
                </Button>
              </Link>

              <Link to="/admin/protocol-unified">
                <Button variant="outline" className="w-full justify-start">
                  <Heart className="mr-2 h-4 w-4" />
                  Protocol Page
                </Button>
              </Link>

              <Link to="/admin/about-app-unified">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  About App
                </Button>
              </Link>

              <Link to="/admin/faq">
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="mr-2 h-4 w-4" />
                  FAQ Page Content
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Static Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText size={20} />
                Static Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/admin/static-content">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Privacy, Terms & Contact
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Content Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen size={20} />
                Content Items
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/admin/faq-management">
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="mr-2 h-4 w-4" />
                  FAQ Items
                </Button>
              </Link>

              <Link to="/admin/blog">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Manage Blog Posts
                </Button>
              </Link>

              <Link to="/admin/blog/new">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Create New Post
                </Button>
              </Link>

              <Link to="/admin/ring-bell-gallery">
                <Button variant="outline" className="w-full justify-start">
                  <Image className="mr-2 h-4 w-4" />
                  Ring Bell Gallery
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
            <CardContent className="space-y-3">
              <Link to="/admin/users">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Change Password
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Fasting Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock size={20} />
                Fasting Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/admin/fasting-timeline">
                <Button variant="outline" className="w-full justify-start">
                  <TimerIcon className="mr-2 h-4 w-4" />
                  Manage Timeline Posts
                </Button>
              </Link>

              <Link to="/admin/fasting-timeline/export">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  Export Timeline Data
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