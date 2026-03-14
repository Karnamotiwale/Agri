// ============================================
// MOCK AI DATA — No backend required
// ============================================

export function getMockDecision(params?: { crop?: string }) {
    const crop = params?.crop || 'rice';
    return {
        final_decision: 1,
        final_decision_label: 'IRRIGATE',
        crop,
        reason: 'Soil moisture dropped below 60%. Temperature is high. Irrigation recommended to prevent crop stress.',
        confidence: 0.91,
        crop_stress: 'Medium' as 'Low' | 'Medium' | 'High',
        ml_prediction: 1,
        explanation: {
            factors: [
                { name: 'Soil Moisture', value: 0.58 },
                { name: 'Temperature', value: 0.29 },
                { name: 'Rainfall Forecast', value: 0.05 },
            ],
            confidence: 0.91,
        },
        irrigation_plan: {
            volume: '1200L',
            duration: '35 min',
            recommended_time: '6:00 AM',
        },
        fertilizer_advice: {
            recommended: true,
            type: 'Urea (Nitrogen)',
            dosage: '50 kg/ha',
        },
        q_values: {
            IRRIGATE: 0.91,
            WAIT: 0.42,
            FERTILIZE: 0.33,
        },
        state: {
            moisture: 'LOW',
            temp: 'HIGH',
            humidity: 'NORMAL',
            rain_forecast: 'NONE',
        },
    };
}

export function getMockAIStatus() {
    return {
        status: 'online',
        model: 'XGBoost + RL',
        model_availability: '100%',
        accuracy: 0.91,
        learning: 'active',
        db_connectivity: 'Healthy',
        data_freshness: '5 min ago',
    };
}

export function getMockRLMetrics() {
    return {
        efficiency_trend: 'IMPROVING',
        positive_rewards: 147,
        avg_regret: 0.03,
        episodes: 320,
        epsilon: 0.12,
        learning_rate: 0.1,
        discount_factor: 0.9,
    };
}

export function getMockXAI() {
    return {
        reason: 'Soil moisture is below threshold. Combined with elevated temperature and no rain forecast, the model recommends immediate irrigation to prevent crop stress.',
        influencing_parameters: [
            { name: 'Soil Moisture', contribution: 0.62 },
            { name: 'Temperature', contribution: 0.21 },
            { name: 'Rainfall Forecast', contribution: 0.10 },
            { name: 'Crop Stage', contribution: 0.07 },
        ],
    };
}

export function getMockDecisionLog(limit = 10) {
    const actions = ['IRRIGATE', 'WAIT', 'FERTILIZE'];
    return Array.from({ length: limit }, (_, i) => ({
        id: `log-${i + 1}`,
        crop: 'rice',
        action: actions[i % 3],
        confidence: +(0.85 + Math.random() * 0.1).toFixed(2),
        outcome: i % 4 === 0 ? 'REJECTED' : 'APPROVED',
        created_at: new Date(Date.now() - i * 4 * 3600 * 1000).toISOString(),
        reason: 'Low moisture conditions',
    }));
}

export function getMockCropAIDetails() {
    return {
        final_decision: 1,
        crop_stress: 'Medium' as 'Low' | 'Medium' | 'High',
        ml_prediction: 1,
        confidence: 0.88,
        explanation: {
            factors: [{ name: 'Moisture', value: 0.6 }],
            confidence: 0.88,
        },
    };
}

export function getMockDiseaseDetection() {
    return {
        disease: 'Healthy',
        confidence: 0.94,
        status: 'clear',
        note: 'No disease detected. Crop appears healthy.',
    };
}
