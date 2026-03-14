// ============================================
// CROP SERVICE — Mock only, no Supabase / backend
// ============================================
import type { Crop } from '../context/AppContext';
import { getMockYieldPrediction } from '../mock/mockAnalytics';

const _crops: Crop[] = [
    {
        id: 'c1',
        name: 'Rice',
        image: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?q=80&w=400',
        location: 'Block A – North',
        landArea: '1.5 Hectares',
        landSize: '1.5 Hectares',
        sowingDate: '2024-06-15',
        sowingPeriod: 'Jun – Nov',
        currentStage: 'Vegetative',
        stageDate: 'Day 45',
        stages: [],
        farmId: 'f1',
        seedsPlanted: '15000',
        cropType: 'Rice',
    },
    {
        id: 'c2',
        name: 'Wheat',
        image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=400',
        location: 'Block A – South',
        landArea: '2.0 Hectares',
        landSize: '2.0 Hectares',
        sowingDate: '2024-11-01',
        sowingPeriod: 'Nov – Apr',
        currentStage: 'Tillering',
        stageDate: 'Day 30',
        stages: [],
        farmId: 'f1',
        seedsPlanted: '12000',
        cropType: 'Wheat',
    },
    {
        id: 'c3',
        name: 'Maize',
        image: 'https://images.unsplash.com/photo-1601593346740-925612772716?q=80&w=400',
        location: 'Block B',
        landArea: '1.2 Hectares',
        landSize: '1.2 Hectares',
        sowingDate: '2024-07-01',
        sowingPeriod: 'Jul – Oct',
        currentStage: 'Tasselling',
        stageDate: 'Day 65',
        stages: [],
        farmId: 'f2',
        seedsPlanted: '8000',
        cropType: 'Maize',
    },
];

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

    getAllCrops: async (): Promise<Crop[]> => [..._crops],

    getCropsByFarm: async (farmId: string): Promise<Crop[]> =>
        _crops.filter(c => c.farmId === farmId),

    createCrop: async (crop: Crop, farmId: string, _imageFile?: File): Promise<Crop> => {
        const newCrop = { ...crop, id: `c${_crops.length + 1}`, farmId };
        _crops.push(newCrop);
        return newCrop;
    },

    updateCrop: async (cropId: string, updates: Partial<Crop>): Promise<Crop> => {
        const idx = _crops.findIndex(c => c.id === cropId);
        if (idx >= 0) _crops[idx] = { ..._crops[idx], ...updates };
        return _crops[idx];
    },

    deleteCrop: async (cropId: string): Promise<void> => {
        const idx = _crops.findIndex(c => c.id === cropId);
        if (idx >= 0) _crops.splice(idx, 1);
    },

    generateMockJourneyData,

    getCropJourney: async (_cropId: string): Promise<any[]> =>
        generateMockJourneyData(30),

    getGrowthStages: async (_cropId: string, _daysSinceSowing = 0): Promise<any> => ({
        current_stage: 'Vegetative',
        days_in_stage: 15,
        next_stage: 'Reproductive',
        days_to_next: 20,
    }),

    getRotationRecommendation: async (_cropId: string): Promise<any> => ({
        status: 'success',
        recommended_crop: 'Pulses',
        confidence: 'high',
        reason: 'Legumes replenish nitrogen depleted by cereal crops.',
        rotation_recommendation: {
            recommended_crop: 'Pulses (Green Gram)',
            reason: 'Restores soil nitrogen and breaks pest cycles.',
            benefits: ['Nitrogen fixation', 'Pest cycle break', 'Soil health restoration'],
        },
    }),

    getYieldPrediction: async (_cropId: string): Promise<any> => getMockYieldPrediction(),
};
