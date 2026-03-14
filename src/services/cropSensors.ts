// ============================================
// SENSOR SERVICE — Mock only, no backend
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
