
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentUser, getUserProfile } from '@/lib/supabase';

type User = {
  id: string;
  email: string;
  user_type: string;
  name?: string;
  [key: string]: any;
};

type AuthContextType = {
  user: User | null;
  profile: any | null;
  isLoading: boolean;
  error: Error | null;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isLoading: true,
  error: null,
  refreshUser: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refreshUser = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { user: currentUser, error: userError } = await getCurrentUser();
      
      if (userError) throw userError;
      
      if (currentUser) {
        setUser({
          id: currentUser.id,
          email: currentUser.email || '',
          user_type: currentUser.user_metadata?.user_type || 'candidate',
          ...currentUser.user_metadata
        });
        
        // Get additional profile data from users table
        const { profile: userProfile, error: profileError } = await getUserProfile(currentUser.id);
        
        if (profileError) throw profileError;
        
        setProfile(userProfile);
      } else {
        setUser(null);
        setProfile(null);
      }
    } catch (err: any) {
      console.error('Error refreshing user:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
    
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async () => {
      refreshUser();
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, isLoading, error, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useUser = () => useContext(AuthContext);
