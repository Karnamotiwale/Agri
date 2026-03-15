// ============================================
// useSensors hook — polls live sensor data
// every 5 seconds from the Flask backend
// ============================================
import { useEffect, useState, useCallback } from 'react';
import { getLatestSensor, type SensorData } from '../services/sensorService';

interface UseSensorsResult {
  data: SensorData | null;
  loading: boolean;
  lastUpdated: Date | null;
  error: string | null;
}

/**
 * Polls /api/v1/sensors/latest every 5 seconds.
 * Pass farmId to scope reads to a specific farm.
 */
export function useSensors(farmId?: string): UseSensorsResult {
  const [data, setData] = useState<SensorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    const result = await getLatestSensor(farmId);
    if (result) {
      setData(result);
      setLastUpdated(new Date());
      setError(null);
    } else if (loading) {
      // Only set error if first load failed; keep stale data on refresh failures
      setError('No sensor data available yet');
    }
    setLoading(false);
  }, [farmId]);

  useEffect(() => {
    fetchData(); // immediate first load
    const interval = setInterval(fetchData, 5000); // refresh every 5 seconds
    return () => clearInterval(interval);
  }, [fetchData]);

  return { data, loading, lastUpdated, error };
}
