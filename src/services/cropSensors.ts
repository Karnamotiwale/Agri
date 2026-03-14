// ============================================
// SENSOR SERVICE — Mock only, no backend
// Real endpoints (for future integration):
//   POST /api/v1/sensors/data           → (push sensor data)
//   GET  /api/v1/sensors/live/<farm_id> → getCropSensors(farmId)
// ============================================
import { getMockSensors, tickMockSensors, type SensorReading } from '../mock/mockSensors';

export type { SensorReading };

export interface CropSensorReading extends SensorReading {}

let _cache: Record<string, SensorReading> = {};

export const getCropSensors = async (cropId: string): Promise<CropSensorReading> => {
    const reading = getMockSensors(cropId);
    _cache[cropId] = reading;
    return reading;
};

export const tickCropSensors = async (cropId: string): Promise<CropSensorReading> => {
    const current = _cache[cropId] || getMockSensors(cropId);
    const next = tickMockSensors(current);
    _cache[cropId] = next;
    return next;
};
