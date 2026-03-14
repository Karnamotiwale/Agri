import { CloudRain, Sun, Wind, Droplets, CloudSun, ThermometerSun } from 'lucide-react';

export function WeatherWidget() {
    const current = {
        temp: 28,
        condition: 'Sunny',
        humidity: 65,
        wind: 12,
        location: 'Field Sector A',
        impact: 'Optimal for Wheat growth'
    };

    const forecast = [
        { day: 'Mon', temp: 29, icon: Sun },
        { day: 'Tue', temp: 27, icon: CloudSun },
        { day: 'Wed', temp: 24, icon: CloudRain },
        { day: 'Thu', temp: 25, icon: CloudSun },
        { day: 'Fri', temp: 28, icon: Sun },
    ];

    return (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-xl shadow-blue-500/20 p-6 h-full flex flex-col justify-between group hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300">
            {/* Decorative background elements */}
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-yellow-300/30 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
            <div className="absolute -left-8 -bottom-8 w-40 h-40 bg-blue-300/20 rounded-full blur-3xl"></div>

            {/* Header */}
            <div className="relative z-10 flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2 mb-1 opacity-90">
                        <span className="text-sm font-medium tracking-wide uppercase">{current.location}</span>
                    </div>
                    <h3 className="text-5xl font-bold tracking-tight mb-2">{current.temp}°</h3>
                    <p className="text-lg font-medium opacity-90 flex items-center gap-2">
                        <Sun className="w-5 h-5 text-yellow-300" />
                        {current.condition}
                    </p>
                </div>
                <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl border border-white/20">
                    <Sun className="w-8 h-8 text-yellow-300 animate-[spin_10s_linear_infinite]" />
                </div>
            </div>

            {/* Metrics */}
            <div className="relative z-10 grid grid-cols-2 gap-4 mt-6 mb-6">
                <div className="bg-blue-950/20 backdrop-blur-sm rounded-xl p-3 flex items-center gap-3 border border-white/10">
                    <Droplets className="w-5 h-5 text-blue-200" />
                    <div>
                        <p className="text-xs opacity-70">Humidity</p>
                        <p className="font-bold">{current.humidity}%</p>
                    </div>
                </div>
                <div className="bg-blue-950/20 backdrop-blur-sm rounded-xl p-3 flex items-center gap-3 border border-white/10">
                    <Wind className="w-5 h-5 text-blue-200" />
                    <div>
                        <p className="text-xs opacity-70">Wind</p>
                        <p className="font-bold">{current.wind} km/h</p>
                    </div>
                </div>
            </div>

            {/* Agri-Impact Note */}
            <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-xl p-3 mb-6 border border-white/10">
                <div className="flex items-center gap-2 mb-1">
                    <ThermometerSun className="w-4 h-4 text-emerald-300" />
                    <p className="text-xs font-bold uppercase text-emerald-100">Agri-Impact</p>
                </div>
                <p className="text-sm leading-relaxed opacity-90">{current.impact}</p>
            </div>

            {/* Forecast */}
            <div className="relative z-10 pt-4 border-t border-white/10">
                <div className="flex justify-between items-center text-center">
                    {forecast.map((day, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-1.5 hover:-translate-y-1 transition-transform cursor-default">
                            <span className="text-xs font-medium opacity-70">{day.day}</span>
                            <day.icon className="w-5 h-5 opacity-90" />
                            <span className="text-sm font-bold">{day.temp}°</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
