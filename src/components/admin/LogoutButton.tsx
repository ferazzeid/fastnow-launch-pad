import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SupabaseAuthService } from '@/services/SupabaseAuthService';
import { toast } from '@/components/ui/sonner';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const success = await SupabaseAuthService.signOut();
    if (success) {
      toast.success('Logged out successfully');
      navigate('/admin/login');
    } else {
      toast.error('Error signing out');
    }
  };

  return (
    <Button variant="outline" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default LogoutButton;