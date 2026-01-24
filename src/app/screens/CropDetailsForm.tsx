import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/app/components/Header';
import { ArrowRight, Calendar, Sprout, Database } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { Crop, CropStage } from '../../context/AppContext';

const CROP_IMAGES: Record<string, string> = {
  wheat: 'https://images.unsplash.com/photo-1625246333195-bf8f85404843?q=80&w=1000&auto=format&fit=crop',
  rice: 'https://images.unsplash.com/photo-1582515073490-dc84fbbf5f84?q=80&w=1000&auto=format&fit=crop',
  corn: 'https://images.unsplash.com/photo-1625246333195-bf8f85404843?q=80&w=1000&auto=format&fit=crop',
  cotton: 'https://images.unsplash.com/photo-1625246333195-bf8f85404843?q=80&w=1000&auto=format&fit=crop',
  soybean: 'https://images.unsplash.com/photo-1625246333195-bf8f85404843?q=80&w=1000&auto=format&fit=crop',
  vegetables: 'https://images.unsplash.com/photo-1589927986089-35812388d1b4?q=80&w=1000&auto=format&fit=crop',
  fruits: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?q=80&w=1000&auto=format&fit=crop',
  default: 'https://images.unsplash.com/photo-1582515073490-dc84fbbf5f84?q=80&w=1000&auto=format&fit=crop',
};

const SOWING_PERIODS: Record<string, string> = {
  wheat: 'Oct – Mar',
  rice: 'Jun – Nov',
  corn: 'May – Sep',
  cotton: 'Apr – Oct',
  soybean: 'Jun – Oct',
  vegetables: 'Jan – Dec',
  fruits: 'Jan – Dec',
};

export function CropDetailsForm() {
  const navigate = useNavigate();
  const { addCrop, farms } = useApp();
  const [cropName, setCropName] = useState('');
  const [cropType, setCropType] = useState('');
  const [sowingDate, setSowingDate] = useState('');
  const [seedsPlanted, setSeedsPlanted] = useState('');
  const [selectedFarmId, setSelectedFarmId] = useState('');

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day} - ${month} - ${year}`;
  };

  const formatShortDate = (dateStr: string): string => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' });
    return `${day} ${month}`;
  };

  const handleSubmit = async () => {
    if (!cropName || !cropType || !sowingDate || !seedsPlanted || !selectedFarmId) {
      return;
    }

    const formattedDate = formatDate(sowingDate);
    const shortDate = formatShortDate(sowingDate);
    const cropImage = CROP_IMAGES[cropType.toLowerCase()] || CROP_IMAGES.default;
    const sowingPeriod = SOWING_PERIODS[cropType.toLowerCase()] || 'Jan – Dec';

    const defaultStages: CropStage[] = [
      { name: 'Planting Phase', description: `Planting phase started ${shortDate}`, date: shortDate, isActive: true },
      { name: 'Vegetative Phase', description: 'Vegetative growth phase', date: '—', isActive: false },
      { name: 'Flowering Phase', description: 'Flowering phase', date: '—', isActive: false },
      { name: 'Harvesting Phase', description: 'Harvesting phase', date: '—', isActive: false },
    ];

    const newCrop: Crop = {
      id: 'c' + Date.now(),
      name: cropName,
      image: cropImage,
      location: 'Field',
      landArea: '1 Hectares of land',
      landSize: '1 Hectares of land',
      sowingDate: formattedDate,
      sowingPeriod: sowingPeriod,
      currentStage: 'Planting Phase',
      stageDate: shortDate,
      stages: defaultStages,
      farmId: selectedFarmId,
      seedsPlanted: seedsPlanted,
      cropType: cropType,
    };

    const success = await addCrop(newCrop, selectedFarmId);
    if (success) {
      navigate('/dashboard');
    }
  };

  const isFormValid = cropName && cropType && sowingDate && seedsPlanted && selectedFarmId;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header
        title="Add Crop Details"
        showBack
        onBackClick={() => navigate('/dashboard')}
        hideRightIcon
      />

      <div className="flex-1 p-6 flex flex-col">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white flex items-center justify-center font-bold text-xl shadow-lg">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Crop Information</h2>
              <p className="text-gray-600 text-sm font-medium mt-0.5">Add crop details</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Crop Name
              </label>
              <input
                type="text"
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                placeholder="e.g. Wheat, Rice, Corn"
                className="w-full px-4 py-4 bg-gradient-to-br from-gray-50 to-gray-50/80 border border-gray-200/50 rounded-2xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/15 focus:shadow-lg focus:shadow-green-500/10 transition-all outline-none text-gray-900 font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Crop Type
              </label>
              <select
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                className="w-full px-4 py-4 bg-gradient-to-br from-gray-50 to-gray-50/80 border border-gray-200/50 rounded-2xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/15 focus:shadow-lg focus:shadow-green-500/10 transition-all outline-none appearance-none text-gray-900 font-medium"
              >
                <option value="">Select Crop Type</option>
                <option value="wheat">Wheat</option>
                <option value="rice">Rice</option>
                <option value="corn">Corn</option>
                <option value="cotton">Cotton</option>
                <option value="soybean">Soybean</option>
                <option value="vegetables">Vegetables</option>
                <option value="fruits">Fruits</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                Sowing Date
              </label>
              <input
                type="date"
                value={sowingDate}
                onChange={(e) => setSowingDate(e.target.value)}
                className="w-full px-4 py-4 bg-gradient-to-br from-gray-50 to-gray-50/80 border border-gray-200/50 rounded-2xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/15 focus:shadow-lg focus:shadow-green-500/10 transition-all outline-none text-gray-900 font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Database className="w-4 h-4 text-gray-500" />
                Seeds Planted
              </label>
              <input
                type="number"
                value={seedsPlanted}
                onChange={(e) => setSeedsPlanted(e.target.value)}
                placeholder="e.g. 1000"
                min="0"
                step="1"
                className="w-full px-4 py-4 bg-gradient-to-br from-gray-50 to-gray-50/80 border border-gray-200/50 rounded-2xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/15 focus:shadow-lg focus:shadow-green-500/10 transition-all outline-none text-gray-900 font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Farm
              </label>
              <select
                value={selectedFarmId}
                onChange={(e) => setSelectedFarmId(e.target.value)}
                className="w-full px-4 py-4 bg-gradient-to-br from-gray-50 to-gray-50/80 border border-gray-200/50 rounded-2xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/15 focus:shadow-lg focus:shadow-green-500/10 transition-all outline-none appearance-none text-gray-900 font-medium"
              >
                <option value="">Select Farm</option>
                {farms.map((farm) => (
                  <option key={farm.id} value={farm.id}>
                    {farm.name} - {farm.area}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!isFormValid}
          className="mt-auto w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4.5 rounded-2xl font-bold text-lg hover:from-green-700 hover:to-green-800 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xl shadow-green-600/30 hover:shadow-2xl hover:shadow-green-600/40"
        >
          Register Crop
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
