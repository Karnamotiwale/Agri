// Centralized API Configuration
const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000";

export const getApiUrl = (endpoint: string) => {
    if (!endpoint.startsWith("/")) {
        endpoint = `/${endpoint}`;
    }
    return `${API_BASE_URL}${endpoint}`;
};

export { API_BASE_URL };
