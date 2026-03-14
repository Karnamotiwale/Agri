// ============================================
// RL SERVICE — Mock only, no backend
// ============================================

export interface AIAction {
    id: string; timestamp: string; cropName: string;
    actionType: 'IRRIGATION' | 'FERTILIZATION' | 'PEST_CONTROL' | 'ALERT';
    reason: string; outcome: 'IMPROVED' | 'NO_CHANGE' | 'WORSENED';
    reward: number; confidence: number;
}

export interface AIPerformance {
    overallScore: number; efficiencyTrend: 'UP' | 'DOWN' | 'STABLE';
    totalActions: number; positiveRewards: number;
    negativeRewards: number; lastUpdated: string;
}

export const rlService = {
    getPerformanceSummary: async (): Promise<AIPerformance> => ({
        overallScore: 92, efficiencyTrend: 'UP',
        totalActions: 1250, positiveRewards: 1100,
        negativeRewards: 150, lastUpdated: new Date().toISOString(),
    }),

    getRecentActions: async (): Promise<AIAction[]> => {
        const types: AIAction['actionType'][] = ['IRRIGATION', 'FERTILIZATION', 'PEST_CONTROL', 'ALERT'];
        const outcomes: AIAction['outcome'][] = ['IMPROVED', 'IMPROVED', 'IMPROVED', 'NO_CHANGE'];
        return Array.from({ length: 10 }, (_, i) => ({
            id: `action-${i + 1}`,
            timestamp: new Date(Date.now() - i * 3600000).toISOString(),
            cropName: ['Rice', 'Wheat', 'Maize'][i % 3],
            actionType: types[i % 4],
            reason: 'Automated AI Decision',
            outcome: outcomes[i % 4],
            reward: +(0.7 + Math.random() * 0.2).toFixed(2),
            confidence: +(0.85 + Math.random() * 0.1).toFixed(2),
        }));
    },

    getRewardHistory: async (): Promise<{ date: string; score: number }[]> => [
        { date: '2025-01-01', score: 0.4 }, { date: '2025-01-07', score: 0.6 },
        { date: '2025-01-14', score: 0.8 }, { date: '2025-01-21', score: 0.85 },
        { date: '2025-01-28', score: 0.92 },
    ],

    getInsights: async (): Promise<string[]> => [
        'Irrigation efficiency improved by 15% this week',
        'Pest prediction model accuracy is 94%',
        'Nitrogen usage successfully optimized for Rice',
    ],
};
