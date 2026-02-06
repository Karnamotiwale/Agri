import { getApiUrl } from './config';

const API_BASE = getApiUrl('');

export interface DiseaseResult {
    disease: string;
    confidence: number;
}

export async function detectCropDisease(file: File): Promise<DiseaseResult> {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(`${API_BASE}/cropnet-detect`, {
        method: "POST",
        body: formData,
    });

    if (!res.ok) {
        throw new Error("Disease detection failed");
    }

    return await res.json();
}
