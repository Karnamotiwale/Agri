// ============================================
// AUTH CONTEXT — Mock only, no Supabase
// ============================================
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { MOCK_USER, MOCK_SESSION } from '../mock/mockAuth';
import { authService } from '../services/auth.service';

interface AuthContextType {
    user: any | null;
    session: any | null;
    loading: boolean;
    signInWithGoogle: () => Promise<{ error: any }>;
    signOut: () => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<any | null>(null);
    const [session, setSession] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Immediately set mock session — no Supabase needed
        const { data: listener } = authService.onAuthStateChange((_event: string, session: any) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    const signInWithGoogle = async () => {
        const result = await authService.signInWithGoogle();
        setUser(MOCK_USER);
        setSession(MOCK_SESSION);
        return result;
    };

    const signOut = async () => {
        const result = await authService.signOut();
        setUser(null);
        setSession(null);
        return result;
    };

    return (
        <AuthContext.Provider value={{ user, session, loading, signInWithGoogle, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
