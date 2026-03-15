import { api } from './api';
import type { Crop } from '../context/AppContext';
import { getMockYieldPrediction } from '../mock/mockAnalytics';



/** Shared Journey data generator (preserved for UI compatibility) */
function generateMockJourneyData(days = 30): any[] {
    const data = [];
    const now = new Date();
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const moisture = 45 + Math.sin(i / 3) * 15 + (Math.random() - 0.5) * 10;
        const temp = 28 + Math.sin(i / 5) * 4 + (Math.random() - 0.5) * 3;
        const humidity = 70 + Math.cos(i / 4) * 15 + (Math.random() - 0.5) * 8;
        const n = Math.max(80, 150 - i * 1.5 + (Math.random() - 0.5) * 10);
        const p = Math.max(60, 120 - i * 1.2 + (Math.random() - 0.5) * 8);
        const k = Math.max(70, 140 - i * 1.3 + (Math.random() - 0.5) * 9);
        data.push({
            created_at: date.toISOString(),
            soil_moisture: +moisture.toFixed(1), soil_moisture_pct: +moisture.toFixed(1),
            temperature: +temp.toFixed(1), temperature_c: +temp.toFixed(1),
            humidity: +humidity.toFixed(0), humidity_pct: +humidity.toFixed(0),
            rainfall: Math.random() > 0.7 ? +(Math.random() * 15).toFixed(1) : +(Math.random() * 2).toFixed(1),
            nitrogen: +n.toFixed(1), phosphorus: +p.toFixed(1), potassium: +k.toFixed(1),
            ph: +(6.5 + (Math.random() - 0.5) * 0.6).toFixed(1),
            irrigation_active: moisture < 50 && Math.random() > 0.5,
            data: { soil_moisture_pct: +moisture.toFixed(1), temperature_c: +temp.toFixed(1), humidity_pct: +humidity.toFixed(0) },
        });
    }
    return data;
}

export const cropService = {
    uploadCropImage: async (_file: File): Promise<string | null> =>
        'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?q=80&w=400',

    uploadDiseaseDetectionImage: async (_file: File): Promise<string | null> => null,

    getAllCrops: async (): Promise<Crop[]> => {
        const response = await api.get('/api/v1/crops');
        return response.data.map((row: any) => ({
            id: row.id,
            name: row.crop_name,
            image: row.image_url || 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?q=80&w=400',
            location: 'Farm Block',
            landArea: '0 Hectares',
            landSize: '0 Hectares',
            sowingDate: row.sowing_date,
            sowingPeriod: '',
            currentStage: 'Vegetative',
            stageDate: 'Day 1',
            stages: [],
            farmId: row.farm_id,
            seedsPlanted: row.seeds_planted || '0',
            cropType: row.crop_type || row.crop_name,
            harvestDate: '',
            cropClass: '',
            cropVariety: '',
            soilType: 'Unknown',
            devices: []
        }));
    },

    getCropsByFarm: async (farmId: string): Promise<Crop[]> => {
        const response = await api.get(`/api/v1/crops?farm_id=${farmId}`);
        return response.data.map((row: any) => ({
            id: row.id,
            name: row.crop_name,
            image: row.image_url || 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?q=80&w=400',
            location: 'Farm Block',
            landArea: '0 Hectares',
            landSize: '0 Hectares',
            sowingDate: row.sowing_date,
            sowingPeriod: '',
            currentStage: 'Vegetative',
            stageDate: 'Day 1',
            stages: [],
            farmId: row.farm_id,
            seedsPlanted: row.seeds_planted || '0',
            cropType: row.crop_type || row.crop_name,
            harvestDate: '',
            cropClass: '',
            cropVariety: '',
            soilType: 'Unknown',
            devices: []
        }));
    },

    createCrop: async (crop: Crop, farmId: string, _imageFile?: File): Promise<Crop> => {
        const payload = {
            farmId: farmId,
            name: crop.name,
            cropType: crop.cropType,
            sowingDate: crop.sowingDate,
            seedsPlanted: parseInt(crop.seedsPlanted) || 0,
            image: crop.image
        };
        const response = await api.post('/api/v1/crops', payload);
        const row = response.data;
        return {
            ...crop,
            id: row.id,
            farmId: row.farm_id,
        };
    },

    updateCrop: async (_cropId: string, _updates: Partial<Crop>): Promise<Crop> => {
        throw new Error("updateCrop not implemented on backend");
    },

    deleteCrop: async (_cropId: string): Promise<void> => {
        throw new Error("deleteCrop not implemented on backend");
    },

    generateMockJourneyData,

    getCropJourney: async (_cropId: string): Promise<any[]> =>
        generateMockJourneyData(30),

    getYieldPrediction: async (_cropId: string): Promise<any> => ({
        estimatedYield: '4.2 Tons/Hectare',
        confidence: 88,
        harvestWindow: 'Oct 15 - Oct 25',
        trend: 'up'
    }),

    getRotationRecommendation: async (_cropId: string): Promise<any> => ({
        recommendedCrop: 'Soybean',
        reason: 'Restores Nitrogen levels after Rice cultivation.',
        benefits: ['Natural Nitrogen Fixation', 'Market Demand', 'Pest Cycle Break']
    }),

    toggleValve: async (valveId: string, status: boolean): Promise<boolean> => {
        // Simulate ESP32 HTTP Request
        console.log(`Sending HTTP command to ESP32: Valve ${valveId} -> ${status ? 'ON' : 'OFF'}`);
        await new Promise(r => setTimeout(r, 800));
        return true;
    },

    getGrowthStages: async (_cropId: string): Promise<any[]> => [
        { id: 1, name: 'Sowing', days: '1-10', status: 'completed', description: 'Seed germination and emergence.' },
        { id: 2, name: 'Vegetative', days: '11-45', status: 'current', description: 'Active leaf and stem growth.' },
        { id: 3, name: 'Flowering', days: '46-70', status: 'upcoming', description: 'Development of reproductive organs.' },
        { id: 4, name: 'Filling', days: '71-95', status: 'upcoming', description: 'Grain or fruit development.' },
        { id: 5, name: 'Maturity', days: '96-120', status: 'upcoming', description: 'Final ripening and drying.' }
    ],

    getOrganicRecommendations: async (_cropId: string): Promise<any> => ({
        fertilizer: {
            name: 'Vermicompost & Seaweed Extract',
            details: 'Rich in micronutrients and growth hormones. Apply 2-3 kg/sq meter during vegetative phase.'
        },
        pestControl: {
            name: 'Neem Oil & Dashparni Ark',
            details: 'Effective against aphids, whiteflies, and fungal infections. Mix 5ml in 1L water and spray bi-weekly.'
        }
    })
};
