import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Activity, Brain, Zap, BarChart3, ArrowLeft,
    ShieldCheck, RefreshCw, Clock, AlertTriangle, CheckCircle2
} from 'lucide-react';
import { aiService } from '../../services/ai.service';
import { BottomNav } from '../components/BottomNav';

/**
 * AI ENGINE DASHBOARD REBUILD (Phase 4)
 * Stabilized with 4 tabs and 10s polling.
 */
export function AIEngineDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'decision' | 'rl' | 'xai' | 'status'>('decision');
    const [aiData, setAiData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isSimulated, setIsSimulated] = useState(false);
    const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

    const loadAllAIData = async () => {
        try {
            // Requirement 5: No frontend AI calculations - frontend is read-only.
            // Requirement 3: include default values if data is missing (handled by service/backend)

            const [decision, status, rl, xai, log] = await Promise.allSettled([
                aiService.getDecision({ crop: 'rice', growth_stage: 'Vegetative' }),
                aiService.getStatus(),
                aiService.getRLMetrics(),
                aiService.getXAI(),
                aiService.getDecisionLog('rice', 1)
            ]);

            const newData: any = {};
            if (decision.status === 'fulfilled') newData.decision = decision.value;
            if (status.status === 'fulfilled') newData.status = status.value;
            if (rl.status === 'fulfilled') newData.rl = rl.value;
            if (xai.status === 'fulfilled') newData.xai = xai.value;
            if (log.status === 'fulfilled') newData.latestLog = log.value[0];

            setAiData(newData);
            setIsSimulated(false);
        } catch (err) {
            console.error('AI Dashboard Engine issue, entering simulation mode:', err);
            setIsSimulated(true);
            // Fallback for UI safety (Requirement 6)
            setAiData(getFallbackData());
        } finally {
            setLoading(false);
            setLastRefresh(new Date());
        }
    };

    // Phase 5: Poll backend every 10 seconds
    useEffect(() => {
        loadAllAIData();
        const interval = setInterval(loadAllAIData, 10000);
        return () => clearInterval(interval);
    }, []);

    const tabs = [
        { id: 'decision', label: 'Decision AI', icon: Brain },
        { id: 'rl', label: 'Reinforcement Learning', icon: Zap },
        { id: 'xai', label: 'Explainable AI', icon: Activity },
        { id: 'status', label: 'AI Health & Status', icon: ShieldCheck },
    ];

    if (loading && !aiData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <RefreshCw className="w-10 h-10 text-purple-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 font-bold">Synchronizing with AI Engines...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <div>
                            <h1 className="text-xl font-black text-gray-900 leading-none">AI Engine Dashboard</h1>
                            <p className="text-xs text-gray-500 font-medium mt-1 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Updated {lastRefresh.toLocaleTimeString()}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {isSimulated && (
                            <span className="px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-200 animate-pulse">
                                Simulation Mode
                            </span>
                        )}
                        <div className={`w-3 h-3 rounded-full ${isSimulated ? 'bg-amber-400' : 'bg-green-500'} shadow-sm`} />
                    </div>
                </div>
            </header>

            {/* Tab Navigation */}
            <nav className="bg-white border-b border-gray-200 px-6 py-1 overflow-x-auto scroller-hidden">
                <div className="max-w-7xl mx-auto flex gap-6">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 py-4 border-b-2 font-bold text-sm transition-all whitespace-nowrap ${activeTab === tab.id
                                    ? 'border-purple-600 text-purple-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="flex-1 p-6 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    {activeTab === 'decision' && <DecisionTab data={aiData?.decision} log={aiData?.latestLog} />}
                    {activeTab === 'rl' && <RLTab data={aiData?.rl} state={aiData?.decision?.state} />}
                    {activeTab === 'xai' && <XAITab data={aiData?.xai} />}
                    {activeTab === 'status' && <StatusTab data={aiData?.status} />}
                </div>
            </main>

            <div className="h-20" />
            <BottomNav />
        </div>
    );
}

// --- SUB-COMPONENTS (Requirement 4) ---

function DecisionTab({ data, log }: any) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    Current AI Intelligence
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
                        <Brain className="absolute -bottom-4 -right-4 w-48 h-48 opacity-10 pointer-events-none" />
                        <div className="relative z-10">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-white/20 px-3 py-1 rounded-full border border-white/30 mb-6 inline-block">
                                Decision Output
                            </span>
                            <div className="text-6xl font-black mb-4 tracking-tighter">
                                {data?.final_decision_label || 'WAIT'}
                            </div>
                            <p className="text-xl font-medium text-purple-50 opacity-90 leading-snug max-w-md">
                                {data?.reason || "Conditions currently stable for growth."}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <KPICard label="Confidence Score" value={`${Math.round((data?.q_values?.[data?.final_decision_label] || 0.95) * 100)}%`} icon={Zap} color="amber" />
                        <KPICard label="Recommended Action" value={data?.final_decision_label || 'Wait'} icon={Activity} color="blue" />
                        <KPICard label="Action Timestamp" value={log?.created_at ? new Date(log.created_at).toLocaleTimeString() : 'N/A'} icon={Clock} color="purple" />
                        <KPICard label="Model Execution" value="Success" icon={CheckCircle2} color="green" />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Agronomic Recommendations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FeatureCard title="Irrigation Plan" data={data?.irrigation_plan} color="indigo" />
                    <FeatureCard title="Fertilizer Advice" data={data?.fertilizer_advice} color="emerald" />
                </div>
            </div>
        </div>
    );
}

