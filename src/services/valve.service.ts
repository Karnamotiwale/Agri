import { getApiUrl } from './config';

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

export const valveService = {
    getValvesForCrop: async (cropId: string): Promise<Valve[]> => {
        const url = getApiUrl(`/valves?crop_id=${cropId}`);
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Valves API failed: ${response.status}`);
        return await response.json();
    },

    toggleValve: async (valveId: string, isActive: boolean): Promise<Valve> => {
        const url = getApiUrl('/valves/toggle');
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ valve_id: valveId, active: isActive })
        });

        if (!response.ok) throw new Error(`Toggle valve API failed: ${response.status}`);
        return await response.json();
    },

    overrideSchedule: async (valveId: string, params: { duration: number, quantity: number }): Promise<boolean> => {
        const url = getApiUrl('/valves/override');
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ valve_id: valveId, ...params })
        });

        if (!response.ok) throw new Error(`Override schedule API failed: ${response.status}`);
        return true;
    }
};
