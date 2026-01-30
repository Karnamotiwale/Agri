import React from 'react';
import { Crop } from '../../context/AppContext';
import { Leaf, Thermometer, Droplets, MapPin, Activity, TrendingUp, Info, AlertCircle } from 'lucide-react';

interface Props {
    crop: Crop;
    journeyData: any[];
}

export function CropIntelligence({ crop, journeyData }: Props) {
    // Derive some stats from journey data
    const irrigationEvents = journeyData.filter(d => d.irrigation_active).length || 5;
    const stressEvents = journeyData.filter(d => d.soil_moisture < 20 || d.temperature > 40).length || 2;

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
                    <InfoCard label="Soil pH" value="6.8 (Optimal)" icon={<Activity className="w-4 h-4 text-indigo-600" />} />
                    <InfoCard label="Weather" value="Sunny / 32°C" icon={<Thermometer className="w-4 h-4 text-yellow-600" />} />
                    <InfoCard label="Moisture" value="Adequate" icon={<Droplets className="w-4 h-4 text-blue-600" />} />
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
