import { supabase } from '@/integrations/supabase/client';

/**
 * Admin Password Reset Utility
 * 
 * For admin users in Supabase, passwords are encrypted and cannot be changed directly.
 * This utility provides methods to help with admin password management.
 */

export const adminPasswordUtils = {
  /**
   * Request a password reset email for the admin user
   * This will send a password reset link to the admin's email
   */
  async requestPasswordReset(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin-login?reset=true`,
      });

      if (error) {
        throw error;
      }

      return { success: true, message: 'Password reset email sent successfully' };
    } catch (error: any) {
      console.error('Password reset error:', error);
      return { success: false, message: error.message || 'Failed to send password reset email' };
    }
  },

  /**
   * Check if a user exists in Supabase Auth
   */
  async checkUserExists(email: string) {
    try {
      // We can't directly check auth.users, but we can try to request a password reset
      // which will fail silently if the user doesn't exist
      const result = await this.requestPasswordReset(email);
      return result.success;
    } catch (error) {
      return false;
    }
  },

  /**
   * Create admin user in Supabase Auth (requires service role key)
   * This method would typically be used by a super admin or in a server environment
   */
  async createAdminUser(email: string, password: string, userData?: any) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            user_type: 'admin',
            name: 'Administrator',
            ...userData
          }
        }
      });

      if (error) {
        throw error;
      }

      return { success: true, data, message: 'Admin user created successfully' };
    } catch (error: any) {
      console.error('Admin user creation error:', error);
      return { success: false, message: error.message || 'Failed to create admin user' };
    }
  },

  /**
   * Instructions for manual password reset in Supabase Dashboard
   */
  getManualResetInstructions() {
    return {
      title: 'Manual Password Reset in Supabase Dashboard',
      steps: [
        '1. Go to your Supabase Dashboard',
        '2. Navigate to Authentication > Users',
        '3. Find the user (superadmin@fresherpools.com)',
        '4. Click on the user to open details',
        '5. Click "Send password recovery email" or "Reset password"',
        '6. The user will receive an email with reset instructions',
        '7. Follow the link in the email to set a new password'
      ],
      dashboardUrl: 'https://supabase.com/dashboard/project/grbtziyqindonbkkkfkc/auth/users',
      note: 'You cannot directly change passwords in Supabase as they are encrypted. Use the password reset flow instead.'
    };
  }
};

// Helper function to display manual reset instructions
export const showPasswordResetInstructions = () => {
  const instructions = adminPasswordUtils.getManualResetInstructions();
  
  console.group('🔑 Admin Password Reset Instructions');
  console.log(instructions.title);
  console.log('');
  instructions.steps.forEach(step => console.log(step));
  console.log('');
  console.log('Dashboard URL:', instructions.dashboardUrl);
  console.log('');
  console.log('⚠️ Note:', instructions.note);
  console.groupEnd();
  
  return instructions;
};