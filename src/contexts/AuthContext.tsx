import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { SupabaseAuthService } from '@/services/SupabaseAuthService';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isLoading: boolean;
  refreshSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = async () => {
    console.log('AuthProvider: Attempting session refresh...');
    try {
      const { data: { session: newSession }, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('AuthProvider: Session refresh failed:', error);
        await supabase.auth.signOut();
        return false;
      }
      
      if (newSession) {
        console.log('AuthProvider: Session refreshed successfully');
        setSession(newSession);
        setUser(newSession.user);
        
        // Recheck admin status
        const adminStatus = await SupabaseAuthService.hasAdminRole();
        setIsAdmin(adminStatus);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('AuthProvider: Session refresh error:', error);
      return false;
    }
  };

  useEffect(() => {
    console.log('AuthProvider: Initializing authentication...');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log('AuthProvider: Auth state changed', event, !!newSession);
      
      if (event === 'TOKEN_REFRESHED' && newSession) {
        console.log('AuthProvider: Token refreshed automatically');
        setSession(newSession);
        setUser(newSession.user);
        return;
      }
      
      if (newSession?.user) {
        console.log('AuthProvider: Setting new session from auth change');
        setSession(newSession);
        setUser(newSession.user);
        
        // Check admin status for new session without setTimeout
        try {
          const adminStatus = await SupabaseAuthService.hasAdminRole();
          console.log('AuthProvider: Admin status from auth change:', adminStatus);
          setIsAdmin(adminStatus);
        } catch (error) {
          console.error('AuthProvider: Admin check failed in listener:', error);
          setIsAdmin(false);
        } finally {
          setIsLoading(false);
        }
      } else {
        console.log('AuthProvider: Clearing session from auth change');
        setSession(null);
        setUser(null);
        setIsAdmin(false);
        setIsLoading(false);
      }
    });

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        console.log('AuthProvider: Checking for existing session...');
        const { data: { session: existingSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('AuthProvider: Initial session check failed:', error);
          setIsLoading(false);
          return;
        }
        
        console.log('AuthProvider: Initial session result:', {
          hasSession: !!existingSession,
          hasUser: !!existingSession?.user,
          userEmail: existingSession?.user?.email,
          expiresAt: existingSession?.expires_at
        });
        
        if (existingSession) {
          // Check if session is expired
          const isExpired = existingSession.expires_at && existingSession.expires_at <= Date.now() / 1000;
          console.log('AuthProvider: Session expired?', isExpired);
          
          if (isExpired) {
            console.log('AuthProvider: Session expired, attempting refresh...');
            const refreshed = await refreshSession();
            if (!refreshed) {
              console.log('AuthProvider: Session refresh failed, clearing state');
              setSession(null);
              setUser(null);
              setIsAdmin(false);
            }
          } else {
            console.log('AuthProvider: Session valid, setting state');
            setSession(existingSession);
            setUser(existingSession.user);
            
            // Check admin status
            try {
              const adminStatus = await SupabaseAuthService.hasAdminRole();
              console.log('AuthProvider: Initial admin check result:', adminStatus);
              setIsAdmin(adminStatus);
            } catch (error) {
              console.error('AuthProvider: Initial admin check failed:', error);
              setIsAdmin(false);
            }
          }
        } else {
          console.log('AuthProvider: No existing session found');
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('AuthProvider: Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, isAdmin, isLoading, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};