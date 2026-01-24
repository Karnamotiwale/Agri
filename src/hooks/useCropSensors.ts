import { useState, useEffect } from 'react';
import { getCropSensors, tickCropSensors, type CropSensorReading } from '../services/cropSensors';

const INTERVAL_MS = 3000;

export function useCropSensors(cropId: string | undefined): CropSensorReading {
  const [reading, setReading] = useState<CropSensorReading>(() =>
    cropId ? getCropSensors(cropId) : { moisture: 0, ph: 0, n: 0, p: 0, k: 0, npk: '0-0-0' }
  );

  useEffect(() => {
    if (!cropId) return;
    setReading(getCropSensors(cropId));
    const t = setInterval(() => {
      setReading(tickCropSensors(cropId));
    }, INTERVAL_MS);
    return () => clearInterval(t);
  }, [cropId]);

  return reading;
}
