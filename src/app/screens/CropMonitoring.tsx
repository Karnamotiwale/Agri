import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/app/components/Header';
import { BottomNav } from '@/app/components/BottomNav';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Droplets, TestTube, Activity, TrendingUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useCropSensors } from '../../hooks/useCropSensors';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function CropMonitoring() {
  const { id } = useParams();
  const navigate = useNavigate();
  const cid = id || '1';
  const { getCrop } = useApp();
  const sensors = useCropSensors(cid);
  const crop = getCrop(cid);

  const [moistureData, setMoistureData] = useState(() =>
    DAYS.map((day, i) => ({ day, value: 65 + Math.round(Math.random() * 20) }))
  );

  useEffect(() => {
    setMoistureData((prev) => {
      const next = prev.map((p, i) =>
        i < 6
          ? { ...p, value: Math.max(20, Math.min(85, p.value + (Math.random() - 0.5) * 3)) }
          : { ...p, value: Math.round(sensors.moisture) }
      );
      return next;
    });
  }, [sensors.moisture]);

  const getSoilHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSoilHealthLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Attention';
  };

  const soilHealthScore = Math.min(
    100,
    Math.round(
      50 +
        (sensors.moisture / 85) * 20 +
        (sensors.ph >= 5.5 && sensors.ph <= 7.5 ? 15 : 0) +
        (sensors.n >= 80 && sensors.p >= 25 && sensors.k >= 120 ? 15 : 0)
    )
  );

  const nPct = Math.min(100, (sensors.n / 200) * 100);
  const pPct = Math.min(100, (sensors.p / 100) * 100);
  const kPct = Math.min(100, (sensors.k / 400) * 100);
  const nLabel = sensors.n >= 100 ? 'Good' : sensors.n >= 80 ? 'Moderate' : 'Low';
  const pLabel = sensors.p >= 25 ? 'Good' : sensors.p >= 15 ? 'Moderate' : 'Low';
  const kLabel = sensors.k >= 120 ? 'Good' : sensors.k >= 80 ? 'Moderate' : 'Low';

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header title="Crop Monitoring" showBack onBackClick={() => navigate('/dashboard')} />

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Crop Image Header */}
        <div className="relative h-48 rounded-2xl overflow-hidden mb-6">
          <img
            src={crop?.image ?? 'https://images.unsplash.com/photo-1673200692829-fcdb7e267fc1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'}
            alt={crop?.name ?? 'Crop'}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-2xl font-bold text-white mb-1">
              {crop?.name ?? 'Crop'}
            </h2>
            <p className="text-white/90 text-sm">
              {crop?.location ?? '—'}
            </p>
          </div>
        </div>

        {/* Overall Soil Health Score */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Soil Health Score
            </h3>
            <Activity className="w-6 h-6 text-gray-400" />
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="10"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="10"
                  strokeDasharray={`${(soilHealthScore / 100) * 251.2} 251.2`}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-3xl font-bold ${getSoilHealthColor(soilHealthScore)}`}>
                  {soilHealthScore}
                </span>
                <span className="text-xs text-gray-500">out of 100</span>
              </div>
            </div>

            <div className="flex-1">
              <p className={`text-2xl font-bold mb-1 ${getSoilHealthColor(soilHealthScore)}`}>
                {getSoilHealthLabel(soilHealthScore)}
              </p>
              <p className="text-sm text-gray-600">
                {soilHealthScore >= 80
                  ? 'Your soil conditions are optimal for growth. Continue monitoring regularly.'
                  : soilHealthScore >= 60
                  ? 'Soil conditions are good. Monitor moisture and nutrients.'
                  : 'Soil needs attention. Check irrigation and fertilization.'}
              </p>
            </div>
          </div>
        </div>

        {/* Sensor Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Droplets className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-gray-700">
                Soil Moisture
              </p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{sensors.moisture.toFixed(2)}%</p>
            <p className="text-xs text-gray-500 mt-1">Optimal range</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <TestTube className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-sm font-medium text-gray-700">Soil pH</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{sensors.ph.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-1">Neutral</p>
          </div>
        </div>

        {/* NPK Levels */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            NPK Levels
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Nitrogen (N)
                </span>
                <span className={`text-sm font-bold ${nLabel === 'Good' ? 'text-green-600' : nLabel === 'Moderate' ? 'text-yellow-600' : 'text-red-600'}`}>
                  {nLabel}
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-600 rounded-full"
                  style={{ width: `${nPct}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Phosphorus (P)
                </span>
                <span className={`text-sm font-bold ${pLabel === 'Good' ? 'text-green-600' : pLabel === 'Moderate' ? 'text-yellow-600' : 'text-red-600'}`}>
                  {pLabel}
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-600 rounded-full"
                  style={{ width: `${pPct}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Potassium (K)
                </span>
                <span className={`text-sm font-bold ${kLabel === 'Good' ? 'text-green-600' : kLabel === 'Moderate' ? 'text-yellow-600' : 'text-red-600'}`}>
                  {kLabel}
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-600 rounded-full"
                  style={{ width: `${kPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Moisture Trend */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              7-Day Moisture Trend
            </h3>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={moistureData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
                stroke="#9ca3af"
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#16a34a"
                strokeWidth={3}
                dot={{ fill: '#16a34a', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Action Button */}
        <button
          onClick={() => navigate(`/crop/${cid}/details`)}
          className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold hover:bg-green-700 transition"
        >
          View Crop Details
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
