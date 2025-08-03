import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

export class SupabaseAuthService {
  // Sign in with email and password
  static async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Sign in error:', error);
        return { success: false, error: error.message };
      }

      return { success: true, user: data.user, session: data.session };
    } catch (error) {
      console.error('Sign in exception:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  }

  // Sign out
  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        toast.error('Error signing out');
        return false;
      }
      return true;
    } catch (error) {
      console.error('Sign out exception:', error);
      toast.error('Error signing out');
      return false;
    }
  }

  // Get current session
  static async getCurrentSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Get session error:', error);
        return null;
      }
      return session;
    } catch (error) {
      console.error('Get session exception:', error);
      return null;
    }
  }

  // Check if user has admin role
  static async hasAdminRole(userId?: string) {
    try {
      const { data, error } = await supabase
        .rpc('has_role', { 
          _user_id: userId || (await this.getCurrentSession())?.user?.id,
          _role: 'admin' 
        });

      if (error) {
        console.error('Role check error:', error);
        return false;
      }

      return data || false;
    } catch (error) {
      console.error('Role check exception:', error);
      return false;
    }
  }

  // Reset password
  static async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/reset-password`
      });

      if (error) {
        console.error('Password reset error:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Password reset exception:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  }

  // Update password (for logged in users)
  static async updatePassword(newPassword: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.error('Password update error:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Password update exception:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  }
}