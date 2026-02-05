const API_BASE = "http://localhost:5000";

export interface AnalyticsData {
    policy_state: any;
    q_table: any[];
}

export async function fetchAnalytics(): Promise<AnalyticsData> {
    const response = await fetch(`${API_BASE}/analytics`);

    if (!response.ok) {
        throw new Error("Failed to fetch analytics");
    }

    return await response.json();
}
