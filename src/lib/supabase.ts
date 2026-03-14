// ============================================
// SUPABASE STUB — Mock mode. No real Supabase client.
// All auth and database calls are replaced by mock services.
// This file exists solely to prevent import errors in legacy
// files that may still reference '../lib/supabase'.
// ============================================

import { MOCK_USER } from '../mock/mockAuth';

// Minimal no-op Supabase stub
export const supabase = {
    auth: {
        getUser: async () => ({ data: { user: MOCK_USER }, error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
        signInWithPassword: async () => ({ data: { user: MOCK_USER, session: null }, error: null }),
        signInWithOAuth: async () => ({ error: null }),
        signUp: async () => ({ data: { user: MOCK_USER, session: null }, error: null }),
        signOut: async () => ({ error: null }),
        onAuthStateChange: (_cb: any) => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: (_table: string) => ({
        select: (_cols?: string) => ({
            eq: (_col: string, _val: any) => ({ order: () => ({ data: [], error: null }), data: [], error: null }),
            order: (_col: string, _opts?: any) => Promise.resolve({ data: [], error: null }),
            single: () => Promise.resolve({ data: null, error: null }),
            data: [] as any[],
            error: null,
        }),
        insert: (_data: any) => ({
            select: () => ({ single: () => Promise.resolve({ data: { id: `mock-${Date.now()}` }, error: null }) }),
        }),
        update: (_data: any) => ({
            eq: (_col: string, _val: any) => ({
                eq: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
            }),
        }),
        delete: () => ({
            eq: (_col: string, _val: any) => ({
                eq: () => Promise.resolve({ error: null }),
            }),
        }),
    }),
    storage: {
        from: (_bucket: string) => ({
            upload: async () => ({ error: null }),
            getPublicUrl: (_path: string) => ({ data: { publicUrl: '' } }),
        }),
    },
};

export async function getCurrentUserId(): Promise<string | null> {
    return MOCK_USER.id;
}

export async function isAuthenticated(): Promise<boolean> {
    return true;
}
