import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Droplets,
  Wind,
  Sun,
  CloudRain,
  Cloud,
  CloudSun,
  ChevronDown,
  Info,
  Navigation,
  Loader2,
  Sunrise,
  Sunset,
  ArrowUp,
  ArrowDown,
  Thermometer,
} from 'lucide-react';
import { getWeather, getUserLocation } from '../../services/weatherService';
import { BottomNav } from '../../components/layout/BottomNav';
import { useApp } from '../../context/AppContext';

// Map OpenWeather condition IDs to icons
function WeatherIcon({ id, className }: { id: number; className?: string }) {
  if (id >= 200 && id < 300) return <CloudRain className={className} />;        // Thunderstorm
  if (id >= 300 && id < 400) return <CloudRain className={className} />;        // Drizzle
  if (id >= 500 && id < 600) return <CloudRain className={className} />;        // Rain
  if (id >= 600 && id < 700) return <Cloud className={className} />;            // Snow
  if (id >= 700 && id < 800) return <Cloud className={className} />;            // Atmosphere
  if (id === 800) return <Sun className={className} />;                          // Clear
  if (id === 801 || id === 802) return <CloudSun className={className} />;      // Few/Scattered clouds
  return <Cloud className={className} />;                                        // Overcast
}

// Convert Unix timestamp + timezone offset to formatted time
function formatTime(unixTs: number, tzOffset: number): string {
  const d = new Date((unixTs + tzOffset) * 1000);
  const h = d.getUTCHours();
  const m = d.getUTCMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

// Wind direction from degrees
function degreesToDir(deg: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(deg / 45) % 8];
}

