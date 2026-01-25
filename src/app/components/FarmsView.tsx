import { MapPin, Sprout, Calendar, Database, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { CROP_GROWTH_STAGES, getCurrentStage } from '../../config/cropGrowthStages';

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
                                                <p className="text-sm text-gray-600 font-medium mt-0.5">
                                                    {farm.latitude && farm.longitude
                                                        ? `${farm.latitude.toFixed(4)}, ${farm.longitude.toFixed(4)}`
                                                        : farm.location}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="px-3 py-1.5 bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 text-xs font-bold rounded-full border border-gray-200">
                                            {farm.area}
                                        </span>
                                    </div>

                                    {/* Map Preview */}
                                    <div className="h-32 w-full rounded-xl relative overflow-hidden border border-green-200/50 shadow-sm mt-3">
                                        {/* Use iframe for simple static-like preview to save resources, or GoogleMapSelector in read-only */}
                                        {farm.latitude && farm.longitude ? (
                                            <iframe
                                                width="100%"
                                                height="100%"
                                                style={{ border: 0 }}
                                                loading="lazy"
                                                allowFullScreen
                                                referrerPolicy="no-referrer-when-downgrade"
                                                src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&q=${farm.latitude},${farm.longitude}&zoom=14`}
                                            ></iframe>
                                        ) : (
                                            <div className="w-full h-full bg-gray-50 flex items-center justify-center flex-col gap-2">
                                                <MapPin className="w-6 h-6 text-gray-300" />
                                                <p className="text-xs text-gray-400 font-medium">Location not set</p>
                                            </div>
                                        )}
                                    </div>
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
                                            {farmCrops.map((crop) => {
                                                const sowingDate = crop.sowingDate || '15 Jan 2024';
                                                const daysSincePlanting = Math.floor(
                                                    (Date.now() - new Date(sowingDate).getTime()) / (1000 * 60 * 60 * 24)
                                                );
                                                const cropType = (crop.crop_type || crop.name || 'Maize')
                                                    .replace(/wild /i, '')
                                                    .replace(/onion/i, 'Maize');
                                                const stages = CROP_GROWTH_STAGES[cropType] || CROP_GROWTH_STAGES.Default;
                                                const currentStage = getCurrentStage(cropType, daysSincePlanting);

                                                return (
                                                    <div
                                                        key={crop.id}
                                                        className="bg-white border border-gray-100 rounded-[2rem] p-5 shadow-xl shadow-gray-900/5 hover:shadow-2xl hover:border-green-100 transition-all duration-300"
                                                    >
                                                        <div className="flex gap-4 mb-4">
                                                            <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 shadow-md">
                                                                <img src={crop.image} alt={crop.name} className="w-full h-full object-cover" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <h5 className="font-bold text-gray-900 text-lg leading-tight">{crop.name}</h5>
                                                                <p className="text-xs text-gray-400 font-medium mt-0.5">
                                                                    {farm.area} hectares of land – [Jan - Dec]
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Horizontal Growth Timeline */}
                                                        <div className="relative pt-4 pb-8">
                                                            {/* Track Line */}
                                                            <div className="absolute top-[22px] left-2 right-2 h-[3px] bg-gray-100 rounded-full"></div>

                                                            {/* Progress Line */}
                                                            <div
                                                                className="absolute top-[22px] left-2 h-[3px] bg-green-500 rounded-full transition-all duration-1000"
                                                                style={{
                                                                    width: `${Math.max(0, Math.min(100, (stages.indexOf(currentStage!) / (stages.length - 1)) * 100))}%`
                                                                }}
                                                            ></div>

                                                            {/* Checkpoints */}
                                                            <div className="relative flex justify-between px-1">
                                                                {stages.map((stage, idx) => {
                                                                    const stageIdx = stages.indexOf(currentStage!);
                                                                    const isPassed = idx < stageIdx;
                                                                    const isCurrent = idx === stageIdx;

                                                                    return (
                                                                        <div key={idx} className="relative">
                                                                            <div className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 z-10 ${isPassed ? 'bg-green-500 border-green-500' :
                                                                                isCurrent ? 'bg-white border-green-500 w-5 h-5 -mt-[3px] shadow-lg shadow-green-200' :
                                                                                    'bg-white border-gray-200'
                                                                                }`}>
                                                                                {isCurrent && (
                                                                                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full m-auto mt-[1.5px]"></div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center justify-between mt-2">
                                                            <div>
                                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-tight">
                                                                    {currentStage?.stage}
                                                                </p>
                                                                <p className="text-[10px] text-gray-400 font-medium">
                                                                    ({new Date(sowingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })})
                                                                </p>
                                                            </div>
                                                            <button
                                                                onClick={() => navigate(`/crop/${crop.id}/details`)}
                                                                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 px-6 rounded-2xl text-xs uppercase tracking-wider shadow-lg shadow-green-500/30 active:scale-95 transition-all"
                                                            >
                                                                View Details
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}

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
