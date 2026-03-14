// ============================================
// MOCK AUTH — No Supabase required
// ============================================

export const MOCK_USER = {
    id: 'mock-user-001',
    email: 'farmer@kisaansaathi.in',
    user_metadata: {
        full_name: 'Rajesh Kumar',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh',
    },
    app_metadata: {},
    aud: 'authenticated',
    created_at: '2024-01-01T00:00:00Z',
};

export const MOCK_SESSION = {
    access_token: 'mock-access-token',
    refresh_token: 'mock-refresh-token',
    expires_in: 3600,
    token_type: 'bearer',
    user: MOCK_USER,
};
