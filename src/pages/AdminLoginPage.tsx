import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '@/components/admin/LoginForm';
import { SupabaseAuthService } from '@/services/SupabaseAuthService';
import { toast } from "@/components/ui/sonner";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if already authenticated
    const checkAuth = async () => {
      const session = await SupabaseAuthService.getCurrentSession();
      if (session?.user) {
        const isAdmin = await SupabaseAuthService.hasAdminRole(session.user.id);
        if (isAdmin) {
          navigate('/admin');
        }
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('Starting login process...');
      const result = await SupabaseAuthService.signIn(email, password);
      console.log('SignIn result:', result);
      
      if (result.success && result.user) {
        console.log('Login successful, checking admin role for user:', result.user.id);
        const isAdmin = await SupabaseAuthService.hasAdminRole(result.user.id);
        console.log('Admin role check result:', isAdmin);
        
        if (isAdmin) {
          console.log('User is admin, attempting navigation...');
          toast.success("Login successful!");
          navigate('/admin');
          console.log('Navigation called');
        } else {
          console.log('User is not admin');
          toast.error("Access denied. Admin privileges required.");
          await SupabaseAuthService.signOut();
        }
      } else {
        console.log('Login failed:', result.error);
        toast.error(result.error || "Authentication failed");
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error("An unexpected error occurred");
    } finally {
      console.log('Setting loading to false');
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Please enter your email address first");
      return;
    }

    try {
      const result = await SupabaseAuthService.resetPassword(email);
      if (result.success) {
        toast.success("Password reset email sent! Check your inbox.");
      } else {
        toast.error(result.error || "Failed to send reset email");
      }
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <LoginForm
      username={email}
      setUsername={setEmail}
      password={password}
      setPassword={setPassword}
      handleLogin={handleLogin}
      handleForgotPassword={handleForgotPassword}
      isLoading={isLoading}
    />
  );
};

export default AdminLoginPage;