// ============================================
// VALVE SERVICE — Mock only, no backend
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

export const valveService = {
    getValvesForCrop: async (_cropId: string): Promise<Valve[]> => MOCK_VALVES,
    toggleValve: async (valveId: string, isActive: boolean): Promise<Valve> => {
        const valve = MOCK_VALVES.find(v => v.id === valveId);
        if (valve) { valve.isActive = isActive; valve.status = isActive ? 'RUNNING' : 'IDLE'; }
        return valve ?? MOCK_VALVES[0];
    },
    overrideSchedule: async (_valveId: string, _params: any): Promise<boolean> => true,
};
