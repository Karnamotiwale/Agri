import React from 'react';
import { Crop } from '../../context/AppContext';
import { Leaf, Thermometer, Droplets, MapPin, Activity, TrendingUp, Info, AlertCircle, Gauge } from 'lucide-react';
import { PesticideRecommendation } from './PesticideRecommendation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Props {
    crop: Crop;
    journeyData: any[];
}

export function CropIntelligence({ crop, journeyData }: Props) {
    // Derive some stats from journey data
    const irrigationEvents = journeyData.filter(d => d.irrigation_active).length || 5;
    const stressEvents = journeyData.filter(d => d.soil_moisture < 20 || d.temperature > 40).length || 2;

    // NPK levels data (using latest journey data if available)
    const latestData = journeyData.length > 0 ? journeyData[journeyData.length - 1] : null;
    const npkData = [
        {
            nutrient: 'N',
            value: latestData?.nitrogen || 125,
            optimal: 150,
            color: '#8b5cf6',
            name: 'Nitrogen'
        },
        {
            nutrient: 'P',
            value: latestData?.phosphorus || 95,
            optimal: 120,
            color: '#06b6d4',
            name: 'Phosphorus'
        },
        {
            nutrient: 'K',
            value: latestData?.potassium || 110,
            optimal: 140,
            color: '#10b981',
            name: 'Potassium'
        }
    ];

    // Calculate soil health score based on NPK levels
    const soilHealthScore = Math.round(
        npkData.reduce((sum, item) => sum + (item.value / item.optimal * 100), 0) / 3
    );

    return (
        <div className="space-y-8">
            {/* 5. General Crop Information */}
            <section className="space-y-4">
                <div className="flex items-center gap-2">
                    <span className="text-xl">🌾</span>
                    <h2 className="text-xl font-bold text-gray-900">General Crop Information</h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <InfoCard label="Crop Name" value={crop.name} icon={<Leaf className="w-4 h-4 text-green-600" />} />
                    <InfoCard label="Variety" value={crop.cropType || 'Local Improved'} icon={<Activity className="w-4 h-4 text-blue-600" />} />
                    <InfoCard label="Sowing Date" value={new Date(crop.sowingDate).toLocaleDateString()} icon={<Clock className="w-4 h-4 text-orange-600" />} />
                    <InfoCard label="Current Stage" value={crop.currentStage} icon={<TrendingUp className="w-4 h-4 text-purple-600" />} />
                </div>
            </section>

            {/* 6. Environment & Site Information */}
            <section className="space-y-4">
                <div className="flex items-center gap-2">
                    <span className="text-xl">🌍</span>
                    <h2 className="text-xl font-bold text-gray-900">Environment & Site Conditions</h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <InfoCard label="Soil Type" value="Clay Loam" icon={<MapPin className="w-4 h-4 text-red-600" />} />
                    <InfoCard label="Soil pH" value={latestData?.ph ? `${latestData.ph} (Optimal)` : "6.8 (Optimal)"} icon={<Activity className="w-4 h-4 text-indigo-600" />} />
                    <InfoCard label="Weather" value="Sunny / 32°C" icon={<Thermometer className="w-4 h-4 text-yellow-600" />} />
                    <InfoCard label="Moisture" value="Adequate" icon={<Droplets className="w-4 h-4 text-blue-600" />} />
                </div>
            </section>

            {/* NPK Levels Visualization */}
            <section className="space-y-4">
                <div className="flex items-center gap-2">
                    <span className="text-xl">🧪</span>
                    <h2 className="text-xl font-bold text-gray-900">Soil Nutrient Analysis</h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    {/* NPK Bar Chart */}
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="text-sm font-bold text-gray-900 mb-4">NPK Levels (mg/kg)</h3>
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={npkData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis
                                        dataKey="nutrient"
                                        tick={{ fontSize: 12, fill: '#6b7280', fontWeight: 'bold' }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 11, fill: '#6b7280' }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                        formatter={(value: any, name: any, props: any) => [
                                            `${value} mg/kg (${Math.round(value / props.payload.optimal * 100)}% of optimal)`,
                                            props.payload.name
                                        ]}
                                    />
                                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                                        {npkData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Soil Health Score */}
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <Gauge className="w-5 h-5 text-emerald-600" />
                            <h3 className="text-sm font-bold text-gray-900">Soil Health Score</h3>
                        </div>
                        <div className="flex flex-col items-center justify-center h-32">
                            <div className="relative w-32 h-32">
                                <svg className="transform -rotate-90 w-32 h-32">
                                    <circle
                                        cx="64"
                                        cy="64"
                                        r="56"
                                        stroke="#e5e7eb"
                                        strokeWidth="12"
                                        fill="none"
                                    />
                                    <circle
                                        cx="64"
                                        cy="64"
                                        r="56"
                                        stroke={soilHealthScore >= 75 ? '#10b981' : soilHealthScore >= 50 ? '#f59e0b' : '#ef4444'}
                                        strokeWidth="12"
                                        fill="none"
                                        strokeDasharray={`${2 * Math.PI * 56}`}
                                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - soilHealthScore / 100)}`}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-3xl font-black text-gray-900">{soilHealthScore}</span>
                                    <span className="text-xs text-gray-500 font-bold">/ 100</span>
                                </div>
                            </div>
                            <p className={`mt-4 text-sm font-bold ${soilHealthScore >= 75 ? 'text-green-600' : soilHealthScore >= 50 ? 'text-orange-600' : 'text-red-600'}`}>
                                {soilHealthScore >= 75 ? 'Excellent' : soilHealthScore >= 50 ? 'Good' : 'Needs Attention'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* NPK Status Cards */}
                <div className="grid grid-cols-3 gap-3">
                    {npkData.map((item, idx) => {
                        const percentage = Math.round(item.value / item.optimal * 100);
                        const status = percentage >= 80 ? 'Optimal' : percentage >= 60 ? 'Moderate' : 'Low';
                        const statusColor = percentage >= 80 ? 'text-green-600 bg-green-50' : percentage >= 60 ? 'text-orange-600 bg-orange-50' : 'text-red-600 bg-red-50';

                        return (
                            <div key={idx} className="bg-white p-3 rounded-xl border border-gray-100">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-gray-500">{item.name}</span>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${statusColor}`}>
                                        {status}
                                    </span>
                                </div>
                                <p className="text-lg font-bold text-gray-900">{item.value} <span className="text-xs text-gray-400">mg/kg</span></p>
                                <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-1000"
                                        style={{
                                            width: `${Math.min(100, percentage)}%`,
                                            backgroundColor: item.color
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* 7. Production & Management Data */}
            <section className="space-y-4">
                <div className="flex items-center gap-2">
                    <span className="text-xl">📈</span>
                    <h2 className="text-xl font-bold text-gray-900">Production & Management</h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <InfoCard label="Irrigation Events" value={`${irrigationEvents} times`} icon={<Droplets className="w-4 h-4 text-blue-500" />} />
                    <InfoCard label="Fertilizer Apps" value="2 times" icon={<Activity className="w-4 h-4 text-purple-500" />} />
                    <InfoCard label="Pest Treatments" value="1 detected" icon={<Activity className="w-4 h-4 text-red-500" />} />
                    <InfoCard label="Stress Events" value={`${stressEvents} detected`} icon={<AlertCircle className="w-4 h-4 text-orange-500" />} />
                </div>
            </section>

            {/* 8. Pest & Disease Management */}
            <section className="space-y-4">
                <div className="flex items-center gap-2">
                    <span className="text-xl">🛡️</span>
                    <h2 className="text-xl font-bold text-gray-900">Pest & Disease Management</h2>
                </div>
                <PesticideRecommendation
                    crop={crop}
                    currentSensorData={{
                        // Use latest journey data if available, otherwise use realistic defaults
                        temperature: journeyData.length > 0
                            ? journeyData[journeyData.length - 1]?.temperature || 28.5
                            : 28.5,
                        humidity: journeyData.length > 0
                            ? journeyData[journeyData.length - 1]?.humidity || 82
                            : 82, // High humidity to trigger preventive pesticide demo
                        moisture: journeyData.length > 0
                            ? journeyData[journeyData.length - 1]?.soil_moisture || 64
                            : 64
                    }}
                />
            </section>
        </div>
    );
}

function InfoCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
    return (
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
                {icon}
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{label}</span>
            </div>
            <p className="text-sm font-bold text-gray-800">{value}</p>
        </div>
    );
}

function Clock({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
        </svg>
    );
}
