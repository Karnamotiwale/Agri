import React, { useEffect, useState } from 'react';
import { aiAdvisoryService, ResourceAnalytics } from '../../services/ai.service';
import { BarChart3, Wallet, Zap, FileText } from 'lucide-react';

interface Props {
    cropId: string;
}

export function FinancialSummary({ cropId }: Props) {
    const [resourceData, setResourceData] = useState<ResourceAnalytics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, [cropId]);

    const loadData = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await aiAdvisoryService.getResourceAnalytics(cropId);
            setResourceData(data);
        } catch (err: any) {
            console.error('Failed to load resource data:', err);
            setError(err.message || 'Failed to load resource analytics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="h-32 bg-gray-100 animate-pulse rounded-xl"></div>;

    if (error) {
        return (
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-800 font-bold">Failed to load financial data</p>
                <p className="text-sm text-red-600 mt-1">{error}</p>
                <button onClick={loadData} className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700">
                    Retry
                </button>
            </div>
        );
    }

    if (!resourceData) return null;

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <span className="text-xl">📊</span>
                <h2 className="text-xl font-bold text-gray-900">Records & Inputs</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-3 text-indigo-600">
                        <Wallet className="w-5 h-5" />
                        <h3 className="text-sm font-bold">Estimated Cost</h3>
                    </div>
                    <p className="text-xl font-bold text-gray-900">₹ 14,250</p>
                    <p className="text-xs text-gray-500 mt-1">Includes seeds, water, and fertilizers</p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-3 text-purple-600">
                        <Zap className="w-5 h-5" />
                        <h3 className="text-sm font-bold">Resource Efficiency</h3>
                    </div>
                    <div className="space-y-2">
                        <EfficiencyBar label="Water" percent={resourceData.water.efficiencyScore} color="bg-blue-500" />
                        <EfficiencyBar label="Fertilizer" percent={resourceData.fertilizer.efficiencyScore} color="bg-purple-500" />
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-100 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-bold text-gray-500 uppercase">Historical Logs (Read-only)</span>
                </div>
                <div className="p-4 space-y-3">
                    <LogRow date="30 Jan" event="Irrigation applied (1200L)" />
                    <LogRow date="25 Jan" event="NPK Fertilization (20kg)" />
                    <LogRow date="12 Jan" event="Pest inspection completed" />
                </div>
            </div>
        </div>
    );
}

function EfficiencyBar({ label, percent, color }: { label: string; percent: number; color: string }) {
    return (
        <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-bold text-gray-500">
                <span>{label}</span>
                <span>{percent}%</span>
            </div>
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <div className={`${color} h-full transition-all duration-1000`} style={{ width: `${percent}%` }}></div>
            </div>
        </div>
    );
}

function LogRow({ date, event }: { date: string; event: string }) {
    return (
        <div className="flex items-center justify-between text-xs py-1 border-b border-gray-50 last:border-0">
            <span className="text-gray-400 w-16">{date}</span>
            <span className="text-gray-600 flex-1">{event}</span>
        </div>
    );
}
