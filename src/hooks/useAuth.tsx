import { useState, useEffect } from 'react';
import { SupabaseAuthService } from '@/services/SupabaseAuthService';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log('useAuth: Starting auth check');
    
    // 2-second timeout to prevent indefinite loading
    const loadingTimeout = setTimeout(() => {
      console.log('useAuth: Timeout reached, stopping loading state');
      setIsLoading(false);
    }, 2000);

    const checkAuth = async () => {
      try {
        const session = await SupabaseAuthService.getCurrentSession();
        console.log('useAuth: Session check complete', !!session?.user);
        
        if (session?.user) {
          setUser(session.user);
          setIsLoading(false);
          clearTimeout(loadingTimeout);
          
          // Check admin role in background without blocking UI
          SupabaseAuthService.hasAdminRole(session.user.id)
            .then(adminStatus => {
              console.log('useAuth: Admin status check complete', adminStatus);
              setIsAdmin(adminStatus);
            })
            .catch(error => {
              console.error('useAuth: Admin check error:', error);
              setIsAdmin(false);
            });
        } else {
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
              setIsAdmin(adminStatus);
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