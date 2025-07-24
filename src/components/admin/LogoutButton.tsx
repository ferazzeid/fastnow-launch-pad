import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AuthService } from '@/services/AuthService';
import { toast } from '@/components/ui/sonner';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    AuthService.clearSession();
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  return (
    <Button variant="outline" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default LogoutButton;