import React, { useEffect, useState } from 'react';
import { aiAdvisoryService, ResourceAnalytics } from '../../services/ai.service';
import { BarChart3, Wallet, Zap, FileText, TrendingDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

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

    // Cost breakdown data
    const costBreakdown = [
        { category: 'Seeds', amount: 3200, color: '#8b5cf6' },
        { category: 'Fertilizer', amount: 5800, color: '#06b6d4' },
        { category: 'Water', amount: 2400, color: '#3b82f6' },
        { category: 'Pesticides', amount: 1850, color: '#f59e0b' },
        { category: 'Labor', amount: 1000, color: '#10b981' }
    ];

    const totalCost = costBreakdown.reduce((sum, item) => sum + item.amount, 0);

    // Enhanced historical logs with more entries
    const historicalLogs = [
        { date: '04 Feb', event: 'Soil moisture check (68%)', type: 'monitoring' },
        { date: '02 Feb', event: 'Irrigation applied (1500L)', type: 'irrigation' },
        { date: '30 Jan', event: 'Pest inspection - No issues', type: 'inspection' },
        { date: '28 Jan', event: 'NPK Fertilization (25kg)', type: 'fertilizer' },
        { date: '25 Jan', event: 'Weed removal completed', type: 'maintenance' },
        { date: '22 Jan', event: 'Irrigation applied (1200L)', type: 'irrigation' },
        { date: '20 Jan', event: 'Growth stage: Tillering', type: 'milestone' },
        { date: '18 Jan', event: 'Soil pH test (6.8)', type: 'monitoring' },
        { date: '15 Jan', event: 'Organic compost added (50kg)', type: 'fertilizer' },
        { date: '12 Jan', event: 'Preventive pesticide spray', type: 'pesticide' },
        { date: '10 Jan', event: 'Irrigation applied (1100L)', type: 'irrigation' },
        { date: '08 Jan', event: 'Field drainage check', type: 'maintenance' },
        { date: '05 Jan', event: 'Nitrogen boost (15kg urea)', type: 'fertilizer' },
        { date: '02 Jan', event: 'Growth monitoring - Healthy', type: 'monitoring' },
        { date: '28 Dec', event: 'Initial crop establishment', type: 'milestone' }
    ];

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
                    <p className="text-2xl font-bold text-gray-900">₹ {totalCost.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-1">Total investment to date</p>
                    <div className="mt-3 flex items-center gap-2 text-xs">
                        <TrendingDown className="w-3 h-3 text-green-600" />
                        <span className="text-green-600 font-bold">8% below budget</span>
                    </div>
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

            {/* Cost Breakdown Chart */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-sm font-bold text-gray-900">Cost Breakdown</h3>
                </div>
                <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={costBreakdown} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis
                                dataKey="category"
                                tick={{ fontSize: 11, fill: '#6b7280' }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fontSize: 11, fill: '#6b7280' }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(val) => `₹${val}`}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                formatter={(value: any) => [`₹${value}`, 'Cost']}
                            />
                            <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                                {costBreakdown.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Historical Logs */}
            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-100 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-bold text-gray-500 uppercase">Historical Logs (Read-only)</span>
                </div>
                <div className="p-4 space-y-2 max-h-64 overflow-y-auto">
                    {historicalLogs.map((log, idx) => (
                        <LogRow key={idx} date={log.date} event={log.event} type={log.type} />
                    ))}
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

function LogRow({ date, event, type }: { date: string; event: string; type?: string }) {
    const getTypeColor = (type?: string) => {
        switch (type) {
            case 'irrigation': return 'text-blue-600';
            case 'fertilizer': return 'text-purple-600';
            case 'pesticide': return 'text-orange-600';
            case 'milestone': return 'text-green-600';
            case 'inspection': return 'text-indigo-600';
            default: return 'text-gray-600';
        }
    };

    return (
        <div className="flex items-center justify-between text-xs py-2 px-2 hover:bg-gray-50 rounded-lg transition-colors">
            <span className="text-gray-400 font-bold w-16 shrink-0">{date}</span>
            <span className={`flex-1 font-medium ${getTypeColor(type)}`}>{event}</span>
        </div>
    );
}
