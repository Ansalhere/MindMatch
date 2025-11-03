
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentUser, getUserProfile } from '@/lib/supabase';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

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
  session: Session | null;
  isLoading: boolean;
  error: Error | null;
  refreshUser: (currentSession?: Session | null) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  session: null,
  isLoading: true,
  error: null,
  refreshUser: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refreshUser = async (currentSession?: Session | null) => {
    try {
      setError(null);
      setIsLoading(true);
      
      // Use the current session from state if not provided
      const sessionToUse = currentSession !== undefined ? currentSession : session;
      
      if (sessionToUse?.user) {
        // Force fresh data from database
        const { profile: userProfile } = await getUserProfile(sessionToUse.user.id);
        if (userProfile) {
          const freshUser = {
            id: sessionToUse.user.id,
            email: sessionToUse.user.email || '',
            user_type: userProfile.user_type || 'candidate',
            ...userProfile
          };
          setUser(freshUser);
          setProfile(userProfile);
        } else {
          setUser({
            id: sessionToUse.user.id,
            email: sessionToUse.user.email || '',
            user_type: sessionToUse.user.user_metadata?.user_type || 'candidate',
            ...sessionToUse.user.user_metadata
          });
          setProfile(null);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
    } catch (err: any) {
      console.error('Error refreshing user:', err);
      setError(err);
      setUser(null);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, !!session);
        if (!mounted) return;
        
        
        setSession(session);
        
        // Use setTimeout to prevent auth state change deadlocks
        setTimeout(() => {
          if (mounted) {
            refreshUser(session);
          }
        }, 0);
      }
    );
    
    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      console.log('Initial session check:', !!session);
      setSession(session);
      refreshUser(session);
    });
    
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, session, isLoading, error, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useUser = () => useContext(AuthContext);
