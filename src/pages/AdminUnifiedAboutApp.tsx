import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import UnifiedAboutAppEditor from '@/components/admin/UnifiedAboutAppEditor';

const AdminUnifiedAboutApp = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isLoading } = useAuth();

  React.useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate('/admin/login');
        return;
      }
      
      if (!isAdmin) {
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

  if (!user || !isAdmin) {
    return null;
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
          <h1 className="text-3xl font-bold text-gray-900">About App Editor</h1>
          <p className="text-gray-600 mt-2">
            Manage all content for the About FastNow App page, SEO settings, and feature screenshots in one place.
          </p>
        </div>

        <UnifiedAboutAppEditor />
      </div>
    </div>
  );
};

export default AdminUnifiedAboutApp;