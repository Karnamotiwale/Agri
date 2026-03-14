// ============================================
// PESTICIDE SERVICE — Mock only, no backend
// ============================================

export interface PesticideRecommendationData {
    status: string; trigger?: string; disease?: string; pest?: string;
    risk_level?: string; reason?: string; pesticide?: string; type?: string;
    category?: string; dosage?: string; spray_interval?: string; safety_notes?: string;
    carbon_impact?: number; carbon_impact_label?: string; stage_advisory?: string;
    message?: string; recommendation?: string; humidity?: number; temperature?: number;
}

export interface PesticideHistoryEntry {
    id: string; crop_id: string; pesticide_name: string; type: string;
    dosage: string; applied_date: string; carbon_impact: number;
}

class PesticideService {
    async getPesticideRecommendation(
        crop: string, _disease?: string, _pest?: string, growthStage?: string,
        humidity?: number, temperature?: number, _soilMoisture?: number
    ): Promise<PesticideRecommendationData> {
        await new Promise(r => setTimeout(r, 300));
        const h = humidity || 63;
        const t = temperature || 29;
        if (h > 75 && t > 24) {
            return {
                status: 'recommendation', trigger: 'environmental_risk', risk_level: 'high',
                reason: `High humidity (${h}%) and temperature (${t}°C) create favorable conditions for fungal diseases`,
                pesticide: crop === 'rice' ? 'Copper Oxychloride' : 'Mancozeb', type: 'fungicide', category: 'preventive',
                dosage: crop === 'rice' ? '2.5 g/L' : '2.0 g/L', spray_interval: '10 days',
                safety_notes: 'Apply early morning or evening. Wear protective gear.',
                carbon_impact: 8.0, carbon_impact_label: '+8.0%',
                stage_advisory: growthStage ? `Current stage: ${growthStage}. Monitor closely.` : undefined,
                humidity: h, temperature: t,
            };
        }
        return { status: 'no_action', message: 'Conditions are favorable. No pesticide required.', recommendation: 'Continue regular monitoring', humidity: h, temperature: t };
    }

    async getPesticideHistory(cropId: string): Promise<PesticideHistoryEntry[]> {
        return [
            { id: '1', crop_id: cropId, pesticide_name: 'Tricyclazole', type: 'fungicide', dosage: '0.6 g/L', applied_date: new Date(Date.now() - 7 * 86400000).toISOString(), carbon_impact: 12.5 },
            { id: '2', crop_id: cropId, pesticide_name: 'Copper Oxychloride', type: 'fungicide', dosage: '2.5 g/L', applied_date: new Date(Date.now() - 18 * 86400000).toISOString(), carbon_impact: 8.0 },
            { id: '3', crop_id: cropId, pesticide_name: 'Bio-Pesticide (Neem)', type: 'bio-pesticide', dosage: '5 ml/L', applied_date: new Date(Date.now() - 28 * 86400000).toISOString(), carbon_impact: -3.0 },
        ];
    }
}

export const pesticideService = new PesticideService();
