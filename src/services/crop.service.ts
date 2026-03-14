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
        harvestDate: '2024-11-20',
        cropClass: 'Cereal',
        cropVariety: 'Basmati',
        soilType: 'Loamy',
        devices: ['Soil Moisture S1', 'NPK Pro v2']
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
        harvestDate: '2025-04-15',
        cropClass: 'Cereal',
        cropVariety: 'Sharbati',
        soilType: 'Clay',
        devices: ['Soil Moisture S2', 'Temp Node A1']
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
        harvestDate: '2024-10-15',
        cropClass: 'Cereal',
        cropVariety: 'Sweet Corn',
        soilType: 'Sandy Loam',
        devices: ['Moisture Hub B1']
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
    ]
};
