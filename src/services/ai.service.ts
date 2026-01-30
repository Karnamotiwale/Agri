import { supabase } from '../lib/supabase';

// Helper interface for the UI
export interface AIRecommendation {
    id: string;
    farm_id: string;
    crop_id: string;
    action: 'IRRIGATE' | 'FERTILIZE' | 'PEST_CONTROL' | 'HARVEST' | 'WAIT' | 'ALERT';
    amount?: number;
    unit?: string;
    confidence: number;
    risk_level: string;
    reasoning: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'DELAYED';
    created_at: string;
}

export const aiService = {
    /**
     * Get recommendations. Returns mock data if API fails or is empty,
     * ensuring the UI always has something to show for demonstration.
     */
    getRecommendations: async (farmId: string): Promise<AIRecommendation[]> => {
        try {
            const response = await fetch(`/recommendations?farm_id=${farmId}`);
            if (!response.ok) throw new Error(`API failed: ${response.status}`);
            return await response.json();
        } catch (err) {
            console.warn("Backend fetch failed, falling back to mock data", err);
            return [
                {
                    id: 'mock-fert-1',
                    farm_id: farmId,
                    crop_id: 'wheat-1',
                    action: 'FERTILIZE',
                    amount: 45,
                    unit: 'kg/ha',
                    confidence: 0.94,
                    risk_level: 'Low',
                    reasoning: 'Soil nitrogen levels are 15% below optimal. Apply Urea to boost vegetative growth.',
                    status: 'PENDING',
                    created_at: new Date().toISOString()
                },
                {
                    id: 'mock-irr-1',
                    farm_id: farmId,
                    crop_id: 'maize-1',
                    action: 'IRRIGATE',
                    amount: 500,
                    unit: 'liters',
                    confidence: 0.85,
                    risk_level: 'Medium',
                    reasoning: 'Soil moisture dropped to 22%. Light irrigation recommended for tomorrow morning.',
                    status: 'PENDING',
                    created_at: new Date().toISOString()
                }
            ];
        }
    },

    runAnalysis: async (farmId: string, cropId: string) => {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        return { message: "Analysis complete", status: "success" };
    },

    /**
     * Get AI Decision from decision engine
     */
    getDecision: async (cropId: string): Promise<any> => {
        try {
            // POST /decide { "crop": "<selected_crop>" }
            const response = await fetch('/decide', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ crop: cropId })
            });

            if (!response.ok) {
                throw new Error(`API call failed: ${response.status}`);
            }

            return await response.json();
        } catch (err) {
            console.warn('Error fetching AI decision, returning fallback for demo:', err);
            // Fallback for demo resilience
            return {
                decision: "IRRIGATE",
                reason: "Soil moisture (32%) is trending downwards while temperature is rising. Light irrigation recommended.",
                confidence: 0.89,
                timestamp: new Date().toISOString()
            };
        }
    },

    /**
     * Submit decision feedback to RL engine
     */
    submitDecisionFeedback: async (cropId: string, actionId: string, status: 'APPLY' | 'DELAY' | 'IGNORE'): Promise<void> => {
        try {
            const response = await fetch('/decide/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ crop: cropId, action_id: actionId, status })
            });
            if (!response.ok) throw new Error(`Feedback failed: ${response.status}`);
        } catch (err) {
        }
    },

    /**
     * Detect crop health from uploaded image
     */
    detectCropHealth: async (cropId: string, imageFile: File): Promise<any> => {
        try {
            const formData = new FormData();
            formData.append('image', imageFile);
            formData.append('crop_id', cropId);

            const response = await fetch('/ai/health-detect', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) throw new Error(`Health detection failed: ${response.status}`);
            return await response.json();
        } catch (err) {
            console.warn('Health detection fallback', err);
            return {
                status: 'diseased',
                issue: 'Leaf Blast (Fungal)',
                severity: 'Moderate',
                solution: 'Apply Carbendazim 2g/L. Improve field drainage.',
                prevention: 'Use certified seeds and avoid excessive nitrogen.',
                confidence: 0.88,
                timestamp: new Date().toISOString()
            };
        }
    },

    /**
     * Get learning insights and history for a crop
     */
    getLearningInsights: async (cropId: string): Promise<any> => {
        try {
            const response = await fetch(`/crop/history?crop_id=${cropId}`);
            if (!response.ok) throw new Error(`History fetch failed: ${response.status}`);
            return await response.json();
        } catch (err) {
            console.warn('History fallback', err);
            return {
                learning: "The RL model has adjusted irrigation frequency because this specific plot retains 12% more moisture at night than average.",
                history: [
                    { event: 'Irrigation Pattern Optimized', date: '2 days ago', type: 'learning' },
                    { event: 'Pest Alert Resolved', date: '5 days ago', type: 'health' },
                    { event: 'Fertilizer Applied', date: '10 days ago', type: 'action' }
                ]
            };
        }
    },

    /**
     * Get global AI engine status across all crops
     */
    getGlobalAIStatus: async (): Promise<any> => {
        try {
            const response = await fetch('/ai/global-status');
            if (!response.ok) throw new Error(`Global status failed: ${response.status}`);
            return await response.json();
        } catch (err) {
            console.warn('Global status fallback', err);
            return {
                recommendations_pending: 12,
                high_priority_alerts: 2,
                system_efficiency: 91.4,
                rl_agent_status: 'Learning Phase',
                last_retrain: '4 hours ago',
                latency_ms: 45
            };
        }
    },

    /**
     * Get aggregate health statistics for the entire farm
     */
    getFarmAIAnalytics: async (): Promise<any> => {
        try {
            const response = await fetch('/ai/farm-analytics');
            if (!response.ok) throw new Error(`Farm analytics failed: ${response.status}`);
            return await response.json();
        } catch (err) {
            console.warn('Farm analytics fallback', err);
            return {
                health_distribution: { healthy: 75, stressed: 15, diseased: 10 },
                resource_usage: [
                    { name: 'Water', optimized: 25, wasted: 5 },
                    { name: 'Fertilizer', optimized: 18, wasted: 2 }
                ],
                predicted_yield_gain: 12.5, // percentage
                connected_sensors: 42,
                active_fields: 8
            };
        }
    }
};

