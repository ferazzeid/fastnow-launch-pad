import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { SupabaseAuthService } from '@/services/SupabaseAuthService';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = async () => {
    console.log('useAuth: Attempting session refresh...');
    try {
      const { data: { session: newSession }, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('useAuth: Session refresh failed:', error);
        // Clear invalid session
        await supabase.auth.signOut();
        return false;
      }
      
      if (newSession) {
        console.log('useAuth: Session refreshed successfully');
        setSession(newSession);
        setUser(newSession.user);
        
        // Recheck admin status
        const adminStatus = await SupabaseAuthService.hasAdminRole();
        setIsAdmin(adminStatus);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('useAuth: Session refresh error:', error);
      return false;
    }
  };

  useEffect(() => {
    console.log('useAuth: Initializing authentication...');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log('useAuth: Auth state changed', event, !!newSession);
      
      if (event === 'TOKEN_REFRESHED' && newSession) {
        console.log('useAuth: Token refreshed automatically');
        setSession(newSession);
        setUser(newSession.user);
        return;
      }
      
      if (newSession?.user) {
        console.log('useAuth: Setting new session from auth change');
        setSession(newSession);
        setUser(newSession.user);
        setIsLoading(false);
        
        // Check admin status for new session
        setTimeout(async () => {
          try {
            const adminStatus = await SupabaseAuthService.hasAdminRole();
            console.log('useAuth: Admin status from auth change:', adminStatus);
            setIsAdmin(adminStatus);
          } catch (error) {
            console.error('useAuth: Admin check failed in listener:', error);
            setIsAdmin(false);
          }
        }, 100);
      } else {
        console.log('useAuth: Clearing session from auth change');
        setSession(null);
        setUser(null);
        setIsAdmin(false); // Set to false instead of null to prevent loading loops
        setIsLoading(false);
      }
    });

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        console.log('useAuth: Checking for existing session...');
        const { data: { session: existingSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('useAuth: Initial session check failed:', error);
          setIsLoading(false);
          return;
        }
        
        console.log('useAuth: Initial session result:', {
          hasSession: !!existingSession,
          hasUser: !!existingSession?.user,
          userEmail: existingSession?.user?.email,
          expiresAt: existingSession?.expires_at
        });
        
        if (existingSession) {
          // Check if session is expired
          const isExpired = existingSession.expires_at && existingSession.expires_at <= Date.now() / 1000;
          console.log('useAuth: Session expired?', isExpired);
          
          if (isExpired) {
            console.log('useAuth: Session expired, attempting refresh...');
            const refreshed = await refreshSession();
            if (!refreshed) {
              console.log('useAuth: Session refresh failed, clearing state');
              setSession(null);
              setUser(null);
              setIsAdmin(false); // Set to false instead of null
            }
          } else {
            console.log('useAuth: Session valid, setting state');
            setSession(existingSession);
            setUser(existingSession.user);
            
            // Check admin status
            try {
              const adminStatus = await SupabaseAuthService.hasAdminRole();
              console.log('useAuth: Initial admin check result:', adminStatus);
              setIsAdmin(adminStatus);
            } catch (error) {
              console.error('useAuth: Initial admin check failed:', error);
              setIsAdmin(false);
            }
          }
        } else {
          console.log('useAuth: No existing session found');
          // Immediately set isAdmin to false when no session exists
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('useAuth: Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, session, isAdmin, isLoading, refreshSession };
};