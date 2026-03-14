// ============================================
// ANALYTICS SERVICE — Mock only, no backend
// Real endpoints (for future integration):
//   GET /api/v1/analytics/overview       → analyticsService.getOverview()
//   GET /api/v1/analytics/range-forecast → analyticsService.getForecast()
//   GET /api/v1/analytics/crop-health    → analyticsService.getCropHealth()
// ============================================
import {
    getMockAnalytics,
    getMockAnalyticsOverview,
    getMockForecast,
    getMockCropHealth,
} from '../mock/mockAnalytics';

// Re-export all interfaces so existing imports don't break
export interface AnalyticsData {
    policy_state: {
        epsilon: number;
        learning_rate: number;
        discount_factor: number;
        penalties: { over_irrigation: number; under_irrigation: number; rain_waste: number };
    };
    q_table: any[];
    model_accuracy: number;
    model_precision: number;
    total_decisions: number;
    system_status: string;
    error?: string;
}

export interface AnalyticsOverview {
    summary: Record<string, any>;
    data_points: number;
    period?: string;
    timestamp?: string;
    source?: string;
}

export interface ForecastDay { date: string; soil_moisture: number; temperature: number; }
export interface ForecastResponse { forecast: ForecastDay[]; horizon_days: number; status?: string; }
export interface CropHealth { crop_id: string; name: string; health_score: number; status: 'Good' | 'Attention' | 'Critical'; }
export interface CropHealthResponse { crops: CropHealth[]; error?: string; }

export async function fetchAnalytics(): Promise<AnalyticsData> {
    return getMockAnalytics();
}

export const analyticsService = {
    getOverview: async (): Promise<AnalyticsOverview> => getMockAnalyticsOverview(),
    getForecast: async (days = 7): Promise<ForecastResponse> => getMockForecast(days),
    getCropHealth: async (): Promise<CropHealthResponse> => getMockCropHealth(),
    startPolling: (callback: (data: AnalyticsOverview) => void, intervalMs = 600000): (() => void) => {
        callback(getMockAnalyticsOverview());
        const id = setInterval(() => callback(getMockAnalyticsOverview()), intervalMs);
        return () => clearInterval(id);
    },
};
