import React, { useEffect, useState } from 'react';
import { aiService, AIRecommendation } from '../../services/ai.service';
import {
    Sprout,
    Bug,
    ArrowRight,
    Sparkles,
    Droplets,
    Zap,
    CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DashboardAIInsights: React.FC = () => {
    const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const data = await aiService.getRecommendations('default-farm');
                setRecommendations(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Visual helper for recommendation types
    const getTheme = (type: string) => {
        switch (type) {
            case 'FERTILIZE':
                return {
                    bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100',
                    border: 'border-emerald-200',
                    iconBg: 'bg-emerald-500',
                    icon: <Sprout className="w-5 h-5 text-white" />,
                    title: 'text-emerald-900',
                    desc: 'text-emerald-700',
                    btn: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'
                };
            case 'PEST_CONTROL':
                return {
                    bg: 'bg-gradient-to-br from-rose-50 to-rose-100',
                    border: 'border-rose-200',
                    iconBg: 'bg-rose-500',
                    icon: <Bug className="w-5 h-5 text-white" />,
                    title: 'text-rose-900',
                    desc: 'text-rose-700',
                    btn: 'bg-rose-600 hover:bg-rose-700 shadow-rose-200'
                };
            case 'IRRIGATE':
                return {
                    bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
                    border: 'border-blue-200',
                    iconBg: 'bg-blue-500',
                    icon: <Droplets className="w-5 h-5 text-white" />,
                    title: 'text-blue-900',
                    desc: 'text-blue-700',
                    btn: 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
                };
            default:
                return {
                    bg: 'bg-gradient-to-br from-amber-50 to-amber-100',
                    border: 'border-amber-200',
                    iconBg: 'bg-amber-500',
                    icon: <Zap className="w-5 h-5 text-white" />,
                    title: 'text-amber-900',
                    desc: 'text-amber-700',
                    btn: 'bg-amber-600 hover:bg-amber-700 shadow-amber-200'
                };
        }
    };

    return (
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-indigo-900/5 border border-indigo-50 relative overflow-hidden transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none"></div>

            <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">AI Insights</h2>
                        <p className="text-xs text-gray-500 font-medium">Real-time crop intelligence</p>
                    </div>
                </div>
            </div>

            <div className="space-y-4 relative z-10">
                {recommendations.map((rec) => {
                    const theme = getTheme(rec.action);
                    return (
                        <div
                            key={rec.id}
                            className={`relative overflow-hidden rounded-2xl border ${theme.border} ${theme.bg} p-4 transition-all duration-300 hover:shadow-md hover:scale-[1.01] group`}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`${theme.iconBg} p-3 rounded-xl shadow-sm shrink-0`}>
                                    {theme.icon}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <h3 className={`font-bold ${theme.title} text-base mb-1`}>
                                            {rec.action === 'PEST_CONTROL' ? 'Pest Alert' :
                                                rec.action === 'FERTILIZE' ? 'Fertilizer Recommendation' :
                                                    rec.action.replace('_', ' ')}
                                        </h3>
                                        <span className="text-[10px] font-bold px-2 py-0.5 bg-white/60 rounded-md backdrop-blur-sm shadow-sm text-gray-600">
                                            {(rec.confidence * 100).toFixed(0)}% Match
                                        </span>
                                    </div>

                                    <p className={`text-sm ${theme.desc} leading-relaxed mb-3 line-clamp-2`}>
                                        {rec.reasoning}
                                    </p>

                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center gap-2">
                                            {rec.amount && (
                                                <div className="px-2.5 py-1 bg-white/60 rounded-lg text-xs font-semibold text-gray-700 backdrop-blur-sm">
                                                    {rec.amount} {rec.unit}
                                                </div>
                                            )}
                                            <div className={`px-2.5 py-1 rounded-lg text-xs font-semibold backdrop-blur-sm ${rec.risk_level === 'High' ? 'bg-red-200/50 text-red-800' : 'bg-white/60 text-gray-700'
                                                }`}>
                                                {rec.risk_level} Priority
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => navigate(`/ai-analysis/${rec.id}`)}
                                            className={`w-8 h-8 flex items-center justify-center rounded-full ${theme.btn} text-white shadow-lg transform transition-transform active:scale-95`}
                                        >
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {recommendations.length === 0 && !loading && (
                    <div className="text-center py-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <CheckCircle2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                        <p className="text-slate-500 text-sm">All crops healthy</p>
                    </div>
                )}
            </div>

            <div className="mt-4 pt-4 border-t border-indigo-50 flex justify-center">
                <button
                    onClick={() => navigate('/ai-chat')}
                    className="text-indigo-600 text-xs font-bold flex items-center gap-1 hover:text-indigo-700 transition-colors"
                >
                    VIEW ALL RECOMMENDATIONS <ArrowRight className="w-3 h-3" />
                </button>
            </div>
        </div>
    );
};