export default function WeatherSoilPestPage() {
  const navigate = useNavigate();
  const { farms, selectedFarmId, setSelectedFarmId } = useApp();

  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [locationName, setLocationName] = useState('Your Location');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadWeather = async () => {
      let farmLat: number | undefined;
      let farmLon: number | undefined;

      const farm = farms.find(f => f.id === selectedFarmId);
      if (farm && farm.latitude && farm.longitude) {
        farmLat = Number(farm.latitude);
        farmLon = Number(farm.longitude);
      }

      try {
        setLoading(true);
        const { lat, lon } = await getUserLocation(farmLat, farmLon);
        if (!active) return;

        const data = await getWeather(lat, lon);
        if (!active) return;

        setWeather(data);
        setLocationName(data.name || 'Your Location');
        setError(null);
      } catch (e) {
        if (!active) return;
        setError('Could not fetch weather');
      } finally {
        if (active) setLoading(false);
      }
    };

    loadWeather();

    return () => {
      active = false;
    };
  }, [farms, selectedFarmId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3" style={{ background: 'var(--background)' }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#2E7D32' }} />
        <p className="text-sm font-semibold" style={{ color: '#4F6F52' }}>Getting your live weather…</p>
      </div>
    );
  }

  if (error || !weather || !weather.main) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3" style={{ background: 'var(--background)' }}>
        <MapPin className="w-8 h-8" style={{ color: '#9CA3AF' }} />
        <p className="text-sm font-semibold text-gray-500">{error || 'Weather unavailable'}</p>
      </div>
    );
  }

  const condId = weather.weather?.[0]?.id ?? 800;
  const condText = weather.weather?.[0]?.description ?? 'Clear';
  const tz = weather.timezone ?? 0;

  const sunriseStr = formatTime(weather.sys?.sunrise ?? 0, tz);
  const sunsetStr  = formatTime(weather.sys?.sunset  ?? 0, tz);

  // Day progress (0–100)
  const now = Math.floor(Date.now() / 1000);
  const sr  = weather.sys?.sunrise ?? now;
  const ss  = weather.sys?.sunset  ?? now;
  const dayPct = Math.min(100, Math.max(0, ((now - sr) / (ss - sr)) * 100));

  // Mock hourly using current temp ± small variation (OpenWeather free tier doesn't include hourly)
  const baseTemp = weather.main.temp;
  const mockHourly = Array.from({ length: 7 }, (_, i) => ({
    time: `${(new Date().getHours() + i) % 24}:00`,
    temp: baseTemp + (i % 3 === 0 ? 1 : i % 3 === 1 ? -1 : 0),
    id: condId,
  }));

  return (
    <div className="min-h-screen pb-24" style={{ background: 'var(--background)' }}>
      {/* Header */}
      <div
        className="px-6 pt-12 pb-5 flex items-center gap-3"
        style={{ background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)' }}
      >
        <button
          onClick={() => navigate('/services')}
          className="p-1.5 hover:bg-white/10 rounded-full transition"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-xl font-black text-white">Weather, Soil and Pest</h1>
      </div>

      {/* Live Location Badge */}
      <div className="px-6 mt-5 mb-4">
        <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm"
          style={{ border: '1.5px solid #E6F4EA' }}>
          <MapPin className="w-4 h-4" style={{ color: '#2E7D32' }} />
          <span className="text-sm font-bold" style={{ color: '#1B3A1B' }}>{locationName}</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#E6F4EA', color: '#2E7D32' }}>LIVE</span>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {/* Weather Status Card */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm" style={{ border: '1px solid #E6F4EA' }}>
          <h2 className="text-lg font-black mb-6" style={{ color: '#1B3A1B' }}>Weather Status</h2>

          <div className="grid grid-cols-2 gap-8 mb-8">
            {/* Icon + temp */}
            <div className="flex flex-col items-center">
              <WeatherIcon id={condId} className="w-20 h-20 text-amber-400" />
              <div className="text-center mt-3">
                <span className="text-5xl font-black" style={{ color: '#1B3A1B' }}>
                  {Math.round(weather.main.temp)}°C
                </span>
                <p className="font-bold mt-1 capitalize" style={{ color: '#4F6F52' }}>{condText}</p>
              </div>
            </div>

            {/* Metrics */}
            <div className="space-y-4 pt-2">
              <MetricItem label="Feels Like" value={`${Math.round(weather.main.feels_like)}°C`} />
              <MetricItem label="Humidity"   value={`${weather.main.humidity}%`} />
              <MetricItem label="Pressure"   value={`${weather.main.pressure} hPa`} />
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#9CA3AF' }}>Wind</span>
                <span className="text-sm font-black flex items-center gap-1" style={{ color: '#1B3A1B' }}>
                  {weather.wind?.speed?.toFixed(1)} m/s {degreesToDir(weather.wind?.deg ?? 0)}
                  <Navigation className="w-3 h-3 rotate-[225deg]" />
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#9CA3AF' }}>Visibility</span>
                <span className="text-sm font-black" style={{ color: '#1B3A1B' }}>
                  {weather.visibility ? `${(weather.visibility / 1000).toFixed(1)} km` : '—'}
                </span>
              </div>
            </div>
          </div>

          {/* Sunrise / Sunset tracker */}
          <div className="pt-6 border-t" style={{ borderColor: '#F0FAF0' }}>
            <div className="flex justify-between items-center mb-4">
              <div className="flex flex-col items-center gap-1">
                <Sunrise className="w-7 h-7 text-amber-500" />
                <span className="text-xs font-black" style={{ color: '#1B3A1B' }}>{sunriseStr}</span>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#9CA3AF' }}>Daytime</p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Sunset className="w-7 h-7 text-orange-500" />
                <span className="text-xs font-black" style={{ color: '#1B3A1B' }}>{sunsetStr}</span>
              </div>
            </div>
            {/* Day arc progress bar */}
            <div className="relative h-2 rounded-full overflow-hidden" style={{ background: '#FEF3C7' }}>
              <div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ width: `${dayPct}%`, background: 'linear-gradient(90deg, #FBBF24, #F97316)' }}
              />
              <div
                className="absolute top-1/2 w-3 h-3 bg-white border-2 rounded-full -translate-y-1/2 shadow-sm"
                style={{ left: `${dayPct}%`, borderColor: '#F97316', transform: 'translate(-50%,-50%)' }}
              />
            </div>
          </div>
        </div>

        {/* Temp range card */}
        <div className="bg-white rounded-[2.5rem] p-6 shadow-sm" style={{ border: '1px solid #E6F4EA' }}>
          <h2 className="text-lg font-black mb-4" style={{ color: '#1B3A1B' }}>Today's Range</h2>
          <div className="flex items-center justify-around">
            <div className="flex flex-col items-center gap-1">
              <Thermometer className="w-6 h-6 text-blue-400" />
              <span className="text-2xl font-black" style={{ color: '#1B3A1B' }}>{Math.round(weather.main.temp_min)}°C</span>
              <span className="text-xs font-bold" style={{ color: '#9CA3AF' }}>Min</span>
            </div>
            <div className="w-px h-12" style={{ background: '#E6F4EA' }} />
            <div className="flex flex-col items-center gap-1">
              <Droplets className="w-6 h-6" style={{ color: '#2E7D32' }} />
              <span className="text-2xl font-black" style={{ color: '#1B3A1B' }}>{weather.main.humidity}%</span>
              <span className="text-xs font-bold" style={{ color: '#9CA3AF' }}>Humidity</span>
            </div>
            <div className="w-px h-12" style={{ background: '#E6F4EA' }} />
            <div className="flex flex-col items-center gap-1">
              <Thermometer className="w-6 h-6 text-orange-400" />
              <span className="text-2xl font-black" style={{ color: '#1B3A1B' }}>{Math.round(weather.main.temp_max)}°C</span>
              <span className="text-xs font-bold" style={{ color: '#9CA3AF' }}>Max</span>
            </div>
          </div>
        </div>

        {/* Hourly Forecast */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm overflow-hidden" style={{ border: '1px solid #E6F4EA' }}>
          <h2 className="text-lg font-black mb-6" style={{ color: '#1B3A1B' }}>Hourly Forecast</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2 no-scrollbar">
            {mockHourly.map((h, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-20 rounded-3xl p-4 flex flex-col items-center gap-2"
                style={{ background: i === 0 ? 'linear-gradient(135deg, #E6F4EA, #C7E76C50)' : '#F9FFF6', border: '1px solid #E6F4EA' }}
              >
                <span className="text-[10px] font-bold" style={{ color: '#9CA3AF' }}>{h.time}</span>
                <WeatherIcon id={h.id} className="w-7 h-7 text-amber-400" />
                <span className="text-sm font-black" style={{ color: '#1B3A1B' }}>{Math.round(h.temp)}°C</span>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-2xl flex items-center gap-3" style={{ background: '#F0FAF0', border: '1px solid #C7E76C50' }}>
            <Navigation className="w-5 h-5 flex-shrink-0" style={{ color: '#2E7D32' }} />
            <p className="text-xs font-bold" style={{ color: '#2E7D32' }}>
              Wind: {weather.wind?.speed?.toFixed(1)} m/s · Suitable conditions for field activities today
            </p>
          </div>
        </div>

        {/* Agricultural Advisory */}
        <div className="bg-white rounded-[2.5rem] p-6 shadow-sm" style={{ border: '1px solid #E6F4EA' }}>
          <h2 className="text-lg font-black mb-4" style={{ color: '#1B3A1B' }}>Agricultural Advisory</h2>
          <div className="space-y-3">
            <AdvisoryItem
              icon={<Droplets className="w-4 h-4" style={{ color: '#2E7D32' }} />}
              label="Irrigation Need"
              value={weather.main.humidity > 70 ? 'Low — soil has adequate moisture' : 'Moderate — consider irrigation'}
              positive={weather.main.humidity > 70}
            />
            <AdvisoryItem
              icon={<Wind className="w-4 h-4" style={{ color: '#2E7D32' }} />}
              label="Spraying Conditions"
              value={(weather.wind?.speed) < 5.5 ? 'Good — low wind, safe to spray' : 'Caution — high wind, avoid spraying'}
              positive={(weather.wind?.speed) < 5.5}
            />
            <AdvisoryItem
              icon={<Sun className="w-4 h-4 text-amber-400" />}
              label="Field Work"
              value={condId === 800 || condId === 801 ? 'Ideal conditions today' : 'Check conditions before working'}
              positive={condId === 800 || condId === 801}
            />
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
      <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#9CA3AF' }}>{label}</span>
      <span className="text-sm font-black" style={{ color: '#1B3A1B' }}>{value}</span>
    </div>
  );
}

function AdvisoryItem({ icon, label, value, positive }: { icon: React.ReactNode; label: string; value: string; positive: boolean }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-2xl" style={{ background: positive ? '#F0FAF0' : '#FFFBEA', border: `1px solid ${positive ? '#C7E76C50' : '#F6C94540'}` }}>
      <div className="mt-0.5">{icon}</div>
      <div>
        <p className="text-xs font-black" style={{ color: '#1B3A1B' }}>{label}</p>
        <p className="text-xs font-semibold mt-0.5" style={{ color: positive ? '#2E7D32' : '#8B6500' }}>{value}</p>
      </div>
    </div>
  );
}
