import { useEffect, useState } from "react";
import { getWeather } from "../../services/weatherService";
import {
  Droplets,
  Wind,
  ThermometerSun,
  MapPin,
  Loader2,
  CloudSun,
} from "lucide-react";

export function DashboardWeather() {
  const [weather, setWeather] = useState<any>(null);
  const [cityName, setCityName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const data = await getWeather(latitude, longitude);
          setWeather(data);
          setCityName(data.name || "");
        } catch (err) {
          console.error("Weather fetch failed:", err);
          setError("Unable to load weather");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Location access denied");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <div className="mx-6 -mt-16 mb-4 p-5 rounded-2xl flex items-center gap-3
      backdrop-blur-lg bg-white/20 border border-white/20 shadow-lg relative z-10">

        <Loader2 className="w-5 h-5 text-white animate-spin" />

        <span className="text-sm font-semibold text-white/90">
          Fetching live weather…
        </span>
      </div>
    );
  }

  /* ---------------- ERROR ---------------- */

  if (error || !weather) {
    return (
      <div className="mx-6 -mt-16 mb-4 p-5 rounded-2xl flex items-center gap-3
      backdrop-blur-lg bg-white/10 border border-white/20 shadow-lg relative z-10">

        <MapPin className="w-5 h-5 text-white/70" />

        <span className="text-sm font-semibold text-white/80">
          {error || "Weather unavailable"}
        </span>
      </div>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <div
      className="mx-6 -mt-16 mb-4 p-6 rounded-[26px] flex items-center justify-between
      transition-all duration-300 hover:scale-[1.02] relative z-10"
      style={{
        background:
          "linear-gradient(135deg,#FFE27A 0%,#C7E76C 50%,#8CD867 100%)",
        boxShadow: "0 12px 40px rgba(139,195,74,0.35)",
      }}
    >
      {/* LEFT SIDE */}

      <div className="flex flex-col gap-1">

        <div className="flex items-center gap-1 text-[11px] font-black uppercase tracking-widest text-green-900">
          <MapPin className="w-3 h-3" />
          {cityName || "Live Weather"}
        </div>

        <div className="flex items-center gap-2">

          <ThermometerSun className="w-6 h-6 text-green-900" />

          <span className="text-4xl font-black text-green-950">
            {Math.round(weather.main.temp)}°
          </span>

          <span className="text-sm font-semibold text-green-900">
            C
          </span>

        </div>

        <span className="text-sm capitalize font-semibold text-green-900/80">
          {weather.weather?.[0]?.description}
        </span>

      </div>

      {/* RIGHT SIDE */}

      <div className="flex gap-5 p-4 rounded-2xl backdrop-blur-lg bg-white/50 shadow-inner">

        {/* HUMIDITY */}

        <div className="flex flex-col items-center">
          <Droplets className="w-5 h-5 text-green-700 mb-1" />
          <span className="text-sm font-bold text-green-900">
            {weather.main.humidity}%
          </span>
          <span className="text-[10px] font-semibold text-green-800/70">
            Humidity
          </span>
        </div>

        {/* WIND */}

        <div className="flex flex-col items-center pl-4 border-l border-green-800/20">
          <Wind className="w-5 h-5 text-green-700 mb-1" />
          <span className="text-sm font-bold text-green-900">
            {weather.wind?.speed} m/s
          </span>
          <span className="text-[10px] font-semibold text-green-800/70">
            Wind
          </span>
        </div>

      </div>
    </div>
  );
}