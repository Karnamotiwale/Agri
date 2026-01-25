import React, { useEffect, useState } from 'react';
import { aiAdvisoryService, ResourceAnalytics } from '../../services/ai.service';
import {
    BarChart2,
    Droplets,
    Database,
    ArrowUpRight,
    ArrowDownRight,
    Minus,
    AlertCircle,
    CheckCircle,
    Leaf,
    Recycle,
    PieChart
} from 'lucide-react';

interface Props {
    cropId?: string;
    cropName?: string;
}

export const ResourceUsageAnalytics: React.FC<Props> = ({
    cropId = '1',
    cropName = 'Wheat'
}) => {
    const [data, setData] = useState<ResourceAnalytics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await aiAdvisoryService.getResourceAnalytics(cropId);
                setData(res);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [cropId]);

    if (loading) return <div className="h-48 bg-gray-50 rounded-3xl animate-pulse mt-6 text-center pt-20 text-gray-400">Loading Analytics...</div>;
    if (!data) return null;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'OPTIMAL': return 'text-emerald-600 bg-emerald-50';
            case 'CAUTION': return 'text-amber-600 bg-amber-50';
            case 'CRITICAL': case 'EXCESS': return 'text-rose-600 bg-rose-50';
            case 'DEFICIENT': return 'text-blue-600 bg-blue-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mt-6 space-y-8">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-200">
                        <BarChart2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Research & Usage Analytics</h2>
                        <p className="text-xs text-gray-500">Farm resource tracking</p>
                    </div>
                </div>
            </div>

            {/* 1. Overview Panels */}
            <div className="grid grid-cols-2 gap-4">
                {/* Water Overview */}
                <div className="p-4 rounded-2xl border border-blue-50 bg-blue-50/30">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-1.5 bg-blue-100 rounded-lg">
                            <Droplets className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${getStatusColor(data.water.status)}`}>
                            {data.water.status}
                        </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-0.5">Total Water Used</p>
                    <p className="text-lg font-bold text-gray-900">{data.water.totalUsed}</p>
                    <div className="mt-2 text-xs font-medium text-blue-700 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> {data.water.efficiencyScore}% Efficiency
                    </div>
                </div>

                {/* Fertilizer Overview */}
                <div className="p-4 rounded-2xl border border-emerald-50 bg-emerald-50/30">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-1.5 bg-emerald-100 rounded-lg">
                            <Leaf className="w-4 h-4 text-emerald-600" />
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${getStatusColor(data.fertilizer.status)}`}>
                            {data.fertilizer.status}
                        </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-0.5">Total Fertilizer</p>
                    <p className="text-lg font-bold text-gray-900">{data.fertilizer.totalUsed}</p>
                    <div className="mt-2 text-xs font-medium text-emerald-700 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {data.fertilizer.efficiencyScore}% Efficiency
                    </div>
                </div>
            </div>

            {/* 2. Water Analysis Details */}
            <div className="border-t border-gray-100 pt-6">
                <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-blue-500" /> Water Consumption Analysis
                </h3>

                <div className="space-y-4">
                    {/* Source Breakdown */}
                    <div>
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Source Breakdown</span>
                            <span>{data.water.breakdown.irrigation}% Irrigation / {data.water.breakdown.rain}% Rain</span>
                        </div>
                        <div className="flex w-full h-2.5 rounded-full overflow-hidden">
                            <div className="bg-blue-500 h-full" style={{ width: `${data.water.breakdown.irrigation}%` }}></div>
                            <div className="bg-blue-300 h-full" style={{ width: `${data.water.breakdown.rain}%` }}></div>
                        </div>
                    </div>

                    {/* Usage vs Req */}
                    <div className="bg-gray-50 rounded-xl p-3 flex justify-between items-center text-xs">
                        <div>
                            <span className="block text-gray-400 mb-0.5">Required</span>
                            <span className="font-bold text-gray-700">{(data.water.comparison.required / 1000000).toFixed(1)}M {data.water.comparison.unit}</span>
                        </div>
                        <div className="h-8 w-[1px] bg-gray-200"></div>
                        <div className="text-right">
                            <span className="block text-gray-400 mb-0.5">Actual Used</span>
                            <span className={`font-bold ${data.water.comparison.used > data.water.comparison.required ? 'text-rose-600' : 'text-emerald-600'}`}>
                                {(data.water.comparison.used / 1000000).toFixed(1)}M {data.water.comparison.unit}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Fertilizer Analysis Details */}
            <div className="border-t border-gray-100 pt-6">
                <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-500" /> Fertilizer Nutrient Analysis
                </h3>

                <div className="space-y-3">
                    {data.fertilizer.breakdown.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                            <div className="flex-1">
                                <div className="flex justify-between mb-1">
                                    <span className="font-medium text-gray-600">{item.name}</span>
                                    <span className={`text-[10px] font-bold px-1.5 rounded ${getStatusColor(item.status)}`}>{item.status}</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-1.5 relative">
                                    {/* Recommended Mark */}
                                    <div className="absolute top-0 bottom-0 w-0.5 bg-gray-400 z-10" style={{ left: `${Math.min((item.recommended / (item.recommended * 1.5)) * 100, 100)}%` }}></div>

                                    {/* Usage Bar */}
                                    <div
                                        className={`h-full rounded-full ${item.status === 'EXCESS' ? 'bg-rose-500' : item.status === 'DEFICIENT' ? 'bg-blue-500' : 'bg-emerald-500'}`}
                                        style={{ width: `${Math.min((item.used / (item.recommended * 1.5)) * 100, 100)}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                                    <span>Used: {item.used}kg</span>
                                    <span>Target: {item.recommended}kg</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 4. Storage & Inventory */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-100">
                <div className="bg-sky-50 rounded-2xl p-4 border border-sky-100 relative overflow-hidden">
                    <div className="absolute right-0 bottom-0 text-sky-200 -mb-4 -mr-4">
                        <Droplets className="w-20 h-20" />
                    </div>
                    <p className="text-xs font-bold text-sky-800 uppercase mb-1">Water Storage</p>
                    <p className="text-2xl font-bold text-sky-900">{data.storage.waterLevel}%</p>
                    <p className="text-[10px] text-sky-700 font-medium mt-1">Reservoir Level</p>
                </div>

                <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 relative overflow-hidden">
                    <div className="absolute right-0 bottom-0 text-amber-200 -mb-4 -mr-4">
                        <Database className="w-20 h-20" />
                    </div>
                    <p className="text-xs font-bold text-amber-800 uppercase mb-1">Fertilizer Stock</p>
                    <p className="text-2xl font-bold text-amber-900">{data.storage.daysRemaining} Days</p>
                    <p className="text-[10px] text-amber-700 font-medium mt-1">{data.storage.fertilizerStock} Left</p>
                </div>
            </div>

            {data.storage.alert && (
                <div className="bg-rose-50 border border-rose-100 text-rose-800 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-500" />
                    {data.storage.alert}
                </div>
            )}

            {/* 5. Sustainability Insight */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
                <div className="flex items-start gap-3 relative z-10">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                        <Recycle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h4 className="font-bold text-sm mb-1">Sustainability Impact</h4>
                        <p className="text-xs text-emerald-50 leading-relaxed opacity-90">
                            {data.insights.efficiencyImpact}
                        </p>

                        <div className="flex gap-4 mt-4">
                            <div>
                                <span className="block text-2xl font-bold">{data.insights.environmentalScore}</span>
                                <span className="text-[10px] uppercase font-bold text-emerald-200">Env. Score</span>
                            </div>
                            <div className="w-[1px] bg-emerald-500/50"></div>
                            <div>
                                <span className="block text-2xl font-bold">{data.insights.wastageReduction}</span>
                                <span className="text-[10px] uppercase font-bold text-emerald-200">Waste Saved</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative */}
                <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            </div>

        </div>
    );
};
