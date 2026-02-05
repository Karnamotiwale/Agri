import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '../components/Header';
import { useApp, Crop } from '../../context/AppContext';
import { cropService } from '../../services/crop.service';
import { Loader2 } from 'lucide-react';

// New Modular Components
import { TodayTasks } from '../../components/statistics/TodayTasks';
import { AdvisoryCards } from '../../components/statistics/AdvisoryCards';
import { ActionButtons } from '../../components/statistics/ActionButtons';
import { CropTraceGraphs } from '../../components/statistics/CropTraceGraphs';
import { CropIntelligence } from '../../components/statistics/CropIntelligence';
import { MarketInsights } from '../../components/statistics/MarketInsights';
import { FinancialSummary } from '../../components/statistics/FinancialSummary';
import { AISystemStatistics } from './AISystemStatistics';
import { fetchAnalytics, AnalyticsData } from '../../services/analyticsService';
import { BrainCircuit, TrendingUp, Zap, BarChart3, ChevronRight } from 'lucide-react';

export function CropStatistics() {
    const navigate = useNavigate();
    const { id: cropId } = useParams();
    const { crops } = useApp();
    const [journeyData, setJourneyData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);
    const [systemAnalytics, setSystemAnalytics] = useState<AnalyticsData | null>(null);

    // AUTO-REFRESH RULE: Refresh every 10 minutes
    useEffect(() => {
        const interval = setInterval(() => {
            console.log("Background Refresh: Syncing crop statistics...");
            setRefreshKey(prev => prev + 1);
        }, 10 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const crop = crops.find((c: Crop) => c.id === cropId);

    useEffect(() => {
        if (cropId) {
            loadContext();
        }
    }, [cropId]);

    const loadContext = async () => {
        try {
            const [journey, analytics] = await Promise.all([
                cropService.getCropJourney(cropId!),
                fetchAnalytics()
            ]);
            setJourneyData(journey);
            setSystemAnalytics(analytics);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!cropId || !crop) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
                <Header title="Status" showBack onBackClick={() => navigate('/dashboard')} />
                <div className="flex-1 flex flex-col items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-green-600 mb-4" />
                    <p className="text-gray-500">Connecting to crop intelligence...</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <Header title="Crop Intelligence" showBack onBackClick={() => navigate('/dashboard')} />

            <div className="px-6 py-6 pb-8 space-y-12">

                {/* 1. CURRENT TASKS & ACTIONS (TOP PRIORITY) */}
                <TodayTasks key={`tasks-${refreshKey}`} cropId={cropId} farmId={crop.farmId} />

                {/* 2. AI ADVISORY PANEL */}
                <AdvisoryCards key={`adv-${refreshKey}`} cropId={cropId} cropName={crop.name} />

                {/* 3. ACTION BUTTONS */}
                <ActionButtons key={`btns-${refreshKey}`} cropId={cropId} />

                <hr className="border-gray-200" />

                {/* 4. CROP JOURNEY & FIELD TRENDS */}
                <CropTraceGraphs key={`trace-${refreshKey}`} cropId={cropId} />

                {/* 5, 6, 7. CROP INTELLIGENCE, ENVIRONMENT, PRODUCTION */}
                <CropIntelligence key={`intl-${refreshKey}`} crop={crop} journeyData={journeyData} />

                {/* 8. HARVEST & POST-HARVEST INSIGHTS */}
                <MarketInsights key={`market-${refreshKey}`} cropId={cropId} cropName={crop.name} />

                {/* 9. FINANCIAL & RECORD KEEPING */}
                <FinancialSummary key={`fin-${refreshKey}`} cropId={cropId} />

                {/* 10. AI SYSTEM PERFORMANCE (PART 4 REDESIGN) */}
                {systemAnalytics && (
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-xl">🧠</span>
                                <h2 className="text-xl font-bold text-gray-900">AI Engine Performance</h2>
                            </div>
                            <button
                                onClick={() => navigate('/ai-statistics')}
                                className="text-sm font-bold text-green-600 flex items-center gap-1 hover:text-green-700"
                            >
                                Full Dashboard <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-50 flex flex-col justify-between h-32">
                                <div className="flex items-center gap-2 text-blue-600">
                                    <TrendingUp className="w-4 h-4" />
                                    <span className="text-xs font-bold uppercase">Accuracy</span>
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-gray-900">
                                        {(systemAnalytics.model_accuracy * 100).toFixed(1)}%
                                    </p>
                                    <div className="mt-2 h-1 bg-blue-50 rounded-full overflow-hidden">
                                        <div className="bg-blue-600 h-full" style={{ width: `${systemAnalytics.model_accuracy * 100}%` }} />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-50 flex flex-col justify-between h-32">
                                <div className="flex items-center gap-2 text-emerald-600">
                                    <Zap className="w-4 h-4" />
                                    <span className="text-xs font-bold uppercase">Precision</span>
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-gray-900">
                                        {(systemAnalytics.model_precision * 100).toFixed(1)}%
                                    </p>
                                    <div className="mt-2 h-1 bg-emerald-50 rounded-full overflow-hidden">
                                        <div className="bg-emerald-600 h-full" style={{ width: `${systemAnalytics.model_precision * 100}%` }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-green-900 to-emerald-900 p-6 rounded-2xl shadow-xl text-white">
                            <div className="flex items-center gap-2 mb-4">
                                <BrainCircuit className="w-5 h-5 text-green-400" />
                                <h3 className="text-sm font-bold">Policy & Q-Table Insights</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-green-300">Total AI Decisions</span>
                                    <span className="font-bold">{systemAnalytics.total_decisions}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-green-300">Learning Rate</span>
                                    <span className="font-bold">{systemAnalytics.policy_state?.learning_rate || '0.1'}</span>
                                </div>
                                <div className="mt-4 p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
                                    <p className="text-[10px] text-green-200 font-bold uppercase mb-1">State Insight</p>
                                    <p className="text-xs leading-relaxed text-white/90">
                                        RL agent is optimizing for {systemAnalytics.policy_state?.penalties?.over_irrigation ? 'water conservation' : 'yield maximization'} based on latest field telemetry.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                <div className="py-8 text-center">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
                        UX4G Compliant • AI-Driven Dashboard
                    </p>
                </div>
            </div>
        </div>
    );
}
