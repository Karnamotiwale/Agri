import { MapPin } from 'lucide-react';
import mapImage from '../../assets/33bf725052eafa258f512dc9b6e87fb9ded80757.png';

export function HomeMap() {
  return (
    <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 mb-6 relative">
      <div className="h-64 relative">
        <img
          src={mapImage}
          alt="Farm Map"
          className="w-full h-full object-cover"
        />
        
        {/* Overlay for Mapbox API visual indication */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
          <p className="text-[10px] font-bold text-gray-900 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-green-600" />
            Live Farm View (Mapbox)
          </p>
        </div>

        {/* Center Pin */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center transform scale-110">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-1">Precision Map Integration</h3>
        <p className="text-xs text-gray-500">Monitoring real-time field variations and crop density across Block A.</p>
      </div>
    </div>
  );
}
