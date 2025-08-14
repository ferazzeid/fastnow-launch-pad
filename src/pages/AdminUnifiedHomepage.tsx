import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import UnifiedHomepageEditor from '@/components/admin/UnifiedHomepageEditor';

const AdminUnifiedHomepage = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isLoading } = useAuth();

  React.useEffect(() => {
    // Only redirect if we're sure about the auth state (not loading)
    if (!isLoading) {
      if (!user) {
        navigate('/admin/login');
        return;
      }
      
      // Give admin check more time - don't redirect immediately
      if (!isAdmin) {
        // Set a small delay to let admin status resolve
        const timeout = setTimeout(() => {
          if (!isAdmin) {
            navigate('/admin');
          }
        }, 1000);
        
        return () => clearTimeout(timeout);
      }
    }
  }, [user, isAdmin, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show loading while auth is being determined OR while admin status is being checked
  if (!user || !isAdmin) {
    return null; // Prevent flash of content before redirect or while checking admin status
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Admin
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Homepage Editor</h1>
          <p className="text-gray-600 mt-2">
            Manage all homepage content, SEO settings, and media in one place.
          </p>
        </div>

        <UnifiedHomepageEditor />
      </div>
    </div>
  );
};

export default AdminUnifiedHomepage;