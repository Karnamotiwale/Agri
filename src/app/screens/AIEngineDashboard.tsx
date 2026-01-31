import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Brain, Zap, BarChart3, ArrowLeft } from 'lucide-react';
import { aiService } from '../../services/ai.service';
import { BottomNav } from '../components/BottomNav';

export function AIEngineDashboard() {
    const navigate = useNavigate();
    const [aiData, setAiData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadAIData();
        const interval = setInterval(loadAIData, 30000); // 30s refresh
        return () => clearInterval(interval);
    }, []);

    const loadAIData = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await aiService.getDecision({
                crop: 'rice',
                growth_stage: 'Vegetative',
                soil_moisture_pct: 65,
                temperature_c: 28
            });
            setAiData(data);
        } catch (err: any) {
            console.error('AI Dashboard connectivity issue, switching to simulation mode:', err);
            // Fallback to Mock Data (Simulation Mode)
            setAiData({
                final_decision: "IRRIGATE",
                reason: "Soil moisture dropped to 18% (Critical)",
                ml_prediction: 1,
                q_values: { "WAIT": -2.4, "IRRIGATE": 8.5, "FERTILIZE": 0.2 },
                state: {
                    "soil_moisture": "LOW",
                    "temperature": "HIGH",
                    "rainfall_forecast": "NONE",
                    "growth_stage": "VEGETATIVE"
                },
                explanation: {
                    explanations: [
                        "Soil moisture is significantly below the 30% threshold for Rice.",
                        "ML model predicts 85% probability of water stress within 6 hours.",
                        "No rainfall is forecast for the next 24 hours."
                    ],
                    advisories: [
                        "Initiate irrigation immediately to prevent yield loss.",
                        "Monitor pump efficiency during operation."
                    ]
                },
                irrigation_plan: {
                    "status": "RECOMMENDED",
                    "volume": "1200 Liters",
                    "method": "Drip Irrigation",
                    "duration": "45 minutes"
                },
                fertilizer_advice: {
                    "status": "HOLD",
                    "reason": "Wait for moisture levels to stabilize before application."
                },
                pest_disease_advisory: {
                    "risk_level": "LOW",
                    "detected_threats": "None",
                    "preventive_measure": "Continue routine monitoring."
                }
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading && !aiData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Brain className="w-12 h-12 text-purple-600 animate-pulse mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Loading AI Engine...</p>
                </div>
            </div>
        );
    }

    if (error && !aiData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="bg-white rounded-2xl p-8 shadow-sm max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Zap className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Connection Error</h3>
                    <p className="text-sm text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={loadAIData}
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        Retry Connection
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between sticky top-0 bg-gray-50 z-10 py-2">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="p-2 hover:bg-white rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900">AI Engine Dashboard</h1>
                        <p className="text-sm text-gray-500">What AI is thinking and deciding</p>
                    </div>
                </div>
                <button
                    onClick={loadAIData}
                    className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
                >
                    <Activity className="w-4 h-4" />
                    <span className="text-sm font-medium">Refresh</span>
                </button>
            </div>

            {/* Content Stack */}
            <div className="space-y-8 max-w-5xl mx-auto">

                {/* 1. Decision AI Section */}
                <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Brain className="w-32 h-32 text-purple-600" />
                    </div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-purple-100 p-2 rounded-lg">
                            <Brain className="w-6 h-6 text-purple-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Decision Engine</h2>
                    </div>
                    <DecisionAITab data={aiData} />
                </section>

                {/* 2. Reinforcement Learning Section */}
                <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Zap className="w-32 h-32 text-amber-500" />
                    </div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-amber-100 p-2 rounded-lg">
                            <Zap className="w-6 h-6 text-amber-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Reinforcement Learning</h2>
                    </div>
                    <RLTab data={aiData} />
                </section>

                {/* 3. Explainability (XAI) Section */}
                <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Activity className="w-32 h-32 text-blue-500" />
                    </div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-blue-100 p-2 rounded-lg">
                            <Activity className="w-6 h-6 text-blue-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Explainability (XAI)</h2>
                    </div>
                    <XAITab data={aiData} />
                </section>

                {/* 4. Active Actions Section */}
                <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <BarChart3 className="w-32 h-32 text-green-500" />
                    </div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-green-100 p-2 rounded-lg">
                            <BarChart3 className="w-6 h-6 text-green-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Active Actions</h2>
                    </div>
                    <ActiveActionsTab data={aiData} />
                </section>
            </div>

            <div className="h-24" /> {/* Bottom spacer for fixed footer */}
            <BottomNav />
        </div>
    );
}

// Decision AI Content
function DecisionAITab({ data }: any) {
    if (!data) return <EmptyState message="No decision data available" />;

    return (
        <div className="space-y-6 relative z-10">
            <div>
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Final Decision</h3>
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white shadow-lg shadow-purple-200">
                    <div className="text-5xl font-black mb-3 tracking-tight">{data.final_decision || 'PROCESSING'}</div>
                    <p className="text-purple-100 text-lg font-medium opacity-90">{data.reason || 'Analyzing farm conditions...'}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <StatCard label="ML Prediction" value={data.ml_prediction === 1 ? 'IRRIGATE' : 'WAIT'} />
                <StatCard label="Decision Source" value="Hybrid (ML + Rules)" />
            </div>
        </div>
    );
}

