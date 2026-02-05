import { useNavigate } from 'react-router-dom';
import { Home, Sprout, Landmark, Activity, MapPin, BarChart2, Cpu, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CropCard } from '../components/CropCard';

function getProgress(cropId: string): number {
  return 25 + (((cropId.charCodeAt(0) || 0) + new Date().getDate()) % 45);
}

export function MyFarm() {
  const navigate = useNavigate();
  const { getAllCrops, farms } = useApp();
  const crops = getAllCrops().map((c) => ({
    ...c,
    progress: getProgress(c.id),
  }));

  const allCropsCount = crops.length;

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto w-full">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Crop Management</h1>
            <p className="text-sm font-medium text-gray-500">Monitor and manage all active crops</p>
          </div>
          <button
            onClick={() => navigate('/crop-registration')}
            className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/10 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add New Crop</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8 space-y-10">
        {/* Empty State */}
        {allCropsCount === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
              <Sprout className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">No crops added yet</h3>
            <p className="text-gray-500 max-w-xs text-center mb-6">Start by adding your first crop to monitor its health and irrigation.</p>
            <button
              onClick={() => navigate('/crop-registration')}
              className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-green-600/20 hover:bg-green-700 transition-all"
            >
              Add Your First Crop
            </button>
          </div>
        )}

        {/* Farms & Crops Grid */}
        {farms.map((farm) => {
          const farmCrops = crops.filter(c => c.farmId === farm.id);
          if (farmCrops.length === 0) return null;

          return (
            <div key={farm.id} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2.5 rounded-xl text-green-700">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-gray-900">{farm.name}</h2>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{farm.location}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {farmCrops.map((crop) => (
                  <CropCard
                    key={crop.id}
                    id={crop.id}
                    name={crop.name}
                    image={crop.image}
                    farmName={farm.name}
                    sowingDate={crop.sowingDate}
                    healthStatus="healthy" // Mocked for UI demo
                    sensorsActive={true}   // Mocked for UI demo
                    stage={crop.currentStage}
                    progress={crop.progress}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Navigation - Existing Static Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200/80 px-6 py-3 z-[100] shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex justify-between max-w-md mx-auto">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 hover:bg-green-50/50 active:scale-95"
          >
            <Home className="w-6 h-6 text-gray-400" />
            <span className="text-[10px] font-medium text-gray-500">Home</span>
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 hover:bg-green-50/50 active:scale-95"
          >
            <BarChart2 className="w-6 h-6 text-gray-400" />
            <span className="text-[10px] font-medium text-gray-500">Analytics</span>
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 hover:bg-green-50/50 active:scale-95"
          >
            <Landmark className="w-6 h-6 text-gray-400" />
            <span className="text-[10px] font-medium text-gray-500">Schemes</span>
          </button>

          <button
            onClick={() => navigate('/sensor-guide')}
            className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 hover:bg-green-50/50 active:scale-95"
          >
            <Activity className="w-6 h-6 text-gray-400" />
            <span className="text-[10px] font-medium text-gray-500">Sensors</span>
          </button>

          <button
            onClick={() => navigate('/my-farm')}
            className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 hover:bg-green-50/50 active:scale-95"
          >
            <MapPin className="w-6 h-6 text-green-600" />
            <span className="text-[10px] font-medium text-green-600">Crops</span>
          </button>

          <button
            onClick={() => navigate('/ai-engine')}
            className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 hover:bg-green-50/50 active:scale-95"
          >
            <Cpu className="w-6 h-6 text-gray-400" />
            <span className="text-[10px] font-medium text-gray-500 whitespace-nowrap">AI Engine</span>
          </button>
        </div>
      </div>
    </div>
  );
}
