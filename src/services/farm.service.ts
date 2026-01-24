import { supabase, getCurrentUserId } from '../lib/supabase';
import type { Farm } from '../context/AppContext';

export const farmService = {
    /**
     * Get all farms for the authenticated user
     */
    getAllFarms: async (): Promise<Farm[]> => {
        try {
            const userId = await getCurrentUserId();
            if (!userId) {
                throw new Error('User not authenticated');
            }

            const { data, error } = await supabase
                .from('farms')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Map DB fields to App types
            return (data || []).map((f: any) => ({
                id: f.id,
                name: f.farm_name,
                location: `Lat: ${f.latitude?.toFixed(2) || 0}, Long: ${f.longitude?.toFixed(2) || 0}`,
                area: `${f.total_land_acres || 0} acres`,
                lands: [{
                    id: f.id,
                    name: f.farm_name,
                    area: f.total_land_acres || 0,
                    x: f.longitude || 0,
                    y: f.latitude || 0
                }],
                crops: [], // Populated separately
                latitude: f.latitude,
                longitude: f.longitude
            })) as Farm[];
        } catch (err: any) {
            console.error('Error fetching farms:', err);
            throw err;
        }
    },

    /**
     * Create a new farm for the authenticated user
     */
    createFarm: async (farm: Farm): Promise<Farm> => {
        try {
            const userId = await getCurrentUserId();
            if (!userId) {
                throw new Error('User not authenticated. Please log in to create a farm.');
            }

            const areaValue = typeof farm.area === 'string'
                ? parseFloat(farm.area.replace(/[^\d.]/g, ''))
                : farm.area;

            const { data, error } = await supabase
                .from('farms')
                .insert({
                    user_id: userId,
                    farm_name: farm.name,
                    total_land_acres: areaValue,
                    latitude: farm.lands[0]?.y || 0,
                    longitude: farm.lands[0]?.x || 0
                })
                .select()
                .single();

            if (error) throw error;

            return {
                ...farm,
                id: data.id,
                latitude: data.latitude,
                longitude: data.longitude
            };
        } catch (err: any) {
            console.error('Error creating farm:', err);
            throw err;
        }
    },

    /**
     * Update an existing farm
     */
    updateFarm: async (farmId: string, updates: Partial<Farm>): Promise<Farm> => {
        try {
            const userId = await getCurrentUserId();
            if (!userId) {
                throw new Error('User not authenticated');
            }

            const dbUpdates: any = {};
            if (updates.name) dbUpdates.farm_name = updates.name;
            if (updates.area) {
                dbUpdates.total_land_acres = typeof updates.area === 'string'
                    ? parseFloat(updates.area.replace(/[^\d.]/g, ''))
                    : updates.area;
            }
            if (updates.latitude !== undefined) dbUpdates.latitude = updates.latitude;
            if (updates.longitude !== undefined) dbUpdates.longitude = updates.longitude;

            const { data, error } = await supabase
                .from('farms')
                .update(dbUpdates)
                .eq('id', farmId)
                .eq('user_id', userId)
                .select()
                .single();

            if (error) throw error;
            if (!data) throw new Error('Farm not found or access denied');

            return {
                id: data.id,
                name: data.farm_name,
                location: `Lat: ${data.latitude?.toFixed(2) || 0}, Long: ${data.longitude?.toFixed(2) || 0}`,
                area: `${data.total_land_acres || 0} acres`,
                lands: [{
                    id: data.id,
                    name: data.farm_name,
                    area: data.total_land_acres || 0,
                    x: data.longitude || 0,
                    y: data.latitude || 0
                }],
                crops: [],
                latitude: data.latitude,
                longitude: data.longitude
            };
        } catch (err: any) {
            console.error('Error updating farm:', err);
            throw err;
        }
    },

    /**
     * Delete a farm (and cascade delete associated crops)
     */
    deleteFarm: async (farmId: string): Promise<void> => {
        try {
            const userId = await getCurrentUserId();
            if (!userId) {
                throw new Error('User not authenticated');
            }

            const { error } = await supabase
                .from('farms')
                .delete()
                .eq('id', farmId)
                .eq('user_id', userId);

            if (error) throw error;
        } catch (err: any) {
            console.error('Error deleting farm:', err);
            throw err;
        }
    }
};
