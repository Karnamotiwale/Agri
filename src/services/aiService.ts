// ============================================
// AI SERVICE — Mock only, no backend
// Real endpoints (for future integration):
//   POST /api/v1/ai/irrigation-decision  → aiService.getDecision()
//   GET  /api/v1/ai/status               → aiService.getStatus()
//   GET  /api/v1/ai/rl-metrics           → aiService.getRLMetrics()
//   GET  /api/v1/ai/xai                  → aiService.getXAI()
//   GET  /api/v1/ai/decision-log         → aiService.getDecisionLog()
//   GET  /api/v1/ai/regret               → aiService.getRegret()
//   POST /api/v1/ai/disease-advice       → aiAdvisoryService.getDetailedAdvisory()
//   POST /api/v1/ai/sustainability-advice→ (not yet wired)
//   POST /api/v1/crops/yield-prediction  → aiAdvisoryService.getYieldPrediction()
// ============================================
import {
    getMockDecision,
    getMockAIStatus,
    getMockRLMetrics,
    getMockXAI,
    getMockDecisionLog,
    getMockCropAIDetails,
} from '../mock/mockAI';
import { getMockResourceAnalytics, getMockYieldPrediction } from '../mock/mockAnalytics';

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
// MAIN AI SERVICE
// ============================================

export const aiService = {
    getDecision: async (params?: any): Promise<any> => {
        await _delay(300);
        return getMockDecision(params);
    },

    getStatus: async (): Promise<any> => {
        await _delay(200);
        return getMockAIStatus();
    },

    getDecisionLog: async (crop?: string, limit: number = 20): Promise<any[]> => {
        await _delay(200);
        return getMockDecisionLog(limit);
    },

    getRLMetrics: async (): Promise<any> => {
        await _delay(200);
        return getMockRLMetrics();
    },

    getRegret: async (): Promise<any> => {
        await _delay(200);
        return { regret: 0.03, episodes: 320 };
    },

    getXAI: async (): Promise<any> => {
        await _delay(200);
        return getMockXAI();
    },

    detectCropStress: async (_cropId: string, _image: File): Promise<StressAnalysisResult> => {
        await _delay(1500);
        return {
            stressLevel: 'MEDIUM',
            primaryStressor: 'Mild Water Stress',
            confidence: 0.87,
            recommendations: [
                'Increase irrigation by 15%',
                'Monitor soil moisture daily',
                'Apply mulch to retain moisture',
            ],
            factors: [
                { name: 'Leaf Moisture Index', value: 0.65 },
                { name: 'Temperature', value: 0.28 },
                { name: 'Soil Moisture', value: 0.35 },
            ],
        };
    },

    detectCropHealth: async (_cropId: string, _image: File): Promise<any> => {
        await _delay(1500);
        return {
            status: 'healthy',
            issue: 'Healthy Crop',
            confidence: 0.94,
            solution: 'Continue current irrigation schedule',
            prevention: 'Maintain regular monitoring and standard care practices.',
        };
    },

    getLearningInsights: async (..._args: any[]): Promise<any> => {
        return [];
    },

    submitDecisionFeedback: async (..._args: any[]): Promise<any> => {
        return { success: true };
    },

    getValveSchedule: async (..._args: any[]): Promise<any> => {
        return [
            { valve: 'Valve 1', time: '06:00 AM', duration: '30 min', zone: 'Zone A' },
            { valve: 'Valve 2', time: '07:00 AM', duration: '25 min', zone: 'Zone B' },
        ];
    },

    getRecommendations: async (farmId: string): Promise<AIRecommendation[]> => {
        await _delay(300);
        return [
            {
                id: `rec-${Date.now()}`,
                farm_id: farmId,
                crop_id: 'active',
                action: 'IRRIGATE',
                confidence: 0.91,
                risk_level: 'Low',
                reasoning: 'Soil moisture below threshold. Irrigation recommended.',
                status: 'PENDING',
                created_at: new Date().toISOString(),
            },
        ];
    },
};

// ============================================
// ADVISORY AGENT
// ============================================

export const aiAdvisoryService = {
    getDetailedAdvisory: async (crop: string): Promise<CropAdvisory> => {
        await _delay(300);
        return {
            fertilizer: {
                recommended: true,
                productName: 'Urea (Nitrogen)',
                type: 'Mineral',
                nutrients: { N: '46%', P: '0%', K: '0%' },
                dosage: '50 kg/ha',
                timing: 'Immediate',
                method: 'Broadcasting',
                status: 'REQUIRED',
            },
            pesticide: {
                detected: false,
                riskLevel: 'LOW',
                productName: 'N/A',
                category: 'N/A',
                target: 'N/A',
                dosage: 'N/A',
                safetyInterval: 'N/A',
            },
            explainability: {
                reason: `Conditions optimal for ${crop} crop`,
                factors: ['Low moisture', 'High temperature', 'No rain forecast'],
                confidence: 0.91,
            },
        };
    },

    getYieldPrediction: async (_crop: string): Promise<any> => {
        await _delay(300);
        return getMockYieldPrediction();
    },

    getResourceAnalytics: async (_cropId: string): Promise<ResourceAnalytics> => {
        await _delay(300);
        return getMockResourceAnalytics();
    },
};

// ============================================
// LEGACY HELPERS (preserved for compatibility)
// ============================================

export async function predictIrrigation(_data: any): Promise<any> {
    await _delay(300);
    return getMockCropAIDetails();
}

export async function sendFeedback(_data: any): Promise<any> {
    return { success: true };
}

// Simulated async delay
function _delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
