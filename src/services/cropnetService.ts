// ============================================
// CROPNET DISEASE DETECTION — Mock only
// ============================================

export interface DiseaseResult {
    disease: string;
    confidence: number;
}

export async function detectCropDisease(_file: File): Promise<DiseaseResult> {
    await new Promise(r => setTimeout(r, 1500));
    return { disease: 'Healthy', confidence: 0.94 };
}
