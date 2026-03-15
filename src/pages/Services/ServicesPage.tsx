import React from 'react';
import { 
  Sprout, 
  CloudSun, 
  BarChart, 
  Tractor, 
  FileText, 
  Droplets,
  ChevronDown,
  MapPin
} from 'lucide-react';
import { BottomNav } from '../../components/layout/BottomNav';

const services = [
  { icon: Sprout, label: 'Crop Monitoring', color: 'bg-white' },
  { icon: CloudSun, label: 'Weather, Soil and Pest', color: 'bg-white' },
  { icon: BarChart, label: 'Analysis', color: 'bg-white' },
  { icon: Tractor, label: 'Soil Analysis', color: 'bg-white' },
  { icon: FileText, label: 'Activity Logs', color: 'bg-white' },
];

import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export default function ServicesPage() {
  const navigate = useNavigate();
  const { auth, farms, selectedFarmId, setSelectedFarmId } = useApp();
  return (
    <div className="min-h-screen bg-[#F4F7F6] pb-24">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2 h-6 bg-amber-500 rounded-full"></div>
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
        </div>

        {/* Location Selector (Interactive Dropdown) */}
        <div className="relative">
          <select
            value={selectedFarmId || ''}
            onChange={(e) => setSelectedFarmId(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          >
            {farms.map((farm) => (
              <option key={farm.id} value={farm.id}>
                {farm.name}
              </option>
            ))}
          </select>
          
          <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between border border-gray-100 cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="bg-gray-50 p-2 rounded-xl">
                <MapPin className="w-5 h-5 text-gray-900" />
              </div>
              <span className="text-sm font-medium text-gray-700">
                {farms.find(f => f.id === selectedFarmId)?.name || 'Select a Farm'}
              </span>
            </div>
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="px-6 grid grid-cols-2 gap-4">
        {services.map((service, index) => (
          <div 
            key={index}
            onClick={() => {
              if (service.label === 'Crop Monitoring') navigate('/crop-monitoring');
              if (service.label === 'Weather, Soil and Pest') navigate('/weather-soil-pest');
              if (service.label === 'Analysis') navigate('/analysis');
              if (service.label === 'Soil Analysis') navigate('/soil-analysis');
              if (service.label === 'Activity Logs') navigate('/activity-logs');
            }}
            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-50 flex flex-col items-start gap-4 active:scale-95 transition-transform cursor-pointer"
          >
            <div className="p-3 bg-gray-50 rounded-2xl">
              <service.icon className="w-8 h-8 text-black" />
            </div>
            <span className="text-sm font-bold text-gray-800 leading-tight">
              {service.label}
            </span>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
