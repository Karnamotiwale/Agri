// ============================================
// MOCK ANALYTICS DATA — No backend required
// ============================================

export function getMockAnalytics() {
    return {
        policy_state: {
            epsilon: 0.12,
            learning_rate: 0.1,
            discount_factor: 0.9,
            penalties: {
                over_irrigation: 1.5,
                under_irrigation: 1.5,
                rain_waste: 2.0,
            },
        },
        q_table: [],
        model_accuracy: 0.91,
        model_precision: 0.89,
        total_decisions: 320,
        system_status: 'online',
    };
}

export function getMockAnalyticsOverview() {
    return {
        summary: {
            soil_moisture: '62%',
            soil_moisture_value: 62,
            temperature: '29°C',
            temperature_value: 29,
            humidity: '63%',
            humidity_value: 63,
            nitrogen: '128 ppm',
            nitrogen_value: 128,
            phosphorus: '38 ppm',
            phosphorus_value: 38,
            potassium: '52 ppm',
            potassium_value: 52,
        },
        data_points: 320,
        period: 'Last 7 days',
        timestamp: new Date().toISOString(),
        source: 'Mock Data',
    };
}

export function getMockForecast(days = 7) {
    return {
        forecast: Array.from({ length: days }, (_, i) => ({
            date: new Date(Date.now() + i * 86400000).toISOString().split('T')[0],
            soil_moisture: +(58 + Math.random() * 15).toFixed(1),
            temperature: +(27 + Math.random() * 5).toFixed(1),
        })),
        horizon_days: days,
        status: 'simulated',
    };
}

export function getMockCropHealth() {
    return {
        crops: [
            { crop_id: 'c1', name: 'Rice', health_score: 87, status: 'Good' as const },
            { crop_id: 'c2', name: 'Wheat', health_score: 73, status: 'Attention' as const },
            { crop_id: 'c3', name: 'Maize', health_score: 91, status: 'Good' as const },
        ],
    };
}

export function getMockResourceAnalytics() {
    return {
        water: { efficiencyScore: 82, usage: '1200L' },
        fertilizer: { efficiencyScore: 76, usage: '50kg' },
        cost: { estimated: 14250, currency: 'INR' },
    };
}

export function getMockYieldPrediction() {
    return {
        summary: {
            yieldRange: '4.2–5.1 tons/ha',
            trend: 'Increasing',
            vsAverage: '+12%',
            predictions: [4.2, 4.5, 4.7, 4.9, 5.1],
            stability: 'High',
            confidence: 0.88,
        },
        predictions: [4.2, 4.5, 4.7, 4.9, 5.1],
    };
}
