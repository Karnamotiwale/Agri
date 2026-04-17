// ============================================
// VALVE SERVICE
// Controls ESP32 irrigation hardware + auto-logs activities to Supabase
// ============================================

import { activityService } from './activity.service';

export interface Valve {
    id: string; farmId: string; cropId: string;
    valveNumber: number; zoneName: string;
    isActive: boolean; status: 'RUNNING' | 'IDLE' | 'ERROR'; lastActive?: string;
}

export interface ValveSchedule {
    id: string; valveId: string; scheduledTime: string;
    durationMinutes: number; waterQuantityLiters: number;
    fertilizerType?: string; source: 'AI' | 'MANUAL';
    status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'SKIPPED'; aiReasoning?: string;
}

const MOCK_VALVES: Valve[] = [
    { id: 'v1', farmId: 'f1', cropId: 'c1', valveNumber: 1, zoneName: 'Zone A – Main Field', isActive: false, status: 'IDLE' },
    { id: 'v2', farmId: 'f1', cropId: 'c1', valveNumber: 2, zoneName: 'Zone B – North',       isActive: false, status: 'IDLE' },
    { id: 'v3', farmId: 'f1', cropId: 'c1', valveNumber: 3, zoneName: 'Zone C – South',       isActive: false, status: 'IDLE' },
    { id: 'v4', farmId: 'f1', cropId: 'c1', valveNumber: 4, zoneName: 'Zone D – East',        isActive: false, status: 'IDLE' },
];

// ESP32 base URL — configurable via env var, falls back to local IP
// NOTE: When deployed on HTTPS (Vercel), browser blocks HTTP (ESP32) requests.
// This is a known Mixed-Content limitation. The app degrades gracefully.
const ESP32_BASE_URL = import.meta.env.VITE_ESP32_URL || "http://10.241.105.66";

export const valveService = {
    getValvesForCrop: async (_cropId: string): Promise<Valve[]> => MOCK_VALVES,
    
    checkESP32Connection: async (): Promise<boolean> => {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);
            await fetch(`${ESP32_BASE_URL}/`, { mode: 'no-cors', signal: controller.signal });
            clearTimeout(timeoutId);
            return true;
        } catch (e) {
            return false;
        }
    },

    toggleValve: async (valveId: string, isActive: boolean): Promise<Valve> => {

        let path = "";

        if (valveId === "v1" || valveId === "irrigation") {
            path = isActive ? `/pump1/on` : `/pump1/off`;
        } else if (valveId === "v2" || valveId === "fertigation" || valveId === "fertilization") {
            path = isActive ? `/pump2/on` : `/pump2/off`;
        }

        if (path) {
            const url = `${ESP32_BASE_URL}${path}`;
            const maxRetries = 3;
            const timeoutMs = 10000; // Increased to 10 seconds

            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

                try {
                    console.log(`[ESP32 Valve] Attempt ${attempt}/${maxRetries} to ${url}...`);
                    
                    await fetch(url, { 
                        mode: 'no-cors',
                        signal: controller.signal
                    });
                    
                    clearTimeout(timeoutId);
                    console.log(`✅ [ESP32 Valve] Command Successful: ${valveId} -> ${isActive ? 'ON' : 'OFF'}`);
                    break; // Success, exit retry loop
                    
                } catch (err: any) {
                    clearTimeout(timeoutId);
                    const isTimeout = err.name === 'AbortError';
                    const isMixedContent = window.location.protocol === 'https:' && ESP32_BASE_URL.startsWith('http:');
                    
                    if (isMixedContent) {
                        console.warn('[ESP32 Valve] Mixed Content: Browser blocked HTTP request from HTTPS page. ESP32 must use HTTPS or be reached via backend proxy.');
                        break; // Don't retry — mixed content will always fail
                    }
                    
                    console.error(`❌ [ESP32 Valve] Request ${isTimeout ? 'Timed out' : 'Failed'} on attempt ${attempt}:`, err.message || err);
                    
                    if (attempt === maxRetries) {
                        console.error("🚨 [ESP32 Valve] OFFLINE or UNREACHABLE. All attempts failed.");
                        // Don't throw — log and continue so UI doesn't crash
                        break;
                    }
                    
                    await new Promise(r => setTimeout(r, 1000));
                }
            }
        }

        const valve = MOCK_VALVES.find(v => v.id === valveId);
        if (valve) {
            valve.isActive = isActive;
            valve.status = isActive ? "RUNNING" : "IDLE";
        }

        return valve ?? MOCK_VALVES[0];
    },
    overrideSchedule: async (_valveId: string, _params: any): Promise<boolean> => true,

    /**
     * Log an irrigation event directly to field_activities.
     * Call this after valve toggle succeeds.
     */
    logIrrigationEvent: async (params: {
      farmId?: string | null;
      farmName?: string;
      cropName?: string;
      valveId: string;
      isActive: boolean;
      durationMinutes?: number;
    }): Promise<void> => {
      if (!params.isActive) return; // Only log when turning ON
      try {
        await activityService.logIrrigation({
          field_id: params.farmId,
          farm_name: params.farmName,
          crop_name: params.cropName,
          valve_id: params.valveId,
          duration_minutes: params.durationMinutes || 0,
          operation: 'Drip Irrigation',
          objective: 'Moisture Maintenance',
          method: 'Drip',
          water_source: 'Borewell',
          growth_stage: 'Vegetative',
        });
        console.log('[ValveService] Irrigation activity logged');
      } catch (e) {
        console.warn('[ValveService] Failed to log irrigation activity:', e);
      }
    },
};
