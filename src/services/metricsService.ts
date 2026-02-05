import { getApiUrl } from './config';

const API_BASE = getApiUrl('');

export interface ModelMetrics {
    accuracy: number;
    precision: number;
}

export async function fetchModelMetrics(): Promise<ModelMetrics> {
    const res = await fetch(`${API_BASE}/model-metrics`);
    if (!res.ok) {
        throw new Error("Failed to fetch metrics");
    }
    return await res.json();
}
