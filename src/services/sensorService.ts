// ============================================
// SENSOR SERVICE — Bypass Flask, Connect Direct
// Fetches live IoT sensor data (soil + NPK)
// straight from Supabase PostgreSQL
// ============================================
import { supabase } from '../lib/supabase';

export interface SensorData {
  id: number;
  farm_id: string | null;
  soil_moisture: number | null;
  nitrogen: number | null;
  phosphorus: number | null;
  potassium: number | null;
  temperature: number | null;
  humidity: number | null;
  created_at: string;
}

/**
 * Fetch the latest sensor reading directly from Supabase.
 * Optionally filter by farm_id.
 */
export async function getLatestSensor(farmId?: string): Promise<SensorData | null> {
  try {
    let query = supabase
      .from("sensor_data")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1);

    if (farmId) {
      query = query.eq("farm_id", farmId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[SensorService] Supabase query error:', error);
      return null;
    }

    return data?.[0] as SensorData ?? null;
  } catch (err: any) {
    console.error('[SensorService] Failed to fetch sensor data:', err);
    return null;
  }
}

/**
 * Fetch recent sensor history directly from Supabase.
 */
export async function getSensorHistory(farmId?: string, limit = 20): Promise<SensorData[]> {
  try {
    let query = supabase
      .from("sensor_data")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (farmId) {
      query = query.eq("farm_id", farmId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[SensorService] Supabase history query error:', error);
      return [];
    }

    return data as SensorData[];
  } catch (err) {
    console.error('[SensorService] Failed to fetch sensor history:', err);
    return [];
  }
}
