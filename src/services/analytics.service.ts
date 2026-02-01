import { getApiUrl } from './config';

// ============================================
// TYPES & INTERFACES
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
// ANALYTICS SERVICE
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
            // Return fallback structure
            return {
                summary: {
                    soil_moisture: 'stable',
                    soil_moisture_value: 0,
                    temperature: 'stable',
                    temperature_value: 0,
                },
                data_points: 0,
                period: '24h',
                source: 'fallback',
            };
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
            // Return fallback forecast
            const today = new Date();
            const fallbackForecast: ForecastDay[] = Array.from({ length: days }, (_, i) => {
                const date = new Date(today);
                date.setDate(date.getDate() + i + 1);
                return {
                    date: date.toISOString().split('T')[0],
                    soil_moisture: 60 + Math.random() * 10 - 5,
                    temperature: 28 + Math.random() * 4 - 2,
                };
            });

            return {
                forecast: fallbackForecast,
                horizon_days: days,
                status: 'fallback',
            };
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
        intervalMs: number = 600000 // 10 minutes default
    ): (() => void) => {
        const poll = async () => {
            try {
                const data = await analyticsService.getOverview();
                callback(data);
            } catch (err) {
                console.error('Polling error:', err);
            }
        };

        // Initial fetch
        poll();

        // Set up interval
        const intervalId = setInterval(poll, intervalMs);

        // Return cleanup function
        return () => clearInterval(intervalId);
    },
};
