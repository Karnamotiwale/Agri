import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from '@/app/components/Header';
import { ArrowRight, Calendar, MapPin, Sprout, Upload } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { toast } from '../../lib/toast';
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

export function CropRegistration() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const farmId = searchParams.get('farmId') || '';
  const { addCrop, getFarm } = useApp();
  const farm = getFarm(farmId);

  const [cropName, setCropName] = useState('');
  const [cropType, setCropType] = useState('');
  const [sowingDate, setSowingDate] = useState('');
  const [landArea, setLandArea] = useState('');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (!cropName || !cropType || !sowingDate || !landArea || !location) {
      toast.error('Please fill all fields', 'All crop details are required');
      return;
    }

    if (!farmId) {
      toast.error('No farm selected', 'Please select a farm to register this crop');
      navigate('/dashboard');
      return;
    }

    setIsSubmitting(true);

    try {
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
        id: '', // Will be set by database
        name: cropName,
        image: cropImage,
        location: location,
        landArea: `${landArea} Hectares of land`,
        landSize: `${landArea} Hectares of land`,
        sowingDate: formattedDate,
        sowingPeriod: sowingPeriod,
        currentStage: 'Planting Phase',
        stageDate: shortDate,
        stages: defaultStages,
        farmId: farmId,
        cropType: cropType,
        seedsPlanted: landArea, // Using land area as seed count approximation
      };

      const success = await addCrop(newCrop, farmId);

      if (success) {
        toast.success('Crop registered successfully!', `${cropName} has been added to ${farm?.name || 'your farm'}`);
        navigate('/dashboard');
      } else {
        toast.error('Failed to register crop', 'Please try again');
      }
    } catch (error: any) {
      console.error('Error saving crop:', error);
      toast.error('Error registering crop', error.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = cropName && cropType && sowingDate && landArea && location && !isSubmitting;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header
        title="Register Crop"
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
              <p className="text-gray-600 text-sm font-medium mt-0.5">
                {farm ? `Registering crop for ${farm.name}` : 'Add crop details'}
              </p>
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
                disabled={isSubmitting}
                className="w-full px-4 py-4 bg-gradient-to-br from-gray-50 to-gray-50/80 border border-gray-200/50 rounded-2xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/15 focus:shadow-lg focus:shadow-green-500/10 transition-all outline-none text-gray-900 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Crop Type
              </label>
              <select
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-4 bg-gradient-to-br from-gray-50 to-gray-50/80 border border-gray-200/50 rounded-2xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/15 focus:shadow-lg focus:shadow-green-500/10 transition-all outline-none appearance-none text-gray-900 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
                disabled={isSubmitting}
                className="w-full px-4 py-4 bg-gradient-to-br from-gray-50 to-gray-50/80 border border-gray-200/50 rounded-2xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/15 focus:shadow-lg focus:shadow-green-500/10 transition-all outline-none text-gray-900 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                Location / Greenhouse
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. 1 Greenhouse, North Field"
                disabled={isSubmitting}
                className="w-full px-4 py-4 bg-gradient-to-br from-gray-50 to-gray-50/80 border border-gray-200/50 rounded-2xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/15 focus:shadow-lg focus:shadow-green-500/10 transition-all outline-none text-gray-900 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Land Area (Hectares)
              </label>
              <input
                type="number"
                value={landArea}
                onChange={(e) => setLandArea(e.target.value)}
                placeholder="e.g. 12"
                min="0"
                step="0.1"
                disabled={isSubmitting}
                className="w-full px-4 py-4 bg-gradient-to-br from-gray-50 to-gray-50/80 border border-gray-200/50 rounded-2xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/15 focus:shadow-lg focus:shadow-green-500/10 transition-all outline-none text-gray-900 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!isFormValid}
          className="mt-auto w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4.5 rounded-2xl font-bold text-lg hover:from-green-700 hover:to-green-800 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xl shadow-green-600/30 hover:shadow-2xl hover:shadow-green-600/40"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Registering Crop...
            </>
          ) : (
            <>
              Register Crop
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
