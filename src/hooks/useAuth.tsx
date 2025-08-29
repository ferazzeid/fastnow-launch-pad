import { useState, useEffect } from 'react';
import { SupabaseAuthService } from '@/services/SupabaseAuthService';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log('useAuth: Starting auth check');
    
    // 5-second timeout to prevent indefinite loading (extended for production)
    const loadingTimeout = setTimeout(() => {
      console.log('useAuth: Timeout reached, stopping loading state');
      setIsLoading(false);
    }, 5000);

    const checkAuth = async () => {
      try {
        console.log('useAuth: Starting session check...');
        const session = await SupabaseAuthService.getCurrentSession();
        console.log('useAuth: Session check complete', {
          hasSession: !!session,
          hasUser: !!session?.user,
          userEmail: session?.user?.email,
          sessionValid: !!session?.access_token
        });
        
        if (session?.user) {
          setUser(session.user);
          setIsLoading(false);
          clearTimeout(loadingTimeout);
          
          console.log('useAuth: Starting admin role check for user:', session.user.email);
          // Check admin role in background without blocking UI
          SupabaseAuthService.hasAdminRole(session.user.id)
            .then(adminStatus => {
              console.log('useAuth: Admin status check complete', {
                userId: session.user.id,
                isAdmin: adminStatus,
                userEmail: session.user.email
              });
              setIsAdmin(Boolean(adminStatus));
            })
            .catch(error => {
              console.error('useAuth: Admin check error:', error);
              setIsAdmin(false);
            });
        } else {
          console.log('useAuth: No session or user found');
          setUser(null);
          setIsAdmin(false);
          setIsLoading(false);
          clearTimeout(loadingTimeout);
        }
      } catch (error) {
        console.error('useAuth: Auth check error:', error);
        setUser(null);
        setIsAdmin(false);
        setIsLoading(false);
        clearTimeout(loadingTimeout);
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('useAuth: Auth state changed', event, !!session?.user);
        
        if (session?.user) {
          setUser(session.user);
          setIsLoading(false);
          clearTimeout(loadingTimeout);
          
          // Check admin role in background
          SupabaseAuthService.hasAdminRole(session.user.id)
            .then(adminStatus => {
              console.log('useAuth: Admin status updated', adminStatus);
              setIsAdmin(Boolean(adminStatus));
            })
            .catch(error => {
              console.error('useAuth: Admin check error in listener:', error);
              setIsAdmin(false);
            });
        } else {
          setUser(null);
          setIsAdmin(false);
          setIsLoading(false);
          clearTimeout(loadingTimeout);
        }
      }
    );

    checkAuth();

    return () => {
      subscription.unsubscribe();
      clearTimeout(loadingTimeout);
    };
  }, []);

  return { user, isAdmin, isLoading };
};