import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '@/components/admin/LoginForm';
import { SupabaseAuthService } from '@/services/SupabaseAuthService';
import { toast } from "@/components/ui/sonner";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState(() => localStorage.getItem('admin_email') || '');
  const [password, setPassword] = useState(() => localStorage.getItem('admin_password') || '');
  const [rememberMe, setRememberMe] = useState(() => localStorage.getItem('admin_remember') === 'true');
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
      // Save login data if remember me is checked
      if (rememberMe) {
        localStorage.setItem('admin_email', email);
        localStorage.setItem('admin_password', password);
        localStorage.setItem('admin_remember', 'true');
      } else {
        localStorage.removeItem('admin_email');
        localStorage.removeItem('admin_password');
        localStorage.removeItem('admin_remember');
      }

      const result = await SupabaseAuthService.signIn(email, password);
      
      if (result.success && result.user) {
        const isAdmin = await SupabaseAuthService.hasAdminRole(result.user.id);
        
        if (isAdmin) {
          toast.success("Login successful!");
          navigate('/admin');
        } else {
          toast.error("Access denied. Admin privileges required.");
          await SupabaseAuthService.signOut();
        }
      } else {
        toast.error(result.error || "Authentication failed");
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error("An unexpected error occurred");
    } finally {
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
      rememberMe={rememberMe}
      setRememberMe={setRememberMe}
      isLoading={isLoading}
    />
  );
};

export default AdminLoginPage;