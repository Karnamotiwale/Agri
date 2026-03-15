import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Droplets, 
  Wind, 
  Sun, 
  CloudRain,
  ChevronDown,
  Info,
  Navigation,
  Loader2,
  Sunrise,
  Sunset,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { weatherService } from '../../services/weather.service';
import { BottomNav } from '../../components/layout/BottomNav';
import { useApp } from '../../context/AppContext';

export default function WeatherSoilPestPage() {
  const navigate = useNavigate();
  const { farms, selectedFarmId, setSelectedFarmId } = useApp();
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWeather() {
      try {
        const data = await weatherService.getCurrentWeather();
        setWeather(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadWeather();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
      </div>
    );
  }

  const { current, hourly, daily } = weather;

  return (
    <div className="min-h-screen bg-[#F8FAFB] pb-24">
      {/* Header */}
      <div className="px-6 pt-12 pb-4 flex items-center gap-4">
        <button 
          onClick={() => navigate('/services')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-900" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Weather, Soil and Pest</h1>
      </div>

      {/* Location Selector (Interactive Dropdown) */}
      <div className="px-6 mb-6">
        <div className="relative">
          <select
            value={selectedFarmId || ''}
            onChange={(e) => setSelectedFarmId(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          >
            {farms.map((farm) => (
              <option key={farm.id} value={farm.id}>
                {farm.name}
              </option>
            ))}
          </select>
          
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100 cursor-pointer">
            <MapPin className="w-4 h-4 text-gray-900" />
            <span className="text-sm font-bold text-gray-900">
              {farms.find(f => f.id === selectedFarmId)?.name || 'Select a Farm'}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </div>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {/* Weather Status Card */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Weather Status</h2>
          
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div className="flex flex-col items-center">
              <div className="relative">
                <Sun className="w-20 h-20 text-amber-400 fill-amber-50" />
                {current.precipitation > 0 && (
                   <CloudRain className="absolute -bottom-2 -right-2 w-10 h-10 text-blue-400 fill-blue-50" />
                )}
              </div>
              <div className="text-center mt-2">
                <span className="text-5xl font-black text-gray-900">{Math.round(current.temp_c)}°C</span>
                <p className="text-gray-500 font-bold mt-1">{current.condition.text}</p>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <MetricItem label="Precipitation" value={`${current.precipitation}%`} />
              <MetricItem label="Humidity" value={`${current.humidity}%`} />
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Wind</span>
                <span className="text-sm font-black text-gray-900 flex items-center gap-1">
                  {current.wind_kph} km/h, {current.wind_dir}
                  <Navigation className="w-3 h-3 rotate-[225deg]" />
                </span>
              </div>
            </div>
          </div>

          {/* Sunrise/Sunset Tracker */}
          <div className="relative pt-8 border-t border-gray-50">
            <div className="flex justify-between items-center mb-4">
              <div className="flex flex-col items-center gap-1">
                <Sunrise className="w-8 h-8 text-amber-500" />
                <span className="text-xs font-black text-gray-900">{daily[0].sunrise}</span>
              </div>
              <div className="text-center">
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Daytime: {daily[0].daylight}</p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Sunset className="w-8 h-8 text-orange-500" />
                <span className="text-xs font-black text-gray-900">{daily[0].sunset}</span>
              </div>
            </div>
            
            <div className="relative h-2 bg-amber-50 rounded-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-200 via-amber-400 to-orange-400 w-3/4 rounded-full" />
                <div className="absolute top-1/2 left-3/4 w-3 h-3 bg-white border-2 border-amber-500 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-sm" />
            </div>
          </div>
        </div>

        {/* 24 Hours Forecast */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <h2 className="text-lg font-bold text-gray-900 mb-6">24 Hours Forecast</h2>
          
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-hide">
            {hourly.map((h: any, i: number) => (
              <div key={i} className="flex-shrink-0 w-20 bg-gray-50 rounded-3xl p-4 flex flex-col items-center gap-3 border border-gray-100 hover:bg-white hover:shadow-md transition-all cursor-pointer group">
                <span className="text-[10px] font-bold text-gray-400 group-hover:text-gray-900">{h.time}</span>
                <Sun className="w-8 h-8 text-amber-400 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-black text-gray-900">{Math.round(h.temp_c)}°C</span>
              </div>
            ))}
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3 text-xs text-gray-500">
                <Info className="w-4 h-4" />
                <button className="underline font-bold decoration-dotted underline-offset-4">How do we define suitable hours?</button>
            </div>
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-2xl border border-green-100">
                <Navigation className="w-5 h-5 text-green-600" />
                <p className="text-xs font-bold text-green-700">Today it is suitable for tractor use</p>
            </div>
          </div>
        </div>

        {/* 7 Days Forecast */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-6">7 Days Forecast</h2>
          
          <div className="space-y-6">
            {daily.map((d: any, i: number) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="w-24">
                  <p className="text-sm font-black text-gray-900">{i === 0 ? 'Today' : d.day}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">{d.date}</p>
                </div>
                
                <div className="flex-1 flex items-center justify-center">
                  <Sun className="w-8 h-8 text-amber-400" />
                </div>

                <div className="flex items-center gap-4 w-28 justify-end">
                   <div className="flex items-center gap-1">
                      <ArrowDown className="w-3 h-3 text-blue-500" />
                      <span className="text-sm font-bold text-gray-400">{Math.round(d.min_temp)}°</span>
                   </div>
                   <div className="flex items-center gap-1">
                      <ArrowUp className="w-3 h-3 text-orange-500" />
                      <span className="text-sm font-black text-gray-900">{Math.round(d.max_temp)}°</span>
                   </div>
                   <ChevronDown className="w-4 h-4 text-gray-300 group-hover:text-gray-900 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

function MetricItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{label}</span>
      <span className="text-sm font-black text-gray-900">{value}</span>
    </div>
  );
}
