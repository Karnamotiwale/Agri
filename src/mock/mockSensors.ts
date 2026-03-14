// ============================================
// MOCK SENSOR DATA — No backend required
// ============================================

export interface SensorReading {
    moisture: number;
    ph: number;
    n: number;
    p: number;
    k: number;
    npk: string;
    temperature: number;
    humidity: number;
}

/** Return a stable base reading (used on first load) */
export function getMockSensors(cropId?: string): SensorReading {
    // Seed variation per crop so each crop shows slightly different data
    const seed = cropId ? cropId.charCodeAt(0) % 10 : 0;
    return {
        moisture: 58 + seed,
        ph: 6.2 + seed * 0.05,
        n: 128 + seed * 2,
        p: 38 + seed,
        k: 52 + seed,
        npk: `${128 + seed * 2}-${38 + seed}-${52 + seed}`,
        temperature: 29 + seed * 0.3,
        humidity: 62 + seed,
    };
}

/** Return a slightly fluctuating reading for live polling */
export function tickMockSensors(current: SensorReading): SensorReading {
    const r = (range: number) => (Math.random() - 0.5) * 2 * range;
    const n = Math.round(current.n + r(3));
    const p = Math.round(current.p + r(2));
    const k = Math.round(current.k + r(2));
    return {
        moisture: +(current.moisture + r(1.5)).toFixed(2),
        ph: +(current.ph + r(0.05)).toFixed(2),
        n,
        p,
        k,
        npk: `${n}-${p}-${k}`,
        temperature: +(current.temperature + r(0.4)).toFixed(1),
        humidity: +(current.humidity + r(1.5)).toFixed(1),
    };
}
