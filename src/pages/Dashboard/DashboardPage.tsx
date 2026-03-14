import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  MapPin,
  Sun,
  Droplets,
  Activity,
  ArrowRight
} from 'lucide-react';
import { FarmsView } from '@/app/components/FarmsView';
import { AddFarmModal } from '@/components/forms/AddFarmModal';
import { AddCropModal } from '@/components/forms/AddCropModal';

// New Dashboard Components
import { WarningsAlerts } from '../../components/dashboard/WarningsAlerts';
import { IrrigationReminders } from '../../components/dashboard/IrrigationReminders';
import { BottomNav } from '../../components/layout/BottomNav';

import { useApp } from '../../context/AppContext';
import { useCropSensors } from '../../hooks/useCropSensors';

import { useTranslation } from 'react-i18next';

export default function Dashboard() {
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
                <span className="text-green-100 text-xs font-bold">
                  Today, {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
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

          {/* New Sections: Warnings & Alerts, Irrigation Reminders */}
          <div className="px-6 mt-8 space-y-6">
            <WarningsAlerts />
            <IrrigationReminders />
          </div>
        </div>
      )}


      {/* Bottom Navigation */}
      <BottomNav />

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


