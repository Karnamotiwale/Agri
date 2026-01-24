import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '@/app/components/Header';
import { Droplets, FlaskConical, Leaf, Thermometer, Sun, Cloud, Droplet, Package, TrendingUp, Calendar, MapPin, Sprout } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useCropSensors } from '../../hooks/useCropSensors';

export function CropFullDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const cropId = id || '1';
  const { getCrop, getFarm } = useApp();
  const crop = getCrop(cropId);
  const farm = crop ? getFarm(crop.farmId || 'f1') : null;
  const sensors = useCropSensors(cropId);

  if (!crop) {
    return (
      <div className="min-h-screen bg-white">
        <Header title="Crop Details" showBack onBackClick={() => navigate('/dashboard')} />
        <div className="p-6 text-center">
          <p className="text-gray-500">Crop not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/20 via-white to-white pb-6">
      <Header title="Crop Details" showBack onBackClick={() => navigate('/dashboard')} />

      <div className="px-6 py-6 space-y-6">
        {/* Live Sensor Data */}
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-900/10 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
            <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full" />
            Live Sensor Data
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-4 border border-blue-100">
              <Droplets className="w-5 h-5 text-blue-600 mb-2" />
              <p className="text-2xl font-bold text-gray-900">{sensors.moisture.toFixed(2)}%</p>
              <p className="text-xs text-gray-600 font-semibold">Moisture</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl p-4 border border-purple-100">
              <FlaskConical className="w-5 h-5 text-purple-600 mb-2" />
              <p className="text-2xl font-bold text-gray-900">{sensors.ph.toFixed(2)}</p>
              <p className="text-xs text-gray-600 font-semibold">pH</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl p-4 border border-green-100">
              <Leaf className="w-5 h-5 text-green-600 mb-2" />
              <p className="text-lg font-bold text-gray-900">{sensors.npk}</p>
              <p className="text-xs text-gray-600 font-semibold">NPK</p>
            </div>
          </div>
        </div>

        {/* 1. General Crop Information */}
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-900/10 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
            <div className="w-1 h-5 bg-gradient-to-b from-green-500 to-green-600 rounded-full" />
            1. General Crop Information (Identification)
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold mb-1">Crop Name & Type</p>
              <p className="text-base font-semibold text-gray-900">{crop.name} – {crop.sowingPeriod}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold mb-1">Variety / Hybrid Name</p>
              <p className="text-sm text-gray-700">Premium Hybrid Variety</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold mb-2">Variety Characteristics</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <span className="text-sm text-gray-700">Maturity duration</span>
                  <span className="text-sm font-semibold text-gray-900">90-120 days (Early to Mid-season)</span>
                </div>
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <span className="text-sm text-gray-700">Disease resistance</span>
                  <span className="text-sm font-semibold text-green-600">High</span>
                </div>
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <span className="text-sm text-gray-700">Drought tolerance</span>
                  <span className="text-sm font-semibold text-green-600">Moderate</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Environmental & Site Information */}
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-900/10 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
            <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full" />
            2. Environmental & Site Information
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold mb-1">Soil Type & Texture</p>
              <p className="text-sm text-gray-700">Loamy soil with good drainage</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold mb-2">Soil Fertility Status</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <span className="text-sm text-gray-700">pH level</span>
                  <span className="text-sm font-semibold text-gray-900">{sensors.ph.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <span className="text-sm text-gray-700">Nitrogen (N) level</span>
                  <span className="text-sm font-semibold text-gray-900">{sensors.n} mg/kg</span>
                </div>
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <span className="text-sm text-gray-700">Phosphorus (P) level</span>
                  <span className="text-sm font-semibold text-gray-900">{sensors.p} mg/kg</span>
                </div>
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <span className="text-sm text-gray-700">Potassium (K) level</span>
                  <span className="text-sm font-semibold text-gray-900">{sensors.k} mg/kg</span>
                </div>
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <span className="text-sm text-gray-700">Nutrient deficiencies</span>
                  <span className="text-sm font-semibold text-green-600">None detected</span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold mb-2">Climate / Weather Patterns</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Thermometer className="w-4 h-4 text-orange-500" />
                    <span className="text-xs text-gray-500">Temperature</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">25-30°C</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Droplet className="w-4 h-4 text-blue-500" />
                    <span className="text-xs text-gray-500">Rainfall</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">800-1200mm</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Cloud className="w-4 h-4 text-gray-500" />
                    <span className="text-xs text-gray-500">Humidity</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">60-80%</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Sun className="w-4 h-4 text-yellow-500" />
                    <span className="text-xs text-gray-500">Sunshine hours</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">6-8 hrs/day</p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold mb-1">Field History</p>
              <p className="text-sm text-gray-700">Previously cultivated with legumes (rotation). Last crop: Soybean (2023)</p>
            </div>
          </div>
        </div>

        {/* 3. Production & Management Data */}
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-900/10 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
            <div className="w-1 h-5 bg-gradient-to-b from-amber-500 to-amber-600 rounded-full" />
            3. Production & Management Data (Activities)
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold mb-1">Land preparation method</p>
              <p className="text-sm text-gray-700">Tillage with plowing and harrowing</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold mb-2">Planting details</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <span className="text-sm text-gray-700">Sowing date</span>
                  <span className="text-sm font-semibold text-gray-900">{crop.sowingDate}</span>
                </div>
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <span className="text-sm text-gray-700">Seed rate</span>
                  <span className="text-sm font-semibold text-gray-900">25-30 kg/ha</span>
                </div>
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <span className="text-sm text-gray-700">Planting depth</span>
                  <span className="text-sm font-semibold text-gray-900">2-3 cm</span>
                </div>
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <span className="text-sm text-gray-700">Spacing</span>
                  <span className="text-sm font-semibold text-gray-900">20x20 cm</span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold mb-2">Nutrient management</p>
              <div className="space-y-2">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm font-semibold text-gray-900 mb-1">Fertilizer type</p>
                  <p className="text-xs text-gray-600">NPK 19:19:19 + Organic compost</p>
                </div>
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <span className="text-sm text-gray-700">Application rate</span>
                  <span className="text-sm font-semibold text-gray-900">100 kg/ha</span>
                </div>
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <span className="text-sm text-gray-700">Timing</span>
                  <span className="text-sm font-semibold text-gray-900">At sowing + 30 DAS</span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold mb-2">Irrigation schedule</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <span className="text-sm text-gray-700">Frequency</span>
                  <span className="text-sm font-semibold text-gray-900">Every 5-7 days</span>
                </div>
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <span className="text-sm text-gray-700">Method</span>
                  <span className="text-sm font-semibold text-gray-900">Drip irrigation</span>
                </div>
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <span className="text-sm text-gray-700">Water source</span>
                  <span className="text-sm font-semibold text-gray-900">Borewell</span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold mb-2">Pest and disease control</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <span className="text-sm text-gray-700">Pest identified</span>
                  <span className="text-sm font-semibold text-green-600">None</span>
                </div>
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <span className="text-sm text-gray-700">Pesticide/Fungicide types</span>
                  <span className="text-sm font-semibold text-gray-900">Preventive only</span>
                </div>
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <span className="text-sm text-gray-700">Spray dates</span>
                  <span className="text-sm font-semibold text-gray-900">As needed</span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold mb-1">Weed management</p>
              <p className="text-sm text-gray-700">Manual weeding + selective herbicides</p>
            </div>
          </div>
        </div>

        {/* 4. Harvest & Post-Harvest Data */}
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-900/10 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
            <div className="w-1 h-5 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full" />
            4. Harvest & Post-Harvest Data
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
              <span className="text-sm text-gray-700">Harvesting date</span>
              <span className="text-sm font-semibold text-gray-900">Pending</span>
            </div>
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
              <span className="text-sm text-gray-700">Harvesting method</span>
              <span className="text-sm font-semibold text-gray-900">Mechanical</span>
            </div>
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
              <span className="text-sm text-gray-700">Yield / Output</span>
              <span className="text-sm font-semibold text-gray-900">To be recorded</span>
            </div>
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
              <span className="text-sm text-gray-700">Storage method</span>
              <span className="text-sm font-semibold text-gray-900">Controlled atmosphere</span>
            </div>
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
              <span className="text-sm text-gray-700">Storage conditions</span>
              <span className="text-sm font-semibold text-gray-900">Temperature: 15-18°C, Humidity: 60-70%</span>
            </div>
          </div>
        </div>

        {/* 5. Financial & Record-Keeping Details */}
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-900/10 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
            <div className="w-1 h-5 bg-gradient-to-b from-indigo-500 to-indigo-600 rounded-full" />
            5. Financial & Record-Keeping Details
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold mb-2">Input costs</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">Seeds</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">₹5,000</span>
                </div>
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <FlaskConical className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">Fertilizers</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">₹8,000</span>
                </div>
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Sprout className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">Pesticides</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">₹3,000</span>
                </div>
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">Labor</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">₹12,000</span>
                </div>
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">Machinery</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">₹6,000</span>
                </div>
                <div className="flex items-center justify-between bg-green-50 rounded-lg p-3 border border-green-200">
                  <span className="text-sm font-bold text-gray-900">Total Input Cost</span>
                  <span className="text-sm font-bold text-green-700">₹34,000</span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold mb-2">Sales data</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <span className="text-sm text-gray-700">Revenue</span>
                  <span className="text-sm font-semibold text-gray-900">To be recorded</span>
                </div>
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <span className="text-sm text-gray-700">Sale price</span>
                  <span className="text-sm font-semibold text-gray-900">Market rate</span>
                </div>
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <span className="text-sm text-gray-700">Buyers</span>
                  <span className="text-sm font-semibold text-gray-900">To be recorded</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
