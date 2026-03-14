import { useEffect, useState } from 'react';
import { Cloud, Droplets, Wind, Eye, Sun, Moon, Gauge, Activity } from 'lucide-react';
import { weatherService, type WeatherData } from '../../services/weather.service';

export function LiveWeatherWidget() {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadWeather();
        // Refresh every 30 minutes
        const interval = setInterval(loadWeather, 30 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const loadWeather = async () => {
        try {
            setLoading(true);
            const data = await weatherService.getLocalWeather();
            setWeather(data);
            setError(null);
        } catch (err) {
            setError('Failed to load weather');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl p-6 shadow-xl text-white animate-pulse">
                <div className="h-48 flex items-center justify-center">
                    <p className="text-lg">Loading weather...</p>
                </div>
            </div>
        );
    }

    if (error || !weather) {
        return (
            <div className="bg-gradient-to-br from-gray-400 to-gray-600 rounded-3xl p-6 shadow-xl text-white">
                <div className="h-48 flex flex-col items-center justify-center">
                    <Cloud className="w-12 h-12 mb-2 opacity-50" />
                    <p className="text-sm">Weather unavailable</p>
                </div>
            </div>
        );
    }

    const { current, location } = weather;

    // Determine if it's day or night
    const hour = new Date(location.localtime).getHours();
    const isDay = hour >= 6 && hour < 18;

    // Get air quality description
    const getAQIDescription = (aqi: number): string => {
        if (aqi <= 50) return 'Good';
        if (aqi <= 100) return 'Moderate';
        if (aqi <= 150) return 'Unhealthy';
        return 'Hazardous';
    };

    return (
        <div className="bg-gradient-to-br from-emerald-500 via-green-600 to-teal-700 rounded-3xl shadow-2xl text-white relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24 blur-3xl"></div>

            <div className="relative z-10 p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <p className="text-sm font-medium text-emerald-100">Current Weather</p>
                        <h3 className="text-xl font-bold">{location.name}</h3>
                        <p className="text-xs text-emerald-200">{new Date(location.localtime).toLocaleString('en-IN', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}</p>
                    </div>
                    <div className="text-right">
                        <img
                            src={`https:${current.condition.icon}`}
                            alt={current.condition.text}
                            className="w-16 h-16"
                        />
                    </div>
                </div>

                {/* Main Temperature Display */}
                <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                        <span className="text-6xl font-bold">{Math.round(current.temp_c)}°</span>
                        <span className="text-2xl text-emerald-100">C</span>
                    </div>
                    <p className="text-emerald-100 text-lg mt-1">{current.condition.text}</p>
                    <p className="text-sm text-emerald-200">Feels like {Math.round(current.feelslike_c)}°C</p>
                </div>

                {/* Weather Stats Grid */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
                        <div className="flex items-center gap-2 mb-1">
                            <Wind className="w-4 h-4 text-emerald-200" />
                            <span className="text-xs text-emerald-200">Wind Speed</span>
                        </div>
                        <p className="text-xl font-bold">{Math.round(current.wind_kph)}</p>
                        <p className="text-xs text-emerald-200">km/h {current.wind_dir}</p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
                        <div className="flex items-center gap-2 mb-1">
                            <Droplets className="w-4 h-4 text-emerald-200" />
                            <span className="text-xs text-emerald-200">Humidity</span>
                        </div>
                        <p className="text-xl font-bold">{current.humidity}</p>
                        <p className="text-xs text-emerald-200">%</p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
                        <div className="flex items-center gap-2 mb-1">
                            <Eye className="w-4 h-4 text-emerald-200" />
                            <span className="text-xs text-emerald-200">Visibility</span>
                        </div>
                        <p className="text-xl font-bold">{current.vis_km}</p>
                        <p className="text-xs text-emerald-200">km</p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
                        <div className="flex items-center gap-2 mb-1">
                            <Sun className="w-4 h-4 text-emerald-200" />
                            <span className="text-xs text-emerald-200">UV Index</span>
                        </div>
                        <p className="text-xl font-bold">{current.uv}</p>
                        <p className="text-xs text-emerald-200">{current.uv < 3 ? 'Low' : current.uv < 6 ? 'Moderate' : 'High'}</p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
                        <div className="flex items-center gap-2 mb-1">
                            <Gauge className="w-4 h-4 text-emerald-200" />
                            <span className="text-xs text-emerald-200">Pressure</span>
                        </div>
                        <p className="text-xl font-bold">{Math.round(current.pressure_mb)}</p>
                        <p className="text-xs text-emerald-200">mb</p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
                        <div className="flex items-center gap-2 mb-1">
                            <Activity className="w-4 h-4 text-emerald-200" />
                            <span className="text-xs text-emerald-200">Cloud Cover</span>
                        </div>
                        <p className="text-xl font-bold">{current.cloud}</p>
                        <p className="text-xs text-emerald-200">%</p>
                    </div>
                </div>

                {/* Farming Insight */}
                <div className="bg-amber-500/20 backdrop-blur-sm rounded-2xl p-3 border border-amber-400/30">
                    <p className="text-sm font-medium text-amber-100 mb-1">🌾 Farming Tip</p>
                    <p className="text-xs text-white">
                        {current.humidity > 70 && current.temp_c > 25
                            ? 'High humidity detected. Watch for fungal diseases in crops.'
                            : current.temp_c > 35
                                ? 'High temperature alert. Ensure adequate irrigation.'
                                : current.humidity < 40
                                    ? 'Low humidity. Consider additional watering for young plants.'
                                    : current.wind_kph > 30
                                        ? 'Strong winds detected. Secure lightweight structures.'
                                        : 'Favorable conditions for most farming activities.'}
                    </p>
                </div>
            </div>
        </div>
    );
}
