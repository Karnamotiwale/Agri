import { supabase, getCurrentUserId } from '../lib/supabase';
import type { Crop } from '../context/AppContext';

export const cropService = {
    /**
     * Upload crop image to storage
     */
    uploadCropImage: async (file: File): Promise<string | null> => {
        try {
            const userId = await getCurrentUserId();
            if (!userId) throw new Error('User not authenticated');

            const fileExt = file.name.split('.').pop();
            const fileName = `${userId}/${Date.now()}.${fileExt}`;
            const filePath = fileName;

            const { error: uploadError } = await supabase.storage
                .from('crop-images')
                .upload(filePath, file);

            if (uploadError) {
                console.error('Error uploading image:', uploadError);
                return null;
            }

            const { data } = supabase.storage.from('crop-images').getPublicUrl(filePath);
            return data.publicUrl;
        } catch (err) {
            console.error('Exception uploading image:', err);
            return null;
        }
    },

    /**
     * Upload disease detection image to storage
     */
    uploadDiseaseDetectionImage: async (file: File): Promise<string | null> => {
        try {
            const userId = await getCurrentUserId();
            if (!userId) throw new Error('User not authenticated');

            const fileExt = file.name.split('.').pop();
            const fileName = `${userId}/${Date.now()}.${fileExt}`;
            const filePath = fileName;

            const { error: uploadError } = await supabase.storage
                .from('disease-detection-images')
                .upload(filePath, file);

            if (uploadError) {
                console.error('Error uploading disease detection image:', uploadError);
                return null;
            }

            const { data } = supabase.storage.from('disease-detection-images').getPublicUrl(filePath);
            return data.publicUrl;
        } catch (err) {
            console.error('Exception uploading disease detection image:', err);
            return null;
        }
    },

    /**
     * Get all crops for the authenticated user
     */
    getAllCrops: async (): Promise<Crop[]> => {
        try {
            const userId = await getCurrentUserId();
            if (!userId) {
                console.error("CropService: No user ID found during fetch");
                throw new Error('User not authenticated');
            }

            console.log("CropService: Fetching crops for user", userId);

            const { data, error } = await supabase
                .from('crops')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) {
                console.error("CropService: Supabase error", error);
                throw error;
            }

            console.log("CropService: Fetched data", data);

            return (data || []).map((c: any) => ({
                id: c.id,
                name: c.crop_name,
                image: c.image_url || 'https://images.unsplash.com/photo-1582515073490-dc84fbbf5f84?q=80&w=400',
                location: 'Field',
                landArea: (c.seeds_planted && c.seeds_planted > 0) ? (c.seeds_planted / 100) + ' Hectares' : '1 Hectares',
                landSize: '1 Hectares',
                sowingDate: c.sowing_date,
                sowingPeriod: 'Jan - Dec',
                currentStage: 'Sowing',
                stageDate: 'Recently',
                stages: [],
                farmId: c.farm_id,
                seedsPlanted: c.seeds_planted?.toString(),
                cropType: c.crop_type
            })) as Crop[];
        } catch (err: any) {
            console.error('Error fetching crops:', err);
            throw err;
        }
    },

    /**
     * Get crops for a specific farm
     */
    getCropsByFarm: async (farmId: string): Promise<Crop[]> => {
        try {
            const userId = await getCurrentUserId();
            if (!userId) {
                throw new Error('User not authenticated');
            }

            const { data, error } = await supabase
                .from('crops')
                .select('*')
                .eq('user_id', userId)
                .eq('farm_id', farmId)
                .order('created_at', { ascending: false });

            if (error) throw error;

            return (data || []).map((c: any) => ({
                id: c.id,
                name: c.crop_name,
                image: c.image_url || 'https://images.unsplash.com/photo-1582515073490-dc84fbbf5f84?q=80&w=400',
                location: 'Field',
                landArea: (c.seeds_planted && c.seeds_planted > 0) ? (c.seeds_planted / 100) + ' Hectares' : '1 Hectares',
                landSize: '1 Hectares',
                sowingDate: c.sowing_date,
                sowingPeriod: 'Jan - Dec',
                currentStage: 'Sowing',
                stageDate: 'Recently',
                stages: [],
                farmId: c.farm_id,
                seedsPlanted: c.seeds_planted?.toString(),
                cropType: c.crop_type
            })) as Crop[];
        } catch (err: any) {
            console.error('Error fetching crops for farm:', err);
            throw err;
        }
    },

    /**
     * Create a new crop for the authenticated user
     */
    createCrop: async (crop: Crop, farmId: string, imageFile?: File): Promise<Crop> => {
        try {
            const userId = await getCurrentUserId();
            if (!userId) {
                throw new Error('User not authenticated. Please log in to create a crop.');
            }

            // Validate that the farm exists and belongs to the user
            const { data: farmData, error: farmError } = await supabase
                .from('farms')
                .select('id')
                .eq('id', farmId)
                .eq('user_id', userId)
                .single();

            if (farmError || !farmData) {
                throw new Error('Farm not found or access denied. Please select a valid farm.');
            }

            let finalImageUrl = crop.image;

            // Upload image if provided
            if (imageFile) {
                const uploadedUrl = await cropService.uploadCropImage(imageFile);
                if (uploadedUrl) {
                    finalImageUrl = uploadedUrl;
                }
            }

            const { data, error } = await supabase
                .from('crops')
                .insert({
                    user_id: userId,
                    farm_id: farmId,
                    crop_name: crop.name,
                    crop_type: crop.cropType,
                    sowing_date: crop.sowingDate,
                    seeds_planted: crop.seedsPlanted ? parseFloat(crop.seedsPlanted) : 0,
                    image_url: finalImageUrl
                })
                .select()
                .single();

            if (error) throw error;

            return { ...crop, id: data.id, farmId: data.farm_id, image: data.image_url || crop.image };
        } catch (err: any) {
            console.error('Error creating crop:', err);
            throw err;
        }
    },

    /**
     * Update an existing crop
     */
    updateCrop: async (cropId: string, updates: Partial<Crop>): Promise<Crop> => {
        try {
            const userId = await getCurrentUserId();
            if (!userId) {
                throw new Error('User not authenticated');
            }

            const dbUpdates: any = {};
            if (updates.name) dbUpdates.crop_name = updates.name;
            if (updates.cropType) dbUpdates.crop_type = updates.cropType;
            if (updates.sowingDate) dbUpdates.sowing_date = updates.sowingDate;
            if (updates.seedsPlanted) dbUpdates.seeds_planted = parseFloat(updates.seedsPlanted);
            if (updates.image) dbUpdates.image_url = updates.image;

            const { data, error } = await supabase
                .from('crops')
                .update(dbUpdates)
                .eq('id', cropId)
                .eq('user_id', userId)
                .select()
                .single();

            if (error) throw error;
            if (!data) throw new Error('Crop not found or access denied');

            return {
                id: data.id,
                name: data.crop_name,
                image: data.image_url || 'https://images.unsplash.com/photo-1582515073490-dc84fbbf5f84?q=80&w=400',
                location: 'Field',
                landArea: (data.seeds_planted && data.seeds_planted > 0) ? (data.seeds_planted / 100) + ' Hectares' : '1 Hectares',
                landSize: '1 Hectares',
                sowingDate: data.sowing_date,
                sowingPeriod: 'Jan - Dec',
                currentStage: 'Sowing',
                stageDate: 'Recently',
                stages: [],
                farmId: data.farm_id,
                seedsPlanted: data.seeds_planted?.toString(),
                cropType: data.crop_type
            };
        } catch (err: any) {
            console.error('Error updating crop:', err);
            throw err;
        }
    },

    /**
     * Delete a crop
     */
    deleteCrop: async (cropId: string): Promise<void> => {
        try {
            const userId = await getCurrentUserId();
            if (!userId) {
                throw new Error('User not authenticated');
            }

            const { error } = await supabase
                .from('crops')
                .delete()
                .eq('id', cropId)
                .eq('user_id', userId);

            if (error) throw error;
        } catch (err: any) {
            console.error('Error deleting crop:', err);
            throw err;
        }
    },

    /**
     * Get crop journey trace data for graphs
     */
    getCropJourney: async (cropId: string): Promise<any[]> => {
        try {
            // Using fetch to call the backend API as requested
            // POST /crop/journey { "crop": "<selected_crop>" }
            const response = await fetch('/crop/journey', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ crop: cropId })
            });

            if (!response.ok) {
                throw new Error(`Crop journey API failed: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (err) {
            console.error('Error fetching crop journey:', err);
            throw err;
        }
    },

    /**
     * Get real-time growth stages from Crop Stage Engine
     */
    getGrowthStages: async (cropId: string, daysSinceSowing: number = 0): Promise<any> => {
        try {
            const response = await fetch('/crop/growth-stages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ crop: cropId, days_since_sowing: daysSinceSowing })
            });

            if (!response.ok) throw new Error(`Growth stages API failed: ${response.status}`);
            return await response.json();
        } catch (err) {
            console.error('Error fetching growth stages:', err);
            throw err;
        }
    }
};
