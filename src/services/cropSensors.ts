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
        console.warn('Sensors fetch failed', err);
        return { moisture: 0, ph: 0, n: 0, p: 0, k: 0, npk: '0-0-0' };
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
            moisture: 0,
            ph: 0,
            n: 0,
            p: 0,
            k: 0,
            npk: '0-0-0'
        };
    }
};
