import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Cpu, Activity, Home, MapPin,
    BarChart2, Landmark, ShieldCheck, Zap,
    AlertTriangle, Server, Database, BrainCircuit, RefreshCcw
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { aiService } from '../../services/ai.service';
import { useApp } from '../../context/AppContext';

export function AIEngineDashboard() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { setDashboardTab } = useApp();
    const [status, setStatus] = useState<any>(null);
    const [analytics, setAnalytics] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadGlobalData();
        const interval = setInterval(loadGlobalData, 60000); // 1 minute refresh for global hub
        return () => clearInterval(interval);
    }, []);

    const loadGlobalData = async () => {
        try {
            const [s, a] = await Promise.all([
                aiService.getGlobalAIStatus(),
                aiService.getFarmAIAnalytics()
            ]);
            setStatus(s);
            setAnalytics(a);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
                <BrainCircuit className="w-12 h-12 text-purple-600 animate-pulse mb-4" />
                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Syncing Neural Networks...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-32">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-6 sticky top-0 z-[100] shadow-sm flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
                        <Cpu className="w-6 h-6 text-purple-600" />
                        AI Command Center
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">System Live • {status?.latency_ms}ms Latency</p>
                    </div>
                </div>
                <button onClick={loadGlobalData} className="p-2 bg-purple-50 rounded-xl text-purple-600 active:scale-95 transition-all">
                    <RefreshCcw className="w-5 h-5" />
                </button>
            </div>

            <div className="p-6 space-y-8">
                {/* 1. System Pulse Section */}
                <div className="grid grid-cols-2 gap-4">
                    <MetricCard
                        label="RL Agent Status"
                        value={status?.rl_agent_status}
                        icon={<BrainCircuit className="w-4 h-4 text-purple-600" />}
                        sub={`Last Retrain: ${status?.last_retrain}`}
                    />
                    <MetricCard
                        label="System Efficiency"
                        value={`${status?.system_efficiency}%`}
                        icon={<Zap className="w-4 h-4 text-yellow-500" />}
                        sub="Real-time Optimization"
                    />
                </div>

                {/* 2. Pending Actions Alert */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-6 rounded-[2.5rem] text-white shadow-xl shadow-purple-200 relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest">Priority Buffer</span>
                            <AlertTriangle className="w-5 h-5 text-yellow-300" />
                        </div>
                        <h3 className="text-2xl font-black mb-1">{status?.recommendations_pending} AI Actions</h3>
                        <p className="text-sm opacity-80 font-medium">Require manual confirmation across {analytics?.active_fields} fields.</p>

                        <button
                            onClick={() => navigate('/dashboard')}
                            className="mt-6 w-full py-4 bg-white text-purple-700 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                        >
                            Process Global Queue
                        </button>
                    </div>
                    <div className="absolute top-0 right-0 p-4 opacity-5 translate-x-4 -translate-y-4">
                        <Cpu className="w-40 h-40" />
                    </div>
                </div>

                {/* 3. Global Analytics Hub */}
                <div className="space-y-4">
                    <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] px-1">Farm Intelligence Hub</h2>

                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-50 rounded-xl"><ShieldCheck className="w-5 h-5 text-green-600" /></div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">Yield Projection</p>
                                    <p className="text-lg font-black text-gray-900">+{analytics?.predicted_yield_gain}% Improvement</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 py-4 border-y border-gray-50">
                            <StatBox label="Active Fields" value={analytics?.active_fields} />
                            <StatBox label="Sensors" value={analytics?.connected_sensors} />
                            <StatBox label="Alerts" value={status?.high_priority_alerts} color="text-red-500" />
                        </div>

                        <div className="space-y-3">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Resource Optimization Trend</p>
                            {analytics?.resource_usage.map((res: any, i: number) => (
                                <div key={i} className="space-y-1">
                                    <div className="flex justify-between text-xs font-bold text-gray-700">
                                        <span>{res.name}</span>
                                        <span>{res.optimized}% Saved</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-purple-500 rounded-full" style={{ width: `${res.optimized}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 4. Infrastructure Status */}
                <div className="grid grid-cols-2 gap-4">
                    <StatusItem icon={<Server className="w-4 h-4" />} label="Edge Compute" status="Online" />
                    <StatusItem icon={<Database className="w-4 h-4" />} label="Sync Engine" status="Synced" />
                </div>

            </div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200/80 px-4 py-3 z-[100] shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                <div className="flex justify-around items-center max-w-md mx-auto">
                    <NavBtn icon={<Home className="w-6 h-6" />} label="Home" onClick={() => { setDashboardTab('home'); navigate('/dashboard'); }} />
                    <NavBtn icon={<BarChart2 className="w-6 h-6" />} label="Analytics" onClick={() => { setDashboardTab('analytics'); navigate('/dashboard'); }} />
                    <NavBtn icon={<Landmark className="w-6 h-6" />} label="Schemes" onClick={() => { setDashboardTab('schemes'); navigate('/dashboard'); }} />
                    <NavBtn icon={<Activity className="w-6 h-6" />} label="Sensors" onClick={() => { setDashboardTab('sensors'); navigate('/sensor-guide'); }} />
                    <NavBtn icon={<MapPin className="w-6 h-6" />} label="Crops" onClick={() => navigate('/my-farm')} />
                    <NavBtn icon={<Cpu className="w-6 h-6" />} label="AI Engine" active />
                </div>
            </div>
        </div>
    );
}

function MetricCard({ label, value, icon, sub }: any) {
    return (
        <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-gray-50 rounded-lg">{icon}</div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{label}</span>
            </div>
            <p className="text-sm font-black text-gray-900 truncate">{value}</p>
            <p className="text-[9px] text-gray-400 font-medium mt-0.5">{sub}</p>
        </div>
    );
}

function StatBox({ label, value, color = "text-gray-900" }: any) {
    return (
        <div className="text-center p-2">
            <p className="text-xl font-black {color}">{value}</p>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">{label}</p>
        </div>
    );
}

function StatusItem({ icon, label, status }: any) {
    return (
        <div className="flex items-center gap-3 p-4 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="p-2 bg-gray-50 rounded-xl text-gray-400">{icon}</div>
            <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">{label}</p>
                <p className="text-xs font-black text-green-600 uppercase tracking-widest">{status}</p>
            </div>
        </div>
    );
}

function NavBtn({ icon, label, onClick, active }: any) {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 ${active ? 'bg-purple-50' : 'hover:bg-gray-50'}`}
        >
            {React.cloneElement(icon, { className: `w-6 h-6 ${active ? 'text-purple-600' : 'text-gray-400'}` })}
            <span className={`text-[10px] font-bold ${active ? 'text-purple-600' : 'text-gray-500'}`}>{label}</span>
        </button>
    );
}
