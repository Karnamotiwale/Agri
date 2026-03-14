import { useState, useRef } from 'react';
import { MapPin, X, Check, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { Farm, LandLocation } from '../../context/AppContext';

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

    // Map Interaction State
    const mapRef = useRef<HTMLDivElement>(null);
    const [tempPin, setTempPin] = useState<{ x: number; y: number } | null>(null);
    const [isAddingLand, setIsAddingLand] = useState(false);
    const [newLandName, setNewLandName] = useState('');
    const [newLandArea, setNewLandArea] = useState('');

    const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isAddingLand || !mapRef.current) return;

        const rect = mapRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        setTempPin({ x, y });
        setIsAddingLand(true);
        setNewLandName(`Land ${lands.length + 1}`);
        setNewLandArea('');
    };

    const handleSaveLand = () => {
        if (tempPin && newLandName && newLandArea) {
            setLands([
                ...lands,
                {
                    id: Date.now().toString(),
                    name: newLandName,
                    area: parseFloat(newLandArea),
                    x: tempPin.x,
                    y: tempPin.y,
                },
            ]);
            setTempPin(null);
            setIsAddingLand(false);
            setNewLandName('');
            setNewLandArea('');
        }
    };

    const handleCancelLand = () => {
        setTempPin(null);
        setIsAddingLand(false);
    };

    const handleRemoveLand = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setLands(lands.filter((land) => land.id !== id));
    };

    const handleNext = () => {
        if (step === 1 && farmName && totalArea && cropType) {
            setStep(2);
        }
    };

    const handleSave = async () => {
        if (step === 2 && lands.length > 0) {
            try {
                const farm: Farm = {
                    id: '',
                    name: farmName,
                    location: 'Marked on map',
                    area: String(totalArea) + ' acres',
                    lands: lands as LandLocation[],
                    crops: [],
                    primaryCrop: cropType,
                    latitude: lands[0]?.y || 0,
                    longitude: lands[0]?.x || 0,
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
        setLands([]);
        setTempPin(null);
        setIsAddingLand(false);
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
                            {step === 1 ? 'Add New Farm' : 'Mark Farm Lands'}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {step === 1 ? 'Enter farm details' : 'Tap on map to add land locations'}
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
                                    Total Area (acres)
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
                        <div className="relative h-96">
                            {/* Map */}
                            <div
                                ref={mapRef}
                                onClick={handleMapClick}
                                className="absolute inset-0 bg-[#e6f0e6] cursor-crosshair"
                                style={{
                                    backgroundImage: 'radial-gradient(#c2e0c2 1px, transparent 1px)',
                                    backgroundSize: '20px 20px',
                                }}
                            >
                                {/* Hint */}
                                {lands.length === 0 && !isAddingLand && (
                                    <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-6 py-3 rounded-full shadow-lg z-10 animate-bounce">
                                        <p className="text-green-800 font-medium text-sm flex items-center gap-2">
                                            <MapPin className="w-4 h-4" /> Tap anywhere to mark land
                                        </p>
                                    </div>
                                )}

                                {/* Existing Pins */}
                                {lands.map((land) => (
                                    <div
                                        key={land.id}
                                        className="absolute transform -translate-x-1/2 -translate-y-full group"
                                        style={{ left: `${land.x}%`, top: `${land.y}%` }}
                                    >
                                        <div className="relative">
                                            <MapPin className="w-10 h-10 text-green-600 drop-shadow-md" fill="currentColor" />
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-lg shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                <p className="text-xs font-bold text-gray-800">{land.name}</p>
                                                <p className="text-[10px] text-gray-500">{land.area} ac</p>
                                            </div>
                                            <button
                                                onClick={(e) => handleRemoveLand(land.id, e)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:scale-110"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {/* Temporary Pin */}
                                {tempPin && (
                                    <div
                                        className="absolute transform -translate-x-1/2 -translate-y-full"
                                        style={{ left: `${tempPin.x}%`, top: `${tempPin.y}%` }}
                                    >
                                        <MapPin className="w-12 h-12 text-green-500 animate-bounce" fill="currentColor" />
                                    </div>
                                )}
                            </div>

                            {/* Add Land Form */}
                            {isAddingLand && (
                                <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-20">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-semibold text-sm">Add Land Details</h3>
                                        <button onClick={handleCancelLand} className="p-1 hover:bg-gray-100 rounded-full">
                                            <X className="w-4 h-4 text-gray-600" />
                                        </button>
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            autoFocus
                                            type="text"
                                            value={newLandName}
                                            onChange={(e) => setNewLandName(e.target.value)}
                                            placeholder="Land Name"
                                            className="flex-1 px-3 py-2 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-green-500 text-sm"
                                        />
                                        <input
                                            type="number"
                                            value={newLandArea}
                                            onChange={(e) => setNewLandArea(e.target.value)}
                                            placeholder="Area (acres)"
                                            className="w-32 px-3 py-2 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-green-500 text-sm"
                                        />
                                        <button
                                            onClick={handleSaveLand}
                                            disabled={!newLandName || !newLandArea}
                                            className="bg-green-600 text-white px-4 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                        >
                                            Save
                                        </button>
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
                        disabled={step === 1 ? !farmName || !totalArea || !cropType : lands.length === 0}
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
