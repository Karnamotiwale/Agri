// ============================================
// CONFIG — Mock mode, no real API URL needed
// ============================================
export const API_BASE_URL = '';

export const getApiUrl = (_endpoint: string) => {
    // In mock mode all URLs are disabled — this function should never be called
    console.warn('[Mock Mode] getApiUrl called — backend is disabled');
    return '';
};
