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

const MOCK_ACTIONS: AIAction[] = [
    {
        id: '1',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
        cropName: 'Wheat',
        actionType: 'IRRIGATION',
        reason: 'Soil moisture dropped below 30% threshold.',
        outcome: 'IMPROVED',
        reward: 10,
        confidence: 92
    },
    {
        id: '2',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        cropName: 'Tomato',
        actionType: 'FERTILIZATION',
        reason: 'Nitrogen deficiency detected in leaf analysis.',
        outcome: 'IMPROVED',
        reward: 15,
        confidence: 88
    },
    {
        id: '3',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
        cropName: 'Corn',
        actionType: 'IRRIGATION',
        reason: 'Preventative watering before predicted heatwave.',
        outcome: 'NO_CHANGE',
        reward: 0,
        confidence: 75
    },
    {
        id: '4',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        cropName: 'Rice',
        actionType: 'ALERT',
        reason: 'Pest activity suspected near boundary.',
        outcome: 'WORSENED', // Maybe user ignored it?
        reward: -5,
        confidence: 65
    }
];

export const rlService = {
    getPerformanceSummary: async (): Promise<AIPerformance> => {
        // Simulate calc
        await new Promise(r => setTimeout(r, 600));
        return {
            overallScore: 87,
            efficiencyTrend: 'UP',
            totalActions: 142,
            positiveRewards: 1250,
            negativeRewards: -120,
            lastUpdated: new Date().toISOString()
        };
    },

    getRecentActions: async (): Promise<AIAction[]> => {
        await new Promise(r => setTimeout(r, 800));
        return MOCK_ACTIONS;
    },

    getRewardHistory: async (): Promise<{ date: string; score: number }[]> => {
        // Mock 7 day history
        return [
            { date: 'Mon', score: 45 },
            { date: 'Tue', score: 60 },
            { date: 'Wed', score: 55 },
            { date: 'Thu', score: 80 },
            { date: 'Fri', score: 95 },
            { date: 'Sat', score: 85 },
            { date: 'Sun', score: 92 }
        ];
    },

    getInsights: async (): Promise<string[]> => {
        return [
            "AI reduced water usage by 18% this week compared to manual cycle.",
            "Yield prediction accuracy improved by 12% after recent feedback.",
            "Manual overrides on Irrigation have reduced AI confidence slightly."
        ];
    }
};
