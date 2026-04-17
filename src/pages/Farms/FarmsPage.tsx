import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, MapPin, Plus, Tractor } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useFarm } from '../../context/FarmContext';
import { CropCard } from '@/components/cards/CropCard';
import { BottomNav } from '../../components/layout/BottomNav';
import { AddFarmModal } from '../../components/forms/AddFarmModal';
import { AddCropModal } from '../../components/forms/AddCropModal';

function getProgress(cropId: string): number {
  return 25 + (((cropId.charCodeAt(0) || 0) + new Date().getDate()) % 45);
}

export default function MyFarm() {
  const navigate = useNavigate();
  const { getAllCrops, farms } = useApp();
  const { refreshFarms, setSelectedFarmId } = useFarm();
  const crops = getAllCrops().map((c) => ({
    ...c,
    progress: getProgress(c.id),
  }));

  const [showAddFarmModal, setShowAddFarmModal] = useState(false);
  const [showAddCropModal, setShowAddCropModal] = useState(false);

  const allCropsCount = crops.length;

  // Called when farm is saved — refresh FarmContext, then open crop modal
  const handleFarmSuccess = (_farmId: string) => {
    setShowAddFarmModal(false);
    refreshFarms(); // Sync FarmContext with new farm
    if (_farmId) setSelectedFarmId(_farmId); // Select the new farm globally
    setTimeout(() => setShowAddCropModal(true), 300);
  };

  return (
    <div className="min-h-screen pb-24" style={{ background: 'var(--background)' }}>
      {/* Header */}
      <div
        className="sticky top-0 z-50 px-6 py-4 border-b"
        style={{ background: 'white', borderColor: '#E6F4EA', boxShadow: '0 2px 12px rgba(46,125,50,0.06)' }}
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto w-full">
          <div>
            <h1 className="text-2xl font-black" style={{ color: '#1B3A1B' }}>Crop Management</h1>
            <p className="text-sm font-medium" style={{ color: '#4F6F52' }}>Monitor and manage all active crops</p>
          </div>

          {/* Three action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/farms/tag-land')}
              className="flex items-center gap-1.5 bg-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm active:scale-95"
              style={{ border: '1.5px solid #64B5F6', color: '#1565C0' }}
            >
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">Tag Land</span>
            </button>
            <button
              onClick={() => setShowAddFarmModal(true)}
              className="flex items-center gap-1.5 bg-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm active:scale-95"
              style={{ border: '1.5px solid #C7E76C', color: '#2E7D32' }}
            >
              <Tractor className="w-4 h-4" />
              <span className="hidden sm:inline">Add Farm</span>
            </button>
            <button
              onClick={() => setShowAddCropModal(true)}
              className="flex items-center gap-1.5 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md active:scale-95"
              style={{ background: 'linear-gradient(135deg, #4CAF50, #2E7D32)', boxShadow: '0 4px 16px rgba(76,175,80,0.3)' }}
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Crop</span>
            </button>
          </div>
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
            <p className="text-gray-500 max-w-xs text-center mb-6">Start by registering your farm first, then add crops to it.</p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowAddFarmModal(true)}
                className="flex items-center gap-2 border border-gray-200 text-gray-700 px-5 py-3 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all"
              >
                <Tractor className="w-4 h-4" />
                Register Farm
              </button>
              <button
                onClick={() => setShowAddCropModal(true)}
                className="flex items-center gap-2 bg-green-600 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-lg shadow-green-600/20 hover:bg-green-700 transition-all"
              >
                <Plus className="w-4 h-4" />
                Add First Crop
              </button>
            </div>
          </div>
        )}

        {/* Farms & Crops Grid */}
        {farms.map((farm) => {
          const farmCrops = crops.filter(c => String(c.farmId) === String(farm.id));
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
                    healthStatus="healthy"
                    sensorsActive={true}
                    stage={crop.currentStage}
                    progress={crop.progress}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Add Farm Modal — on success, auto-opens Add Crop Modal */}
      <AddFarmModal
        isOpen={showAddFarmModal}
        onClose={() => setShowAddFarmModal(false)}
        onSuccess={handleFarmSuccess}
      />

      {/* Add Crop Modal */}
      <AddCropModal
        isOpen={showAddCropModal}
        onClose={() => setShowAddCropModal(false)}
        onSuccess={() => setShowAddCropModal(false)}
      />
    </div>
  );
}
