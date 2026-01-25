import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Cpu, Activity, Zap, TrendingUp, AlertTriangle,
    CheckCircle2, XCircle, Home, Sprout, MapPin,
    BarChart2, Landmark
} from 'lucide-react';
import { rlService, AIAction, AIPerformance } from '../../services/rl.service';

export function AIEngineDashboard() {
    const navigate = useNavigate();
    const [performance, setPerformance] = useState<AIPerformance | null>(null);
    const [actions, setActions] = useState<AIAction[]>([]);
    const [insights, setInsights] = useState<string[]>([]);
    const [chartData, setChartData] = useState<{ date: string; score: number }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const [perf, act, ins, chart] = await Promise.all([
            rlService.getPerformanceSummary(),
            rlService.getRecentActions(),
            rlService.getInsights(),
            rlService.getRewardHistory()
        ]);
        setPerformance(perf);
        setActions(act);
        setInsights(ins);
        setChartData(chart);
        setLoading(false);
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-500';
        if (score >= 50) return 'text-yellow-500';
        return 'text-red-500';
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-5 sticky top-0 z-10 shadow-sm">
                <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Cpu className="w-6 h-6 text-purple-600" />
                    AI Engine Dashboard
                </h1>
                <p className="text-xs text-gray-500 mt-1">Real-time Reinforcement Learning Metrics</p>
            </div>

            <div className="p-6 space-y-6">

                {/* 1. Performance Score Card */}
                <div className="bg-white rounded-3xl p-6 shadow-xl shadow-purple-900/5 border border-purple-50">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">AI Farming Efficiency</h2>
                        <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-1 rounded-full">RL MODEL V2.1</span>
                    </div>

                    <div className="flex flex-col items-center justify-center py-4">
                        <div className={`relative w-32 h-32 flex items-center justify-center rounded-full border-8 border-gray-100`}>
                            {/* Simple circular fake progress for UI */}
                            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                                <circle
                                    cx="50" cy="50" r="46"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    className={`${performance && getScoreColor(performance.overallScore)} opacity-20`}
                                />
                                <circle
                                    cx="50" cy="50" r="46"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    strokeDasharray="289"
                                    strokeDashoffset={289 - (289 * (performance?.overallScore || 0)) / 100}
                                    className={`${performance && getScoreColor(performance.overallScore)} transition-all duration-1000 ease-out`}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="text-center">
                                <span className={`text-3xl font-bold ${performance && getScoreColor(performance.overallScore)}`}>
                                    {loading ? '--' : performance?.overallScore}
                                </span>
                                <p className="text-[10px] text-gray-400 font-bold uppercase">Points</p>
                            </div>
                        </div>
                        {performance && (
                            <p className="text-sm font-medium text-gray-600 mt-4 flex items-center gap-1">
                                Performance is
                                <strong className={getScoreColor(performance.overallScore)}>
                                    {performance.overallScore >= 80 ? 'EXCELLENT' : performance.overallScore >= 50 ? 'AVERAGE' : 'POOR'}
                                </strong>
                            </p>
                        )}
                    </div>
                </div>

                {/* 2. Rewards Graph (Mock Visual) */}
                <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-500" />
                        Reward History
                    </h3>
                    <div className="h-40 flex items-end justify-between gap-2 px-2">
                        {chartData.map((d, i) => (
                            <div key={i} className="flex flex-col items-center gap-2 w-full">
                                <div
                                    className={`w-full rounded-t-lg transition-all duration-500 ${d.score > 0 ? 'bg-green-400' : 'bg-red-400'}`}
                                    style={{ height: `${Math.abs(d.score)}%` }}
                                />
                                <span className="text-[10px] text-gray-400 font-medium">{d.date}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. Insights Panel */}
                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 text-white shadow-lg shadow-indigo-600/30">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-300" />
                        Learning Insights
                    </h3>
                    <ul className="space-y-3">
                        {loading ? (
                            <li className="animate-pulse h-4 bg-white/20 rounded w-3/4"></li>
                        ) : insights.map((insight, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-sm text-indigo-100 leading-relaxed">
                                <span className="w-1.5 h-1.5 bg-yellow-300 rounded-full mt-2 flex-shrink-0" />
                                {insight}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* 4. Action Log */}
                <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-gray-700" />
                        Recent Decisions
                    </h3>
                    <div className="space-y-4">
                        {loading ? <p className="text-sm text-gray-400">Loading actions...</p> : actions.map(action => (
                            <div key={action.id} className="border border-gray-100 rounded-2xl p-4 bg-gray-50/50">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                                            {new Date(action.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {action.cropName}
                                        </span>
                                        <h4 className="font-bold text-gray-900 text-sm mt-0.5">{action.actionType}</h4>
                                    </div>
                                    <div className={`px-2 py-1 rounded text-xs font-bold ${action.reward > 0 ? 'bg-green-100 text-green-700' :
                                            action.reward < 0 ? 'bg-red-100 text-red-700' : 'bg-gray-200 text-gray-600'
                                        }`}>
                                        {action.reward > 0 ? '+' : ''}{action.reward} pts
                                    </div>
                                </div>
                                <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                                    "{action.reason}"
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className={`flex items-center gap-1 text-[10px] font-bold ${action.outcome === 'IMPROVED' ? 'text-green-600' :
                                            action.outcome === 'WORSENED' ? 'text-red-600' : 'text-gray-500'
                                        }`}>
                                        {action.outcome === 'IMPROVED' ? <CheckCircle2 className="w-3 h-3" /> :
                                            action.outcome === 'WORSENED' ? <XCircle className="w-3 h-3" /> : <div className="w-3 h-3 bg-gray-400 rounded-full" />}
                                        {action.outcome}
                                    </div>
                                    <span className="text-[10px] text-purple-600 font-medium bg-purple-50 px-2 py-0.5 rounded">
                                        {action.confidence}% Conf.
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200/80 px-4 py-3 z-[100] shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                <div className="flex justify-around max-w-lg mx-auto overflow-x-auto no-scrollbar">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex flex-col items-center min-w-[3.5rem] gap-1 px-1 py-1.5 rounded-xl transition-all duration-200 hover:bg-green-50/50 active:scale-95"
                    >
                        <Home className="w-6 h-6 text-gray-400" />
                        <span className="text-[10px] font-medium text-gray-500">Home</span>
                    </button>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex flex-col items-center min-w-[3.5rem] gap-1 px-1 py-1.5 rounded-xl transition-all duration-200 hover:bg-green-50/50 active:scale-95"
                    >
                        <BarChart2 className="w-6 h-6 text-gray-400" />
                        <span className="text-[10px] font-medium text-gray-500">Analytics</span>
                    </button>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex flex-col items-center min-w-[3.5rem] gap-1 px-1 py-1.5 rounded-xl transition-all duration-200 hover:bg-green-50/50 active:scale-95"
                    >
                        <Landmark className="w-6 h-6 text-gray-400" />
                        <span className="text-[10px] font-medium text-gray-500">Schemes</span>
                    </button>
                    <button
                        onClick={() => navigate('/sensor-guide')}
                        className="flex flex-col items-center min-w-[3.5rem] gap-1 px-1 py-1.5 rounded-xl transition-all duration-200 hover:bg-green-50/50 active:scale-95"
                    >
                        <Activity className="w-6 h-6 text-gray-400" />
                        <span className="text-[10px] font-medium text-gray-500">Sensors</span>
                    </button>
                    <button
                        onClick={() => navigate('/my-farm')}
                        className="flex flex-col items-center min-w-[3.5rem] gap-1 px-1 py-1.5 rounded-xl transition-all duration-200 hover:bg-green-50/50 active:scale-95"
                    >
                        <MapPin className="w-6 h-6 text-gray-400" />
                        <span className="text-[10px] font-medium text-gray-500">Crops</span>
                    </button>

                    {/* AI Engine Tab (Active) */}
                    <button
                        className="flex flex-col items-center min-w-[3.5rem] gap-1 px-1 py-1.5 rounded-xl transition-all duration-200 bg-purple-50"
                    >
                        <Cpu className="w-6 h-6 text-purple-600" />
                        <span className="text-[10px] font-medium text-purple-600 whitespace-nowrap">AI Engine</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