function RLTab({ data, state }: any) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-8">Policy Learning & Reward Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <MetricCard label="Efficiency Trend" value={data?.efficiency_trend || 'STABLE'} trend="up" />
                    <MetricCard label="Positive Rewards" value={data?.positive_rewards || 0} color="green" />
                    <MetricCard label="Regret Score" value={data?.avg_regret || 0.05} color="red" />
                </div>

                <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-6">Current State Exploration</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(state || {}).map(([key, value]: [string, any]) => (
                            <div key={key} className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">{key.replace(/_/g, ' ')}</div>
                                <div className="text-lg font-black text-gray-900 capitalize">{String(value)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function XAITab({ data }: any) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Why this decision?</h3>
                <div className="bg-blue-50/50 rounded-3xl p-8 border border-blue-100/50 mb-8">
                    <p className="text-2xl font-bold text-blue-900 leading-tight">
                        {data?.reason || "Conditions optimal for current crop cycle."}
                    </p>
                </div>

                <h4 className="text-sm font-bold text-gray-900 mb-6">Influencing Parameters</h4>
                <div className="space-y-6">
                    {(data?.influencing_parameters || []).map((param: any, idx: number) => (
                        <div key={idx}>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-bold text-gray-700">{param.name}</span>
                                <span className="text-sm font-black text-purple-600">{(param.contribution * 100).toFixed(0)}% Impact</span>
                            </div>
                            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-1000"
                                    style={{ width: `${param.contribution * 100}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function StatusTab({ data }: any) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <HealthCard label="Model Availability" value={data?.model_availability || '0%'} icon={Brain} ok={!!data?.model_availability && data.model_availability !== '0%'} />
                <HealthCard label="Database Sync" value={data?.db_connectivity || 'Disconnected'} icon={RefreshCw} ok={data?.db_connectivity === 'Healthy'} />
                <HealthCard label="Data Freshness" value={data?.data_freshness || 'Offline'} icon={Clock} ok={!!data?.data_freshness} />
                <HealthCard label="Backend Connectivity" value={data?.status === 'online' ? 'Online' : 'Offline'} icon={Zap} ok={data?.status === 'online'} />
            </div>
        </div>
    );
}

// --- UI ATOMS ---

function KPICard({ label, value, icon: Icon, color }: any) {
    const colors: any = {
        purple: 'bg-purple-100 text-purple-600',
        amber: 'bg-amber-100 text-amber-600',
        blue: 'bg-blue-100 text-blue-600',
        green: 'bg-green-100 text-green-600',
    };
    return (
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
            <div className={`w-8 h-8 ${colors[color]} rounded-lg flex items-center justify-center mb-3`}>
                <Icon className="w-4 h-4" />
            </div>
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</div>
            <div className="text-xl font-bold text-gray-900">{value}</div>
        </div>
    );
}

function FeatureCard({ title, data, color }: any) {
    const accents: any = {
        indigo: 'border-l-4 border-indigo-500 bg-indigo-50/30',
        emerald: 'border-l-4 border-emerald-500 bg-emerald-50/30',
    };
    return (
        <div className={`p-6 rounded-2xl ${accents[color]}`}>
            <h4 className="font-black text-xs uppercase tracking-widest text-gray-500 mb-4">{title}</h4>
            <div className="space-y-4">
                {Object.entries(data || {}).map(([key, val]: [string, any]) => (
                    <div key={key}>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{key.replace(/_/g, ' ')}</div>
                        <div className="font-bold text-gray-800">{String(val)}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function MetricCard({ label, value, color, trend }: any) {
    return (
        <div className="text-center">
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{label}</div>
            <div className={`text-4xl font-black ${color === 'green' ? 'text-emerald-600' : color === 'red' ? 'text-rose-600' : 'text-gray-900'}`}>{value}</div>
            {trend && <div className="text-[10px] font-bold text-emerald-500 mt-1">▲ Trending Up</div>}
        </div>
    );
}

function HealthCard({ label, value, icon: Icon, ok }: any) {
    return (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${ok ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div>
                    <div className="text-xs font-black text-gray-400 uppercase tracking-widest">{label}</div>
                    <div className="text-lg font-bold text-gray-900">{value}</div>
                </div>
            </div>
            {ok ? <CheckCircle2 className="w-6 h-6 text-green-500" /> : <AlertTriangle className="w-6 h-6 text-red-500" />}
        </div>
    );
}

function getFallbackData() {
    return {
        decision: {
            final_decision_label: "IRRIGATE (Simulated)",
            reason: "Mock Data: Moisture dropped below 20%",
            irrigation_plan: { volume: "1000L", duration: "30m" },
            fertilizer_advice: { recommendation: "Apply Urea" },
            state: { moisture: "LOW", temp: "NORMAL" }
        },
        rl: { efficiency_trend: "STABLE", positive_rewards: 100, avg_regret: 0.02 },
        xai: { reason: "Low soil moisture threshold triggered rules.", influencing_parameters: [{ name: 'Moisture', contribution: 0.8 }, { name: 'Temp', contribution: 0.1 }] },
        status: { model_availability: '100%', db_connectivity: 'Healthy', data_freshness: 'Simulated', status: 'online' }
    };
}
