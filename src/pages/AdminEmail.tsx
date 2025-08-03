import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import EmailSettings from '@/components/admin/EmailSettings';

const AdminEmail = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Email Settings | Admin</title>
      </Helmet>

      <header className="border-b bg-card">
        <div className="container flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-accent-green hover:opacity-80 transition-opacity">
            FastNow
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">Email Settings</h1>
            <Button variant="outline" onClick={() => navigate('/admin')}>
              <ArrowLeft size={16} className="mr-2" />
              Back to Admin
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <p className="text-muted-foreground">
              Configure contact form email delivery and API integration.
            </p>
          </div>

          <EmailSettings />
        </div>
      </main>
    </div>
  );
};

export default AdminEmail;