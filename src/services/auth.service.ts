// ============================================
// AUTH SERVICE — Mock only, no Supabase
// ============================================
import { MOCK_USER, MOCK_SESSION } from '../mock/mockAuth';

// We keep a local "logged in" flag so the app can toggle sign in / out
let _isLoggedIn = true; // Start as logged-in for demo mode

export const authService = {
    signUp: async (_email: string, _password: string, _metadata?: any) => ({
        user: MOCK_USER,
        session: MOCK_SESSION,
        error: null,
    }),

    signIn: async (_email: string, _password: string) => ({
        user: MOCK_USER,
        session: MOCK_SESSION,
        error: null,
    }),

    signInWithGoogle: async () => {
        _isLoggedIn = true;
        return { error: null };
    },

    signOut: async () => {
        _isLoggedIn = false;
        return { error: null };
    },

    getCurrentUser: async () => ({
        user: _isLoggedIn ? MOCK_USER : null,
        error: null,
    }),

    getSession: async () => ({
        session: _isLoggedIn ? MOCK_SESSION : null,
        error: null,
    }),

    onAuthStateChange: (callback: (event: string, session: any) => void) => {
        // Immediately fire INITIAL_SESSION with the mock session
        setTimeout(() => callback('INITIAL_SESSION', _isLoggedIn ? MOCK_SESSION : null), 0);
        return { data: { subscription: { unsubscribe: () => {} } } };
    },
};
