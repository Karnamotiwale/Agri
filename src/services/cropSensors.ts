import { getApiUrl } from './config';

export interface CropSensorReading {
    moisture: number;
    ph: number;
    n: number;
    p: number;
    k: number;
    npk: string;
}

export const getCropSensors = async (cropId: string): Promise<CropSensorReading> => {
    try {
        const url = getApiUrl(`/sensors?crop_id=${cropId}`);
        const response = await fetch(url);
        if (!response.ok) throw new Error(`API failed: ${response.status}`);
        return await response.json();
    } catch (err) {
        console.warn('Sensors fallback', err);
        return { moisture: 60, ph: 6.5, n: 120, p: 40, k: 60, npk: '120-40-60' };
    }
};

export const tickCropSensors = async (cropId: string): Promise<CropSensorReading> => {
    try {
        const url = getApiUrl(`/sensors/tick?crop_id=${cropId}`);
        const response = await fetch(url);
        if (!response.ok) throw new Error(`API failed: ${response.status}`);
        return await response.json();
    } catch (err) {
        return {
            moisture: 60 + Math.random() * 5,
            ph: 6.5 + Math.random() * 0.2,
            n: 120,
            p: 40,
            k: 60,
            npk: '120-40-60'
        };
    }
};
