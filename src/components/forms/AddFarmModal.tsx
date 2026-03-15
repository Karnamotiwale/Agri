import { useState } from 'react';
import { MapPin, X, Check, ArrowRight, Save } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { Farm, LandLocation } from '../../context/AppContext';
import { FarmMap } from '../maps/FarmMap';

interface AddFarmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: (farmId: string) => void;
}

export function AddFarmModal({ isOpen, onClose, onSuccess }: AddFarmModalProps) {
    const { addFarm } = useApp();
    const [step, setStep] = useState(1);
    const [farmName, setFarmName] = useState('');
    const [totalArea, setTotalArea] = useState('');
    const [cropType, setCropType] = useState('');
    const [lands, setLands] = useState<LandLocation[]>([]);

    // Real Map State
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [address, setAddress] = useState<string>('');
    const [boundaryGeojson, setBoundaryGeojson] = useState<any>(null);

    const handleLocationChange = (lat: number, lng: number, addr?: string) => {
        setLatitude(lat);
        setLongitude(lng);
        if (addr) setAddress(addr);
    };

    const handlePolygonChange = (geojson: GeoJSON.Polygon | null) => {
        setBoundaryGeojson(geojson);
    };

    const handleNext = () => {
        if (step === 1 && farmName && totalArea && cropType) {
            setStep(2);
        }
    };

    const handleSave = async () => {
        if (step === 2 && latitude && longitude) {
            try {
                const farm: Farm = {
                    id: '',
                    name: farmName,
                    location: address || 'Marked on map',
                    area: String(totalArea) + ' ha',
                    lands: [], // Backward compatibility with mock lands array handled by service
                    crops: [],
                    primaryCrop: cropType,
                    latitude,
                    longitude,
                    boundary_geojson: boundaryGeojson
                };

                const farmId = await addFarm(farm);
                if (farmId) {
                    onSuccess?.(farmId);
                    handleClose();
                } else {
                    alert('Failed to save farm. Please try again.');
                }
            } catch (error: any) {
                console.error('Error saving farm:', error);
                alert(`Error: ${error.message || 'Failed to save farm'}`);
            }
        }
    };

    const handleClose = () => {
        setStep(1);
        setFarmName('');
        setTotalArea('');
        setCropType('');
        setLatitude(null);
        setLongitude(null);
        setAddress('');
        setBoundaryGeojson(null);
        onClose();
    };

    if (!isOpen) return null;

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
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            {step === 1 ? 'Add New Farm' : '🗺️ Tag Your Farm Land'}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {step === 1 ? 'Enter farm details' : 'Mark the location and draw boundaries'}
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-180px)]">
                    {step === 1 ? (
                        <div className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Farm Name
                                </label>
                                <input
                                    type="text"
                                    value={farmName}
                                    onChange={(e) => setFarmName(e.target.value)}
                                    placeholder="e.g. Green Valley Farm"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Total Area (ha)
                                </label>
                                <input
                                    type="number"
                                    value={totalArea}
                                    onChange={(e) => setTotalArea(e.target.value)}
                                    placeholder="e.g. 50"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Primary Crop
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
                        </div>
                    ) : (
                        <div className="p-4">
                            <FarmMap 
                                height={380}
                                onLocationChange={handleLocationChange}
                                onPolygonChange={handlePolygonChange}
                            />
                            {address && (
                                <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-2 animate-in slide-in-from-bottom-2 duration-300">
                                    <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">Detected Location</p>
                                        <p className="text-sm text-blue-900 font-medium leading-normal">{address}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t border-gray-100 bg-gray-50">
                    <button
                        onClick={step === 2 ? () => setStep(1) : handleClose}
                        className="px-6 py-2.5 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                    >
                        {step === 2 ? 'Back' : 'Cancel'}
                    </button>
                    <button
                        onClick={step === 1 ? handleNext : handleSave}
                        disabled={step === 1 ? !farmName || !totalArea || !cropType : !latitude}
                        className="px-6 py-2.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                    >
                        {step === 1 ? (
                            <>
                                Next <ArrowRight className="w-4 h-4" />
                            </>
                        ) : (
                            <>
                                Save Farm <Check className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
