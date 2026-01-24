import { useNavigate, useParams } from 'react-router-dom';
import { Droplets, Thermometer, Activity, ArrowRight, Wind } from 'lucide-react';
import { Header } from '../components/Header';
import { useApp } from '../../context/AppContext';
import { useCropSensors } from '../../hooks/useCropSensors';

export function CropOverview() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { getCrop } = useApp();
    const s = useCropSensors(id);

    const cropFromStore = getCrop(id || '1');
    const crop = {
        name: cropFromStore?.name ?? 'Crop',
        image: cropFromStore?.image ?? 'https://images.unsplash.com/photo-1625246333195-bf8f85404843?q=80&w=1000&auto=format&fit=crop',
        location: cropFromStore?.location ?? '—',
        sownDate: cropFromStore?.sowingDate ?? '—',
        status: 'Vegetative Stage',
    };

    const moistureStatus = s.moisture < 40 ? 'Low' : s.moisture > 80 ? 'High' : 'Normal';
    const phStatus = s.ph < 5.5 || s.ph > 7.5 ? 'Check' : 'Good';
    const temp = Math.round(20 + (s.moisture % 10) + s.ph);

    const sensors = [
        { label: 'Soil Moisture', value: `${s.moisture.toFixed(2)}%`, status: moistureStatus, color: 'text-blue-500', bg: 'bg-blue-50', icon: Droplets },
        { label: 'Temperature', value: `${temp}°C`, status: 'Optimal', color: 'text-orange-500', bg: 'bg-orange-50', icon: Thermometer },
        { label: 'Soil pH', value: s.ph.toFixed(2), status: phStatus, color: 'text-purple-500', bg: 'bg-purple-50', icon: Activity },
        { label: 'NPK Level', value: s.npk, status: 'Normal', color: 'text-green-500', bg: 'bg-green-50', icon: Wind },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50/20 via-white to-white pb-6">
            <Header title="Crop Monitor" showBack onBackClick={() => navigate('/dashboard')} />

            <div className="px-6 py-6">
                {/* Crop Summary Card */}
                <div className="bg-white rounded-3xl shadow-xl shadow-gray-900/10 overflow-hidden mb-8 border border-gray-100/50">
                    <div className="h-52 relative">
                        <img src={crop.image} alt={crop.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute bottom-5 left-5 text-white">
                            <h2 className="text-3xl font-bold mb-1 drop-shadow-lg">{crop.name}</h2>
                            <p className="opacity-95 text-sm font-medium">{crop.location}</p>
                        </div>
                    </div>
                    <div className="p-5 flex items-center justify-between bg-gradient-to-r from-gray-50/50 to-white">
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Status</p>
                            <p className="text-green-600 font-bold text-base">{crop.status}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Sown</p>
                            <p className="text-gray-800 font-bold text-base">{crop.sownDate}</p>
                        </div>
                    </div>
                </div>

                {/* Real-time Sensor Data */}
                <div className="mb-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                        <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full" />
                        Live Sensor Data
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        {sensors.map((sensor, idx) => {
                            const Icon = sensor.icon;
                            return (
                                <div key={idx} className={`bg-gradient-to-br ${sensor.bg} border border-gray-200/50 p-5 rounded-3xl shadow-md shadow-gray-900/5 flex flex-col gap-3 hover:shadow-lg transition-shadow`}>
                                    <div className={`w-12 h-12 ${sensor.bg} rounded-xl flex items-center justify-center shadow-sm`}>
                                        <Icon className={`w-6 h-6 ${sensor.color}`} />
                                    </div>
                                    <div>
                                        <span className="text-2xl font-bold text-gray-900">{sensor.value}</span>
                                        <p className="text-xs text-gray-600 font-semibold mt-1.5">{sensor.label}</p>
                                        <span className={`inline-block mt-2.5 text-[10px] font-bold px-2.5 py-1 rounded-full ${sensor.bg} ${sensor.color} border border-current/20`}>
                                            {sensor.status}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Action Button */}
                <button
                    onClick={() => navigate(`/crop/${id || '1'}/details`)}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4.5 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:from-green-700 hover:to-green-800 active:scale-[0.98] transition-all shadow-xl shadow-green-600/30 hover:shadow-2xl hover:shadow-green-600/40"
                >
                    View Crop Details
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
