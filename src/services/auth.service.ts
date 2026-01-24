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
        console.log("AuthService: signInWithGoogle called");
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin
            }
        });
        if (error) console.error("AuthService: signInWithGoogle error", error);
        return { error };
    },

    signOut: async () => {
        console.log("AuthService: signOut called");
        const { error } = await supabase.auth.signOut();
        return { error };
    },

    getCurrentUser: async () => {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) console.error("AuthService: getUser error", error);
        return { user, error };
    },

    getSession: async () => {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log("AuthService: getSession result", { hasSession: !!session, error });
        return { session, error };
    },

    onAuthStateChange: (callback: (event: string, session: Session | null) => void) => {
        console.log("AuthService: setting up onAuthStateChange listener");
        const { data } = supabase.auth.onAuthStateChange((event, session) => {
            console.log(`AuthService: Auth Event: ${event}`, { userId: session?.user?.id });
            callback(event, session);
        });
        return { data };
    },
};
