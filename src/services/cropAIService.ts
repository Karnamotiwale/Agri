// ============================================
// CROP AI SERVICE — Mock only, no backend
// ============================================
import { getMockCropAIDetails, getMockDiseaseDetection } from '../mock/mockAI';

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

export async function fetchCropDetails(_data: CropDetailsRequest): Promise<CropDetailsResponse> {
    await new Promise((r) => setTimeout(r, 400));
    return getMockCropAIDetails() as CropDetailsResponse;
}

export async function detectDisease(_file: File): Promise<DiseaseDetectionResponse> {
    await new Promise((r) => setTimeout(r, 1500));
    return getMockDiseaseDetection();
}
