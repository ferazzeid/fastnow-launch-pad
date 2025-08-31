import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import LoginForm from '@/components/admin/LoginForm';
import { SupabaseAuthService } from '@/services/SupabaseAuthService';
import { useAuth } from '@/hooks/useAuth';
import { toast } from "@/components/ui/sonner";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin, session } = useAuth();
  
  const [email, setEmail] = useState(() => localStorage.getItem('admin_email') || '');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(() => localStorage.getItem('admin_remember') === 'true');
  const [isLoading, setIsLoading] = useState(false);

  // Check if already authenticated and redirect
  useEffect(() => {
    const checkExistingAuth = async () => {
      if (session && user && isAdmin === true) {
        console.log('AdminLogin: Already authenticated as admin, redirecting');
        const from = (location.state as any)?.from?.pathname || '/admin';
        navigate(from, { replace: true });
      }
    };

    // Only check if we have a definitive admin status (not loading)
    if (isAdmin !== null) {
      checkExistingAuth();
    }
  }, [user, isAdmin, session, navigate, location]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('AdminLogin: Starting login process for:', email);
      
      // Save email if remember me is checked (NEVER save passwords)
      if (rememberMe) {
        localStorage.setItem('admin_email', email);
        localStorage.setItem('admin_remember', 'true');
      } else {
        localStorage.removeItem('admin_email');
        localStorage.removeItem('admin_remember');
      }

      const result = await SupabaseAuthService.signIn(email, password);
      console.log('AdminLogin: Login result:', { success: result.success, hasSession: !!result.session });
      
      if (!result.success || !result.session) {
        console.error('AdminLogin: Login failed:', result.error);
        toast.error(result.error || 'Login failed');
        return;
      }

      console.log('AdminLogin: Login successful, checking admin status...');
      
      // Wait a moment for the auth state to propagate properly
      setTimeout(async () => {
        try {
          const isAdminUser = await SupabaseAuthService.hasAdminRole();
          console.log('AdminLogin: Admin check result:', isAdminUser);
          
          if (!isAdminUser) {
            console.log('AdminLogin: User is not admin, signing out');
            await SupabaseAuthService.signOut();
            toast.error('Access denied. Admin privileges required.');
            return;
          }

          console.log('AdminLogin: Admin access confirmed, redirecting');
          toast.success('Welcome back, admin!');
          
          const from = (location.state as any)?.from?.pathname || '/admin';
          navigate(from, { replace: true });
        } catch (adminCheckError) {
          console.error('AdminLogin: Admin check failed:', adminCheckError);
          toast.error('Failed to verify admin status. Please try again.');
        }
      }, 500); // Increased delay to ensure auth state propagates properly

    } catch (error) {
      console.error('AdminLogin: Login exception:', error);
      toast.error('An unexpected error occurred');
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
      console.log('AdminLogin: Sending password reset for:', email);
      const result = await SupabaseAuthService.resetPassword(email);
      
      if (result.success) {
        toast.success('Password reset email sent! Check your inbox.');
      } else {
        console.error('AdminLogin: Password reset failed:', result.error);
        toast.error(result.error || 'Failed to send reset email');
      }
    } catch (error) {
      console.error('AdminLogin: Password reset exception:', error);
      toast.error('An unexpected error occurred');
    }
  };

  // Show loading if we're still determining auth state
  if (isAdmin === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="mt-2 text-muted-foreground">Checking authentication...</p>
          <p className="mt-2 text-xs text-muted-foreground">This should only take a moment...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead 
        config={{
          title: 'Admin Login | FastNow',
          description: 'Secure admin login portal for FastNow administration panel.',
          type: 'website',
          robots: { index: false, follow: false }
        }}
      />
      
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
    </>
  );
};

export default AdminLoginPage;