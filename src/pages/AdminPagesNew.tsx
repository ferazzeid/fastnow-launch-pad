import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { SupabaseAuthService } from '@/services/SupabaseAuthService';

const AdminPagesNew = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await SupabaseAuthService.getCurrentSession();
        if (session?.user) {
          const isAdmin = await SupabaseAuthService.hasAdminRole(session.user.id);
          if (isAdmin) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
            navigate('/');
          }
        } else {
          setIsAuthenticated(false);
          navigate('/admin/login');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
        navigate('/admin/login');
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

  const pages = [
    {
      title: 'Home Page',
      description: 'Edit the main landing page content',
      route: '/admin/edit-home',
      liveUrl: '/',
      hasEditor: false // TODO: Create editor
    },
    {
      title: 'FastNow Protocol',
      description: 'Edit the protocol documentation page',
      route: '/admin/edit-protocol',
      liveUrl: '/fastnow-protocol',
      hasEditor: false // TODO: Create editor
    },
    {
      title: 'About FastNow App',
      description: 'Edit the app information page',
      route: '/admin/about-fastnow-app',
      liveUrl: '/about-fastnow-app',
      hasEditor: true
    },
    {
      title: 'About Me',
      description: 'Edit the personal/creator page',
      route: '/admin/about-me',
      liveUrl: '/about-me',
      hasEditor: true
    },
    {
      title: 'FAQ',
      description: 'Manage frequently asked questions',
      route: '/admin/faq',
      liveUrl: '/faq',
      hasEditor: true
    },
    {
      title: 'Privacy Policy',
      description: 'Edit the privacy policy page',
      route: '/admin/privacy',
      liveUrl: '/privacy',
      hasEditor: true
    },
    {
      title: 'Terms of Service',
      description: 'Edit the terms of service page',
      route: '/admin/terms',
      liveUrl: '/terms',
      hasEditor: true
    },
    {
      title: 'Contact',
      description: 'Edit the contact page',
      route: '/admin/contact-page',
      liveUrl: '/contact',
      hasEditor: false // TODO: Create editor
    }
  ];

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
            <h1 className="text-3xl font-bold">Page Content Manager</h1>
            <p className="text-muted-foreground mt-2">
              Manage the content for all pages on your website. Each page corresponds to an actual page visitors can see.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {pages.map((page) => (
              <Card key={page.route} className="relative">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{page.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {page.description}
                      </p>
                    </div>
                    <a
                      href={page.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                      title="View live page"
                    >
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    {page.hasEditor ? (
                      <Button asChild className="flex-1">
                        <Link to={page.route}>
                          Edit Content
                        </Link>
                      </Button>
                    ) : (
                      <Button variant="outline" disabled className="flex-1">
                        Editor Coming Soon
                      </Button>
                    )}
                    <Button variant="outline" asChild>
                      <a href={page.liveUrl} target="_blank" rel="noopener noreferrer">
                        Preview
                      </a>
                    </Button>
                  </div>
                  {!page.hasEditor && (
                    <p className="text-xs text-muted-foreground mt-2">
                      This page editor is not yet implemented. The page uses hardcoded content.
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Note about Page Editors</h3>
            <p className="text-sm text-muted-foreground">
              Some pages currently use hardcoded content in their React components. These will need individual 
              content management systems created to make them editable. The pages marked as "Editor Coming Soon" 
              require custom implementations to extract their content into the database.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPagesNew;