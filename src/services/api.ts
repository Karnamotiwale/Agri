// ============================================
// API CLIENT — Disabled in mock mode
// ============================================
// All network calls are replaced by mock services.
// This module is kept for type-compatibility only.

export const api = {
    get: async (_url: string) => { console.warn('[Mock] api.get called'); return { data: null }; },
    post: async (_url: string, _data?: any) => { console.warn('[Mock] api.post called'); return { data: null }; },
};
