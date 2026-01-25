
export interface Valve {
    id: string;
    farmId: string;
    cropId: string;
    valveNumber: number;
    zoneName: string;
    isActive: boolean;
    status: 'RUNNING' | 'IDLE' | 'ERROR';
    lastActive?: string;
}

export interface ValveSchedule {
    id: string;
    valveId: string;
    scheduledTime: string;
    durationMinutes: number;
    waterQuantityLiters: number;
    fertilizerType?: string;
    source: 'AI' | 'MANUAL';
    status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'SKIPPED';
    aiReasoning?: string;
}

// Mock initial data
const MOCK_VALVES: Valve[] = [
    { id: 'v1', farmId: 'f1', cropId: '1', valveNumber: 1, zoneName: 'Zone A (North)', isActive: false, status: 'IDLE' },
    { id: 'v2', farmId: 'f1', cropId: '1', valveNumber: 2, zoneName: 'Zone B (East)', isActive: false, status: 'IDLE' },
    { id: 'v3', farmId: 'f1', cropId: '1', valveNumber: 3, zoneName: 'Zone C (West)', isActive: false, status: 'IDLE' },
    { id: 'v4', farmId: 'f1', cropId: '1', valveNumber: 4, zoneName: 'Zone D (South)', isActive: false, status: 'IDLE' },
    { id: 'v5', farmId: 'f1', cropId: '1', valveNumber: 5, zoneName: 'Green House 1', isActive: false, status: 'IDLE' },
    { id: 'v6', farmId: 'f1', cropId: '1', valveNumber: 6, zoneName: 'Green House 2', isActive: false, status: 'IDLE' }
];

export const valveService = {
    getValvesForCrop: async (cropId: string): Promise<Valve[]> => {
        // Simulate DB fetch
        await new Promise(r => setTimeout(r, 500));
        return MOCK_VALVES.filter(v => v.cropId === cropId);
    },

    toggleValve: async (valveId: string, isActive: boolean): Promise<Valve> => {
        await new Promise(r => setTimeout(r, 800)); // Simulate network latency to ESP32
        const valve = MOCK_VALVES.find(v => v.id === valveId);
        if (!valve) throw new Error('Valve not found');

        valve.isActive = isActive;
        valve.status = isActive ? 'RUNNING' : 'IDLE';
        valve.lastActive = isActive ? new Date().toISOString() : valve.lastActive;

        return { ...valve };
    },

    // Simulates sending a manual override command that might be logged
    overrideSchedule: async (valveId: string, params: { duration: number, quantity: number }): Promise<boolean> => {
        console.log(`Override command sent to Valve ${valveId}:`, params);
        await new Promise(r => setTimeout(r, 600));
        return true;
    }
};
