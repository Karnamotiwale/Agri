import { supabase } from '../lib/supabase';
import type { User, Session, AuthError } from '@supabase/supabase-js';

export const authService = {
    signUp: async (email: string, password: string, metadata?: Record<string, any>) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: metadata,
            },
        });
        return { user: data.user, session: data.session, error };
    },

    signIn: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return { user: data.user, session: data.session, error };
    },

    signInWithGoogle: async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin
            }
        });
        return { error };
    },

    signOut: async () => {
        const { error } = await supabase.auth.signOut();
        return { error };
    },

    getCurrentUser: async () => {
        const { data: { user }, error } = await supabase.auth.getUser();
        return { user, error };
    },

    getSession: async () => {
        const { data: { session }, error } = await supabase.auth.getSession();
        return { session, error };
    },

    onAuthStateChange: (callback: (event: string, session: Session | null) => void) => {
        const { data } = supabase.auth.onAuthStateChange((event, session) => {
            callback(event, session);
        });
        return { data };
    },
};
