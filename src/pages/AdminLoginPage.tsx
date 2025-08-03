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
    
    // Add timeout to prevent infinite loading
    const loginTimeout = setTimeout(() => {
      setIsLoading(false);
      toast.error("Login timeout. Please try again.");
    }, 30000); // 30 second timeout
    
    try {
      console.log('Starting login process...', { email });
      
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

      console.log('Calling SupabaseAuthService.signIn...');
      const result = await SupabaseAuthService.signIn(email, password);
      console.log('Login result:', { success: result.success, hasUser: !!result.user, error: result.error });
      
      if (result.success && result.user) {
        console.log('Checking admin role for user:', result.user.id);
        const isAdmin = await SupabaseAuthService.hasAdminRole(result.user.id);
        console.log('Admin check result:', isAdmin);
        
        if (isAdmin) {
          console.log('Admin confirmed, navigating to /admin');
          clearTimeout(loginTimeout);
          toast.success("Login successful!");
          navigate('/admin');
        } else {
          console.log('User is not admin, signing out');
          toast.error("Access denied. Admin privileges required.");
          await SupabaseAuthService.signOut();
        }
      } else {
        console.log('Login failed:', result.error);
        toast.error(result.error || "Authentication failed");
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error("An unexpected error occurred: " + (error instanceof Error ? error.message : String(error)));
    } finally {
      clearTimeout(loginTimeout);
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