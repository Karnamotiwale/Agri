import { useState } from 'react';
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
} from 'lucide-react';

import { FarmsView } from '../components/FarmsView';
import { GovernmentSchemes } from '../components/GovernmentSchemes';
import { useApp } from '../../context/AppContext';
import { useCropSensors } from '../../hooks/useCropSensors';

export function Dashboard() {
  const navigate = useNavigate();
  const { getAllCrops, dashboardActiveTab, setDashboardTab } = useApp();
  const [selectedPlant, setSelectedPlant] = useState<{ id: string; name: string; location: string; image: string } | null>(null);

  const plants = getAllCrops().map((c) => ({
    id: c.id,
    name: c.name,
    location: c.location,
    image: c.image,
  }));

  const activeTab = dashboardActiveTab;
  const setActiveTab = setDashboardTab;
  const popupSensors = useCropSensors(selectedPlant?.id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/30 via-white to-white pb-24">
      {activeTab === 'home' && (
        <div className="px-6 pt-6 pb-4">
          {/* Greeting */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-3xl font-light text-gray-900 mb-1.5 leading-tight">
                Hello, Farmer
              </h2>
              <p className="text-sm text-gray-500 font-medium">
                Your farming diary
              </p>
            </div>
            <button
              onClick={() => navigate('/profile')}
              className="mt-1 flex-shrink-0 hover:scale-105 transition-transform duration-200"
            >
              <img
                src="https://i.pravatar.cc/100"
                alt="Profile"
                className="w-11 h-11 rounded-full object-cover ring-3 ring-green-100 shadow-sm"
              />
            </button>
          </div>

          {/* Floating Action Button - Only visible on home tab */}
          {activeTab === 'home' && (
            <button
              onClick={() => navigate('/action-selection')}
              className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-br from-green-600 to-green-700 text-white rounded-full shadow-xl shadow-green-600/40 hover:shadow-2xl hover:shadow-green-600/50 active:scale-95 transition-all duration-200 flex items-center justify-center z-[90]"
            >
              <Plus className="w-7 h-7" />
            </button>
          )}

          {/* Illustration Section */}
          <div className="mb-6">
            <div className="relative rounded-3xl overflow-hidden shadow-lg shadow-green-900/5">
              <img
                src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=800"
                alt="Farmer"
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 to-transparent" />
            </div>
          </div>

          {/* Plant List */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <div className="w-1 h-4 bg-gradient-to-b from-green-500 to-green-600 rounded-full" />
              Your Plants
            </h3>

            <div className="space-y-3">
              {plants.map((plant) => (
                <div
                  key={plant.id}
                  onClick={() => setSelectedPlant(plant)}
                  className="bg-white p-4 rounded-2xl flex items-center gap-4 shadow-sm shadow-gray-900/5 border border-gray-100/50 cursor-pointer hover:shadow-md hover:shadow-green-900/5 hover:border-green-100 active:scale-[0.98] transition-all duration-200"
                >
                  <div className="relative">
                    <img
                      src={plant.image}
                      alt={plant.name}
                      className="w-12 h-12 rounded-xl object-cover ring-2 ring-green-50"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 mb-0.5">
                      {plant.name}
                    </p>
                    <p className="text-xs text-gray-500 font-medium">
                      {plant.location}
                    </p>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'farms' && <FarmsView />}
      {activeTab === 'schemes' && <GovernmentSchemes />}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200/80 px-6 py-3 z-[100] shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex justify-between max-w-md mx-auto">
          <button 
            onClick={() => setActiveTab('home')}
            className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 hover:bg-green-50/50 active:scale-95"
          >
            <Home className={`w-6 h-6 transition-colors ${activeTab === 'home' ? 'text-green-600' : 'text-gray-400'}`} />
            <span className={`text-[10px] font-medium transition-colors ${activeTab === 'home' ? 'text-green-600' : 'text-gray-500'}`}>Home</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('farms');
            }}
            className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 hover:bg-green-50/50 active:scale-95"
          >
            <Sprout className={`w-6 h-6 transition-colors ${activeTab === 'farms' ? 'text-green-600' : 'text-gray-400'}`} />
            <span className={`text-[10px] font-medium transition-colors ${activeTab === 'farms' ? 'text-green-600' : 'text-gray-500'}`}>Farms</span>
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
        </div>
      </div>

      {/* Plant Detail Popup */}
      {selectedPlant && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end z-50 animate-in fade-in duration-200">
          <div className="bg-white w-full rounded-t-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
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
          </div>
        </div>
      )}
    </div>
  );
}
