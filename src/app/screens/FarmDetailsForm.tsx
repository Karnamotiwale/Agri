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
  // Location removed by request, defaulting to 0,0 in submit
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!farmName || !totalArea) {
      toast.error('Please fill all fields', 'Farm name and area are required');
      return;
    }

    setIsSubmitting(true);

    try {
      // Default location since map is removed
      const defaultLocation = { x: 0, y: 0 };

      const lands: LandLocation[] = [{
        id: 'temp-land',
        name: 'Main Farm',
        area: parseFloat(totalArea),
        x: defaultLocation.x,
        y: defaultLocation.y,
      }];

      const farm: Farm = {
        id: '', // Will be set by database
        name: farmName,
        location: 'Not Specified',
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

  const isFormValid = farmName && totalArea && !isSubmitting;

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

            {/* Location Map Removed as per request */}
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
