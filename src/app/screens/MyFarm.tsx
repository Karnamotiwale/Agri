import { useNavigate } from 'react-router-dom';
import { Home, Sprout, Landmark, Activity, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';

function getProgress(cropId: string): number {
  return 25 + (((cropId.charCodeAt(0) || 0) + new Date().getDate()) % 45);
}

export function MyFarm() {
  const navigate = useNavigate();
  const { getAllCrops } = useApp();
  const crops = getAllCrops().map((c) => ({
    ...c,
    progress: getProgress(c.id),
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/20 via-white to-white pb-24">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-4 py-4 shadow-sm">
        <div className="flex items-center justify-center max-w-md mx-auto">
          <h1 className="text-xl font-bold text-gray-900">Crops</h1>
        </div>
      </div>

      {/* Crops List */}
      <div className="px-4 pt-6">
        <div className="max-w-md mx-auto space-y-4">
          {crops.map((crop) => (
            <div
              key={crop.id}
              className="bg-white rounded-2xl p-5 shadow-md shadow-gray-900/5 border border-gray-100/50 hover:shadow-lg hover:shadow-green-900/5 hover:border-green-100 transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                {/* Crop Image */}
                <div className="w-18 h-18 rounded-xl overflow-hidden flex-shrink-0 ring-2 ring-green-100 shadow-sm">
                  <img
                    src={crop.image}
                    alt={crop.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Crop Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 mb-1 text-base">{crop.name}</h3>
                  <p className="text-xs text-gray-500 mb-3 font-medium">
                    {crop.landArea} ({crop.sowingPeriod})
                  </p>

                  {/* Growth Progress Indicator */}
                  <div className="mb-3">
                    <div className="h-2 bg-gray-200 rounded-full relative overflow-hidden">
                      <div
                        className="h-2 bg-gradient-to-r from-green-500 to-green-600 rounded-full absolute left-0 top-0 shadow-sm"
                        style={{ width: `${crop.progress}%` }}
                      />
                      <div
                        className="absolute w-3 h-3 bg-green-600 rounded-full -top-0.5 shadow-md border-2 border-white"
                        style={{ left: `calc(${crop.progress}% - 6px)` }}
                      />
                    </div>
                    <p className="text-[10px] text-gray-500 font-medium mt-1">{crop.progress}% Complete</p>
                  </div>

                  {/* Current Growth Stage */}
                  <p className="text-xs text-gray-700 font-semibold bg-gray-50 px-2 py-1 rounded-lg inline-block">
                    {crop.currentStage} ({crop.stageDate})
                  </p>
                </div>

                {/* VIEW DETAILS Button */}
                <button
                  onClick={() => navigate(`/crop/${crop.id}/details`)}
                  className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap hover:from-green-700 hover:to-green-800 active:scale-95 transition-all flex-shrink-0 shadow-md shadow-green-600/20 hover:shadow-lg hover:shadow-green-600/30"
                >
                  VIEW DETAILS
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation - Static */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200/80 px-6 py-3 z-[100] shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex justify-between max-w-md mx-auto">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 hover:bg-green-50/50 active:scale-95"
          >
            <Home className="w-6 h-6 text-gray-400" />
            <span className="text-[10px] font-medium text-gray-500">Home</span>
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 hover:bg-green-50/50 active:scale-95"
          >
            <Sprout className="w-6 h-6 text-gray-400" />
            <span className="text-[10px] font-medium text-gray-500">Farms</span>
          </button>

          <button 
            onClick={() => navigate('/dashboard')}
            className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 hover:bg-green-50/50 active:scale-95"
          >
            <Landmark className="w-6 h-6 text-gray-400" />
            <span className="text-[10px] font-medium text-gray-500">Schemes</span>
          </button>

          <button
            onClick={() => navigate('/sensor-guide')}
            className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 hover:bg-green-50/50 active:scale-95"
          >
            <Activity className="w-6 h-6 text-gray-400" />
            <span className="text-[10px] font-medium text-gray-500">Sensors</span>
          </button>

          <button
            onClick={() => navigate('/my-farm')}
            className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 hover:bg-green-50/50 active:scale-95"
          >
            <MapPin className="w-6 h-6 text-green-600" />
            <span className="text-[10px] font-medium text-green-600">Crops</span>
          </button>
        </div>
      </div>
    </div>
  );
}
