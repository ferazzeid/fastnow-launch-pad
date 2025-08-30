import React from 'react';
import MainNavigation from '@/components/MainNavigation';
import Footer from '@/components/layout/Footer';
import { AuthorProfileSettings } from '@/components/admin/AuthorProfileSettings';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

const AdminAuthorProfile = () => {
  const { isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <MainNavigation />
      
      <main className="container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Author Profile Settings</h1>
              <p className="text-muted-foreground mt-2">
                Configure author information and author box display settings for blog posts.
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/admin">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Admin
              </Link>
            </Button>
          </div>

          <AuthorProfileSettings />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminAuthorProfile;