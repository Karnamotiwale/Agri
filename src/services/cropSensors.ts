// ============================================
// SENSOR SERVICE — Mock only, no backend
// Real endpoints (for future integration):
//   POST /api/v1/sensors/data           → (push sensor data)
//   GET  /api/v1/sensors/live/<farm_id> → getCropSensors(farmId)
// ============================================
import { api } from './api';
import { getMockSensors, tickMockSensors, type SensorReading } from '../mock/mockSensors';

export type { SensorReading };
export interface CropSensorReading extends SensorReading {}

let _cache: Record<string, SensorReading> = {};

export const getCropSensors = async (cropId: string): Promise<CropSensorReading> => {
    try {
        const response = await api.get(`/api/v1/sensors/live/${cropId}`);
        if (response.data && response.data.length > 0) {
            const row = response.data[0];
            const reading: CropSensorReading = {
                moisture: row.moisture || 45,
                temperature: row.temperature || 28,
                humidity: row.humidity || 65,
                n: row.nitrogen || 120,
                p: row.phosphorus || 45,
                k: row.potassium || 180,
                npk: `${row.nitrogen || 120}-${row.phosphorus || 45}-${row.potassium || 180}`,
                ph: row.ph || 6.5
            };
            _cache[cropId] = reading;
            return reading;
        }
    } catch (error) {
        console.warn('Failed to fetch live sensors. Falling back to mock.', error);
    }
    
    // Fallback
    const reading = getMockSensors(cropId);
    _cache[cropId] = reading;
    return reading;
};

export const tickCropSensors = async (cropId: string): Promise<CropSensorReading> => {
    // For live tick, we could re-fetch. To avoid spam, we'll just mock simulated tick.
    const current = _cache[cropId] || await getCropSensors(cropId);
    const next = tickMockSensors(current);
    _cache[cropId] = next;
    return next;
};
