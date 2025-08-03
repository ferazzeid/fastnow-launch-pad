import { useState, useEffect } from 'react';
import { SupabaseAuthService } from '@/services/SupabaseAuthService';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await SupabaseAuthService.getCurrentSession();
        if (session?.user) {
          setUser(session.user);
          const adminStatus = await SupabaseAuthService.hasAdminRole(session.user.id);
          setIsAdmin(adminStatus);
        } else {
          setUser(null);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setUser(null);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          const adminStatus = await SupabaseAuthService.hasAdminRole(session.user.id);
          setIsAdmin(adminStatus);
        } else {
          setUser(null);
          setIsAdmin(false);
        }
        setIsLoading(false);
      }
    );

    checkAuth();

    return () => subscription.unsubscribe();
  }, []);

  return { user, isAdmin, isLoading };
};