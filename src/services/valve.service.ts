// ============================================
// VALVE SERVICE — Mock only, no backend
// Real endpoints (for future integration):
//   POST /api/v1/valves/open  → valveService.toggleValve(id, true)
//   POST /api/v1/valves/stop  → valveService.toggleValve(id, false)
// ============================================

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

const ESP_IP = "10.171.0.66";

export const valveService = {
    getValvesForCrop: async (_cropId: string): Promise<Valve[]> => MOCK_VALVES,
    toggleValve: async (valveId: string, isActive: boolean): Promise<Valve> => {

        let url = "";

        if (valveId === "v1") {
            url = isActive
                ? `http://${ESP_IP}/pump1/on`
                : `http://${ESP_IP}/pump1/off`;
        }

        if (valveId === "v2") {
            url = isActive
                ? `http://${ESP_IP}/pump2/on`
                : `http://${ESP_IP}/pump2/off`;
        }

        if (url !== "") {
            try {
                // Use no-cors to prevent browser from blocking requests to local IPs that don't return CORS headers
                await fetch(url, { mode: 'no-cors' });
            } catch (err) {
                console.error("Valve fetch error:", err);
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
};