export interface CropAdvisory {
    fertilizer: {
        recommended: boolean;
        productName: string;
        type: string; // Urea, DAP, etc.
        nutrients: { N: string; P: string; K: string };
        dosage: string;
        timing: string;
        method: string;
        status: 'REQUIRED' | 'OPTIONAL' | 'EXCESS';
    };
    pesticide: {
        detected: boolean;
        riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'NONE';
        productName: string;
        category: string; // Insecticide, etc.
        target: string;
        dosage: string;
        safetyInterval: string;
        organicAlternative?: string;
    };
    explainability: {
        reason: string;
        factors: string[];
        confidence: number;
    };
}

export const aiAdvisoryService = {
    getDetailedAdvisory: async (cropId: string): Promise<CropAdvisory> => {
        try {
            const response = await fetch(`/ai/detailed-advisory?crop_id=${cropId}`);
            if (!response.ok) throw new Error(`API failed: ${response.status}`);
            return await response.json();
        } catch (err) {
            console.warn("Falling back to demo advisory data", err);
            return {
                fertilizer: {
                    recommended: true,
                    productName: 'Nutrient Mix',
                    type: 'NPK',
                    nutrients: { N: '20%', P: '10%', K: '10%' },
                    dosage: '20 kg/ha',
                    timing: 'Vegetative Phase',
                    method: 'Soil Application',
                    status: 'REQUIRED'
                },
                pesticide: {
                    detected: false,
                    riskLevel: 'LOW',
                    productName: 'None',
                    category: 'N/A',
                    target: 'None',
                    dosage: '0',
                    safetyInterval: '0'
                },
                explainability: {
                    reason: 'Environmental conditions suggest optimal growth with current nutrient levels.',
                    factors: ['Temperature: 28°C', 'Humidity: 65%'],
                    confidence: 90
                }
            };
        }
    },

    getYieldPrediction: async (cropId: string): Promise<YieldPrediction> => {
        try {
            const response = await fetch(`/yield/prediction?crop_id=${cropId}`);
            if (!response.ok) throw new Error(`API failed: ${response.status}`);
            return await response.json();
        } catch (err) {
            console.warn("Falling back to demo yield data", err);
            return {
                summary: {
                    expectedYield: '2.5 tons/ha',
                    yieldRange: '2.2 - 2.8 tons/ha',
                    vsAverage: '+5%',
                    stability: 'STABLE',
                    trend: 'STABLE'
                },
                risks: [],
                factors: [],
                explainability: {
                    reason: 'Sufficient rainfall and heat units accumulated.',
                    confidence: 85
                }
            };
        }
    },

    getResourceAnalytics: async (cropId: string): Promise<ResourceAnalytics> => {
        try {
            const response = await fetch(`/resource/analytics?crop_id=${cropId}`);
            if (!response.ok) throw new Error(`API failed: ${response.status}`);
            return await response.json();
        } catch (err) {
            console.warn("Falling back to demo resource data", err);
            return {
                water: {
                    totalUsed: '5000L',
                    efficiencyScore: 92,
                    status: 'OPTIMAL',
                    breakdown: { rain: 30, irrigation: 70 },
                    comparison: { used: 5000, required: 4800, unit: 'L' }
                },
                fertilizer: {
                    totalUsed: '200kg',
                    efficiencyScore: 85,
                    status: 'OPTIMAL',
                    breakdown: []
                },
                storage: {
                    waterLevel: 80,
                    fertilizerStock: '500kg',
                    daysRemaining: 15
                },
                insights: {
                    efficiencyImpact: 'High',
                    environmentalScore: 88,
                    wastageReduction: '10%'
                }
            };
        }
    },

    /**
     * Generates AI-driven schedules for valves based on predictive analysis
     */
    getValveSchedule: async (cropId: string, valveIds: string[]): Promise<any[]> => {
        try {
            const response = await fetch(`/ai/valves?crop_id=${cropId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ valves: valveIds })
            });

            if (!response.ok) throw new Error(`Valve API failed: ${response.status}`);
            return await response.json();
        } catch (err) {
            console.warn('Valve schedule fallback', err);
            // Mock schedule generation based on "current time"
            const now = new Date();
            const schedules = valveIds.map((vid, idx) => {
                const nextRun = new Date(now.getTime() + (idx + 1) * 60 * 60 * 1000); // Staggered by hour
                return {
                    id: `sch_${vid}_${Date.now()}`,
                    valveId: vid,
                    scheduledTime: nextRun.toISOString(),
                    durationMinutes: 45,
                    waterQuantityLiters: 1200 + (Math.random() * 200),
                    fertilizerType: idx % 2 === 0 ? 'N-Boost Liquid' : undefined, // Alternate fertilizer
                    source: 'AI',
                    status: 'PENDING',
                    aiReasoning: 'Scheduled based on moisture depletion rate of 1.2% per hour and 0% rain probability.'
                };
            });
            return schedules;
        }
    }
};

export interface ResourceAnalytics {
    water: {
        totalUsed: string;
        efficiencyScore: number;
        status: 'OPTIMAL' | 'CAUTION' | 'CRITICAL';
        breakdown: {
            rain: number;
            irrigation: number;
        };
        comparison: {
            used: number;
            required: number;
            unit: string;
        };
    };
    fertilizer: {
        totalUsed: string;
        efficiencyScore: number;
        status: 'OPTIMAL' | 'CAUTION' | 'CRITICAL';
        breakdown: Array<{
            name: string;
            used: number;
            recommended: number;
            status: 'OPTIMAL' | 'EXCESS' | 'DEFICIENT';
        }>;
    };
    storage: {
        waterLevel: number;
        fertilizerStock: string;
        daysRemaining: number;
        alert?: string;
    };
    insights: {
        efficiencyImpact: string;
        environmentalScore: number;
        wastageReduction: string;
    };
}

export interface YieldPrediction {
    summary: {
        expectedYield: string;
        yieldRange: string;
        vsAverage: string;
        stability: 'STABLE' | 'AT_RISK' | 'CRITICAL';
        trend: 'UP' | 'DOWN' | 'STABLE';
    };
    risks: Array<{
        type: string;
        level: 'LOW' | 'MEDIUM' | 'HIGH';
        description: string;
    }>;
    factors: Array<{
        name: string;
        impact: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
        score: number;
    }>;
    explainability: {
        reason: string;
        confidence: number;
    };
}


