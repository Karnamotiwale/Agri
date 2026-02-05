import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { fetchAnalytics, AnalyticsData } from '../../services/analyticsService';
import {
    BrainCircuit,
    TrendingUp,
    CheckCircle,
    AlertCircle,
    Activity,
    Zap,
    BarChart3,
    RefreshCw
} from 'lucide-react';

export function AISystemStatistics() {
    const navigate = useNavigate();
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await fetchAnalytics();
            setAnalytics(data);
            setLastUpdated(new Date());
            if (data.error) {
                setError(data.error);
            }
        } catch (err) {
            console.error('Failed to load analytics:', err);
            setError('Failed to load statistics');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'operational':
                return 'text-green-600 bg-green-50 border-green-200';
            case 'degraded':
                return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'offline':
                return 'text-red-600 bg-red-50 border-red-200';
            default:
                return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'operational':
                return <CheckCircle className="w-5 h-5" />;
            case 'degraded':
            case 'offline':
                return <AlertCircle className="w-5 h-5" />;
            default:
                return <Activity className="w-5 h-5" />;
        }
    };

    return (
        <div className="min-h-screen bg-[#F4F7F6] pb-24">
            <Header
                title="AI System Statistics"
                showBack
                onBackClick={() => navigate('/dashboard')}
                hideRightIcon
            />

            <div className="px-6 py-6 space-y-6">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">AI Performance Metrics</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Live insights from the AI engine
                        </p>
                    </div>
                    <button
                        onClick={loadData}
                        disabled={loading}
                        className="p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-50"
                    >
                        <RefreshCw className={`w-5 h-5 text-green-600 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                {/* Loading State */}
                {loading && !analytics && (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-32 bg-white rounded-2xl animate-pulse" />
                        ))}
                    </div>
                )}

                {/* Error Banner */}
                {error && analytics && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-yellow-800">
                            <AlertCircle className="w-5 h-5" />
                            <p className="text-sm font-semibold">Using cached data - {error}</p>
                        </div>
                    </div>
                )}

                {/* Analytics Data */}
                {analytics && (
                    <>
                        {/* System Status Card */}
                        <div className={`rounded-2xl border-2 p-6 ${getStatusColor(analytics.system_status)}`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {getStatusIcon(analytics.system_status)}
                                    <div>
                                        <h3 className="text-sm font-bold uppercase tracking-wider">System Status</h3>
                                        <p className="text-2xl font-bold capitalize mt-1">{analytics.system_status}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs opacity-75">Last Updated</p>
                                    <p className="text-sm font-semibold">{lastUpdated.toLocaleTimeString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Model Accuracy */}
                            <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all">
                                <div className="flex items-center gap-2 mb-3 text-blue-600">
                                    <TrendingUp className="w-5 h-5" />
                                    <h3 className="text-sm font-bold">Model Accuracy</h3>
                                </div>
                                <p className="text-4xl font-bold text-gray-900">
                                    {(analytics.model_accuracy * 100).toFixed(1)}%
                                </p>
                                <div className="mt-3 bg-blue-50 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="bg-blue-600 h-full transition-all duration-500"
                                        style={{ width: `${analytics.model_accuracy * 100}%` }}
                                    />
                                </div>
                            </div>

                            {/* Model Precision */}
                            <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all">
                                <div className="flex items-center gap-2 mb-3 text-emerald-600">
                                    <Zap className="w-5 h-5" />
                                    <h3 className="text-sm font-bold">Model Precision</h3>
                                </div>
                                <p className="text-4xl font-bold text-gray-900">
                                    {(analytics.model_precision * 100).toFixed(1)}%
                                </p>
                                <div className="mt-3 bg-emerald-50 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="bg-emerald-600 h-full transition-all duration-500"
                                        style={{ width: `${analytics.model_precision * 100}%` }}
                                    />
                                </div>
                            </div>

                            {/* Total Decisions */}
                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-md p-6 border border-purple-200">
                                <div className="flex items-center gap-2 mb-3 text-purple-700">
                                    <BarChart3 className="w-5 h-5" />
                                    <h3 className="text-sm font-bold">Total Decisions</h3>
                                </div>
                                <p className="text-4xl font-bold text-purple-900">
                                    {analytics.total_decisions}
                                </p>
                                <p className="text-xs text-purple-700 mt-2">AI recommendations made</p>
                            </div>

                            {/* Learning Rate */}
                            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl shadow-md p-6 border border-orange-200">
                                <div className="flex items-center gap-2 mb-3 text-orange-700">
                                    <BrainCircuit className="w-5 h-5" />
                                    <h3 className="text-sm font-bold">Learning Rate</h3>
                                </div>
                                <p className="text-4xl font-bold text-orange-900">
                                    {analytics.policy_state.learning_rate}
                                </p>
                                <p className="text-xs text-orange-700 mt-2">RL optimization speed</p>
                            </div>
                        </div>

                        {/* Policy State Card */}
                        <div className="bg-white rounded-2xl shadow-md p-6">
                            <div className="flex items-center gap-2 mb-4 text-gray-900">
                                <Activity className="w-6 h-6 text-green-600" />
                                <h2 className="text-lg font-bold">Policy Configuration</h2>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <p className="text-xs text-gray-500 mb-1">Epsilon (Exploration)</p>
                                    <p className="text-2xl font-bold text-gray-900">{analytics.policy_state.epsilon}</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <p className="text-xs text-gray-500 mb-1">Discount Factor</p>
                                    <p className="text-2xl font-bold text-gray-900">{analytics.policy_state.discount_factor}</p>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <h3 className="text-sm font-bold text-gray-700 mb-3">Penalty Weights</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Over Irrigation</span>
                                        <span className="text-sm font-bold text-red-600">
                                            {analytics.policy_state.penalties.over_irrigation}x
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Under Irrigation</span>
                                        <span className="text-sm font-bold text-orange-600">
                                            {analytics.policy_state.penalties.under_irrigation}x
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Rain Waste</span>
                                        <span className="text-sm font-bold text-blue-600">
                                            {analytics.policy_state.penalties.rain_waste}x
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Q-Table Overview */}
                        <div className="bg-white rounded-2xl shadow-md p-6">
                            <div className="flex items-center gap-2 mb-4 text-gray-900">
                                <BarChart3 className="w-6 h-6 text-purple-600" />
                                <h2 className="text-lg font-bold">Reinforcement Learning Q-Table</h2>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4 max-h-64 overflow-auto">
                                <pre className="text-xs text-gray-700 font-mono">
                                    {JSON.stringify(analytics.q_table, null, 2)}
                                </pre>
                            </div>
                            <p className="text-xs text-gray-500 mt-3">
                                Q-values represent expected rewards for state-action pairs in the RL agent
                            </p>
                        </div>

                        {/* Footer Info */}
                        <div className="text-center py-4">
                            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                                AI-Powered Decision Engine • Real-time Analytics
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
