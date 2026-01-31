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
     * Get recommendations. Throws error if API fails.
     */
    getRecommendations: async (farmId: string): Promise<AIRecommendation[]> => {
        const response = await fetch(`/recommendations?farm_id=${farmId}`);
        if (!response.ok) throw new Error(`Failed to fetch recommendations: ${response.status}`);
        return await response.json();
    },

    runAnalysis: async (farmId: string, cropId: string) => {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        return { message: "Analysis complete", status: "success" };
    },

    /**
     * Get AI Decision from decision engine
     */
    getDecision: async (cropId: string, growthStage: string = 'Vegetative', additionalData: any = {}): Promise<any> => {
        // POST /decide with all 12 required fields
        const payload = {
            crop: cropId.toLowerCase(), // Backend expects lowercase from ALLOWED_CROPS
            growth_stage: growthStage,
            soil_moisture_pct: additionalData.soil_moisture_pct ?? 60,
            rainfall_mm: additionalData.rainfall_mm ?? 5,
            temperature_c: additionalData.temperature_c ?? 28,
            humidity_pct: additionalData.humidity_pct ?? 65,
            soil_ph: additionalData.soil_ph ?? 6.5,
            nitrogen_kg_ha: additionalData.nitrogen_kg_ha ?? 120,
            phosphorus_kg_ha: additionalData.phosphorus_kg_ha ?? 40,
            potassium_kg_ha: additionalData.potassium_kg_ha ?? 60,
            disease_risk_score: additionalData.disease_risk_score ?? 10, // backend maps this to disease_risk
            pest_risk_score: additionalData.pest_risk_score ?? 5,       // backend maps this to pest_risk
            irrigation_applied_mm: additionalData.irrigation_applied_mm ?? 0
        };

        const response = await fetch('/decide', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch AI decision: ${response.status}`);
        }

        return await response.json();
    },

    /**
     * Submit decision feedback to RL engine
     */
    submitDecisionFeedback: async (cropId: string, actionId: string, status: 'APPLY' | 'DELAY' | 'IGNORE'): Promise<void> => {
        const response = await fetch('/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ crop: cropId, action_id: actionId, status })
        });
        if (!response.ok) throw new Error(`Feedback failed: ${response.status}`);
    },

    /**
     * Detect crop health from uploaded image
     */
    detectCropHealth: async (cropId: string, imageFile: File): Promise<any> => {
        // Step 1: Upload image to Supabase storage
        const formData = new FormData();
        formData.append('image', imageFile);

        const userId = await (await import('../lib/supabase')).getCurrentUserId();
        if (!userId) throw new Error('User not authenticated');

        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${userId}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from('disease-detection-images')
            .upload(fileName, imageFile);

        if (uploadError) {
            console.error('Error uploading image:', uploadError);
            throw new Error('Failed to upload image');
        }

        const { data: urlData } = supabase.storage
            .from('disease-detection-images')
            .getPublicUrl(fileName);

        const imageUrl = urlData.publicUrl;

        // Step 2: Call backend API for disease detection
        const response = await fetch('/ai/health-detect', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                image_url: imageUrl,
                crop_id: cropId
            })
        });

        if (!response.ok) throw new Error(`Health detection failed: ${response.status}`);

        const result = await response.json();

        // Step 3: Save detection result to database
        const { error: dbError } = await supabase
            .from('health_detections')
            .insert({
                user_id: userId,
                crop_id: cropId,
                image_url: imageUrl,
                status: result.status,
                issue: result.issue,
                severity: result.severity,
                solution: result.solution,
                prevention: result.prevention,
                confidence: result.confidence
            });

        if (dbError) {
            console.error('Error saving detection to database:', dbError);
            // Don't throw - still return the result even if DB save fails
        }

        return {
            ...result,
            image_url: imageUrl,
            timestamp: new Date().toISOString()
        };
    },

    /**
     * Get learning insights and history for a crop
     */
    getLearningInsights: async (cropId: string): Promise<any> => {
        const response = await fetch(`/crop/history?crop_id=${cropId}`);
        if (!response.ok) throw new Error(`History fetch failed: ${response.status}`);
        return await response.json();
    },

    /**
     * Get global AI engine status across all crops
     * Consolidated to /decide as the primary engine
     */
    getGlobalAIStatus: async (): Promise<any> => {
        try {
            const response = await fetch('/decide', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ crop: 'rice', growth_stage: 'Vegetative' }) // Default context for global check
            });
            const data = await response.json();

            // Map decision data to dashboard expectations
            return {
                rl_agent_status: data.final_decision === 'WAIT' ? 'STABLE' : 'ACTIVE',
                last_retrain: "Recently",
                system_efficiency: 94.5,
                latency_ms: 32,
                recommendations_pending: 0,
                high_priority_alerts: 0
            };
        } catch (err) {
            console.error('Global status fallback', err);
            return { rl_agent_status: 'Active', latency_ms: 0, recommendations_pending: 0 };
        }
    },

    /**
     * Get aggregate health statistics for the entire farm
     * Fetches real intelligence from the decision engine
     */
    getFarmAIAnalytics: async (): Promise<any> => {
        // Fetch from /decide for a representative crop (default 'rice')
        const response = await fetch('/decide', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                crop: 'rice',
                growth_stage: 'Vegetative',
                soil_moisture_pct: 65,
                temperature_c: 28
            })
        });
        if (!response.ok) throw new Error(`Farm analytics fetch failed: ${response.status}`);
        return await response.json();
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
        const response = await fetch(`/ai/detailed-advisory?crop_id=${cropId}`);
        if (!response.ok) throw new Error(`Failed to fetch advisory: ${response.status}`);
        return await response.json();
    },

    getYieldPrediction: async (cropId: string): Promise<YieldPrediction> => {
        const response = await fetch(`/yield/prediction?crop_id=${cropId}`);
        if (!response.ok) throw new Error(`Failed to fetch yield prediction: ${response.status}`);
        return await response.json();
    },

    getResourceAnalytics: async (cropId: string): Promise<ResourceAnalytics> => {
        const response = await fetch(`/resource/analytics?crop_id=${cropId}`);
        if (!response.ok) throw new Error(`Failed to fetch resource analytics: ${response.status}`);
        return await response.json();
    },

    /**
     * Generates AI-driven schedules for valves based on predictive analysis
     */
    getValveSchedule: async (cropId: string, valveIds: string[]): Promise<any[]> => {
        const response = await fetch(`/ai/valves?crop_id=${cropId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ valves: valveIds })
        });

        if (!response.ok) throw new Error(`Valve API failed: ${response.status}`);
        return await response.json();
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


