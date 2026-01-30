import { useState, useEffect } from 'react';
import { getCropSensors, tickCropSensors, type CropSensorReading } from '../services/cropSensors';

const INTERVAL_MS = 3000;

export function useCropSensors(cropId: string | undefined): CropSensorReading {
  const [reading, setReading] = useState<CropSensorReading>({ moisture: 0, ph: 0, n: 0, p: 0, k: 0, npk: '0-0-0' });

  useEffect(() => {
    if (!cropId) return;

    const load = async () => {
      const initial = await getCropSensors(cropId);
      setReading(initial);
    };

    load();

    const t = setInterval(async () => {
      const next = await tickCropSensors(cropId);
      setReading(next);
    }, INTERVAL_MS);

    return () => clearInterval(t);
  }, [cropId]);

  return reading;
}
