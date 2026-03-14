// ============================================
// HEALTH SERVICE — AI Disease Diagnosis Mock
// ============================================

export interface DiagnosisResult {
  diseaseName: string;
  confidence: number;
  symptoms: string[];
  organicTreatment: string[];
  chemicalTreatment: string[];
  doctorAdvice: string;
}

const mockResults: Record<string, DiagnosisResult> = {
  default: {
    diseaseName: 'Early Blight (Alternaria solani)',
    confidence: 94,
    symptoms: [
      'Small, dark spots on older leaves',
      'Concentric rings (target-like) in spots',
      'Yellowing of leaves around spots'
    ],
    organicTreatment: [
      'Apply neem oil spray weekly',
      'Remove and destroy infected lower leaves',
      'Improve air circulation'
    ],
    chemicalTreatment: [
      'Apply Mancozeb or Chlorothalonil fungicide',
      'Copper-based sprays during high humidity'
    ],
    doctorAdvice: "Your plant shows signs of Early Blight. It's currently in the vegetative stage, making it vulnerable. Prioritize removing the lower infected leaves immediately to prevent upward spread."
  }
};

export const healthService = {
  diagnoseImage: async (imageUri: string): Promise<DiagnosisResult> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2500));
    return mockResults.default;
  }
};
