import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Tag, 
  Layers, 
  Database, 
  Cpu, 
  Activity,
  ChevronRight,
  ChevronDown,
  Sprout
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BottomNav } from '../../components/layout/BottomNav';

export default function CropMonitoringPage() {
  const navigate = useNavigate();
  const { crops, farms, selectedFarmId, setSelectedFarmId } = useApp();

  const selectedFarm = farms.find(f => f.id === selectedFarmId);
  const selectedFarmCrops = selectedFarm ? crops.filter(c => String(c.farmId) === String(selectedFarm.id)) : [];

  return (
    <div className="min-h-screen bg-[#F8FAFB] pb-24">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-6 shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-4 mb-4">
          <button 
            onClick={() => navigate('/services')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Crop Monitoring</h1>
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
          
          <div className="flex items-center justify-between gap-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-2xl border border-gray-100 cursor-pointer">
            <div className="flex items-center gap-2">
               <Layers className="w-4 h-4" />
               <span>Farm: <span className="font-bold text-gray-900">{selectedFarm?.name || 'Select a Farm'}</span></span>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="px-6 py-8 space-y-8">
        {selectedFarmCrops.map((crop) => (
          <div 
            key={crop.id}
            className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl shadow-gray-200/50 border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            {/* Crop Card Header */}
            <div className="relative h-48">
              <img 
                src={crop.image} 
                alt={crop.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div>
                  <h2 className="text-3xl font-black text-white mb-1">{crop.name}</h2>
                  <div className="inline-flex items-center gap-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    <Activity className="w-3 h-3" />
                    Active Monitoring
                  </div>
                </div>
              </div>
            </div>

            {/* Crop Info Grid */}
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <InfoItem 
                  icon={Calendar} 
                  label="Sowing Date" 
                  value={crop.sowingDate} 
                  color="text-blue-600"
                  bgColor="bg-blue-50"
                />
                <InfoItem 
                  icon={Calendar} 
                  label="Harvest Date" 
                  value={crop.harvestDate || 'Not set'} 
                  color="text-amber-600"
                  bgColor="bg-amber-50"
                />
                <InfoItem 
                  icon={Tag} 
                  label="Crop Class" 
                  value={crop.cropClass || 'General'} 
                  color="text-purple-600"
                  bgColor="bg-purple-50"
                />
                <InfoItem 
                  icon={Layers} 
                  label="Variety" 
                  value={crop.cropVariety || 'Hybrid'} 
                  color="text-green-600"
                  bgColor="bg-green-50"
                />
                <InfoItem 
                  icon={Database} 
                  label="Soil Type" 
                  value={crop.soilType || 'Loamy'} 
                  color="text-orange-600"
                  bgColor="bg-orange-50"
                />
                <div className="col-span-1">
                   <InfoItem 
                    icon={Cpu} 
                    label="Devices" 
                    value={crop.devices?.join(', ') || '0 Active'} 
                    color="text-gray-700"
                    bgColor="bg-gray-50"
                  />
                </div>
              </div>

              {/* Phenological Stages */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">Phenological Stages</h3>
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                    Stage: {crop.currentStage}
                  </span>
                </div>
                
                <div className="relative pt-2 pb-6 px-2">
                  <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-100 -translate-y-1/2 rounded-full" />
                  <div className="relative flex justify-between">
                    {['Vegetative', 'Flowering', 'Maturation', 'Harvest'].map((stage, i) => {
                      const isActive = crop.currentStage === stage;
                      const isPast = ['Vegetative'].includes(stage) && crop.currentStage !== 'Vegetative'; // Simplified check
                      
                      return (
                        <div key={stage} className="flex flex-col items-center gap-2">
                          <div className={`w-4 h-4 rounded-full border-4 z-10 transition-all duration-500 ${
                            isActive ? 'bg-green-600 border-green-100 scale-125 shadow-lg' : 
                            isPast ? 'bg-green-600 border-white' : 'bg-white border-gray-200'
                          }`} />
                          <span className={`text-[10px] font-bold uppercase tracking-tighter ${
                            isActive ? 'text-green-600' : 'text-gray-400'
                          }`}>
                            {stage}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => navigate(`/crop/${crop.id}/details`)}
                className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all active:scale-95"
              >
                <span>View Full Analysis</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}

        {selectedFarmCrops.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sprout className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No crops for this farm</h3>
            <p className="text-gray-500 max-w-xs mx-auto">Add a crop from the dashboard to start monitoring.</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

function InfoItem({ icon: Icon, label, value, color, bgColor }: any) {
  return (
    <div className="flex flex-col gap-1.5 p-3 rounded-2xl hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-2">
        <div className={`p-1.5 rounded-lg ${bgColor}`}>
          <Icon className={`w-3.5 h-3.5 ${color}`} />
        </div>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-sm font-bold text-gray-900 truncate">{value}</p>
    </div>
  );
}
