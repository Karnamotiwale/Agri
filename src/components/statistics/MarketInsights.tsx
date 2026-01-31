import React, { useEffect, useState } from 'react';
import { aiAdvisoryService, YieldPrediction } from '../../services/ai.service';
import { Calendar, TrendingUp, Info, Package } from 'lucide-react';

interface Props {
    cropId: string;
}

export function MarketInsights({ cropId }: Props) {
    const [yieldData, setYieldData] = useState<YieldPrediction | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, [cropId]);

    const loadData = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await aiAdvisoryService.getYieldPrediction(cropId);
            setYieldData(data);
        } catch (err: any) {
            console.error('Failed to load yield data:', err);
            setError(err.message || 'Failed to load yield prediction');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="h-32 bg-gray-100 animate-pulse rounded-xl"></div>;

    if (error) {
        return (
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-800 font-bold">Failed to load market insights</p>
                <p className="text-sm text-red-600 mt-1">{error}</p>
                <button onClick={loadData} className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700">
                    Retry
                </button>
            </div>
        );
    }

    if (!yieldData) return null;

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <span className="text-xl">🌾</span>
                <h2 className="text-xl font-bold text-gray-900">Harvest & Post-Harvest Insights</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-3 text-orange-600">
                        <Calendar className="w-5 h-5" />
                        <h3 className="text-sm font-bold">Estimated Harvest Window</h3>
                    </div>
                    <p className="text-xl font-bold text-gray-900">Dec 15 - Dec 28</p>
                    <p className="text-xs text-gray-500 mt-1">Approx. 45 days remaining</p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-3 text-green-600">
                        <TrendingUp className="w-5 h-5" />
                        <h3 className="text-sm font-bold">Predicted Yield Range</h3>
                    </div>
                    <p className="text-xl font-bold text-gray-900">{yieldData.summary.yieldRange}</p>
                    <p className="text-xs text-green-600 font-bold mt-1">Trend: {yieldData.summary.trend} ({yieldData.summary.vsAverage})</p>
                </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2 text-blue-700">
                    <Info className="w-4 h-4" />
                    <h3 className="text-xs font-bold uppercase tracking-wider">Post-Harvest Advisory</h3>
                </div>
                <p className="text-xs text-blue-800 leading-relaxed">
                    Ensure storage moisture is below 12% for long-term grain quality. Market demand for this variety is expected to peak in early January.
                </p>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                <span className="text-xs font-medium text-gray-600 flex items-center gap-2">
                    <Package className="w-4 h-4" /> Market Readiness Indicator
                </span>
                <span className="text-xs font-bold text-orange-600">75% (Maturing)</span>
            </div>
        </div>
    );
}
