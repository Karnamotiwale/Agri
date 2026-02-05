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
        // Return fallback data instead of throwing
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
