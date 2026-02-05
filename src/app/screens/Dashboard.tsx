import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sprout,
  Activity,
  Home,
  ArrowRight,
  Droplets,
  Landmark,
  MapPin,
  Plus,
  BarChart2,
  Sun,
  Cpu,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  Zap,
  BrainCircuit,
  Thermometer,
  CloudRain
} from 'lucide-react';
import { aiService } from '../../services/ai.service';
import { predictIrrigation } from '../../services/aiService';

import { FarmsView } from '../components/FarmsView';
import { GovernmentSchemes } from '../components/GovernmentSchemes';
import { AnalyticsView } from '../components/analytics/AnalyticsView';
import { AddFarmModal } from '../components/AddFarmModal';
import { AddCropModal } from '../components/AddCropModal';

import { useApp } from '../../context/AppContext';
import { useCropSensors } from '../../hooks/useCropSensors';

import { useTranslation } from 'react-i18next';

export function Dashboard() {
  const { getAllCrops, getAllFarms, dashboardActiveTab, setDashboardTab, auth } = useApp();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedPlant, setSelectedPlant] = useState<{ id: string; name: string; location: string; image: string; farmId: string; sowingDate?: string } | null>(null);

  // Modal State
  const [showAddFarmModal, setShowAddFarmModal] = useState(false);
  const [showAddCropModal, setShowAddCropModal] = useState(false);

  const plants = getAllCrops().map((c) => ({
    id: c.id,
    name: c.name,
    location: c.location,
    image: c.image,
    farmId: c.farmId,
    sowingDate: c.sowingDate,
    healthStatus: 'healthy' as const,
    soilMoisture: 45,
    temperature: 28,
  }));

  const farms = getAllFarms();

  const activeTab = dashboardActiveTab;
  const setActiveTab = setDashboardTab;
  const popupSensors = useCropSensors(selectedPlant?.id);

  // AI Advisor State
  const [aiFormData, setAiFormData] = useState({
    soil_moisture: 30,
    temperature: 28,
    humidity: 60,
    rain_forecast: 0,
  });

  const [aiResult, setAiResult] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  function handleAiChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setAiFormData((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  }

  async function handleAiPredict() {
    setAiLoading(true);
    setAiError(null);

    try {
      const response = await predictIrrigation(aiFormData);
      setAiResult(response);
    } catch (err) {
      console.error(err);
      setAiError("Failed to get AI prediction");
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F7F6] pb-24">
      {activeTab === 'home' && (
        <div className="relative">
          {/* Green Gradient Header Section */}
          <div className="bg-gradient-to-br from-green-700 via-green-600 to-green-500 rounded-b-[3rem] px-6 pt-8 pb-12 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-400/20 rounded-full -mr-32 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-800/30 rounded-full -ml-24 -mb-24 blur-2xl"></div>

            <div className="relative z-10">
              {/* Header with icons */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h1 className="text-white text-2xl font-bold mb-1">
                    Hello, Farmer!
                  </h1>
                  <p className="text-green-100 text-sm">Check your plants today</p>
                </div>
                <button
                  onClick={() => navigate('/profile')}
                  className="flex-shrink-0 hover:scale-105 transition-transform duration-200"
                >
                  <img
                    src={auth?.photoURL || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&auto=format&fit=crop&q=60"}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-white/30 shadow-sm"
                  />
                </button>
              </div>

              {/* Location and Date */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-green-100">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm font-medium">Bangalore, India</span>
                </div>
                <span className="text-green-100 text-xs">
                  {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>

              {/* Integrated Weather Display */}
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                      <Sun className="w-10 h-10 text-yellow-300" />
                    </div>
                    <div>
                      <div className="text-white text-4xl font-bold">26°C</div>
                      <div className="text-green-100 text-sm">Partly cloudy</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-100 text-xs mb-1">T:34° • R:22°</div>
                    <div className="text-green-200 text-xs">1:34°</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Farming Illustration Section */}
          <div className="px-6 -mt-6 relative z-20">
            <div className="bg-white rounded-3xl p-2 shadow-xl shadow-green-900/10">
              <img
                src="/farming_community.png"
                alt="Farming Community"
                className="w-full h-auto rounded-2xl"
              />
            </div>
          </div>

          {/* Your Farm Section */}
          <div className="px-6 pt-6 pb-4">
            <div className="bg-white rounded-3xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Your Crops</h2>
                <button
                  onClick={() => setShowAddCropModal(true)}
                  className="text-green-600 text-sm font-semibold hover:text-green-700 flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add Crop
                </button>
              </div>

              {/* Farm/Plant Grid */}
              <div className="grid grid-cols-2 gap-4">
                {plants.slice(0, 4).map((plant) => (
                  <div
                    key={plant.id}
                    onClick={() => setSelectedPlant(plant)}
                    className="relative rounded-2xl overflow-hidden shadow-md cursor-pointer transform hover:scale-[1.02] transition-transform"
                  >
                    <div className="aspect-[4/3] relative">
                      <img
                        src={plant.image}
                        alt={plant.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>

                      {/* Badge */}
                      <div className="absolute top-3 right-3">
                        <span className="bg-amber-500/90 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full">
                          About to ripen
                        </span>
                      </div>

                      {/* Plant info */}
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <h3 className="text-white font-bold text-sm mb-1">{plant.name}</h3>
                        <div className="flex items-center gap-1 text-white/80 text-xs">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          <span>{plant.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {plants.length === 0 && (
                <div className="text-center py-12">
                  <Sprout className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-sm font-semibold mb-2">No crops yet</p>
                  <p className="text-gray-400 text-xs mb-4">Add your first crop to get started</p>
                  <button
                    onClick={() => setShowAddCropModal(true)}
                    className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-green-700 transition-colors inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Crop
                  </button>
                </div>
              )}
            </div>

            {/* Farms Quick Access */}
            {farms.length > 0 && (
              <div className="mt-4 bg-white rounded-2xl shadow-md p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-gray-900">Your Farms</h3>
                  <button
                    onClick={() => setShowAddFarmModal(true)}
                    className="text-green-600 text-xs font-semibold hover:text-green-700 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Add
                  </button>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {farms.map((farm) => (
                    <div
                      key={farm.id}
                      className="flex-shrink-0 bg-green-50 rounded-xl px-4 py-2 border border-green-100"
                    >
                      <div className="flex items-center gap-2">
                        <Landmark className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-gray-900">{farm.name}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{farm.area}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {farms.length === 0 && (
              <div className="mt-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-md p-6 border border-green-100">
                <div className="text-center">
                  <Landmark className="w-12 h-12 text-green-600 mx-auto mb-3" />
                  <h3 className="text-sm font-bold text-gray-900 mb-1">No farms registered</h3>
                  <p className="text-xs text-gray-500 mb-4">Create your first farm to start managing crops</p>
                  <button
                    onClick={() => setShowAddFarmModal(true)}
                    className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-green-700 transition-colors inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Create Farm
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* AI Irrigation Advisor Section */}
          <div className="px-6 pb-6">
            <div className="bg-white rounded-3xl shadow-lg p-6 border border-green-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-green-100 p-2 rounded-xl">
                  <BrainCircuit className="w-6 h-6 text-green-700" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">AI Irrigation Advisor</h2>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 ml-1">Soil Moisture (%)</label>
                    <input
                      type="number"
                      name="soil_moisture"
                      value={aiFormData.soil_moisture}
                      onChange={handleAiChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 ml-1">Temperature (°C)</label>
                    <input
                      type="number"
                      name="temperature"
                      value={aiFormData.temperature}
                      onChange={handleAiChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 ml-1">Humidity (%)</label>
                    <input
                      type="number"
                      name="humidity"
                      value={aiFormData.humidity}
                      onChange={handleAiChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 ml-1">Rain Forecast (0/1)</label>
                    <input
                      type="number"
                      name="rain_forecast"
                      value={aiFormData.rain_forecast}
                      onChange={handleAiChange}
                      min="0"
                      max="1"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all font-medium"
                    />
                  </div>
                </div>

                <button
                  onClick={handleAiPredict}
                  disabled={aiLoading}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-green-600/20 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {aiLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      <span>Get AI Decision</span>
                    </>
                  )}
                </button>

                {aiError && (
                  <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {aiError}
                  </div>
                )}

                {aiResult && (
                  <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className={`p-5 rounded-2xl border-2 ${aiResult.final_decision === 1 ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'}`}>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Recommendation</h3>
                        {aiResult.final_decision === 1 ? (
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">ACTION REQUIRED</span>
                        ) : (
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">OPTIMAL</span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 mb-4">
                        {aiResult.final_decision === 1 ? (
                          <div className="p-3 bg-blue-500 text-white rounded-xl shadow-sm">
                            <Droplets className="w-8 h-8" />
                          </div>
                        ) : (
                          <div className="p-3 bg-green-500 text-white rounded-xl shadow-sm">
                            <ShieldCheck className="w-8 h-8" />
                          </div>
                        )}
                        <div>
                          <p className="text-2xl font-black text-gray-900">
                            {aiResult.final_decision === 1 ? "Start Irrigation" : "Do Not Irrigate"}
                          </p>
                          <p className="text-sm font-medium text-gray-600">
                            {aiResult.final_decision === 1 ? "Water levels low" : "Soil moisture sufficient"}
                          </p>
                        </div>
                      </div>

                      {aiResult.explanation && (
                        <div className="bg-white/60 rounded-xl p-3 text-xs text-gray-600 font-mono border border-black/5 overflow-x-auto">
                          <pre>{JSON.stringify(aiResult.explanation, null, 2)}</pre>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>


          {/* Floating Action Button */}
          <button
            onClick={() => navigate('/action-selection')}
            className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-br from-green-600 to-green-700 text-white rounded-full shadow-xl shadow-green-600/40 hover:shadow-2xl hover:shadow-green-600/50 active:scale-95 transition-all duration-200 flex items-center justify-center z-[90]"
          >
            <Plus className="w-7 h-7" />
          </button>
        </div>
      )}

      {activeTab === 'farms' && <FarmsView />}
      {activeTab === 'schemes' && <GovernmentSchemes />}

      {/* Analytics View */}
      {activeTab === 'analytics' && (
        <div className="px-6 py-8 animate-in fade-in duration-500">
          <AnalyticsView selectedCrop={selectedPlant} />
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200/80 px-4 py-3 z-[100] shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around max-w-md mx-auto">
          <button
            onClick={() => setActiveTab('home')}
            className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 hover:bg-green-50/50 active:scale-95"
          >
            <Home className={`w-6 h-6 transition-colors ${activeTab === 'home' ? 'text-green-600' : 'text-gray-400'}`} />
            <span className={`text-[10px] font-medium transition-colors ${activeTab === 'home' ? 'text-green-600' : 'text-gray-500'}`}>Home</span>
          </button>

          <button
            onClick={() => activeTab === 'analytics' ? setActiveTab('home') : setActiveTab('analytics')}
            className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 hover:bg-green-50/50 active:scale-95"
          >
            <BarChart2 className={`w-6 h-6 transition-colors ${activeTab === 'analytics' ? 'text-green-600' : 'text-gray-400'}`} />
            <span className={`text-[10px] font-medium transition-colors ${activeTab === 'analytics' ? 'text-green-600' : 'text-gray-500'}`}>Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('schemes')}
            className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 hover:bg-green-50/50 active:scale-95"
          >
            <Landmark className={`w-6 h-6 transition-colors ${activeTab === 'schemes' ? 'text-green-600' : 'text-gray-400'}`} />
            <span className={`text-[10px] font-medium transition-colors ${activeTab === 'schemes' ? 'text-green-600' : 'text-gray-500'}`}>Schemes</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('sensors');
              navigate('/sensor-guide');
            }}
            className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 hover:bg-green-50/50 active:scale-95"
          >
            <Activity className={`w-6 h-6 transition-colors ${activeTab === 'sensors' ? 'text-green-600' : 'text-gray-400'}`} />
            <span className={`text-[10px] font-medium transition-colors ${activeTab === 'sensors' ? 'text-green-600' : 'text-gray-500'}`}>Sensors</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('farm-details');
              navigate('/my-farm');
            }}
            className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 hover:bg-green-50/50 active:scale-95"
          >
            <MapPin className={`w-6 h-6 transition-colors ${activeTab === 'farm-details' ? 'text-green-600' : 'text-gray-400'}`} />
            <span className={`text-[10px] font-medium transition-colors ${activeTab === 'farm-details' ? 'text-green-600' : 'text-gray-500'}`}>Crops</span>
          </button>

          <button
            onClick={() => navigate('/ai-engine')}
            className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 hover:bg-green-50/50 active:scale-95"
          >
            <Cpu className="w-6 h-6 text-gray-400" />
            <span className="text-[10px] font-medium text-gray-500 whitespace-nowrap">AI Engine</span>
          </button>
        </div>
      </div>

      {/* Plant Detail Popup */}
      {selectedPlant && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end z-50 animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white w-full rounded-t-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300 min-h-[80vh]">
            <div className="flex justify-between items-start mb-5">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={selectedPlant.image}
                    className="w-14 h-14 rounded-xl object-cover ring-2 ring-green-100"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-base">
                    {selectedPlant.name}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    {selectedPlant.location}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedPlant(null)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-lg transition-colors"
              >
                <span className="text-lg">×</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-3 text-center border border-blue-100">
                <Droplets className="mx-auto text-blue-600 mb-1.5 w-5 h-5" />
                <p className="text-sm font-bold text-gray-900">{popupSensors.moisture.toFixed(2)}%</p>
                <p className="text-[10px] text-gray-600 font-medium mt-0.5">Moisture</p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-2xl p-3 text-center border border-amber-100">
                <Activity className="mx-auto text-amber-600 mb-1.5 w-5 h-5" />
                <p className="text-sm font-bold text-gray-900">{280 + (popupSensors.moisture % 70)}</p>
                <p className="text-[10px] text-gray-600 font-medium mt-0.5">Lumen</p>
              </div>
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-2xl p-3 text-center border border-indigo-100">
                <ArrowRight className="mx-auto text-indigo-600 mb-1.5 w-5 h-5" />
                <p className="text-sm font-bold text-gray-900">{18 + Math.round(popupSensors.ph)}</p>
                <p className="text-[10px] text-gray-600 font-medium mt-0.5">km/h</p>
              </div>
            </div>



            <div className="rounded-2xl overflow-hidden mb-5 shadow-md">
              <img
                src={selectedPlant.image}
                className="w-full h-36 object-cover"
              />
            </div>

            <button
              onClick={() => {
                setSelectedPlant(null);
                navigate(`/crop/${selectedPlant.id}/statistics`);
              }}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3.5 rounded-xl font-semibold text-sm shadow-lg shadow-green-600/25 hover:shadow-xl hover:shadow-green-600/30 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
            >
              View Statistics
              <ArrowRight className="w-4 h-4" />
            </button>
            <div className="h-4"></div>
          </div>
        </div>
      )}

      {/* Add Farm Modal */}
      <AddFarmModal
        isOpen={showAddFarmModal}
        onClose={() => setShowAddFarmModal(false)}
        onSuccess={() => {
          setShowAddFarmModal(false);
        }}
      />

      {/* Add Crop Modal */}
      <AddCropModal
        isOpen={showAddCropModal}
        onClose={() => setShowAddCropModal(false)}
        onSuccess={() => {
          setShowAddCropModal(false);
        }}
      />
    </div>
  );
}


