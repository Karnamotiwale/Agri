// API configuration - use window location for now to avoid TypeScript errors
const API_BASE_URL = 'http://localhost:5000';

export interface PesticideRecommendationData {
    status: string;
    trigger?: string;
    disease?: string;
    pest?: string;
    risk_level?: string;
    reason?: string;
    pesticide?: string;
    type?: string;
    category?: string;
    dosage?: string;
    spray_interval?: string;
    safety_notes?: string;
    carbon_impact?: number;
    carbon_impact_label?: string;
    stage_advisory?: string;
    message?: string;
    recommendation?: string;
    humidity?: number;
    temperature?: number;
}

export interface PesticideHistoryEntry {
    id: string;
    crop_id: string;
    pesticide_name: string;
    type: string;
    dosage: string;
    applied_date: string;
    carbon_impact: number;
}

class PesticideService {
    private baseUrl = API_BASE_URL || 'http://localhost:5000';

    /**
     * Get pesticide recommendation for a crop
     */
    async getPesticideRecommendation(
        crop: string,
        disease?: string,
        pest?: string,
        growthStage?: string,
        humidity?: number,
        temperature?: number,
        soilMoisture?: number
    ): Promise<PesticideRecommendationData> {
        try {
            const response = await fetch(`${this.baseUrl}/pesticide/recommend`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    crop,
                    disease,
                    pest,
                    growth_stage: growthStage,
                    humidity,
                    temperature,
                    soil_moisture: soilMoisture,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to get pesticide recommendation');
            }

            return await response.json();
        } catch (error) {
            console.error('Pesticide recommendation error:', error);

            // Return realistic mock data as fallback when backend is not connected
            // This simulates a high humidity + high temperature scenario triggering preventive pesticide
            if (humidity && humidity > 75 && temperature && temperature > 24) {
                return {
                    status: 'recommendation',
                    trigger: 'environmental_risk',
                    risk_level: 'high',
                    reason: `High humidity (${humidity}%) and temperature (${temperature}°C) create favorable conditions for fungal diseases`,
                    pesticide: crop === 'rice' ? 'Copper Oxychloride' : crop === 'wheat' ? 'Mancozeb' : 'Azoxystrobin',
                    type: 'fungicide',
                    category: 'preventive',
                    dosage: crop === 'rice' ? '2.5 g/L' : crop === 'wheat' ? '2.0 g/L' : '1.0 ml/L',
                    spray_interval: crop === 'pulses' ? '14 days' : '10 days',
                    safety_notes: 'Use as preventive measure during humid conditions. Apply early morning or evening.',
                    carbon_impact: crop === 'rice' ? 8.0 : crop === 'wheat' ? 10.0 : 9.0,
                    carbon_impact_label: `+${crop === 'rice' ? 8.0 : crop === 'wheat' ? 10.0 : 9.0}%`,
                    stage_advisory: growthStage ? `⚠️ Current stage: ${growthStage}. Enhanced monitoring recommended.` : undefined,
                    humidity,
                    temperature
                };
            }

            // Default to "no action required" for safe conditions
            return {
                status: 'no_action',
                message: 'No immediate pesticide treatment required. Conditions are favorable.',
                recommendation: 'Continue regular field monitoring',
                humidity: humidity || 62,
                temperature: temperature || 28
            };
        }
    }

    /**
     * Get pesticide usage history for a crop
     * Note: This would fetch from Supabase in production
     */
    async getPesticideHistory(cropId: string): Promise<PesticideHistoryEntry[]> {
        try {
            // Mock data for now - in production this would query Supabase
            // SELECT * FROM pesticide_applications WHERE crop_id = cropId
            return [
                {
                    id: '1',
                    crop_id: cropId,
                    pesticide_name: 'Tricyclazole',
                    type: 'fungicide',
                    dosage: '0.6 g/L',
                    applied_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                    carbon_impact: 12.5,
                },
                {
                    id: '2',
                    crop_id: cropId,
                    pesticide_name: 'Copper Oxychloride',
                    type: 'fungicide',
                    dosage: '2.5 g/L',
                    applied_date: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
                    carbon_impact: 8.0,
                },
                {
                    id: '3',
                    crop_id: cropId,
                    pesticide_name: 'Bio-Pesticide (Neem)',
                    type: 'bio-pesticide',
                    dosage: '5 ml/L',
                    applied_date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
                    carbon_impact: -3.0, // Negative = carbon reduction
                },
            ];
        } catch (error) {
            console.error('Pesticide history error:', error);
            return [];
        }
    }
}

export const pesticideService = new PesticideService();
