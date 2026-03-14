import React from 'react';
import { DiseaseDetection } from '../../features/crop-health/DiseaseDetection';

export function DashboardCarousel() {
  return (
    <div className="w-full bg-gradient-to-b from-cyan-50 to-white pb-6 pt-2 rounded-b-[4rem]">
       <DiseaseDetection />
    </div>
  );
}