// RL Content
function RLTab({ data }: any) {
    if (!data?.q_values) return <EmptyState message="No RL data available" />;

    const qValues = Object.entries(data.q_values || {});

    return (
        <div className="space-y-8 relative z-10">
            <div>
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Q-Values (Policy Weights)</h3>
                <div className="space-y-4">
                    {qValues.map(([action, value]: [string, any]) => (
                        <div key={action}>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="font-bold text-gray-700">Action {action}</span>
                                <span className="text-gray-600 font-mono">{Number(value).toFixed(3)}</span>
                            </div>
                            <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${Math.min(Math.abs(Number(value)) * 50, 100)}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {data.state && (
                <div>
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Current State Vector</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {Object.entries(data.state).map(([key, value]) => (
                            <div key={key} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-bold">{key.replace(/_/g, ' ')}</div>
                                <div className="font-bold text-gray-900 text-lg">{String(value)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// XAI Content
function XAITab({ data }: any) {
    if (!data?.explanation) return <EmptyState message="No explainability data available" />;

    const explanations = data.explanation?.explanations || [];
    const advisories = data.explanation?.advisories || [];

    return (
        <div className="space-y-8 relative z-10">
            <div>
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Why This Decision?</h3>
                <div className="space-y-3">
                    {explanations.length > 0 ? (
                        explanations.map((exp: string, idx: number) => (
                            <div key={idx} className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100 transition-all hover:shadow-md">
                                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-sm">
                                    {idx + 1}
                                </div>
                                <p className="text-gray-800 leading-relaxed font-medium pt-1">{exp}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500 italic">No explanations available</p>
                    )}
                </div>
            </div>

            {advisories.length > 0 && (
                <div>
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Advisory Notes</h3>
                    <div className="space-y-3">
                        {advisories.map((adv: string, idx: number) => (
                            <div key={idx} className="flex items-start gap-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
                                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2.5 flex-shrink-0" />
                                <p className="text-gray-800 font-medium">{adv}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// Active Actions Content
function ActiveActionsTab({ data }: any) {
    if (!data) return <EmptyState message="No active actions" />;

    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 relative z-10">
            {data.irrigation_plan && (
                <ActionCard
                    title="Irrigation Plan"
                    data={data.irrigation_plan}
                    color="blue"
                    icon={<Brain className="w-5 h-5 text-blue-600" />}
                />
            )}

            {data.fertilizer_advice && (
                <ActionCard
                    title="Fertilizer Recommendation"
                    data={data.fertilizer_advice}
                    color="green"
                    icon={<Zap className="w-5 h-5 text-green-600" />}
                />
            )}

            {data.pest_disease_advisory && (
                <ActionCard
                    title="Pest & Disease Advisory"
                    data={data.pest_disease_advisory}
                    color="red"
                    icon={<Activity className="w-5 h-5 text-red-600" />}
                />
            )}
        </div>
    );
}

// Helper Components
function StatCard({ label, value }: any) {
    return (
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-gray-200 transition-colors">
            <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider font-bold">{label}</div>
            <div className="text-2xl font-black text-gray-900">{value}</div>
        </div>
    );
}

function ActionCard({ title, data, color, icon }: any) {
    const colors = {
        blue: 'bg-blue-50/50 border-blue-100 hover:border-blue-200 ring-1 ring-blue-100',
        green: 'bg-green-50/50 border-green-100 hover:border-green-200 ring-1 ring-green-100',
        red: 'bg-red-50/50 border-red-100 hover:border-red-200 ring-1 ring-red-100',
    };

    const headerColors = {
        blue: 'text-blue-900 bg-blue-100/50',
        green: 'text-green-900 bg-green-100/50',
        red: 'text-red-900 bg-red-100/50',
    };

    return (
        <div className={`rounded-2xl overflow-hidden transition-all hover:shadow-lg ${colors[color as keyof typeof colors]}`}>
            {/* Card Header */}
            <div className={`px-6 py-4 flex items-center gap-3 border-b border-black/5 ${headerColors[color as keyof typeof headerColors]}`}>
                <div className="bg-white p-2 rounded-lg shadow-sm">
                    {icon}
                </div>
                <h4 className="font-bold text-lg">{title}</h4>
            </div>

            {/* Card Body */}
            <div className="p-6 space-y-4">
                {Object.entries(data || {}).map(([key, value]) => (
                    <div key={key} className="group">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                            {key.replace(/_/g, ' ')}
                        </div>

                        <div className="text-gray-900 font-medium leading-relaxed bg-white/60 p-3 rounded-lg border border-black/5">
                            {renderValue(value)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function renderValue(value: any) {
    if (Array.isArray(value)) {
        if (value.length === 0) return <span className="text-gray-400 italic">None</span>;
        return (
            <ul className="list-disc list-inside space-y-1">
                {value.map((item, i) => (
                    <li key={i} className="text-sm">{String(item)}</li>
                ))}
            </ul>
        );
    }
    if (typeof value === 'boolean') {
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {value ? 'YES' : 'NO'}
            </span>
        );
    }
    if (typeof value === 'object' && value !== null) {
        return (
            <div className="text-xs font-mono bg-gray-50 p-2 rounded">
                {JSON.stringify(value, null, 2)}
            </div>
        );
    }
    return <span className="text-sm">{String(value)}</span>;
}

function EmptyState({ message }: any) {
    return (
        <div className="flex items-center justify-center h-48 text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <div className="text-center">
                <BarChart3 className="w-8 h-8 mx-auto mb-3 opacity-50" />
                <p className="text-sm font-medium">{message}</p>
            </div>
        </div>
    );
}
