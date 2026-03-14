// ============================================
// CROP SERVICE — Mock Stub (thin wrapper)
// ============================================
import { getMockCropHealth } from '../mock/mockAnalytics';
import { getMockDiseaseDetection } from '../mock/mockAI';

export const getCropHealth = async (_farmId: string) => getMockCropHealth();

export const detectDisease = async (_image: File) => getMockDiseaseDetection();
