// ============================================
// CONFIG — Central API configuration for KisaanSaathi
// ============================================

/**
 * Backend API base URL.
 * Set VITE_API_URL in your .env.production file on Vercel.
 * Falls back to localhost for local development.
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const getApiUrl = (endpoint: string): string => {
    const base = API_BASE_URL.replace(/\/$/, ''); // strip trailing slash
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${base}${path}`;
};
