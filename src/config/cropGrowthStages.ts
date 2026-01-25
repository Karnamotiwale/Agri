export interface GrowthStage {
    stage: string;
    dayStart: number;
    dayEnd: number;
    icon: string;
    description: string;
    tasks: string[];
    irrigation: string;
    fertilization?: string;
    pestWatch: string[];
    observations: string[];
}

export const CROP_GROWTH_STAGES: Record<string, GrowthStage[]> = {
    Maize: [
        {
            stage: 'Planting & Germination',
            dayStart: 0,
            dayEnd: 10,
            icon: '🌱',
            description: 'Seeds sprouting, first shoots emerging from soil',
            tasks: [
                'Ensure soil temperature is 10-12°C',
                'Apply pre-emergence herbicide',
                'Protect seedbed from birds and rodents'
            ],
            irrigation: 'Light irrigation every 2-3 days (20-25mm)',
            fertilization: 'Apply 25% of total nitrogen as basal dose',
            pestWatch: ['Cutworms', 'Wireworms', 'Birds'],
            observations: ['Shoot emergence (5-7 days)', 'First leaf unfolding']
        },
        {
            stage: 'Vegetative Growth',
            dayStart: 11,
            dayEnd: 50,
            icon: '🌿',
            description: 'Rapid leaf and stem development, building plant structure',
            tasks: [
                'First top-dressing of nitrogen (30-35 DAS)',
                'Inter-cultivation and earthing up',
                'Weed control (manual or herbicide)'
            ],
            irrigation: 'Regular irrigation every 5-7 days (40-50mm)',
            fertilization: 'Apply 50% nitrogen + full phosphorus and potassium',
            pestWatch: ['Fall Armyworm', 'Stem Borer', 'Aphids'],
            observations: ['6-8 leaves visible', 'Rapid height increase', 'Strong green color']
        },
        {
            stage: 'Tasseling & Silking',
            dayStart: 51,
            dayEnd: 75,
            icon: '🌾',
            description: 'Flowering stage - critical for pollination and ear formation',
            tasks: [
                'Second nitrogen top-dressing',
                'Ensure consistent soil moisture',
                'Monitor for pest damage on tassels'
            ],
            irrigation: 'Critical irrigation every 4-5 days (50-60mm)',
            fertilization: 'Apply remaining 25% nitrogen',
            pestWatch: ['Earworms', 'Aphids', 'Thrips'],
            observations: ['Tassel emergence', 'Silk appearance', 'Pollen shed']
        },
        {
            stage: 'Grain Filling',
            dayStart: 76,
            dayEnd: 110,
            icon: '🌽',
            description: 'Kernels developing and accumulating starch',
            tasks: [
                'Maintain adequate moisture',
                'Protect from birds and wild animals',
                'Monitor for late-season diseases'
            ],
            irrigation: 'Regular irrigation every 6-7 days (40-50mm)',
            pestWatch: ['Corn Borer', 'Birds', 'Rodents'],
            observations: ['Kernels visible on cob', 'Milk to dough stage', 'Cob weight increasing']
        },
        {
            stage: 'Maturity & Harvest',
            dayStart: 111,
            dayEnd: 140,
            icon: '🚜',
            description: 'Crop ready for harvest - physiological maturity reached',
            tasks: [
                'Test grain moisture (should be 20-25%)',
                'Prepare harvesting equipment',
                'Plan for immediate drying or storage'
            ],
            irrigation: 'Stop irrigation 10-15 days before harvest',
            pestWatch: ['Storage pests', 'Birds'],
            observations: ['Black layer at kernel base', 'Husks dry and brown', 'Kernels hard']
        }
    ],
    Wheat: [
        {
            stage: 'Germination',
            dayStart: 0,
            dayEnd: 7,
            icon: '🌱',
            description: 'Seeds sprouting, emergence of coleoptile',
            tasks: [
                'Ensure proper seed depth (4-5 cm)',
                'Light irrigation if dry',
                'Apply pre-emergence weedicide'
            ],
            irrigation: 'Light irrigation if rainfall insufficient',
            fertilization: 'Full phosphorus and potassium + 25% nitrogen',
            pestWatch: ['Termites', 'Wireworms'],
            observations: ['Seedling emergence in 5-7 days']
        },
        {
            stage: 'Tillering',
            dayStart: 8,
            dayEnd: 45,
            icon: '🌿',
            description: 'Multiple shoots developing from base',
            tasks: [
                'First irrigation at Crown Root Initiation (21 DAS)',
                'First nitrogen top-dressing',
                'Weed control'
            ],
            irrigation: 'First critical irrigation at 20-25 DAS',
            fertilization: 'Apply 50% nitrogen',
            pestWatch: ['Aphids', 'Termites'],
            observations: ['3-5 tillers per plant', 'Vigorous green growth']
        },
        {
            stage: 'Stem Extension & Heading',
            dayStart: 46,
            dayEnd: 85,
            icon: '🌾',
            description: 'Stems elongating, ear emergence',
            tasks: [
                'Second irrigation at jointing stage',
                'Final nitrogen application',
                'Monitor for rust diseases'
            ],
            irrigation: 'Second critical irrigation at flowering (60 DAS)',
            fertilization: 'Apply remaining 25% nitrogen',
            pestWatch: ['Rust', 'Aphids', 'Sawfly'],
            observations: ['Ear emergence', 'Flowering initiation']
        },
        {
            stage: 'Grain Filling',
            dayStart: 86,
            dayEnd: 120,
            icon: '🌽',
            description: 'Grains developing and filling with starch',
            tasks: [
                'Third irrigation at milk stage',
                'Protect from birds',
                'Monitor grain moisture'
            ],
            irrigation: 'Third irrigation at milk stage (80-85 DAS)',
            pestWatch: ['Birds', 'Rats', 'Aphids'],
            observations: ['Milky grain', 'Dough stage', 'Grain hardening']
        },
        {
            stage: 'Maturity & Harvest',
            dayStart: 121,
            dayEnd: 150,
            icon: '🚜',
            description: 'Physiological maturity reached, ready for harvest',
            tasks: [
                'Test grain moisture (12-14%)',
                'Harvest when grains are hard',
                'Plan threshing and storage'
            ],
            irrigation: 'Stop irrigation 10 days before harvest',
            pestWatch: ['Storage pests'],
            observations: ['Golden yellow color', 'Dry stems', 'Hard grains']
        }
    ],
    // Generic template for unknown crops
    Default: [
        {
            stage: 'Early Growth',
            dayStart: 0,
            dayEnd: 30,
            icon: '🌱',
            description: 'Initial growth phase',
            tasks: ['Ensure proper watering', 'Monitor for pests', 'Apply basal fertilizer'],
            irrigation: 'Regular light watering',
            pestWatch: ['General pests'],
            observations: ['Plant establishment']
        },
        {
            stage: 'Mid Growth',
            dayStart: 31,
            dayEnd: 90,
            icon: '🌿',
            description: 'Active vegetative growth',
            tasks: ['Top-dress fertilizer', 'Weed control', 'Pest monitoring'],
            irrigation: 'Regular irrigation based on soil moisture',
            pestWatch: ['Leaf-eating insects'],
            observations: ['Vigorous growth']
        },
        {
            stage: 'Maturity',
            dayStart: 91,
            dayEnd: 150,
            icon: '🌾',
            description: 'Approaching harvest',
            tasks: ['Prepare for harvest', 'Reduce irrigation'],
            irrigation: 'Reduce frequency',
            pestWatch: ['Birds', 'Rodents'],
            observations: ['Signs of maturity']
        }
    ]
};

// Helper function to get current stage
export function getCurrentStage(cropType: string, daysSincePlanting: number): GrowthStage | null {
    const stages = CROP_GROWTH_STAGES[cropType] || CROP_GROWTH_STAGES.Default;
    return stages.find(s => daysSincePlanting >= s.dayStart && daysSincePlanting <= s.dayEnd) || stages[stages.length - 1];
}

// Calculate progress percentage
export function getGrowthProgress(cropType: string, daysSincePlanting: number): number {
    const stages = CROP_GROWTH_STAGES[cropType] || CROP_GROWTH_STAGES.Default;
    const totalDays = stages[stages.length - 1].dayEnd;
    return Math.min(100, (daysSincePlanting / totalDays) * 100);
}
