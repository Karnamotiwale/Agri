export interface CropSensorReading {
    moisture: number;
    ph: number;
    n: number;
    p: number;
    k: number;
    npk: string;
}

export const getCropSensors = (cropId: string): CropSensorReading => {
    return { moisture: 60, ph: 6.5, n: 120, p: 40, k: 60, npk: '120-40-60' };
};

export const tickCropSensors = (cropId: string) => {
    return {
        moisture: 60 + Math.random() * 5,
        ph: 6.5 + Math.random() * 0.2,
        n: 120,
        p: 40,
        k: 60,
        npk: '120-40-60'
    };
};
