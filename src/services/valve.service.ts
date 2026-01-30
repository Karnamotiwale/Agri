
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
        try {
            const response = await fetch(`/valves?crop_id=${cropId}`);
            if (!response.ok) throw new Error(`API failed: ${response.status}`);
            return await response.json();
        } catch (err) {
            console.warn('Valves fallback', err);
            return MOCK_VALVES.filter(v => v.cropId === cropId);
        }
    },

    toggleValve: async (valveId: string, isActive: boolean): Promise<Valve> => {
        try {
            const response = await fetch('/valves/toggle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ valve_id: valveId, active: isActive })
            });

            if (!response.ok) throw new Error(`Toggle failed: ${response.status}`);
            return await response.json();
        } catch (err) {
            console.warn('Toggle fallback', err);
            const valve = MOCK_VALVES.find(v => v.id === valveId);
            if (!valve) throw new Error('Valve not found');

            valve.isActive = isActive;
            valve.status = isActive ? 'RUNNING' : 'IDLE';
            valve.lastActive = isActive ? new Date().toISOString() : valve.lastActive;

            return { ...valve };
        }
    },

    overrideSchedule: async (valveId: string, params: { duration: number, quantity: number }): Promise<boolean> => {
        try {
            const response = await fetch('/valves/override', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ valve_id: valveId, ...params })
            });

            if (!response.ok) throw new Error(`Override failed: ${response.status}`);
            return true;
        } catch (err) {
            console.warn('Override fallback', err);
            return true;
        }
    }
};
