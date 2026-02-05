import { supabase, getCurrentUserId } from '../lib/supabase';
import type { Crop } from '../context/AppContext';
import { getApiUrl } from './config';

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
     * Generate realistic mock crop journey data
     */
    generateMockJourneyData: (days: number = 30): any[] => {
        const data = [];
        const now = new Date();

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);

            // Generate realistic sensor values with some variation
            const baseTemp = 28 + Math.sin(i / 5) * 4; // Temperature oscillates between 24-32°C
            const baseMoisture = 60 + Math.sin(i / 3) * 15; // Moisture 45-75%
            const baseHumidity = 70 + Math.cos(i / 4) * 15; // Humidity 55-85%

            // Add some random variation
            const temp = baseTemp + (Math.random() - 0.5) * 3;
            const moisture = Math.max(20, Math.min(95, baseMoisture + (Math.random() - 0.5) * 10));
            const humidity = Math.max(40, Math.min(95, baseHumidity + (Math.random() - 0.5) * 8));

            // Rainfall (occasional spikes)
            const rainfall = Math.random() > 0.7 ? Math.random() * 15 : Math.random() * 2;

            // NPK values (gradually decreasing, simulating nutrient consumption)
            const nitrogen = Math.max(80, 150 - (i * 1.5) + (Math.random() - 0.5) * 10);
            const phosphorus = Math.max(60, 120 - (i * 1.2) + (Math.random() - 0.5) * 8);
            const potassium = Math.max(70, 140 - (i * 1.3) + (Math.random() - 0.5) * 9);

            data.push({
                created_at: date.toISOString(),
                soil_moisture: parseFloat(moisture.toFixed(1)),
                soil_moisture_pct: parseFloat(moisture.toFixed(1)),
                temperature: parseFloat(temp.toFixed(1)),
                temperature_c: parseFloat(temp.toFixed(1)),
                humidity: parseFloat(humidity.toFixed(0)),
                humidity_pct: parseFloat(humidity.toFixed(0)),
                rainfall: parseFloat(rainfall.toFixed(1)),
                nitrogen: parseFloat(nitrogen.toFixed(1)),
                phosphorus: parseFloat(phosphorus.toFixed(1)),
                potassium: parseFloat(potassium.toFixed(1)),
                ph: parseFloat((6.5 + (Math.random() - 0.5) * 0.6).toFixed(1)),
                irrigation_active: moisture < 50 && Math.random() > 0.5,
                data: {
                    soil_moisture_pct: parseFloat(moisture.toFixed(1)),
                    temperature_c: parseFloat(temp.toFixed(1)),
                    humidity_pct: parseFloat(humidity.toFixed(0))
                }
            });
        }

        return data;
    },

    /**
     * Get crop journey trace data for graphs
     */
    getCropJourney: async (cropId: string): Promise<any[]> => {
        try {
            // Using fetch to call the backend API as requested
            // POST /crop/journey { "crop": "<selected_crop>" }
            const url = getApiUrl('/crop/journey');
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ crop: cropId })
            });

            if (!response.ok) {
                console.warn(`Crop journey API failed with status ${response.status}, using mock data`);
                return cropService.generateMockJourneyData(30);
            }

            const data = await response.json();

            // If backend returns empty or invalid data, use mock data
            if (!data || !Array.isArray(data) || data.length === 0) {
                console.warn('Backend returned empty journey data, using mock data');
                return cropService.generateMockJourneyData(30);
            }

            return data;
        } catch (err) {
            console.error('Error fetching crop journey, using mock data:', err);
            return cropService.generateMockJourneyData(30);
        }
    },

    getGrowthStages: async (cropId: string, daysSinceSowing: number = 0): Promise<any> => {
        try {
            const url = getApiUrl('/crop/stages');
            const response = await fetch(url, {
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
    },

    /**
     * Get crop rotation recommendation
     */
    getRotationRecommendation: async (cropId: string): Promise<any> => {
        try {
            const url = getApiUrl('/crop/rotation');
            const payload = {
                crop: cropId,
                soil_nutrients: { N: 0, P: 0, K: 0 }, // Future-proofing (Requirement 1)
                crop_history: []
            };

            // Log outgoing payload (Requirement 4)
            console.log("Rotation API Request:", payload);

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            // Handle non-200 responses gracefully (Requirement 4)
            if (!response.ok) {
                console.warn(`Rotation API returned ${response.status}. Using fallback.`);
                return {
                    status: "success",
                    recommended_crop: "pulses",
                    confidence: "low",
                    reason: "Rotation data temporarily unavailable"
                };
            }

            const data = await response.json();

            // Validate and transform response shape (Requirement 4 & legacy UI support)
            if (data && data.status === "success" && data.recommended_crop) {
                // Ensure rotation_recommendation exists for UI compatibility
                if (!data.rotation_recommendation) {
                    data.rotation_recommendation = {
                        recommended_crop: data.recommended_crop.charAt(0).toUpperCase() + data.recommended_crop.slice(1),
                        reason: data.reason,
                        benefits: ["Nutrient replenishment", "Pest control", "Soil recovery"]
                    };
                }
                return data;
            }

            console.warn("Invalid rotation data received, using fallback");
            return {
                status: "success",
                recommended_crop: "pulses",
                confidence: "low",
                reason: "Interpreting rotation suggestions...",
                rotation_recommendation: {
                    recommended_crop: "Pulses",
                    reason: "Standard recovery crop recommended.",
                    benefits: ["Restores Nitrogen", "Soil Health"]
                }
            };
        } catch (err) {
            console.error('Error fetching rotation:', err);
            // Return safe fallback instead of throwing (Requirement 5)
            return {
                status: "success",
                recommended_crop: "pulses",
                confidence: "low",
                reason: "System maintaining soil health with default rotation"
            };
        }
    },

    /**
     * Get yield prediction
     */
    getYieldPrediction: async (cropId: string): Promise<any> => {
        try {
            const url = getApiUrl('/yield/predict');
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ crop: cropId })
            });

            if (!response.ok) throw new Error(`Yield API failed: ${response.status}`);
            return await response.json();
        } catch (err) {
            console.error('Error fetching yield:', err);
            throw err;
        }
    }
};
