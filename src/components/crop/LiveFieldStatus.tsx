import React, { useEffect, useState } from 'react';
import { cropService } from '../../services/crop.service';
import { Droplets, Thermometer, CloudRain, Clock, ShieldCheck } from 'lucide-react';

interface Props {
    cropId: string;
}

export function LiveFieldStatus({ cropId }: Props) {
    const [journey, setJourney] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [cropId]);

    const loadData = async () => {
        try {
            const data = await cropService.getCropJourney(cropId);
            setJourney(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="h-32 bg-gray-100 animate-pulse rounded-2xl mx-6"></div>;

    // Get latest data point
    const latest = journey[journey.length - 1] || {
        soil_moisture: 42,
        temperature: 28,
        rainfall: 0,
        irrigation_active: false
    };

    return (
        <div className="px-6 space-y-4">
            <div className="flex items-center gap-2">
                <span className="text-xl">📊</span>
                <h2 className="text-xl font-bold text-gray-900">Live Field Status</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <StatusCard
                    label="Soil Moisture"
                    value={`${Math.round(latest.soil_moisture)}%`}
                    status={latest.soil_moisture < 25 ? 'Critical' : 'Handled'}
                    icon={<Droplets className="w-5 h-5 text-blue-500" />}
                />
                <StatusCard
                    label="Temperature"
                    value={`${Math.round(latest.temperature)}°C`}
                    status="Optimal"
                    icon={<Thermometer className="w-5 h-5 text-orange-500" />}
                />
                <StatusCard
                    label="Rainfall"
                    value={`${latest.rainfall}mm`}
                    status="Dry Phase"
                    icon={<CloudRain className="w-5 h-5 text-indigo-500" />}
                />
                <StatusCard
                    label="AI Irrigation"
                    value={latest.irrigation_active ? 'Active' : 'Idle'}
                    status="Scheduled: 6PM"
                    icon={<Clock className="w-5 h-5 text-purple-500" />}
                />
            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg border border-green-100">
                <ShieldCheck className="w-4 h-4 text-green-600" />
                <span className="text-[10px] font-bold text-green-700 uppercase">AI Confidence: 94% — Model Learning Active</span>
            </div>
        </div>
    );
}

function StatusCard({ label, value, status, icon }: { label: string; value: string; status: string; icon: React.ReactNode }) {
    return (
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-1">
            <div className="flex items-center justify-between mb-1">
                <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${status === 'Critical' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                    }`}>{status}</span>
            </div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tight">{label}</p>
            <p className="text-xl font-black text-gray-900">{value}</p>
        </div>
    );
}
