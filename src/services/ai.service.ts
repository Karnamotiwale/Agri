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
            // Try to fetch from Supabase first if available
            const { data, error } = await supabase
                .from('ai_recommendations')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(5);

            if (!error && data && data.length > 0) {
                return data as AIRecommendation[];
            }
        } catch (err) {
            console.warn("Backend fetch failed, falling back to mock data", err);
        }

        // FALLBACK MOCK DATA - Ensures the UI is never empty for the user
        return [
            {
                id: 'mock-fert-1',
                farm_id: 'demo',
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
                id: 'mock-pest-1',
                farm_id: 'demo',
                crop_id: 'rice-1',
                action: 'PEST_CONTROL',
                confidence: 0.89,
                risk_level: 'High',
                reasoning: 'Potential Stem Borer outbreak detected in neighboring fields. Preventive spray recommended.',
                status: 'PENDING',
                created_at: new Date().toISOString()
            },
            {
                id: 'mock-irr-1',
                farm_id: 'demo',
                crop_id: 'corn-1',
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
    },

    /**
     * Placeholder method for running analysis
     */
    runAnalysis: async (farmId: string, cropId: string) => {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        return { message: "Analysis complete", status: "success" };
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
        // Mock data logic for demonstration
        await new Promise(r => setTimeout(r, 800)); // Simulate net delay

        return {
            fertilizer: {
                recommended: true,
                productName: 'Neem-Coated Urea',
                type: 'Nitrogenous',
                nutrients: { N: '46%', P: '0%', K: '0%' },
                dosage: '25 kg/acre',
                timing: 'Top dressing (Now)',
                method: 'Broadcasting',
                status: 'REQUIRED'
            },
            pesticide: {
                detected: true,
                riskLevel: 'MEDIUM',
                productName: 'Imidacloprid 17.8 SL',
                category: 'Insecticide',
                target: 'Aphids & Thrips',
                dosage: '0.5 ml/liter',
                safetyInterval: '14 Days',
                organicAlternative: 'Neem Oil 10000 ppm'
            },
            explainability: {
                reason: 'Standard nitrogen deficiency details detected for vegetative stage.',
                factors: [
                    'Soil N Level: 140 kg/ha (Low)',
                    'Crop Stage: Vegetative (High N demand)',
                    'Weather: No rain forecast (Safe to apply)',
                    'Pest Risk: Rising Thrip population'
                ],
                confidence: 88
            }
        };
    },

    getYieldPrediction: async (cropId: string): Promise<YieldPrediction> => {
        await new Promise(r => setTimeout(r, 1200));

        return {
            summary: {
                expectedYield: '2,250 kg/acre',
                yieldRange: '2,100 - 2,400 kg/acre',
                vsAverage: '+12% above avg',
                stability: 'STABLE',
                trend: 'UP'
            },
            risks: [
                { type: 'Weather', level: 'LOW', description: 'Favorable rainfall expected next week.' },
                { type: 'Pest', level: 'MEDIUM', description: 'Minor thrip activity detected.' },
                { type: 'Water', level: 'LOW', description: 'Soil moisture is optimal.' }
            ],
            factors: [
                { name: 'Soil Moisture', impact: 'POSITIVE', score: 92 },
                { name: 'Nutrient NPK', impact: 'NEUTRAL', score: 78 },
                { name: 'Crop Health', impact: 'POSITIVE', score: 88 }
            ],
            explainability: {
                reason: "Yield is favorable due to excellent early-stage growth and optimal moisture levels, though slightly limited by nitrogen availability.",
                confidence: 85
            }
        };
    },

    getResourceAnalytics: async (cropId: string): Promise<ResourceAnalytics> => {
        await new Promise(r => setTimeout(r, 1000));

        return {
            water: {
                totalUsed: '2.4M Liters',
                efficiencyScore: 88,
                status: 'OPTIMAL',
                breakdown: {
                    rain: 40,
                    irrigation: 60
                },
                comparison: {
                    used: 2400000,
                    required: 2350000,
                    unit: 'Liters'
                }
            },
            fertilizer: {
                totalUsed: '450 kg',
                efficiencyScore: 72,
                status: 'CAUTION',
                breakdown: [
                    { name: 'Nitrogen (N)', used: 200, recommended: 180, status: 'EXCESS' },
                    { name: 'Phosphorus (P)', used: 100, recommended: 120, status: 'DEFICIENT' },
                    { name: 'Potassium (K)', used: 150, recommended: 150, status: 'OPTIMAL' },
                ]
            },
            storage: {
                waterLevel: 65, // percentage
                fertilizerStock: '1,200 kg',
                daysRemaining: 24,
                alert: 'Refill Nitrogen stock soon'
            },
            insights: {
                efficiencyImpact: 'Water usage reduced by 18% compared to last season due to AI-guided irrigation scheduling.',
                environmentalScore: 94,
                wastageReduction: '150 kg'
            }
        };
    },

    /**
     * Generates AI-driven schedules for valves based on predictive analysis
     */
    getValveSchedule: async (cropId: string, valveIds: string[]): Promise<any[]> => {
        await new Promise(r => setTimeout(r, 1500)); // Simulate complex calculation

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


