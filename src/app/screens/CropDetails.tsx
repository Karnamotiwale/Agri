import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell } from 'lucide-react';

export function CropDetails() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-600 via-green-600 to-green-700 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-b from-green-600 to-green-700 text-white px-4 py-4 shadow-lg shadow-green-900/20">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-white/10 rounded-xl transition-all duration-200 active:scale-95"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">Crop Details</h1>
          </div>
          <button className="p-2 hover:bg-white/10 rounded-xl transition-all duration-200 active:scale-95">
            <Bell className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Content removed as requested */}
      </div>
    </div>
  );
}
