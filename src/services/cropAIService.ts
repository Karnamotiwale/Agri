// API Base URL
const API_BASE = 'http://localhost:5000';

export interface CropDetailsRequest {
    soil_moisture: number;
    temperature: number;
    humidity: number;
    rain_forecast: number;
    crop?: string;
}

export interface CropDetailsResponse {
    final_decision: number;
    explanation: any;
    crop_stress: 'Low' | 'Medium' | 'High';
    ml_prediction: number;
    confidence: number;
}

export interface DiseaseDetectionResponse {
    disease: string;
    confidence: number;
    status: string;
    note?: string;
}

/**
 * Fetch unified crop AI details including:
 * - Irrigation decision
 * - Crop stress level
 * - AI explanation
 */
export async function fetchCropDetails(data: CropDetailsRequest): Promise<CropDetailsResponse> {
    const res = await fetch(`${API_BASE}/crop-details`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        throw new Error('Failed to fetch crop details');
    }

    return await res.json();
}

/**
 * Detect disease from crop image
 */
export async function detectDisease(file: File): Promise<DiseaseDetectionResponse> {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(`${API_BASE}/detect-disease`, {
        method: 'POST',
        body: formData,
    });

    if (!res.ok) {
        throw new Error('Disease detection failed');
    }

    return await res.json();
}
