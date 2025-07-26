import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import ContactSettings from '@/components/admin/ContactSettings';

const AdminContactSettings = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    const authToken = localStorage.getItem('fastingApp_authToken');
    if (!authToken) {
      navigate('/admin/login');
    } else {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, [navigate]);

  const handleBack = () => {
    navigate('/admin');
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-4xl">
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={handleBack}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900">Contact Form Settings</h1>
          <p className="text-gray-600 mt-2">
            Configure how contact form submissions are handled
          </p>
        </div>

        <ContactSettings />
      </div>
    </div>
  );
};

export default AdminContactSettings;