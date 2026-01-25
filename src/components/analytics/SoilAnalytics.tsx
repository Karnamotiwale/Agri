import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, Radar, CartesianGrid } from 'recharts';
import { Layers, Droplets } from 'lucide-react';

export function SoilAnalytics() {
    const moistureData = [
        { day: 'Mon', value: 30 },
        { day: 'Tue', value: 35 },
        { day: 'Wed', value: 32 },
        { day: 'Thu', value: 40 },
        { day: 'Fri', value: 38 },
        { day: 'Sat', value: 42 },
        { day: 'Sun', value: 39 },
    ];

    const npkData = [
        { subject: 'Nitrogen (N)', A: 120, fullMark: 150 },
        { subject: 'Phosphorus (P)', A: 98, fullMark: 150 },
        { subject: 'Potassium (K)', A: 86, fullMark: 150 },
        { subject: 'pH Level', A: 99, fullMark: 150 },
        { subject: 'Organic C', A: 85, fullMark: 150 },
        { subject: 'Sulfur', A: 65, fullMark: 150 },
    ];

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white/90 p-2 border border-gray-200 shadow-lg rounded-lg text-xs">
                    <p className="font-bold text-gray-700">{label}</p>
                    <p className="text-blue-600 font-semibold">{payload[0].value}% Moisture</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
            {/* Moisture Trend Chart */}
            <div className="bg-white rounded-3xl p-5 shadow-lg shadow-gray-100 border border-gray-100 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <Droplets className="w-4 h-4 text-blue-500" />
                            Soil Moisture Retention
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">7-Day Analysis • Optimal Range</p>
                    </div>
                    <div className="px-2 py-1 bg-green-50 rounded-lg">
                        <span className="text-xs font-bold text-green-700">+12% vs last week</span>
                    </div>
                </div>

                <div className="flex-1 w-full min-h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={moistureData}>
                            <defs>
                                <linearGradient id="colorMoisture" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#94a3b8', strokeDasharray: '3 3' }} />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorMoisture)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* NPK Radar Chart */}
            <div className="bg-white rounded-3xl p-5 shadow-lg shadow-gray-100 border border-gray-100 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                    <div>
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <Layers className="w-4 h-4 text-purple-500" />
                            Nutrient Balance (NPK)
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">Soil Health Composition</p>
                    </div>
                </div>

                <div className="flex-1 w-full min-h-[200px] flex items-center justify-center relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={npkData}>
                            <PolarGrid stroke="#e2e8f0" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} />
                            <Radar
                                name="Nutrients"
                                dataKey="A"
                                stroke="#8b5cf6"
                                strokeWidth={2}
                                fill="#8b5cf6"
                                fillOpacity={0.4}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                itemStyle={{ color: '#6d28d9', fontWeight: 'bold', fontSize: '12px' }}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                    <div className="absolute bottom-0 right-0 bg-purple-50 px-2 py-1 rounded text-[10px] font-medium text-purple-700">
                        Balanced
                    </div>
                </div>
            </div>
        </div>
    );
}
