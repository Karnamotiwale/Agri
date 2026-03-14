// ============================================
// INSURANCE SERVICE — Mock only, no Supabase
// ============================================

export interface InsurancePolicy {
    id: string; name: string; coverageType: string; risksCovered: string[];
    eligibility: string; coverageAmount: string; premium: string; claimTrigger: string;
    calamitySpecific: boolean; officialLink: string; description: string; icon: string;
}

export interface InsuranceRecommendation {
    policy: InsurancePolicy; urgencyLevel: 'Normal' | 'High' | 'Emergency'; reason: string; matchScore: number;
}

export interface RiskAssessment {
    droughtRisk: number; floodRisk: number; pestRisk: number; weatherRisk: number;
}

const MOCK_POLICIES: InsurancePolicy[] = [
    { id: 'p1', name: 'PMFBY – Pradhan Mantri Fasal Bima Yojana', coverageType: 'Comprehensive Crop Insurance', risksCovered: ['Drought', 'Flood', 'Hailstorm', 'Pest Outbreak'], eligibility: 'All farmers', coverageAmount: 'Up to ₹2 lakh/ha', premium: '1.5–5% of sum insured', claimTrigger: 'Crop loss > 25%', calamitySpecific: false, officialLink: 'https://pmfby.gov.in', description: 'National crop insurance scheme covering all major risks.', icon: '🌾' },
    { id: 'p2', name: 'Weather Based Crop Insurance (WBCIS)', coverageType: 'Weather Index Insurance', risksCovered: ['Rainfall Deficit', 'Excess Rain', 'Temperature Extremes'], eligibility: 'Notified areas', coverageAmount: 'Up to ₹1.2 lakh/ha', premium: '2% of sum insured', claimTrigger: 'Weather index threshold breach', calamitySpecific: true, officialLink: 'https://pmfby.gov.in', description: 'Triggered automatically by weather station data.', icon: '🌦️' },
    { id: 'p3', name: 'PM-KISAN – Income Support', coverageType: 'Direct Income Transfer', risksCovered: ['Income Support'], eligibility: 'All landholding farmers', coverageAmount: '₹6,000/year', premium: 'Free – Government funded', claimTrigger: 'Auto-disbursed', calamitySpecific: false, officialLink: 'https://pmkisan.gov.in', description: 'Direct income support of ₹6000/year in three installments.', icon: '💰' },
    { id: 'p4', name: 'Pradhan Mantri Suraksha Bima Yojana', coverageType: 'Accidental Insurance', risksCovered: ['Accidental Death', 'Disability'], eligibility: 'Age 18–70', coverageAmount: '₹2 lakh', premium: '₹20/year', claimTrigger: 'Accident', calamitySpecific: false, officialLink: 'https://jansuraksha.gov.in', description: 'Affordable accident insurance for farmers.', icon: '🛡️' },
];

class InsuranceService {
    async getAllPolicies(): Promise<InsurancePolicy[]> { return MOCK_POLICIES; }

    async getRecommendations(cropType: string, _location: string, r: RiskAssessment): Promise<InsuranceRecommendation[]> {
        const recs: InsuranceRecommendation[] = [];
        if (r.droughtRisk > 60 || r.floodRisk > 50) {
            recs.push({ policy: MOCK_POLICIES[0], urgencyLevel: r.droughtRisk > 80 ? 'Emergency' : 'High', reason: `Risk detected. PMFBY recommended.`, matchScore: Math.max(r.droughtRisk, r.floodRisk) });
            recs.push({ policy: MOCK_POLICIES[1], urgencyLevel: 'High', reason: 'Weather-based insurance for rain variability.', matchScore: r.weatherRisk });
        }
        recs.push({ policy: MOCK_POLICIES[2], urgencyLevel: 'Normal', reason: 'Income support available for all farmers.', matchScore: 50 });
        recs.push({ policy: MOCK_POLICIES[3], urgencyLevel: 'Normal', reason: 'Affordable accident insurance.', matchScore: 40 });
        return recs.sort((a, b) => b.matchScore - a.matchScore);
    }

    detectCalamity(soilMoisture: number, rainfall: number, temperature: number): string[] {
        const c: string[] = [];
        if (soilMoisture < 25 && rainfall < 10) c.push('Drought');
        if (rainfall > 100) c.push('Flood');
        if (temperature > 42) c.push('Extreme Heat');
        return c;
    }

    async getCalamityInsurance(): Promise<InsurancePolicy[]> {
        return MOCK_POLICIES.filter(p => p.calamitySpecific);
    }
}

export const insuranceService = new InsuranceService();
