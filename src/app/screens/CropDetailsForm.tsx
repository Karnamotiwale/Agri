import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { ArrowRight, Calendar, Sprout, Database, Camera, Upload, X, Loader2 } from 'lucide-react';
import { useRef } from 'react';
import { useApp } from '../../context/AppContext';
import type { Crop, CropStage } from '../../context/AppContext';
import { cropService } from '../../services/crop.service';

const ALLOWED_CROPS = [
  { id: 'rice', name: 'Rice', icon: '🌾', description: 'Semi-aquatic cereal' },
  { id: 'wheat', name: 'Wheat', icon: '🍞', description: 'Cereal grass' },
  { id: 'maize', name: 'Maize', icon: '🌽', description: 'Corn/Cereal' },
  { id: 'sugarcane', name: 'Sugarcane', icon: '🎋', description: 'Tall perennial grass' },
  { id: 'pulses', name: 'Pulses', icon: '🫘', description: 'Leguminous crops' },
];

const CROP_IMAGES: Record<string, string> = {
  wheat: 'https://images.unsplash.com/photo-1625246333195-bf8f85404843?q=80&w=1000&auto=format&fit=crop',
  rice: 'https://images.unsplash.com/photo-1582515073490-dc84fbbf5f84?q=80&w=1000&auto=format&fit=crop',
  maize: 'https://images.unsplash.com/photo-1625246333195-bf8f85404843?q=80&w=1000&auto=format&fit=crop',
  sugarcane: 'https://images.unsplash.com/photo-1673200692829-fcdb7e267fc1?q=80&w=1000&auto=format&fit=crop',
  pulses: 'https://images.unsplash.com/photo-1589927986089-35812388d1b4?q=80&w=1000&auto=format&fit=crop',
  default: 'https://images.unsplash.com/photo-1582515073490-dc84fbbf5f84?q=80&w=1000&auto=format&fit=crop',
};

const SOWING_PERIODS: Record<string, string> = {
  wheat: 'Oct – Mar',
  rice: 'Jun – Nov',
  maize: 'May – Sep',
  sugarcane: 'Feb – Apr',
  pulses: 'Jun – Oct',
};

export function CropDetailsForm() {
  const navigate = useNavigate();
  const { addCrop, farms } = useApp();
  const [cropName, setCropName] = useState('');
  const [cropType, setCropType] = useState('');
  const [sowingDate, setSowingDate] = useState('');
  const [seedsPlanted, setSeedsPlanted] = useState('');
  const [selectedFarmId, setSelectedFarmId] = useState('');
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

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

    setIsSubmitting(true);

    try {
      const formattedDate = formatDate(sowingDate);
      const shortDate = formatShortDate(sowingDate);
      const cropImage = customImage || CROP_IMAGES[cropType.toLowerCase()] || CROP_IMAGES.default;
      const sowingPeriod = SOWING_PERIODS[cropType.toLowerCase()] || 'Jan – Dec';

      const defaultStages: CropStage[] = [
        { name: 'Planting Phase', description: `Planting phase started ${shortDate}`, date: shortDate, isActive: true },
        { name: 'Vegetative Phase', description: 'Vegetative growth phase', date: '—', isActive: false },
        { name: 'Flowering Phase', description: 'Flowering phase', date: '—', isActive: false },
        { name: 'Harvesting Phase', description: 'Harvesting phase', date: '—', isActive: false },
      ];

      const newCrop: Crop = {
        id: 'c' + Date.now(),
        name: cropType.charAt(0).toUpperCase() + cropType.slice(1),
        image: cropImage,
        location: 'Field',
        landArea: '1 Hectares of land',
        landSize: '1 Hectares of land',
        sowingDate: sowingDate,
        sowingPeriod: sowingPeriod,
        currentStage: 'Planting Phase',
        stageDate: shortDate,
        stages: defaultStages,
        farmId: selectedFarmId,
        seedsPlanted: seedsPlanted,
        cropType: cropType,
      };

      // We need to bypass the context addCrop for file upload because context might not expose the file param
      // Or we can modify the context. For now, let's try to use the service directly if possible, 
      // but AppContext keeps local state in sync. 
      // The cleaner way is to update AppContext, but we don't have access to modify it easily right now without a full refactor.
      // So we will upload the image first if it exists, get the URL, update the crop object, and then call addCrop.

      let finalCrop = { ...newCrop };

      if (imageFile) {
        const uploadedUrl = await cropService.uploadCropImage(imageFile);
        if (uploadedUrl) {
          finalCrop.image = uploadedUrl;
        }
      }

      const success = await addCrop(finalCrop, selectedFarmId);
      if (success) {
        navigate('/dashboard');
      }
    } catch (e) {
      console.error("Failed to add crop", e);
      alert("Failed to add crop. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = cropType && sowingDate && seedsPlanted && selectedFarmId;

  const handleImageUpload = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }
    if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
      alert('Please upload a JPG or PNG image');
      return;
    }

    setImageFile(file); // Store file for upload

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setCustomImage(imageUrl); // Preview
    };
    reader.readAsDataURL(file);
  };


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

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Crop Image</label>

            {customImage ? (
              <div className="relative w-full h-48 rounded-2xl overflow-hidden shadow-md group">
                <img src={customImage} alt="Crop preview" className="w-full h-full object-cover" />
                <button
                  onClick={() => {
                    setCustomImage(null);
                    setImageFile(null);
                  }}
                  className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-2 p-6 rounded-2xl border-2 border-dashed border-gray-300 hover:border-green-500 hover:bg-green-50 transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <Camera className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-600 group-hover:text-green-700">Capture</span>
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-2 p-6 rounded-2xl border-2 border-dashed border-gray-300 hover:border-green-500 hover:bg-green-50 transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <Upload className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-600 group-hover:text-blue-700">Upload</span>
                </button>
              </div>
            )}

            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
            />
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Select Crop Type (Whitelist Only)
              </label>
              <div className="grid grid-cols-1 gap-3">
                {ALLOWED_CROPS.map((crop) => (
                  <button
                    key={crop.id}
                    onClick={() => {
                      setCropType(crop.id);
                      setCropName(crop.name);
                    }}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 ${cropType === crop.id
                      ? 'border-green-500 bg-green-50 shadow-md transform scale-[1.02]'
                      : 'border-gray-100 bg-gray-50/50 hover:border-gray-200'
                      }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-2xl">
                      {crop.icon}
                    </div>
                    <div className="text-left flex-1">
                      <h4 className={`font-bold transition-colors ${cropType === crop.id ? 'text-green-700' : 'text-gray-900'}`}>
                        {crop.name}
                      </h4>
                      <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">{crop.description}</p>
                    </div>
                    {cropType === crop.id && (
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                        <Database className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
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
          disabled={!isFormValid || isSubmitting}
          className="mt-auto w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4.5 rounded-2xl font-bold text-lg hover:from-green-700 hover:to-green-800 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xl shadow-green-600/30 hover:shadow-2xl hover:shadow-green-600/40"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Registering...
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
