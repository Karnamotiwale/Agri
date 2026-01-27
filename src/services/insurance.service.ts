import { supabase } from '../lib/supabase';

export interface InsurancePolicy {
    id: string;
    name: string;
    coverageType: string;
    risksCovered: string[];
    eligibility: string;
    coverageAmount: string;
    premium: string;
    claimTrigger: string;
    calamitySpecific: boolean;
    officialLink: string;
    description: string;
    icon: string;
}

export interface InsuranceRecommendation {
    policy: InsurancePolicy;
    urgencyLevel: 'Normal' | 'High' | 'Emergency';
    reason: string;
    matchScore: number;
}

export interface RiskAssessment {
    droughtRisk: number; // 0-100
    floodRisk: number;
    pestRisk: number;
    weatherRisk: number;
}

class InsuranceService {
    /**
     * Get all insurance policies from database
     */
    async getAllPolicies(): Promise<InsurancePolicy[]> {
        try {
            const { data, error } = await supabase
                .from('insurance_policies')
                .select('*')
                .order('calamity_specific', { ascending: false });

            if (error) throw error;

            return (data || []).map(policy => ({
                id: policy.id,
                name: policy.name,
                coverageType: policy.coverage_type,
                risksCovered: policy.risks_covered,
                eligibility: policy.eligibility,
                coverageAmount: policy.coverage_amount,
                premium: policy.premium,
                claimTrigger: policy.claim_trigger,
                calamitySpecific: policy.calamity_specific,
                officialLink: policy.official_link,
                description: policy.description,
                icon: policy.icon,
            }));
        } catch (error) {
            console.error('Error fetching insurance policies:', error);
            return [];
        }
    }

    /**
     * Get AI-driven insurance recommendations based on crop type, location, and risks
     */
    async getRecommendations(
        cropType: string,
        location: string,
        riskAssessment: RiskAssessment
    ): Promise<InsuranceRecommendation[]> {
        const policies = await this.getAllPolicies();
        const recommendations: InsuranceRecommendation[] = [];

        // Drought risk analysis
        if (riskAssessment.droughtRisk > 60) {
            const pmfby = policies.find(p => p.name.includes('PMFBY'));
            if (pmfby) {
                recommendations.push({
                    policy: pmfby,
                    urgencyLevel: riskAssessment.droughtRisk > 80 ? 'Emergency' : 'High',
                    reason: `High drought risk detected (${riskAssessment.droughtRisk}%). PMFBY covers crop failure due to drought.`,
                    matchScore: riskAssessment.droughtRisk,
                });
            }

            const wbcis = policies.find(p => p.name.includes('Weather Based'));
            if (wbcis) {
                recommendations.push({
                    policy: wbcis,
                    urgencyLevel: 'High',
                    reason: `Weather-based insurance recommended due to rainfall deficit risk.`,
                    matchScore: riskAssessment.droughtRisk * 0.8,
                });
            }
        }

        // Flood risk analysis
        if (riskAssessment.floodRisk > 50) {
            const pmfby = policies.find(p => p.name.includes('PMFBY'));
            if (pmfby && !recommendations.find(r => r.policy.id === pmfby.id)) {
                recommendations.push({
                    policy: pmfby,
                    urgencyLevel: riskAssessment.floodRisk > 75 ? 'Emergency' : 'High',
                    reason: `Flood risk detected (${riskAssessment.floodRisk}%). PMFBY provides coverage for flood damage.`,
                    matchScore: riskAssessment.floodRisk,
                });
            }
        }

        // Pest risk analysis
        if (riskAssessment.pestRisk > 70) {
            const pmfby = policies.find(p => p.name.includes('PMFBY'));
            if (pmfby && !recommendations.find(r => r.policy.id === pmfby.id)) {
                recommendations.push({
                    policy: pmfby,
                    urgencyLevel: 'Emergency',
                    reason: `Pest outbreak risk detected (${riskAssessment.pestRisk}%). Immediate crop insurance coverage recommended.`,
                    matchScore: riskAssessment.pestRisk,
                });
            }
        }

        // Always recommend basic schemes
        const pmKisan = policies.find(p => p.name.includes('PM-KISAN'));
        if (pmKisan && !recommendations.find(r => r.policy.id === pmKisan.id)) {
            recommendations.push({
                policy: pmKisan,
                urgencyLevel: 'Normal',
                reason: 'Direct income support scheme available for all eligible farmers.',
                matchScore: 50,
            });
        }

        // Farmer safety insurance
        const pmsby = policies.find(p => p.name.includes('Suraksha'));
        if (pmsby) {
            recommendations.push({
                policy: pmsby,
                urgencyLevel: 'Normal',
                reason: 'Affordable accident insurance for farmer safety.',
                matchScore: 40,
            });
        }

        // Sort by match score
        return recommendations.sort((a, b) => b.matchScore - a.matchScore);
    }

    /**
     * Detect calamity based on sensor data and weather
     */
    detectCalamity(soilMoisture: number, rainfall: number, temperature: number): string[] {
        const calamities: string[] = [];

        // Drought detection
        if (soilMoisture < 25 && rainfall < 10) {
            calamities.push('Drought');
        }

        // Flood detection
        if (rainfall > 100) {
            calamities.push('Flood');
        }

        // Extreme heat
        if (temperature > 42) {
            calamities.push('Extreme Heat');
        }

        return calamities;
    }

    /**
     * Get calamity-specific insurance policies
     */
    async getCalamityInsurance(): Promise<InsurancePolicy[]> {
        const policies = await this.getAllPolicies();
        return policies.filter(p => p.calamitySpecific);
    }
}

export const insuranceService = new InsuranceService();
