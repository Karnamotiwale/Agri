import React, { useEffect, useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { cropService } from '../../services/crop.service';
import { Loader2, AlertTriangle } from 'lucide-react';

interface Props {
    cropId: string;
}

export function CropTraceGraphs({ cropId }: Props) {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, [cropId]);

    const loadData = async () => {
        setLoading(true);
        setError(null);

        try {
            const journeyData = await cropService.getCropJourney(cropId);
            // Format data for display (e.g. shorten date)
            const formattedData = journeyData.map(d => ({
                ...d,
                displayDate: new Date(d.created_at).toLocaleDateString([], { day: '2-digit', month: 'short' })
            })).reverse(); // Reverse to show chronological order if backend returns newest first

            // Limit to 10-14 records as requested
            const limitedData = formattedData.slice(-14);

            setData(limitedData);
        } catch (err: any) {
            console.error('Failed to load crop journey:', err);
            setError(err.message || 'Failed to load field trends');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !data.length) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            </div>
        );
    }

    if (error && !data.length) {
        return (
            <div className="bg-red-50 p-4 rounded-xl text-red-600 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                <span className="text-sm font-medium">{error}. Data unavailable.</span>
            </div>
        );
    }

    // Common chart props
    const chartHeight = 200;
    const commonMargin = { top: 5, right: 10, left: 0, bottom: 5 };

    return (
        <div className="space-y-8">

            {/* MANDATORY HEADING */}
            <div className="border-l-4 border-green-600 pl-4 py-1">
                <h2 className="text-xl font-bold text-gray-900">🌱 Crop Journey & Field Condition Trends</h2>
                <p className="text-sm text-gray-500">Historical trace of growth parameters</p>
            </div>

            {/* 1. Soil Moisture Graph */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    Soil Moisture (%)
                </h3>
                <div style={{ width: '100%', height: chartHeight }}>
                    <ResponsiveContainer>
                        <LineChart data={data} margin={commonMargin}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis
                                dataKey="displayDate"
                                tick={{ fontSize: 12, fill: '#6B7280' }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fontSize: 12, fill: '#6B7280' }}
                                axisLine={false}
                                tickLine={false}
                                domain={[0, 100]}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                itemStyle={{ fontSize: '12px', fontWeight: 'bold', color: '#166534' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="soil_moisture"
                                stroke="#16a34a"
                                strokeWidth={3}
                                dot={{ r: 3, fill: '#16a34a', strokeWidth: 0 }}
                                activeDot={{ r: 6 }}
                                isAnimationActive={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 2. Temperature Graph */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                    Temperature (°C)
                </h3>
                <div style={{ width: '100%', height: chartHeight }}>
                    <ResponsiveContainer>
                        <LineChart data={data} margin={commonMargin}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis
                                dataKey="displayDate"
                                tick={{ fontSize: 12, fill: '#6B7280' }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fontSize: 12, fill: '#6B7280' }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                itemStyle={{ fontSize: '12px', fontWeight: 'bold', color: '#ea580c' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="temperature"
                                stroke="#f97316"
                                strokeWidth={3}
                                dot={{ r: 3, fill: '#f97316', strokeWidth: 0 }}
                                activeDot={{ r: 6 }}
                                isAnimationActive={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 3. Rainfall Graph */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    Rainfall (mm)
                </h3>
                <div style={{ width: '100%', height: chartHeight }}>
                    <ResponsiveContainer>
                        <LineChart data={data} margin={commonMargin}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis
                                dataKey="displayDate"
                                tick={{ fontSize: 10, fill: '#6B7280' }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fontSize: 10, fill: '#6B7280' }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                itemStyle={{ fontSize: '12px', fontWeight: 'bold', color: '#2563eb' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="rainfall"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                dot={{ r: 3, fill: '#3b82f6', strokeWidth: 0 }}
                                activeDot={{ r: 6 }}
                                isAnimationActive={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* CRITICAL AI LINK */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 flex items-start gap-3">
                <span className="text-xl">🤖</span>
                <p className="text-sm text-indigo-800 font-medium">
                    AI used the above field condition trends to make today’s irrigation decision
                </p>
            </div>

        </div>
    );
}
