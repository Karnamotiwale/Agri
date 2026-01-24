import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { authService } from '../services/auth.service';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function getInitialSession() {
      try {
        const { session } = await authService.getSession();
        if (mounted) {
          if (session) {
            setSession(session);
            setUser(session.user);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
        if (mounted) setLoading(false);
      }
    }

    getInitialSession();

    const { data: authListener } = authService.onAuthStateChange((event, session) => {
      console.log(`Auth state change: ${event}`, session?.user?.email);
      if (mounted) {
        if (event === 'INITIAL_SESSION') {
          // STRICT: Only set user if session exists.
          // If session is null, it means no user is logged in, but we might still be loading?
          // Actually, INITIAL_SESSION with null session means strictly "not authenticated".
          if (session?.user) {
            setSession(session);
            setUser(session.user);
            setLoading(false);
          } else {
            // If no user on initial session, ensure we are null, but keeping loading false?
            // No, getSession() handles the loading state, so we just ensure user is null here.
            // But let's follow the requirement: If session.user is null -> keep user as null.
            // We won't set user to null here explicitly if it's already null, but safe to set.
            // Crucially, does this override getSession?
          }
        } else {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    session,
    loading,
    signInWithGoogle: authService.signInWithGoogle,
    signOut: authService.signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
