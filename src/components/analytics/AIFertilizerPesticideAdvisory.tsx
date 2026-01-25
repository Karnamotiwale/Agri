import React, { useEffect, useState } from 'react';
import { aiAdvisoryService, CropAdvisory } from '../../services/ai.service';
import {
    Sprout,
    Bug,
    AlertTriangle,
    CheckCircle2,
    Droplets,
    Info,
    Beaker,
    ShieldAlert,
    Clock,
    ThumbsUp,
    ThumbsDown,
    XCircle,
    BrainCircuit,
    Leaf
} from 'lucide-react';

interface Props {
    cropId?: string;
    cropName?: string;
    stage?: string;
}

export const AIFertilizerPesticideAdvisory: React.FC<Props> = ({
    cropId = '1',
    cropName = 'Wheat',
    stage = 'Vegetative'
}) => {
    const [advisory, setAdvisory] = useState<CropAdvisory | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdvisory = async () => {
            try {
                setLoading(true);
                const data = await aiAdvisoryService.getDetailedAdvisory(cropId);
                setAdvisory(data);
            } catch (e) {
                console.error("Failed to load advisory", e);
            } finally {
                setLoading(false);
            }
        };
        fetchAdvisory();
    }, [cropId]);

    if (loading) {
        return (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-pulse">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-indigo-100 rounded-xl"></div>
                    <div className="h-6 w-48 bg-gray-200 rounded"></div>
                </div>
                <div className="h-40 bg-gray-100 rounded-2xl mb-4"></div>
                <div className="h-40 bg-gray-100 rounded-2xl"></div>
            </div>
        );
    }

    if (!advisory) return null;

    return (
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-indigo-900/5 ring-1 ring-black/5 relative overflow-hidden">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-3 rounded-2xl shadow-lg shadow-indigo-200">
                        <BrainCircuit className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 leading-tight">AI Advisory</h2>
                        <p className="text-sm text-gray-500 font-medium mt-0.5 flex items-center gap-1.5">
                            For {cropName} <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                            <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-xs font-bold uppercase">{stage} Stage</span>
                        </p>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1.5 bg-green-50 px-3 py-1 rounded-full border border-green-100 mb-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-bold text-green-700">Live Analysis</span>
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium">Updated just now</span>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* 1. Fertilizer Panel */}
                <div className={`rounded-2xl border-2 p-5 relative overflow-hidden transition-all duration-300 ${advisory.fertilizer.status === 'REQUIRED'
                        ? 'border-emerald-100 bg-emerald-50/50'
                        : 'border-gray-100 bg-gray-50'
                    }`}>
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                <Sprout className="w-5 h-5 text-emerald-600" />
                            </div>
                            <h3 className="font-bold text-gray-800">Fertilizer</h3>
                        </div>
                        {advisory.fertilizer.status === 'REQUIRED' && (
                            <span className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-lg text-xs font-bold border border-emerald-200">
                                REQUIRED
                            </span>
                        )}
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm border border-emerald-100/50 mb-4">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-semibold text-gray-500 uppercase">Recommended Product</span>
                        </div>
                        <p className="text-lg font-bold text-emerald-900">{advisory.fertilizer.productName}</p>
                        <p className="text-sm text-gray-600 mb-3">{advisory.fertilizer.type}</p>

                        <div className="flex gap-2 mb-4">
                            {['N', 'P', 'K'].map(n => (
                                <div key={n} className="flex-1 bg-gray-50 rounded-lg p-2 text-center border border-gray-100">
                                    <span className="block text-[10px] font-bold text-gray-400">{n}</span>
                                    <span className="block text-sm font-bold text-gray-700">
                                        {advisory.fertilizer.nutrients[n as keyof typeof advisory.fertilizer.nutrients]}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-2 border-t border-gray-100 pt-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 flex items-center gap-1.5">
                                    <Beaker className="w-3.5 h-3.5" /> Dosage
                                </span>
                                <span className="font-semibold text-gray-900">{advisory.fertilizer.dosage}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5" /> Timing
                                </span>
                                <span className="font-semibold text-gray-900">{advisory.fertilizer.timing}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 flex items-center gap-1.5">
                                    <Droplets className="w-3.5 h-3.5" /> Method
                                </span>
                                <span className="font-semibold text-gray-900">{advisory.fertilizer.method}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Pesticide Panel */}
                <div className={`rounded-2xl border-2 p-5 relative overflow-hidden transition-all duration-300 ${advisory.pesticide.detected
                        ? 'border-rose-100 bg-rose-50/50'
                        : 'border-gray-100 bg-gray-50'
                    }`}>
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                <Bug className="w-5 h-5 text-rose-600" />
                            </div>
                            <h3 className="font-bold text-gray-800">Pest Control</h3>
                        </div>
                        {advisory.pesticide.riskLevel !== 'NONE' && (
                            <span className="bg-rose-100 text-rose-700 px-2.5 py-1 rounded-lg text-xs font-bold border border-rose-200">
                                {advisory.pesticide.riskLevel} RISK
                            </span>
                        )}
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm border border-rose-100/50 mb-4">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-semibold text-gray-500 uppercase">Target Threat</span>
                        </div>
                        <p className="text-lg font-bold text-rose-900">{advisory.pesticide.target}</p>

                        <div className="mt-3 mb-4 p-3 bg-rose-50 rounded-lg border border-rose-100">
                            <p className="text-xs font-bold text-rose-800 uppercase mb-1">Recommended Solution</p>
                            <p className="text-sm font-semibold text-gray-900">{advisory.pesticide.productName}</p>
                            <p className="text-xs text-gray-600">{advisory.pesticide.category}</p>
                        </div>

                        <div className="space-y-2 border-t border-gray-100 pt-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 flex items-center gap-1.5">
                                    <Beaker className="w-3.5 h-3.5" /> Dosage
                                </span>
                                <span className="font-semibold text-gray-900">{advisory.pesticide.dosage}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 flex items-center gap-1.5">
                                    <ShieldAlert className="w-3.5 h-3.5" /> Safety
                                </span>
                                <span className="font-semibold text-gray-900">{advisory.pesticide.safetyInterval} PHI</span>
                            </div>
                            {advisory.pesticide.organicAlternative && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 flex items-center gap-1.5">
                                        <Leaf className="w-3.5 h-3.5 text-green-600" /> Organic
                                    </span>
                                    <span className="font-semibold text-green-700">{advisory.pesticide.organicAlternative}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Explainability Section */}
            <div className="mt-6 bg-slate-50 border border-slate-200 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                    <Info className="w-5 h-5 text-indigo-600" />
                    <h3 className="font-bold text-slate-800">Why was this recommended?</h3>
                    <span className="ml-auto bg-white border border-slate-200 text-slate-600 px-2.5 py-0.5 rounded-full text-xs font-bold">
                        {advisory.explainability.confidence}% Confidence
                    </span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed mb-4">
                    {advisory.explainability.reason}
                </p>
                <div className="flex flex-wrap gap-2">
                    {advisory.explainability.factors.map((factor, idx) => (
                        <span key={idx} className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors cursor-default">
                            {factor}
                        </span>
                    ))}
                </div>
            </div>

            {/* 4. Actions */}
            <div className="mt-6 flex gap-3 pt-6 border-t border-gray-100">
                <button className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-200/50 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Apply Recommendations
                </button>
                <button className="px-6 py-3 bg-white border border-gray-200 font-semibold text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
                    Delay
                </button>
                <button className="px-6 py-3 bg-white border border-gray-200 font-semibold text-gray-400 rounded-xl hover:bg-gray-50 hover:text-gray-600 transition-colors">
                    Ignore
                </button>
            </div>
        </div>
    );
};
