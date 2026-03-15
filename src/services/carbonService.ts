import { api } from './api';

export interface CarbonBreakdown {
  electricity_pct: number;
  fertilizer_pct: number;
  fuel_pct: number;
  residue_pct: number;
}

export interface CarbonFootprintData {
  total_carbon: number;
  carbon_per_hectare: number;
  electricity_emission: number;
  fertilizer_emission: number;
  fuel_emission: number;
  residue_emission: number;
  emission_breakdown: CarbonBreakdown;
  suggestions: string[];
  unit: string;
}

const FALLBACK_DATA: CarbonFootprintData = {
  total_carbon: 652.5,
  carbon_per_hectare: 81.6,
  electricity_emission: 98.4,
  fertilizer_emission: 535.5,
  fuel_emission: 107.2,
  residue_emission: 45.0,
  emission_breakdown: {
    electricity_pct: 12.5,
    fertilizer_pct: 68.0,
    fuel_pct: 13.6,
    residue_pct: 5.7,
  },
  suggestions: [
    'Reduce nitrogen fertilizer usage — switch to organic compost or nitrification inhibitors.',
    'Install solar-powered irrigation pumps to reduce grid electricity dependence.',
    'Adopt drip irrigation to reduce water and energy consumption.',
    'Track and benchmark your annual emissions to monitor improvement over time.',
  ],
  unit: 'kg CO₂e',
};

export async function getCarbonFootprint(farmId?: string): Promise<CarbonFootprintData> {
  try {
    const params = farmId ? `?farm_id=${farmId}` : '';
    const response = await api.get(`/api/v1/carbon-footprint${params}`);
    return response.data as CarbonFootprintData;
  } catch (err) {
    console.warn('[CarbonService] Backend unavailable, using fallback data');
    return FALLBACK_DATA;
  }
}
