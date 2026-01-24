import { useNavigate } from 'react-router-dom';
import { Header } from '@/app/components/Header';
import { MapPin, Sprout, ArrowRight } from 'lucide-react';

export function ActionSelection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/30 via-white to-white flex flex-col">
      <Header
        title="Add New"
        showBack
        onBackClick={() => navigate('/dashboard')}
        hideRightIcon
      />

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-4">
          <button
            onClick={() => navigate('/farm-details')}
            className="w-full bg-white rounded-3xl p-6 shadow-xl shadow-gray-900/10 border border-gray-100 hover:shadow-2xl hover:border-green-200 active:scale-[0.98] transition-all duration-200 flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/25">
                <MapPin className="w-7 h-7 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold text-gray-900 mb-1">Add Farm Details</h3>
                <p className="text-sm text-gray-500 font-medium">Register a new farm</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
          </button>

          <button
            onClick={() => navigate('/crop-details')}
            className="w-full bg-white rounded-3xl p-6 shadow-xl shadow-gray-900/10 border border-gray-100 hover:shadow-2xl hover:border-green-200 active:scale-[0.98] transition-all duration-200 flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                <Sprout className="w-7 h-7 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold text-gray-900 mb-1">Add Crop Details</h3>
                <p className="text-sm text-gray-500 font-medium">Register a new crop</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
}
