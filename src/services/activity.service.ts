// ============================================
// ACTIVITY SERVICE — Real-time backend connection
// Supabase is the single source of truth for all farm activities
// ============================================

export interface ActivityLog {
  id: string;
  field_id: string | null;
  activity_type: string;
  growth_stage: string;
  operation: string;
  objective: string;
  water_source: string | null;
  method: string;
  weather_condition: string;
  notes: string | null;
  crop_name: string | null;
  farm_name: string | null;
  created_at: string;
  performed_by?: string;
}

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const activityService = {
  /**
   * Fetch the latest activities.
   * If fieldId is provided → filter by that farm.
   * If null/empty → fetch all activities (global view).
   */
  getLogsByField: async (fieldId?: string | null): Promise<ActivityLog[]> => {
    try {
      const url = fieldId
        ? `${BASE_URL}/api/v1/activities/${fieldId}`
        : `${BASE_URL}/api/v1/activities`;

      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      if (!Array.isArray(data)) return [];
      return data;
    } catch (error) {
      console.error('[ActivityService] Error fetching activities:', error);
      return [];
    }
  },

  /**
   * Log an irrigation event — writes to irrigation_logs + field_activities
   */
  logIrrigation: async (payload: {
    field_id?: string | null;
    farm_name?: string;
    crop_name?: string;
    valve_id?: string;
    duration_minutes?: number;
    water_volume?: number;
    moisture_before?: number;
    moisture_after?: number;
    growth_stage?: string;
    operation?: string;
    objective?: string;
    method?: string;
    water_source?: string;
    weather_condition?: string;
    notes?: string;
  }): Promise<boolean> => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/irrigation/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return response.ok;
    } catch {
      return false;
    }
  },

  /**
   * Log a fertilization event — writes to fertilization_logs + field_activities
   */
  logFertilization: async (payload: {
    field_id?: string | null;
    farm_name?: string;
    crop_name?: string;
    fertilizer_type?: string;
    npk_ratio?: string;
    quantity?: number;
    method?: string;
    growth_stage?: string;
    operation?: string;
    objective?: string;
    weather_condition?: string;
    notes?: string;
  }): Promise<boolean> => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/fertilization/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return response.ok;
    } catch {
      return false;
    }
  },

  /**
   * Manually store any activity record
   */
  storeActivity: async (payload: Partial<ActivityLog>): Promise<boolean> => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return response.ok;
    } catch {
      return false;
    }
  },
};
