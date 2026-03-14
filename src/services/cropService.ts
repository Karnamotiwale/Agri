import { api } from './api';

export const cropService = {
  detectCropDisease: async (imageFile: File) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      // Pointing to the specific CropNet CNN endpoint found in backend
      const response = await api.post('/api/v1/crops/detect-disease-cnn', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Disease detection failed:', error);
      throw error;
    }
  }
};
