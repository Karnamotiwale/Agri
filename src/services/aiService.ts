import { getApiUrl } from './config';

// ============================================
// SHARED DATA CONTRACTS
// ============================================

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

export interface CropAdvisory {
    fertilizer: {
        recommended: boolean;
        productName: string;
        type: string;
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
        category: string;
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

export interface StressAnalysisResult {
    stressLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    primaryStressor: string;
    confidence: number;
    recommendations: string[];
    factors: { name: string; value: number }[];
}

export type ResourceAnalytics = any;
export type YieldPrediction = any;

// ============================================
// SAFE FETCH WRAPPER
// ============================================

const safeFetch = async (endpoint: string, options: RequestInit = {}) => {
    const url = getApiUrl(endpoint);
    try {
        const res = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            }
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`AI API Error ${res.status}: ${errorText}`);
        }

        const data = await res.json();
        if (!data) throw new Error("Empty JSON response from AI engine");
        return data;
    } catch (err) {
        console.warn(`[AI Service] Connectivity issue at ${endpoint}:`, err);
        throw err;
    }
};

// ============================================
// STABLE AI SERVICE LAYER
// ============================================

export const aiService = {
    /**
     * POST /decide - Unified Decision Engine
     */
    getDecision: async (params: {
        crop: string;
        growth_stage?: string;
        soil_moisture_pct?: number;
        temperature_c?: number;
    }): Promise<any> => {
        return await safeFetch('/decide', {
            method: 'POST',
            body: JSON.stringify(params)
        });
    },

    /**
     * GET /ai/status - Health & Status
     */
    getStatus: async (): Promise<any> => {
        return await safeFetch('/ai/status');
    },

    /**
     * GET /ai/decision-log - History
     */
    getDecisionLog: async (crop?: string, limit: number = 20): Promise<any[]> => {
        const endpoint = crop
            ? `/ai/decision-log?crop=${crop.toLowerCase()}&limit=${limit}`
            : `/ai/decision-log?limit=${limit}`;
        return await safeFetch(endpoint);
    },

    /**
     * GET /ai/rl-metrics - RL Metrics
     */
    getRLMetrics: async (): Promise<any> => {
        return await safeFetch('/ai/rl-metrics');
    },

    /**
     * GET /ai/regret - Regret Analysis
     */
    getRegret: async (): Promise<any> => {
        return await safeFetch('/ai/regret');
    },

    /**
     * GET /ai/xai - Explainable AI
     */
    getXAI: async (): Promise<any> => {
        return await safeFetch('/ai/xai');
    },

    /**
     * Detect Crop Stress (Mock)
     */
    detectCropStress: async (cropId: string, image: File): Promise<StressAnalysisResult> => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        return {
            stressLevel: 'HIGH',
            primaryStressor: 'Water Stress (Drought)',
            confidence: 0.89,
            recommendations: [
                'Increase irrigation frequency by 20%',
                'Apply mulch to retain soil moisture',
                'Monitor soil moisture levels daily'
            ],
            factors: [
                { name: 'Leaf Temperature', value: 0.8 },
                { name: 'Chlorophyll Content', value: 0.4 },
                { name: 'Soil Moisture', value: 0.2 }
            ]
        };
    },

    /**
     * Detect Crop Health (Mock)
     */
    detectCropHealth: async (cropId: string, image: File): Promise<any> => {
        return {
            issue: "Leaf Blight",
            confidence: 92,
            description: "Fungal infection detected.",
            recommendations: ["Apply fungicide", "Reduce watering"]
        };
    },

    getLearningInsights: async (...args: any[]): Promise<any> => {
        return [];
    },

    submitDecisionFeedback: async (...args: any[]): Promise<any> => {
        return { success: true };
    },

    getValveSchedule: async (...args: any[]): Promise<any> => {
        return [];
    },

    /**
     * Legacy support for Recommendations
     */
    getRecommendations: async (farmId: string): Promise<AIRecommendation[]> => {
        const data = await aiService.getDecision({ crop: 'rice', growth_stage: 'Vegetative' });
        const recommendations: AIRecommendation[] = [];

        if (data && data.final_decision_label) {
            recommendations.push({
                id: `rec-${Date.now()}`,
                farm_id: farmId,
                crop_id: 'active',
                action: data.final_decision_label,
                confidence: data.explanation?.confidence || 0.9,
                risk_level: 'Low',
                reasoning: data.reason || "AI processed conditions",
                status: 'PENDING',
                created_at: new Date().toISOString()
            });
        }
        return recommendations;
    }
};

// ============================================
// DETAILED ADVISORY AGENT
// ============================================

export const aiAdvisoryService = {
    getDetailedAdvisory: async (crop: string): Promise<CropAdvisory> => {
        const data = await aiService.getDecision({ crop });
        return {
            fertilizer: {
                recommended: !!data.fertilizer_advice?.recommended,
                productName: "Urea (Nitrogen)",
                type: "Mineral",
                nutrients: { N: "46%", P: "0%", K: "0%" },
                dosage: "50kg/ha",
                timing: "Immediate",
                method: "Broadcasting",
                status: data.fertilizer_advice?.recommended ? 'REQUIRED' : 'OPTIONAL'
            },
            pesticide: {
                detected: false,
                riskLevel: 'LOW',
                productName: "N/A",
                category: "N/A",
                target: "N/A",
                dosage: "N/A",
                safetyInterval: "N/A"
            },
            explainability: {
                reason: data.reason || "Conditions optimal",
                factors: data.explanation?.factors || [],
                confidence: 0.95
            }
        };
    },

    getYieldPrediction: async (crop: string): Promise<any> => {
        return await safeFetch('/yield/predict', {
            method: 'POST',
            body: JSON.stringify({ crop: crop.toLowerCase() })
        });
    },

    getResourceAnalytics: async (cropId: string): Promise<ResourceAnalytics> => {
        return await safeFetch(`/api/analytics/resources?crop_id=${cropId}`);
    }
};

// ============================================
// LEGACY HELPER FUNCTIONS (merged from old aiService.ts)
// ============================================

const API_BASE = "http://localhost:5000";

interface PredictionData {
    soil_moisture: number;
    temperature: number;
    humidity: number;
    rain_forecast: number;
}

interface PredictionResponse {
    ml_prediction: number;
    final_decision: number;
    explanation: any;
}

interface FeedbackData {
    state: string;
    final_decision: number;
    outcome: string;
}

export async function predictIrrigation(data: PredictionData): Promise<PredictionResponse> {
    const response = await fetch(`${API_BASE}/api/irrigationDecision`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Prediction request failed");
    }

    return await response.json();
}

export async function sendFeedback(data: FeedbackData) {
    const response = await fetch(`${API_BASE}/feedback`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Feedback request failed");
    }

    return await response.json();
}
