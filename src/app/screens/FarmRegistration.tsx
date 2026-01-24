import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/app/components/Header';
import { MapPin, Plus, Trash2, ArrowRight, X, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { Farm, LandLocation } from '../../context/AppContext';

export function FarmRegistration() {
  const navigate = useNavigate();
  const { addFarm } = useApp();
  const [step, setStep] = useState(1);
  const [farmName, setFarmName] = useState('');
  const [totalArea, setTotalArea] = useState('');
  const [cropType, setCropType] = useState('');
  const [lands, setLands] = useState<LandLocation[]>([]);

  // Map Interaction State
  const mapRef = useRef<HTMLDivElement>(null);
  const [tempPin, setTempPin] = useState<{ x: number, y: number } | null>(null);
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

  const handleNext = async () => {
    if (step === 1 && farmName && totalArea && cropType) {
      setStep(2);
    } else if (step === 2 && lands.length > 0) {
      try {
        const farm: Farm = {
          id: '', // Will be set by database
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
          navigate(`/crop-registration?farmId=${farmId}`);
        } else {
          alert('Failed to save farm. Please try again.');
        }
      } catch (error: any) {
        console.error('Error saving farm:', error);
        alert(`Error: ${error.message || 'Failed to save farm'}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header
        title={step === 1 ? "Add Farm Details" : "Mark Lands"}
        showBack
        onBackClick={step === 2 ? () => setStep(1) : () => navigate('/dashboard')}
        hideRightIcon
      />

      {/* Step 1: Basic Information */}
      {step === 1 && (
        <div className="flex-1 p-6 flex flex-col justify-start">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-xl">1</div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Basic Info</h2>
                <p className="text-gray-500 text-sm">Tell us about your main farm</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Farm Name
                </label>
                <input
                  type="text"
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  placeholder="e.g. Green Valley Farm"
                  className="w-full px-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Estimated Area (acres)
                </label>
                <input
                  type="number"
                  value={totalArea}
                  onChange={(e) => setTotalArea(e.target.value)}
                  placeholder="e.g. 50"
                  className="w-full px-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Crop
                </label>
                <select
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  className="w-full px-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none appearance-none"
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
          </div>

          <button
            onClick={handleNext}
            disabled={!farmName || !totalArea || !cropType}
            className="mt-auto w-full bg-green-600 text-white py-4 rounded-2xl font-semibold text-lg hover:bg-green-700 hover:shadow-lg hover:shadow-green-600/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Locate Farm on Map
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Step 2: Interactive Map */}
      {step === 2 && (
        <div className="flex-1 relative flex flex-col">
          {/* Map Surface */}
          <div
            ref={mapRef}
            onClick={handleMapClick}
            className="flex-1 bg-[#e6f0e6] relative overflow-hidden cursor-crosshair active:cursor-grabbing"
            style={{
              backgroundImage: 'radial-gradient(#c2e0c2 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          >
            {/* Map Placeholder Graphic to make it look real */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 100 Q 250 50 500 100 T 1000 100" stroke="green" strokeWidth="2" fill="none" />
                <path d="M0 300 Q 250 250 500 300 T 1000 300" stroke="green" strokeWidth="2" fill="none" />
                <path d="M200 0 Q 300 300 200 600" stroke="green" strokeWidth="2" fill="none" />
              </svg>
            </div>

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

            {/* Temporary Pin (Being Added) */}
            {tempPin && (
              <div
                className="absolute transform -translate-x-1/2 -translate-y-full"
                style={{ left: `${tempPin.x}%`, top: `${tempPin.y}%` }}
              >
                <MapPin className="w-12 h-12 text-green-500 animate-bounce" fill="currentColor" />
              </div>
            )}
          </div>

          {/* Bottom Sheet / Controls */}
          <div className="bg-white rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)] p-6 z-20">
            {isAddingLand ? (
              <div className="animate-in slide-in-from-bottom duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">Add Land Details</h3>
                  <button onClick={handleCancelLand} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                <div className="space-y-4">
                  <input
                    autoFocus
                    type="text"
                    value={newLandName}
                    onChange={(e) => setNewLandName(e.target.value)}
                    placeholder="Land Name"
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-green-500"
                  />
                  <div className="flex gap-4">
                    <input
                      type="number"
                      value={newLandArea}
                      onChange={(e) => setNewLandArea(e.target.value)}
                      placeholder="Area (acres)"
                      className="flex-1 px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                      onClick={handleSaveLand}
                      disabled={!newLandName || !newLandArea}
                      className="bg-green-600 text-white px-6 rounded-xl font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">Marked Locations</h3>
                    <p className="text-sm text-gray-500">{lands.length} lands added</p>
                  </div>
                  {lands.length > 0 && (
                    <div className="flex -space-x-2">
                      {lands.slice(0, 3).map(l => (
                        <div key={l.id} className="w-8 h-8 rounded-full bg-green-100 border-2 border-white flex items-center justify-center text-xs font-bold text-green-700">
                          {l.name[0]}
                        </div>
                      ))}
                      {lands.length > 3 && (
                        <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-600">
                          +{lands.length - 3}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleNext}
                  disabled={lands.length === 0}
                  className="w-full bg-green-600 text-white py-4 rounded-2xl font-semibold text-lg hover:bg-green-700 hover:shadow-lg hover:shadow-green-600/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Confirm & Save Layout
                  <Check className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
