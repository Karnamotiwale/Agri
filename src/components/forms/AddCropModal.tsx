import { useState } from 'react';
import { X, Sprout, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { toast } from '../../lib/toast';
import type { Crop, CropStage } from '../../context/AppContext';

interface AddCropModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

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

export function AddCropModal({ isOpen, onClose, onSuccess }: AddCropModalProps) {
    const { addCrop, getAllFarms } = useApp();
    const farms = getAllFarms();

    const [farmId, setFarmId] = useState('');
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
        if (!cropName || !cropType || !sowingDate || !landArea || !location || !farmId) {
            toast.error('Please fill all fields', 'All crop details are required');
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
                id: '',
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
                seedsPlanted: landArea,
            };

            const success = await addCrop(newCrop, farmId);

            if (success) {
                toast.success('Crop registered successfully!', `${cropName} has been added`);
                handleClose();
                onSuccess?.();
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

    const handleClose = () => {
        setFarmId('');
        setCropName('');
        setCropType('');
        setSowingDate('');
        setLandArea('');
        setLocation('');
        onClose();
    };

    if (!isOpen) return null;

    const isFormValid = cropName && cropType && sowingDate && landArea && location && farmId && !isSubmitting;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                            <Sprout className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Add New Crop</h2>
                            <p className="text-sm text-gray-500 mt-0.5">Register a new crop to your farm</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6">
                    <div className="space-y-5">
                        {/* Farm Selection */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Select Farm
                            </label>
                            <select
                                value={farmId}
                                onChange={(e) => setFarmId(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none"
                            >
                                <option value="">Choose a farm</option>
                                {farms.map((farm: any) => (
                                    <option key={farm.id} value={farm.id}>
                                        {farm.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Crop Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Crop Name
                            </label>
                            <input
                                type="text"
                                value={cropName}
                                onChange={(e) => setCropName(e.target.value)}
                                placeholder="e.g. Organic Wheat"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none"
                            />
                        </div>

                        {/* Crop Type */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Crop Type
                            </label>
                            <select
                                value={cropType}
                                onChange={(e) => setCropType(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none"
                            >
                                <option value="">Select Crop Type</option>
                                <option value="wheat">Wheat</option>
                                <option value="rice">Rice</option>
                                <option value="corn">Corn</option>
                                <option value="cotton">Cotton</option>
                                <option value="soybean">Soybean</option>
                                <option value="vegetables">Vegetables</option>
                                <option value="fruits">Fruits</option>
                            </select>
                        </div>

                        {/* Sowing Date */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Sowing Date
                            </label>
                            <input
                                type="date"
                                value={sowingDate}
                                onChange={(e) => setSowingDate(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none"
                            />
                        </div>

                        {/* Land Area */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Land Area (Hectares)
                            </label>
                            <input
                                type="number"
                                value={landArea}
                                onChange={(e) => setLandArea(e.target.value)}
                                placeholder="e.g. 5"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none"
                            />
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Location
                            </label>
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="e.g. North Field"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t border-gray-100 bg-gray-50">
                    <button
                        onClick={handleClose}
                        className="px-6 py-2.5 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!isFormValid}
                        className="px-6 py-2.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                Save Crop <Check className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
