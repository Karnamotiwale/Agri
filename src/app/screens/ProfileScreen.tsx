import { useNavigate } from 'react-router-dom';
import { Header } from '@/app/components/Header';
import {
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  Settings,
  LogOut,
  Sprout,
  Leaf,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function ProfileScreen() {
  const navigate = useNavigate();
  const { auth, farms, getAllCrops, logout } = useApp();
  const cropCount = getAllCrops().length;
  const farmCount = farms.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/30 via-gray-50 to-white pb-8">
      <Header title="Profile" showBack onBackClick={() => navigate('/dashboard')} hideRightIcon />

      <div className="px-6 py-6 max-w-md mx-auto">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-900/10 border border-gray-100/50 mb-6">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-5">
              <img
                src="https://i.pravatar.cc/160"
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover ring-4 ring-green-100 shadow-lg"
              />
              <div className="absolute bottom-0 right-0 w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center border-3 border-white shadow-lg">
                <Sprout className="w-5 h-5 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Hello, Farmer</h2>
            <p className="text-sm text-gray-600 font-medium">AgriSmart Member</p>
          </div>
        </div>

        {/* Contact & Info */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-900/10 border border-gray-100/50 overflow-hidden mb-6">
          <div className="divide-y divide-gray-100/50">
            <button className="w-full px-5 py-4 flex items-center gap-4 hover:bg-gradient-to-r hover:from-green-50/50 hover:to-transparent transition-all duration-200 text-left active:scale-[0.98]">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center shadow-sm">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">Email</p>
                <p className="text-xs text-gray-600 font-medium mt-0.5">{auth.email || 'farmer@example.com'}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            <button className="w-full px-5 py-4 flex items-center gap-4 hover:bg-gradient-to-r hover:from-green-50/50 hover:to-transparent transition-all duration-200 text-left active:scale-[0.98]">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center shadow-sm">
                <Phone className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">Phone</p>
                <p className="text-xs text-gray-600 font-medium mt-0.5">{auth.phone || '+91 98765 43210'}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            <button className="w-full px-5 py-4 flex items-center gap-4 hover:bg-gradient-to-r hover:from-green-50/50 hover:to-transparent transition-all duration-200 text-left active:scale-[0.98]">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center shadow-sm">
                <MapPin className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">Location</p>
                <p className="text-xs text-gray-600 font-medium mt-0.5">North District, Punjab</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-white to-green-50/30 rounded-2xl p-5 shadow-lg shadow-gray-900/5 border border-gray-100/50 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center mb-3 shadow-sm">
              <Leaf className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{cropCount}</p>
            <p className="text-xs text-gray-600 font-semibold">Active Crops</p>
          </div>
          <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-2xl p-5 shadow-lg shadow-gray-900/5 border border-gray-100/50 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mb-3 shadow-sm">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{farmCount}</p>
            <p className="text-xs text-gray-600 font-semibold">Registered Farms</p>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-900/10 border border-gray-100/50 overflow-hidden mb-6">
          <div className="divide-y divide-gray-100/50">
            <button
              onClick={() => {}}
              className="w-full px-5 py-4 flex items-center gap-4 hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent transition-all duration-200 text-left active:scale-[0.98]"
            >
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                <Settings className="w-5 h-5 text-gray-600" />
              </div>
              <span className="flex-1 text-sm font-semibold text-gray-900">Settings</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="w-full px-5 py-4 flex items-center gap-4 hover:bg-gradient-to-r hover:from-red-50 hover:to-transparent transition-all duration-200 text-left active:scale-[0.98]"
            >
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                <LogOut className="w-5 h-5 text-red-600" />
              </div>
              <span className="flex-1 text-sm font-semibold text-red-600">Log Out</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
