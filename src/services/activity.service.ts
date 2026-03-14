// ============================================
// ACTIVITY SERVICE — Mock data provider
// ============================================

export interface ActivityGeneral {
  activityType: string;
  date: string;
  rotationAtDate: string;
  sowingDate: string;
  harvestDate: string;
}

export interface ActivityDetails {
  weatherStatus: string;
  method: string;
  objective: string;
  waterSource: string;
  operation: string;
}

export interface ActivityLog {
  id: string;
  general: ActivityGeneral;
  details: ActivityDetails;
}

const _logs: ActivityLog[] = [
  {
    id: 'act1',
    general: {
      activityType: 'Irrigation',
      date: '15 Mar, 2026',
      rotationAtDate: 'Rice - Wheat - Rice',
      sowingDate: '10 Feb, 2026',
      harvestDate: '20 Jun, 2026'
    },
    details: {
      weatherStatus: 'Sunny',
      method: 'Drip Irrigation',
      objective: 'Moisture Maintenance',
      waterSource: 'Borewell 1',
      operation: 'Morning Schedule'
    }
  },
  {
    id: 'act2',
    general: {
      activityType: 'Fertilization',
      date: '12 Mar, 2026',
      rotationAtDate: 'Rice - Wheat - Rice',
      sowingDate: '10 Feb, 2026',
      harvestDate: '20 Jun, 2026'
    },
    details: {
      weatherStatus: 'Cloudy',
      method: 'Manual Spreading',
      objective: 'Nitrogen Boost',
      waterSource: 'N/A',
      operation: 'NPK Application'
    }
  },
  {
    id: 'act3',
    general: {
      activityType: 'Planting',
      date: '10 Feb, 2026',
      rotationAtDate: 'Rice - Wheat - Rice',
      sowingDate: '10 Feb, 2026',
      harvestDate: '20 Jun, 2026'
    },
    details: {
      weatherStatus: 'Mild Rain',
      method: 'Transplanting',
      objective: 'New Crop Start',
      waterSource: 'Canal',
      operation: 'Manual Labor'
    }
  }
];

export const activityService = {
  getAllLogs: async (): Promise<ActivityLog[]> => {
    return [..._logs];
  }
};
