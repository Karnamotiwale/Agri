export interface AIAction {
    id: string;
    timestamp: string;
    cropName: string;
    actionType: 'IRRIGATION' | 'FERTILIZATION' | 'PEST_CONTROL' | 'ALERT';
    reason: string;
    outcome: 'IMPROVED' | 'NO_CHANGE' | 'WORSENED';
    reward: number;
    confidence: number;
}

export interface AIPerformance {
    overallScore: number;
    efficiencyTrend: 'UP' | 'DOWN' | 'STABLE';
    totalActions: number;
    positiveRewards: number;
    negativeRewards: number;
    lastUpdated: string;
}

export const rlService = {
    getPerformanceSummary: async (): Promise<AIPerformance> => {
        const response = await fetch('/ai/rl-performance');
        if (!response.ok) throw new Error(`RL performance API failed: ${response.status}`);
        return await response.json();
    },

    getRecentActions: async (): Promise<AIAction[]> => {
        const response = await fetch('/ai/rl-actions');
        if (!response.ok) throw new Error(`RL actions API failed: ${response.status}`);
        return await response.json();
    },

    getRewardHistory: async (): Promise<{ date: string; score: number }[]> => {
        const response = await fetch('/ai/rl-rewards');
        if (!response.ok) throw new Error(`RL rewards API failed: ${response.status}`);
        return await response.json();
    },

    getInsights: async (): Promise<string[]> => {
        const response = await fetch('/ai/rl-insights');
        if (!response.ok) throw new Error(`RL insights API failed: ${response.status}`);
        return await response.json();
    }
};
