import { getApiUrl } from './config';

// ============================================
// TYPES & INTERFACES (from analyticsService)
// ============================================

const API_BASE = "http://localhost:5000";

export interface AnalyticsData {
    policy_state: {
        epsilon: number;
        learning_rate: number;
        discount_factor: number;
        penalties: {
            over_irrigation: number;
            under_irrigation: number;
            rain_waste: number;
        };
    };
    q_table: any[];
    model_accuracy: number;
    model_precision: number;
    total_decisions: number;
    system_status: string;
    error?: string;
}

export async function fetchAnalytics(): Promise<AnalyticsData> {
    try {
        const response = await fetch(`${API_BASE}/analytics`);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Analytics fetch failed:', error);
        return {
            policy_state: {
                epsilon: 0.1,
                learning_rate: 0.1,
                discount_factor: 0.9,
                penalties: {
                    over_irrigation: 1.5,
                    under_irrigation: 1.5,
                    rain_waste: 2.0
                }
            },
            q_table: [],
            model_accuracy: 0.88,
            model_precision: 0.91,
            total_decisions: 0,
            system_status: "offline",
            error: error instanceof Error ? error.message : "Failed to fetch analytics"
        };
    }
}

// ============================================
// TYPES & INTERFACES (from analytics.service)
// ============================================

export interface AnalyticsOverview {
    summary: {
        soil_moisture?: string;
        soil_moisture_value?: number;
        temperature?: string;
        temperature_value?: number;
        humidity?: string;
        humidity_value?: number;
        nitrogen?: string;
        nitrogen_value?: number;
        phosphorus?: string;
        phosphorus_value?: number;
        potassium?: string;
        potassium_value?: number;
    };
    data_points: number;
    period?: string;
    timestamp?: string;
    source?: string;
}

export interface ForecastDay {
    date: string;
    soil_moisture: number;
    temperature: number;
}

export interface ForecastResponse {
    forecast: ForecastDay[];
    horizon_days: number;
    status?: string;
}

export interface CropHealth {
    crop_id: string;
    name: string;
    health_score: number;
    status: 'Good' | 'Attention' | 'Critical';
}

export interface CropHealthResponse {
    crops: CropHealth[];
    error?: string;
}

// ============================================
// SAFE FETCH HELPER
// ============================================

const safeFetch = async (endpoint: string, options: RequestInit = {}) => {
    const url = getApiUrl(endpoint);
    try {
        const res = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error(`API Error ${res.status}: ${text}`);
        }

        return await res.json();
    } catch (err) {
        console.error(`Analytics fetch failed for ${url}:`, err);
        throw err;
    }
};

// ============================================
// ANALYTICS SERVICE (from analytics.service)
// ============================================

export const analyticsService = {
    /**
     * Get real-time analytics overview with trends
     */
    getOverview: async (): Promise<AnalyticsOverview> => {
        try {
            const data = await safeFetch('/api/analytics/overview');
            return data;
        } catch (err) {
            console.error('Failed to fetch analytics overview:', err);
            throw err;
        }
    },

    /**
     * Get short-term forecast (default 7 days)
     */
    getForecast: async (days: number = 7): Promise<ForecastResponse> => {
        try {
            const data = await safeFetch(`/api/analytics/range-forecast?days=${days}`);
            return data;
        } catch (err) {
            console.error('Failed to fetch forecast:', err);
            throw err;
        }
    },

    /**
     * Get health scores for all active crops
     */
    getCropHealth: async (): Promise<CropHealthResponse> => {
        try {
            const data = await safeFetch('/api/analytics/crop-health');
            return data;
        } catch (err) {
            console.error('Failed to fetch crop health:', err);
            return {
                crops: [],
                error: err instanceof Error ? err.message : 'Unknown error',
            };
        }
    },

    /**
     * Poll analytics data at regular intervals
     * Returns cleanup function
     */
    startPolling: (
        callback: (data: AnalyticsOverview) => void,
        intervalMs: number = 600000
    ): (() => void) => {
        const poll = async () => {
            try {
                const data = await analyticsService.getOverview();
                callback(data);
            } catch (err) {
                console.error('Polling error:', err);
            }
        };

        poll();
        const intervalId = setInterval(poll, intervalMs);
        return () => clearInterval(intervalId);
    },
};
