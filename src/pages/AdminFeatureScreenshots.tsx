import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import FeatureScreenshotSettings from "@/components/admin/FeatureScreenshotSettings";
import { SupabaseAuthService } from "@/services/SupabaseAuthService";

const AdminFeatureScreenshots = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { user, isAdmin } = await SupabaseAuthService.getCurrentUser();
        if (!user || !isAdmin) {
          navigate('/admin');
          return;
        }
        setIsAuthenticated(true);
      } catch (error) {
        navigate('/admin');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
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
          <Link to="/" className="text-2xl font-bold text-primary hover:opacity-80 transition-opacity">
            FastNow
          </Link>
          <Button variant="outline" onClick={() => navigate('/admin')}>
            <ArrowLeft size={16} className="mr-2" />
            Back to Admin
          </Button>
        </div>
      </header>
      
      <main className="container py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Feature Screenshots</h1>
            <p className="text-muted-foreground mt-2">
              Manage screenshots for each app feature displayed on the About FastNow App page
            </p>
          </div>
          <FeatureScreenshotSettings />
        </div>
      </main>
    </div>
  );
};

export default AdminFeatureScreenshots;