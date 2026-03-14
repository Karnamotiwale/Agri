// ============================================
// METRICS SERVICE — Mock only, no backend
// ============================================

export interface ModelMetrics { accuracy: number; precision: number; }

export async function fetchModelMetrics(): Promise<ModelMetrics> {
    return { accuracy: 0.91, precision: 0.89 };
}
