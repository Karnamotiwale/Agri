import { api } from './api';
import type { Farm } from '../context/AppContext';

export const farmService = {
    getAllFarms: async (): Promise<Farm[]> => {
        const response = await api.get('/api/v1/farms');
        return response.data.map((row: any) => ({
            id: row.id,
            name: row.farm_name,
            location: 'India', // Optional field
            area: `${row.total_land_acres} acres`,
            lands: [],
            crops: [],
            latitude: row.latitude,
            longitude: row.longitude,
        }));
    },
    createFarm: async (farm: Farm): Promise<Farm> => {
        const payload = {
            name: farm.name,
            area: parseFloat(farm.area),
            latitude: farm.latitude,
            longitude: farm.longitude,
        };
        const response = await api.post('/api/v1/farms', payload);
        const row = response.data;
        return {
            id: row.id,
            name: row.farm_name,
            location: 'India',
            area: `${row.total_land_acres} acres`,
            lands: [],
            crops: [],
            latitude: row.latitude,
            longitude: row.longitude,
        };
    },
    updateFarm: async (_farmId: string, _updates: Partial<Farm>): Promise<Farm> => {
        throw new Error("updateFarm not implemented on backend");
    },
    deleteFarm: async (_farmId: string): Promise<void> => {
        throw new Error("deleteFarm not implemented on backend");
    },
};
