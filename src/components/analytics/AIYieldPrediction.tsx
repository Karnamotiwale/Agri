import React, { useEffect, useState } from 'react';
import { aiAdvisoryService, YieldPrediction } from '../../services/ai.service';
import {
    TrendingUp,
    TrendingDown,
    Minus,
    AlertTriangle,
    CheckCircle2,
    Info,
    Droplets,
    CloudLightning,
    Bug,
    Leaf
} from 'lucide-react';

interface Props {
    cropId?: string;
    cropName?: string;
    sowingDate?: string;
}

export const AIYieldPrediction: React.FC<Props> = ({
    cropId = '1',
    cropName = 'Wheat'
}) => {
    const [prediction, setPrediction] = useState<YieldPrediction | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchYieldData = async () => {
            try {
                setLoading(true);
                const data = await aiAdvisoryService.getYieldPrediction(cropId);
                setPrediction(data);
            } catch (e) {
                console.error("Failed to load yield prediction", e);
            } finally {
                setLoading(false);
            }
        };
        fetchYieldData();
    }, [cropId]);

    if (loading) {
        return (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-pulse mt-6">
                <div className="flex justify-between mb-8">
                    <div className="h-8 w-1/3 bg-gray-200 rounded-lg"></div>
                    <div className="h-8 w-20 bg-gray-200 rounded-lg"></div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="h-24 bg-gray-100 rounded-2xl"></div>
                    <div className="h-24 bg-gray-100 rounded-2xl"></div>
                </div>
                <div className="h-32 bg-gray-100 rounded-2xl"></div>
            </div>
        );
    }

    if (!prediction) return null;

    const { summary, risks, factors, explainability } = prediction;

    const getStabilityColor = (status: string) => {
        switch (status) {
            case 'STABLE': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
            case 'AT_RISK': return 'text-amber-600 bg-amber-50 border-amber-100';
            case 'CRITICAL': return 'text-rose-600 bg-rose-50 border-rose-100';
            default: return 'text-gray-600 bg-gray-50 border-gray-100';
        }
    };

    const getRiskIcon = (type: string) => {
        switch (type) {
            case 'Weather': return <CloudLightning className="w-4 h-4 text-amber-500" />;
            case 'Pest': return <Bug className="w-4 h-4 text-rose-500" />;
            case 'Water': return <Droplets className="w-4 h-4 text-blue-500" />;
            default: return <AlertTriangle className="w-4 h-4 text-gray-500" />;
        }
    };

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-indigo-50 mt-6 relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

            <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200">
                        <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Yield Prediction</h2>
                        <p className="text-xs text-gray-500">AI forecasted output</p>
                    </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStabilityColor(summary.stability)}`}>
                    {summary.stability}
                </span>
            </div>

            {/* 1. Yield Summary Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
                <div className="p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-2xl">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Expected Yield</p>
                    <p className="text-xl font-bold text-gray-900">{summary.expectedYield}</p>
                    <div className="flex items-center gap-1 mt-1 text-xs font-medium text-emerald-600">
                        <TrendingUp className="w-3 h-3" /> {summary.vsAverage}
                    </div>
                </div>

                <div className="p-4 bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-2xl">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Yield Range</p>
                    <p className="text-lg font-bold text-gray-800">{summary.yieldRange}</p>
                    <p className="text-xs text-gray-400 mt-1">Confidence Interval</p>
                </div>
            </div>

            {/* 2. Influencing Factors */}
            <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <Leaf className="w-4 h-4 text-indigo-500" /> Influencing Factors
                </h3>
                <div className="space-y-3">
                    {factors.map((factor, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                            <div className="flex-1">
                                <div className="flex justify-between mb-1">
                                    <span className="text-xs font-medium text-gray-600">{factor.name}</span>
                                    <span className={`text-xs font-bold ${factor.impact === 'POSITIVE' ? 'text-emerald-600' :
                                            factor.impact === 'NEGATIVE' ? 'text-rose-600' : 'text-gray-600'
                                        }`}>
                                        {factor.impact}
                                    </span>
                                </div>
                                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${factor.impact === 'POSITIVE' ? 'bg-emerald-500' :
                                                factor.impact === 'NEGATIVE' ? 'bg-rose-500' : 'bg-gray-400'
                                            }`}
                                        style={{ width: `${factor.score}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. Risk Analysis */}
            <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" /> Potential Risks
                </h3>
                <div className="grid gap-3">
                    {risks.map((risk, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="mt-0.5">{getRiskIcon(risk.type)}</div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-gray-900">{risk.type}</span>
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${risk.level === 'HIGH' ? 'bg-rose-100 text-rose-700 border-rose-200' :
                                            risk.level === 'MEDIUM' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                                                'bg-blue-100 text-blue-700 border-blue-200'
                                        }`}>{risk.level}</span>
                                </div>
                                <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{risk.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 4. Explainability & Actions */}
            <div className="bg-indigo-50/50 rounded-2xl p-4 border border-indigo-100">
                <div className="flex items-center gap-2 mb-2">
                    <Info className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-bold text-indigo-800">Why this prediction?</span>
                    <span className="ml-auto text-[10px] font-bold text-indigo-600 bg-white px-2 py-0.5 rounded-full border border-indigo-100">
                        {explainability.confidence}% Confidence
                    </span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed mb-4">
                    {explainability.reason}
                </p>

                <div className="flex gap-2">
                    <button className="flex-1 bg-white border border-gray-200 text-gray-700 text-xs font-bold py-2.5 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
                        Improve Yield Plan
                    </button>
                    <button className="flex-1 bg-white border border-gray-200 text-gray-700 text-xs font-bold py-2.5 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
                        View Risks
                    </button>
                </div>
            </div>
        </div>
    );
};
