import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/app/components/Header';
import { MapPin, ArrowRight, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { toast } from '../../lib/toast';
import type { Farm, LandLocation } from '../../context/AppContext';

export function FarmDetailsForm() {
  const navigate = useNavigate();
  const { addFarm } = useApp();
  const [farmName, setFarmName] = useState('');
  const [totalArea, setTotalArea] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [farmLocation, setFarmLocation] = useState<{ x: number; y: number } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setFarmLocation({ x, y });
  };

  const handleSubmit = async () => {
    if (!farmName || !totalArea || !farmLocation) {
      toast.error('Please fill all fields', 'Farm name, area, and location are required');
      return;
    }

    setIsSubmitting(true);

    try {
      const lands: LandLocation[] = farmLocation ? [{
        id: 'temp-land',
        name: 'Main Farm',
        area: parseFloat(totalArea),
        x: farmLocation.x,
        y: farmLocation.y,
      }] : [];

      const farm: Farm = {
        id: '', // Will be set by database
        name: farmName,
        location: 'Marked on map',
        area: `${totalArea} acres`,
        lands: lands,
        crops: [],
      };

      const id = await addFarm(farm);

      if (id) {
        toast.success('Farm registered successfully!', `${farmName} has been added to your farms`);
        navigate('/crop-details');
      } else {
        toast.error('Failed to register farm', 'Please try again');
      }
    } catch (error: any) {
      console.error('Error creating farm:', error);
      toast.error('Error creating farm', error.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = farmName && totalArea && farmLocation && !isSubmitting;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header
        title="Add Farm Details"
        showBack
        onBackClick={() => navigate('/dashboard')}
        hideRightIcon
      />

      <div className="flex-1 p-6 flex flex-col">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-xl">1</div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Farm Information</h2>
              <p className="text-gray-500 text-sm">Enter your farm details</p>
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
                disabled={isSubmitting}
                className="w-full px-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Estimated Land (acres)
              </label>
              <input
                type="number"
                value={totalArea}
                onChange={(e) => setTotalArea(e.target.value)}
                placeholder="e.g. 50"
                disabled={isSubmitting}
                className="w-full px-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Land Details
              </label>
              {!showMap ? (
                <button
                  onClick={() => setShowMap(true)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-4 bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-2xl hover:border-green-300 hover:shadow-md transition-all flex items-center justify-center gap-2 text-green-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MapPin className="w-5 h-5" />
                  Set Location on Map
                </button>
              ) : (
                <div className="space-y-4">
                  <div
                    ref={mapRef}
                    onClick={handleMapClick}
                    className="w-full h-64 bg-[#e6f0e6] rounded-2xl relative overflow-hidden cursor-crosshair border-2 border-green-200"
                    style={{
                      backgroundImage: 'radial-gradient(#c2e0c2 1px, transparent 1px)',
                      backgroundSize: '20px 20px'
                    }}
                  >
                    {farmLocation && (
                      <div
                        className="absolute transform -translate-x-1/2 -translate-y-full"
                        style={{ left: `${farmLocation.x}%`, top: `${farmLocation.y}%` }}
                      >
                        <MapPin className="w-10 h-10 text-green-600" fill="currentColor" />
                      </div>
                    )}
                    {!farmLocation && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <p className="bg-white/90 backdrop-blur px-4 py-2 rounded-full text-green-800 font-medium text-sm">
                          Click to mark farm location
                        </p>
                      </div>
                    )}
                  </div>
                  {farmLocation && (
                    <button
                      onClick={() => {
                        setFarmLocation(null);
                        setShowMap(false);
                      }}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Change Location
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!isFormValid}
          className="mt-auto w-full bg-green-600 text-white py-4 rounded-2xl font-semibold text-lg hover:bg-green-700 hover:shadow-lg hover:shadow-green-600/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Registering Farm...
            </>
          ) : (
            <>
              Continue to Crop Details
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
