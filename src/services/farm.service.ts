// ============================================
// FARM SERVICE — Mock only, no Supabase
// ============================================
import type { Farm } from '../context/AppContext';

const _farms: Farm[] = [
    {
        id: 'f1',
        name: 'Kisaan Farm — Block A',
        location: 'Bengaluru, Karnataka',
        area: '4.5 acres',
        lands: [{ id: 'l1', name: 'Main Field', area: 4.5, x: 77.59, y: 12.97 }],
        crops: ['c1', 'c2'],
        latitude: 12.9716,
        longitude: 77.5946,
    },
    {
        id: 'f2',
        name: 'Kisaan Farm — Block B',
        location: 'Mysuru, Karnataka',
        area: '2.8 acres',
        lands: [{ id: 'l2', name: 'North Field', area: 2.8, x: 76.64, y: 12.31 }],
        crops: ['c3'],
        latitude: 12.3051,
        longitude: 76.6551,
    },
];

export const farmService = {
    getAllFarms: async (): Promise<Farm[]> => _farms,
    createFarm: async (farm: Farm): Promise<Farm> => {
        const newFarm = { ...farm, id: `f${_farms.length + 1}` };
        _farms.push(newFarm);
        return newFarm;
    },
    updateFarm: async (farmId: string, updates: Partial<Farm>): Promise<Farm> => {
        const idx = _farms.findIndex(f => f.id === farmId);
        if (idx >= 0) _farms[idx] = { ..._farms[idx], ...updates };
        return _farms[idx];
    },
    deleteFarm: async (farmId: string): Promise<void> => {
        const idx = _farms.findIndex(f => f.id === farmId);
        if (idx >= 0) _farms.splice(idx, 1);
    },
};
