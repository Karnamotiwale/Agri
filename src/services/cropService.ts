// ============================================
// CROP SERVICE — Mock Stub (thin wrapper)
// Real endpoints (for future integration):
//   GET  /api/v1/analytics/crop-health   → getCropHealth()
//   POST /api/v1/crops/detect-disease    → detectDisease()  [Gemini Vision]
//   POST /api/v1/crops/detect-disease-cnn→ (CropNet CNN pipeline)
//   POST /api/v1/crops/rotation          → (crop rotation advice)
// ============================================
import { getMockCropHealth } from '../mock/mockAnalytics';
import { getMockDiseaseDetection } from '../mock/mockAI';

export const getCropHealth = async (_farmId: string) => getMockCropHealth();

export const detectDisease = async (_image: File) => getMockDiseaseDetection();
