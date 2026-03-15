import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  MapPin,
  Sun,
  Droplets,
  Activity,
  ArrowRight,
  AlertCircle,
  ChevronDown
} from 'lucide-react';
import { FarmsView } from '@/app/components/FarmsView';
import { AddFarmModal } from '@/components/forms/AddFarmModal';
import { AddCropModal } from '@/components/forms/AddCropModal';
import { motion } from 'motion/react';

// New Dashboard Components
import { WarningsAlerts } from '../../components/dashboard/WarningsAlerts';
import { DashboardCarousel } from '../../components/dashboard/DashboardCarousel';
import { DashboardWeather } from '../../components/dashboard/DashboardWeather';
import { WisdomCards } from '../../components/dashboard/WisdomCards';
import { DashboardAIInsights } from '../../components/dashboard/DashboardAIInsights';
import { BottomNav } from '../../components/layout/BottomNav';
import SoilMoistureCard from '../../features/sensors/SoilMoistureCard';
import NPKCard from '../../features/sensors/NPKCard';

import { useApp } from '../../context/AppContext';
import { useCropSensors } from '../../hooks/useCropSensors';

import { useTranslation } from 'react-i18next';

export default function Dashboard() {
  const { getAllCrops, getAllFarms, dashboardActiveTab, setDashboardTab, auth, selectedFarmId, setSelectedFarmId } = useApp();
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
    <div className="min-h-screen pb-24" style={{ background: 'var(--background)' }}>
      {activeTab === 'home' && (
        <div className="relative">
          {/* Top Bar: Title & Profile */}
          <div className="px-6 pt-12 pb-24 rounded-b-[2.5rem] flex justify-between items-center" style={{ background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)' }}>
            <h1 className="text-2xl font-black text-white">KisaanSaathi 👋</h1>
            <div className="flex items-center gap-4">

              <button
                onClick={() => navigate('/profile')}
                className="flex-shrink-0 hover:scale-105 transition-transform duration-200"
              >
                <img
                  src={auth?.photoURL || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&auto=format&fit=crop&q=60"}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-50 shadow-sm"
                />
              </button>
            </div>
          </div>

          {/* OpenWeather API Widget */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <DashboardWeather />
          </motion.div>

          {/* AI Insights & ML Suggestions Widget */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}>
            <DashboardAIInsights />
          </motion.div>

          {/* Main Dashboard Carousel */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white">
            <DashboardCarousel />
          </motion.div>

          {/* Live IoT Sensor Cards */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="px-6 mt-10">
            <h2 className="text-base font-black mb-3" style={{ color: '#1B3A1B' }}>Live Field Sensors</h2>
            <div className="flex flex-col gap-4">
              <SoilMoistureCard />
              <NPKCard />
            </div>
          </motion.div>

          {/* Existing Sections: Warnings & Alerts, Weather Advice */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="px-6 mt-6 space-y-6">
            <WarningsAlerts />
            <WisdomCards />
          </motion.div>
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


