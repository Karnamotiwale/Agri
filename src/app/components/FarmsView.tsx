import { MapPin, Sprout, Calendar, Database, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export function FarmsView() {
    const navigate = useNavigate();
    const { farms, getAllCrops } = useApp();
    const allCrops = getAllCrops();

    return (
        <div className="flex-1 overflow-y-auto pb-32 bg-gradient-to-b from-green-50/20 via-white to-white">
            <div className="px-6 pt-6 pb-2">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-green-600 rounded-full" />
                    My Farm
                </h2>

                {/* Farm Cards Loop */}
                <div className="space-y-8">
                    {farms.map((farm) => {
                        const farmCrops = allCrops.filter((c) => farm.crops.includes(c.id));
                        return (
                            <div key={farm.id} className="space-y-4">
                                {/* Farm Header Card */}
                                <div className="bg-white border border-gray-200/50 rounded-3xl p-5 shadow-lg shadow-gray-900/5 hover:shadow-xl transition-shadow">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center shadow-sm">
                                                <MapPin className="w-6 h-6 text-green-700" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 text-base">{farm.name}</h3>
                                                <p className="text-sm text-gray-600 font-medium mt-0.5">{farm.location}</p>
                                            </div>
                                        </div>
                                        <span className="px-3 py-1.5 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 text-xs font-bold rounded-full border border-gray-200">
                                            {farm.area}
                                        </span>
                                    </div>

                                    {/* Map Preview Placeholder */}
                                    <button
                                        type="button"
                                        onClick={() => { }}
                                        className="h-28 w-full bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl relative overflow-hidden flex items-center justify-center border border-green-200/50 hover:shadow-md transition-shadow"
                                    >
                                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#86c286 1px, transparent 1px)', backgroundSize: '12px 12px' }}></div>
                                        <p className="text-xs text-green-700 font-bold z-10 flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-lg shadow-sm">
                                            <MapPin className="w-3.5 h-3.5" /> View on Map
                                        </p>
                                    </button>
                                </div>

                                {/* Crops List */}
                                <div className="pl-2">
                                    <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-lg bg-green-100 flex items-center justify-center">
                                            <Sprout className="w-3.5 h-3.5 text-green-600" />
                                        </div>
                                        Crops
                                    </h4>

                                    {farmCrops.length > 0 ? (
                                        <div className="space-y-4">
                                            {farmCrops.map((crop) => (
                                                <div
                                                    key={crop.id}
                                                    onClick={() => navigate(`/crop/${crop.id}/full-details`)}
                                                    className="bg-white border border-gray-200/50 rounded-2xl p-4 shadow-md shadow-gray-900/5 flex gap-4 cursor-pointer hover:shadow-lg hover:border-green-100 active:scale-[0.98] transition-all duration-200"
                                                >
                                                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 ring-2 ring-green-100 shadow-sm">
                                                        <img src={crop.image} alt={crop.name} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-start justify-between mb-2">
                                                            <h5 className="font-bold text-gray-900 text-base">{crop.name}</h5>
                                                            <span className="px-2 py-1 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 text-[10px] font-bold uppercase tracking-wide rounded-lg border border-green-200">
                                                                Active
                                                            </span>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-y-2.5 gap-x-4">
                                                            <div className="bg-gray-50 rounded-lg px-2 py-1.5 min-w-0">
                                                                <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Sown</p>
                                                                <p className="text-xs text-gray-800 font-bold flex items-center gap-1 whitespace-nowrap overflow-hidden">
                                                                    <Calendar className="w-3 h-3 text-gray-500 flex-shrink-0" />
                                                                    <span className="overflow-hidden text-ellipsis">{crop.sowingDate}</span>
                                                                </p>
                                                            </div>
                                                            <div className="bg-gray-50 rounded-lg px-2 py-1.5">
                                                                <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Seeds</p>
                                                                <p className="text-xs text-gray-800 font-bold flex items-center gap-1">
                                                                    <Database className="w-3 h-3 text-gray-500" />
                                                                    —
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Vegetation Registered Banner */}
                                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
                                                <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                                                    <CheckCircle2 className="w-4 h-4 text-green-700" />
                                                </div>
                                                <p className="text-xs text-green-800 font-bold">
                                                    Vegetation successfully registered and being monitored.
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl border-2 border-dashed border-gray-300">
                                            <p className="text-sm text-gray-500 font-medium mb-2">No crops registered yet</p>
                                            <button
                                                onClick={() => navigate(`/crop-registration?farmId=${farm.id}`)}
                                                className="mt-2 text-green-600 text-xs font-bold hover:text-green-700 hover:underline transition-colors"
                                            >
                                                + Add Verification
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
