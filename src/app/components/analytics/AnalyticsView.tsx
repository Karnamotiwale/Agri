import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { Activity, Sprout, BarChart3, RotateCw, Droplets, Thermometer, Wind, AlertCircle, CheckCircle2, Calendar, Leaf, BrainCircuit } from 'lucide-react';
import { cropService } from '../../../services/crop.service';
import { getCropSensors } from '../../../services/cropSensors';
import { analyticsService } from '../../../services/analytics.service';
import { fetchAnalytics } from '../../../services/analyticsService';

interface AnalyticsViewProps {
    selectedCrop: { id: string; name: string; sowingDate?: string } | null;
}

export function AnalyticsView({ selectedCrop }: AnalyticsViewProps) {
    const [activeTab, setActiveTab] = useState<'sensors' | 'timeline' | 'yield' | 'rotation' | 'carbon' | 'ai'>('sensors');
    const [loading, setLoading] = useState(true);
    const [historyData, setHistoryData] = useState<any[]>([]);
    const [currentSensors, setCurrentSensors] = useState<any>(null);
    const [growthStages, setGrowthStages] = useState<any>(null);
    const [yieldData, setYieldData] = useState<any>(null);
    const [rotationData, setRotationData] = useState<any>(null);
    const [carbonData, setCarbonData] = useState<any>(null);

    // AI Analytics State
    const [policyState, setPolicyState] = useState<any>(null);
    const [qTable, setQTable] = useState<any[]>([]);
    const [analyticsLoading, setAnalyticsLoading] = useState(false);
    const [analyticsError, setAnalyticsError] = useState<string | null>(null);

    // Default crop if none selected
    const cropName = selectedCrop?.name || 'rice';
    const sowingDate = selectedCrop?.sowingDate;

    useEffect(() => {
        loadAnalyticsData();
        const interval = setInterval(loadAnalyticsData, 30000); // 30s refresh
        return () => clearInterval(interval);
    }, [cropName, sowingDate]);

    const loadAnalyticsData = async () => {
        try {
            setLoading(true);

            // normalize crop name
            const cName = cropName.toLowerCase();

            // 1. Fetch from NEW Analytics Service (Real Backend Integration)
            const analyticsPromise = analyticsService.getOverview();
            const forecastPromise = analyticsService.getForecast(7);

            // Fetch AI Analytics
            try {
                const aiData = await fetchAnalytics();
                setPolicyState(aiData.policy_state);
                setQTable(aiData.q_table);
            } catch (err) {
                console.error("AI Analytics fetch failed", err);
                // Non-blocking error
            }

            // 2. Fetch existing crop-specific data
            const promises = [
                cropService.getCropJourney(cName),
                getCropSensors(cropName),
                cropService.getGrowthStages(cName, calculateDaysSinceSowing(sowingDate)),
                cropService.getYieldPrediction(cName),
                cropService.getRotationRecommendation(cName),
                analyticsPromise,
                forecastPromise
            ];

            const results = await Promise.allSettled(promises);

            // Handle Analytics Overview (NEW - Real Backend)
            if (results[5].status === 'fulfilled') {
                const overview = results[5].value;
                console.log('✅ Real Analytics Data:', overview);

                // Update sensors from real analytics if available
                if (overview.summary && overview.data_points > 0) {
                    setCurrentSensors({
                        moisture: overview.summary.soil_moisture_value || 0,
                        temperature: overview.summary.temperature_value || 0,
                        humidity: overview.summary.humidity_value || 0,
                        n: overview.summary.nitrogen_value || 0,
                        p: overview.summary.phosphorus_value || 0,
                        k: overview.summary.potassium_value || 0,
                    });
                }
            }

            // Handle Forecast (NEW - Real Backend)
            if (results[6].status === 'fulfilled') {
                const forecast = results[6].value;
                console.log('✅ Real Forecast Data:', forecast);
                // You can use this forecast data in yield prediction tab
            }

            // Handle History (Existing Logic) - Enhanced with NPK data
            if (results[0].status === 'fulfilled') {
                const journey = results[0].value || [];
                if (journey.length > 0) {
                    const processedHistory = journey.map((record: any) => ({
                        time: new Date(record.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                        moisture: record.soil_moisture_pct || record.soil_moisture || record.data?.soil_moisture_pct || 0,
                        temperature: record.temperature_c || record.temperature || record.data?.temperature_c || 0,
                        humidity: record.humidity_pct || record.humidity || record.data?.humidity_pct || 0,
                        nitrogen: record.nitrogen || 0,
                        phosphorus: record.phosphorus || 0,
                        potassium: record.potassium || 0,
                    })).slice(-30); // Show last 30 days for smoother graphs
                    setHistoryData(processedHistory);
                } else {
                    setHistoryData([]);
                }
            } else {
                setHistoryData([]);
            }

            // Handle Sensors (Fallback if analytics didn't provide)
            if (results[1].status === 'fulfilled' && !currentSensors) {
                setCurrentSensors(results[1].value);
            } else if (!currentSensors) {
                // Return empty if both fetch methods fail
                setCurrentSensors({ moisture: 0, temperature: 0, humidity: 0, n: 0 });
            }

            // Handle Growth Stages
            if (results[2].status === 'fulfilled') {
                setGrowthStages(results[2].value);
            }

            // Handle Yield
            if (results[3].status === 'fulfilled') {
                setYieldData(results[3].value);
            }

            // Handle Rotation
            if (results[4].status === 'fulfilled') {
                setRotationData(results[4].value);
            }

        } catch (err) {
            console.error("Analytics load failed", err);
            // Fallback to empty on error
            setHistoryData([]);
        } finally {
            setLoading(false);
        }
    };

    const calculateDaysSinceSowing = (dateStr?: string) => {
        if (!dateStr) return 45; // Default to mid-stage if unknown
        const start = new Date(dateStr).getTime();
        const now = new Date().getTime();
        const diff = now - start;
        return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
    };



    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2 px-2">
                <div className="bg-green-100 p-2 rounded-xl text-green-700">
                    <BarChart3 className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Analytics Dashboard</h2>
                    <p className="text-sm text-gray-500 font-medium">Real-time farm intelligence & predictions</p>
                </div>
            </div>

            {/* Tabs Header */}
            <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-1.5 shadow-sm border border-gray-100 flex overflow-x-auto no-scrollbar gap-2">
                <TabButton
                    active={activeTab === 'sensors'}
                    onClick={() => setActiveTab('sensors')}
                    icon={Activity}
                    label="Live Sensors"
                    color="blue"
                />
                <TabButton
                    active={activeTab === 'timeline'}
                    onClick={() => setActiveTab('timeline')}
                    icon={Sprout}
                    label="Growth Timeline"
                    color="green"
                />
                <TabButton
                    active={activeTab === 'yield'}
                    onClick={() => setActiveTab('yield')}
                    icon={BarChart3}
                    label="Yield Analytics"
                    color="amber"
                />
                <TabButton
                    active={activeTab === 'rotation'}
                    onClick={() => setActiveTab('rotation')}
                    icon={RotateCw}
                    label="Crop Rotation"
                    color="purple"
                />
                <TabButton
                    active={activeTab === 'carbon'}
                    onClick={() => setActiveTab('carbon')}
                    icon={Leaf}
                    label="Carbon Footprint"
                    color="emerald"
                />
                <TabButton
                    active={activeTab === 'ai'}
                    onClick={() => setActiveTab('ai')}
                    icon={BrainCircuit}
                    label="AI Analytics"
                    color="rose"
                />
            </div>

            {/* Content Area */}
            <div className="min-h-[500px] animate-in fade-in zoom-in-95 duration-500">
                {loading && !currentSensors ? (
                    <div className="h-96 flex items-center justify-center flex-col gap-4">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500"></div>
                        <p className="text-gray-400 font-medium animate-pulse">Gathering field intelligence...</p>
                    </div>
                ) : (
                    <>
                        {activeTab === 'sensors' && (
                            <LiveSensorsTab
                                current={currentSensors || { moisture: 62, temperature: 29, humidity: 60, n: 110 }}
                                history={historyData}
                            />
                        )}
                        {activeTab === 'timeline' && (
                            <CropTimelineTab
                                data={growthStages}
                                days={calculateDaysSinceSowing(sowingDate)}
                            />
                        )}
                        {activeTab === 'yield' && (
                            <YieldAnalyticsTab data={yieldData} />
                        )}
                        {activeTab === 'rotation' && (
                            <CropRotationTab data={rotationData} currentCrop={cropName} />
                        )}
                        {activeTab === 'carbon' && (
                            <CarbonFootprintTab data={carbonData} />
                        )}
                        {activeTab === 'ai' && (
                            <AIAnalyticsTab policyState={policyState} qTable={qTable} />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

// --------------------------------------------------
// TAB COMPONENTS
// --------------------------------------------------

function LiveSensorsTab({ current, history }: any) {
    return (
        <div className="space-y-6">
            {/* Current Snapshot Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <SensorCard
                    label="Soil Moisture"
                    value={`${current?.moisture?.toFixed(1) || 0}%`}
                    icon={Droplets}
                    color="blue"
                    trend="+2.4%"
                />
                <SensorCard
                    label="Temperature"
                    value={`${current?.temperature?.toFixed(1) || 28.5}°C`}
                    icon={Thermometer}
                    color="amber"
                    trend="+0.8°"
                />
                <SensorCard
                    label="Humidity"
                    value={`${current?.humidity?.toFixed(0) || 65}%`}
                    icon={Wind}
                    color="cyan"
                    trend="-1.2%"
                />
                <SensorCard
                    label="Nitrogen (N)"
                    value={`${current?.n || 0} mg/kg`}
                    icon={Activity}
                    color="green"
                    trend="Optimal"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="font-bold text-gray-800 flex items-center gap-3 text-lg">
                            <div className="w-3 h-3 rounded-full bg-blue-500 ring-4 ring-blue-100" />
                            Soil Moisture Trend
                        </h3>
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">Real-time</span>
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={history}>
                                <defs>
                                    <linearGradient id="colorMoisture" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis
                                    dataKey="time"
                                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={10}
                                />
                                <YAxis
                                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(val) => `${val}%`}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
                                    cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '4 4' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="moisture"
                                    stroke="#3b82f6"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorMoisture)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="font-bold text-gray-800 flex items-center gap-3 text-lg">
                            <div className="w-3 h-3 rounded-full bg-amber-500 ring-4 ring-amber-100" />
                            Temperature History
                        </h3>
                        <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full">Recent</span>
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={history}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis
                                    dataKey="time"
                                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={10}
                                />
                                <YAxis
                                    domain={['auto', 'auto']}
                                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(val) => `${val}°`}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
                                    cursor={{ stroke: '#f59e0b', strokeWidth: 1, strokeDasharray: '4 4' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="temperature"
                                    stroke="#f59e0b"
                                    strokeWidth={4}
                                    dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                                    activeDot={{ r: 6, strokeWidth: 0, fill: '#f59e0b' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Additional Sensor Graphs - Humidity and NPK */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Humidity Trend */}
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="font-bold text-gray-800 flex items-center gap-3 text-lg">
                            <div className="w-3 h-3 rounded-full bg-cyan-500 ring-4 ring-cyan-100" />
                            Humidity Levels
                        </h3>
                        <span className="text-xs font-bold text-cyan-600 bg-cyan-50 px-3 py-1.5 rounded-full">Live</span>
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={history}>
                                <defs>
                                    <linearGradient id="colorHumidity" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis
                                    dataKey="time"
                                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={10}
                                />
                                <YAxis
                                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(val) => `${val}%`}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
                                    cursor={{ stroke: '#06b6d4', strokeWidth: 1, strokeDasharray: '4 4' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="humidity"
                                    stroke="#06b6d4"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorHumidity)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* NPK Trends */}
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="font-bold text-gray-800 flex items-center gap-3 text-lg">
                            <div className="w-3 h-3 rounded-full bg-purple-500 ring-4 ring-purple-100" />
                            NPK Nutrient Trends
                        </h3>
                        <span className="text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-full">Tracked</span>
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={history}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis
                                    dataKey="time"
                                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={10}
                                />
                                <YAxis
                                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(val) => `${val}`}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
                                    cursor={{ stroke: '#a855f7', strokeWidth: 1, strokeDasharray: '4 4' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="nitrogen"
                                    stroke="#8b5cf6"
                                    strokeWidth={3}
                                    dot={{ r: 3, strokeWidth: 2, fill: '#fff' }}
                                    name="Nitrogen"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="phosphorus"
                                    stroke="#06b6d4"
                                    strokeWidth={3}
                                    dot={{ r: 3, strokeWidth: 2, fill: '#fff' }}
                                    name="Phosphorus"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="potassium"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    dot={{ r: 3, strokeWidth: 2, fill: '#fff' }}
                                    name="Potassium"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CropTimelineTab({ data, days }: any) {
    // Mock data if missing
    const stages = data?.stages || [
        { name: 'Germination', status: 'completed', days: '0-10' },
        { name: 'Seedling', status: 'completed', days: '11-30' },
        { name: 'Tillering', status: 'active', days: '31-60' },
        { name: 'Flowering', status: 'upcoming', days: '61-90' },
        { name: 'Maturity', status: 'upcoming', days: '91-110' },
    ];
    const current = data?.currentStage || 'Tillering';

    return (
        <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">Crop Journey</h3>
                    <p className="text-gray-500 font-medium mt-1">
                        Current: <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-lg">{current}</span>
                    </p>
                </div>
                <div className="bg-green-600 text-white px-5 py-3 rounded-2xl shadow-lg shadow-green-200">
                    <div className="flex items-center gap-2 font-bold text-lg">
                        <Calendar className="w-5 h-5" />
                        Day {days}
                    </div>
                    <div className="text-[10px] font-medium opacity-80 uppercase tracking-wider text-center">Since Sowing</div>
                </div>
            </div>

            <div className="relative pl-4">
                {/* Connecting Line */}
                <div className="absolute left-[2.85rem] top-4 bottom-12 w-1 bg-gradient-to-b from-green-500 via-green-200 to-gray-100 rounded-full"></div>

                <div className="space-y-10">
                    {stages.map((stage: any, idx: number) => {
                        const isCompleted = stage.status === 'completed';
                        const isActive = stage.status === 'active';

                        return (
                            <div key={idx} className="relative flex items-center gap-8 group">
                                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shrink-0 z-10 border-[6px] transition-all duration-500 ${isActive ? 'bg-green-600 border-green-100 text-white shadow-xl shadow-green-200 scale-110' :
                                    isCompleted ? 'bg-green-100 border-white text-green-600' :
                                        'bg-white border-gray-100 text-gray-300'
                                    }`}>
                                    {isCompleted ? <CheckCircle2 className="w-9 h-9" /> : <Sprout className="w-9 h-9" />}
                                </div>
                                <div className={`flex-1 p-6 rounded-3xl transition-all duration-300 ${isActive ? 'bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 shadow-sm translate-x-2' :
                                    'hover:bg-gray-50'
                                    }`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className={`text-lg font-black ${isActive ? 'text-green-800' : 'text-gray-900'}`}>
                                            {stage.name}
                                        </h4>
                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${isActive ? 'bg-green-200 text-green-800' : 'bg-gray-100 text-gray-400'
                                            }`}>
                                            Days {stage.days}
                                        </span>
                                    </div>
                                    <p className={`text-sm ${isActive ? 'text-green-700 font-medium' : 'text-gray-400'}`}>
                                        {isActive ? 'Current growth phase. Critical irrigation monitoring recommended.' :
                                            isCompleted ? 'Stage completed successfully.' : 'Upcoming stage.'}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function YieldAnalyticsTab({ data }: any) {
    const summary = data?.yield_prediction?.summary || {
        expectedYield: '4,250 kg/ha',
        stability: 'HIGH',
        vsAverage: '+12%',
        yieldRange: '4100-4400 kg/ha'
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 border border-white/20">
                        <Activity className="w-3 h-3" /> AI Prediction
                    </div>
                    <p className="text-indigo-200 font-medium mb-1 text-lg">Expected Yield</p>
                    <div className="flex items-baseline gap-4 mt-2">
                        <h2 className="text-6xl font-black tracking-tight">{summary.expectedYield}</h2>
                    </div>
                    <div className="mt-8 flex gap-3 text-sm font-medium text-indigo-100">
                        <div className="bg-white/20 px-4 py-2 rounded-xl backdrop-blur-sm">
                            Range: {summary.yieldRange || 'N/A'}
                        </div>
                        <div className="bg-white/20 px-4 py-2 rounded-xl backdrop-blur-sm">
                            Confidence: 94%
                        </div>
                    </div>
                </div>
                {/* Decorative background */}
                <div className="absolute -right-10 -bottom-20 opacity-20 transform rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                    <BarChart3 className="w-96 h-96" />
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl -mr-16 -mt-16"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-lg transition-all active:scale-[0.99]">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center mb-6 text-amber-600">
                        <Activity className="w-7 h-7" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-xl mb-1">Yield Stability</h4>
                    <p className="text-gray-400 text-sm mb-6">Based on weather variance & history</p>

                    <div className="flex items-center gap-3">
                        <div className={`px-4 py-2 rounded-xl font-bold ${summary.stability === 'STABLE' || summary.stability === 'HIGH' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                            {summary.stability || 'STABLE'}
                        </div>
                        <div className="h-2 flex-1 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 w-3/4 rounded-full"></div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-lg transition-all active:scale-[0.99]">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 text-blue-600">
                        <BarChart3 className="w-7 h-7" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-xl mb-1">Regional Benchmark</h4>
                    <p className="text-gray-400 text-sm mb-6">Compared to local average</p>

                    <div className="flex items-center gap-2">
                        <span className="text-4xl font-black text-gray-900">{summary.vsAverage}</span>
                        <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-lg">ABOVE AVG</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CropRotationTab({ data, currentCrop }: any) {
    const rec = data?.rotation_recommendation || {
        recommended_crop: 'Pulses',
        reason: 'Nitrogen replenishment needed.',
        benefits: ['Restores Nitrogen', 'Breaks Pest Cycles', 'Low Water Usage']
    };

    return (
        <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700 relative overflow-hidden">

            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-full blur-3xl -mr-20 -mt-20"></div>

            <div className="relative z-10">
                <div className="flex items-center gap-5 mb-10">
                    <div className="bg-purple-100 p-4 rounded-3xl shadow-sm">
                        <RotateCw className="w-10 h-10 text-purple-600" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-gray-900">Next Season Recommendation</h3>
                        <p className="text-gray-500 font-medium">Optimized for soil health after {currentCrop}</p>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl p-8 mb-10 border border-purple-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-2 block">Best Option</span>
                            <h2 className="text-4xl font-black text-purple-900 mb-3">{rec.recommended_crop}</h2>
                            <p className="text-purple-800 leading-relaxed font-medium opacity-80 max-w-md">{rec.reason}</p>
                        </div>
                        <div className="hidden md:block">
                            <Sprout className="w-24 h-24 text-purple-200" />
                        </div>
                    </div>
                </div>

                <div>
                    <h4 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        Key Benefits
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {rec.benefits?.map((benefit: string, idx: number) => (
                            <div key={idx} className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                <div className="bg-white p-2 rounded-full shadow-sm text-green-600">
                                    <CheckCircle2 className="w-5 h-5" />
                                </div>
                                <span className="text-gray-700 font-bold text-sm">{benefit}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function CarbonFootprintTab({ data }: any) {
    // Mock data for carbon footprint
    const carbonMetrics = data || {
        totalEmissions: 2340, // kg CO2e
        breakdown: [
            { category: 'Fertilizers', emissions: 890, percentage: 38, color: 'emerald' },
            { category: 'Machinery & Fuel', emissions: 620, percentage: 26, color: 'blue' },
            { category: 'Irrigation', emissions: 450, percentage: 19, color: 'cyan' },
            { category: 'Pesticides', emissions: 380, percentage: 17, color: 'amber' },
        ],
        sustainabilityScore: 72,
        carbonSequestered: 450, // kg CO2 absorbed by crops
        netEmissions: 1890, // total - sequestered
        trend: '-8.5%', // reduction compared to last season
    };

    const chartData = [
        { month: 'Jan', emissions: 320 },
        { month: 'Feb', emissions: 280 },
        { month: 'Mar', emissions: 350 },
        { month: 'Apr', emissions: 410 },
        { month: 'May', emissions: 380 },
        { month: 'Jun', emissions: 330 },
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Hero Card - Total Emissions */}
            <div className="bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-emerald-200 relative overflow-hidden group">
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 border border-white/20">
                        <Leaf className="w-3 h-3" /> Carbon Impact
                    </div>
                    <p className="text-emerald-100 font-medium mb-1 text-lg">Total Carbon Footprint</p>
                    <div className="flex items-baseline gap-4 mt-2">
                        <h2 className="text-6xl font-black tracking-tight">{carbonMetrics.totalEmissions.toLocaleString()}</h2>
                        <span className="text-2xl font-bold text-emerald-200">kg CO₂e</span>
                    </div>
                    <div className="mt-8 flex gap-3 text-sm font-medium text-emerald-100">
                        <div className="bg-white/20 px-4 py-2 rounded-xl backdrop-blur-sm flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" />
                            Net: {carbonMetrics.netEmissions.toLocaleString()} kg CO₂e
                        </div>
                        <div className="bg-white/20 px-4 py-2 rounded-xl backdrop-blur-sm">
                            {carbonMetrics.trend} vs Last Season
                        </div>
                    </div>
                </div>
                {/* Decorative background */}
                <div className="absolute -right-10 -bottom-20 opacity-20 transform rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                    <Leaf className="w-96 h-96" />
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/30 rounded-full blur-3xl -mr-16 -mt-16"></div>
            </div>

            {/* Emissions Breakdown */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
                <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                    Emissions Breakdown
                </h3>
                <div className="space-y-4">
                    {carbonMetrics.breakdown.map((item: any, idx: number) => {
                        const colorClasses = {
                            emerald: 'bg-emerald-500',
                            blue: 'bg-blue-500',
                            cyan: 'bg-cyan-500',
                            amber: 'bg-amber-500',
                        };
                        return (
                            <div key={idx} className="group hover:bg-gray-50 p-4 rounded-2xl transition-all">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-gray-900">{item.category}</span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-gray-500 font-medium">{item.emissions} kg CO₂e</span>
                                        <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">{item.percentage}%</span>
                                    </div>
                                </div>
                                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${colorClasses[item.color as keyof typeof colorClasses]} rounded-full transition-all duration-1000 group-hover:opacity-80`}
                                        style={{ width: `${item.percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sustainability Score */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-lg transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center mb-6 text-green-600">
                        <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-xl mb-1">Sustainability Score</h4>
                    <p className="text-gray-400 text-sm mb-6">Based on eco-friendly practices</p>

                    <div className="flex items-end gap-3">
                        <span className="text-5xl font-black text-gray-900">{carbonMetrics.sustainabilityScore}</span>
                        <span className="text-2xl font-bold text-gray-400 mb-1">/100</span>
                    </div>
                    <div className="mt-4 h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-green-400 to-emerald-600 rounded-full"
                            style={{ width: `${carbonMetrics.sustainabilityScore}%` }}
                        ></div>
                    </div>
                </div>

                {/* Carbon Sequestered */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-lg transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6 text-emerald-600">
                        <Leaf className="w-7 h-7" />
                    </div>
                    <h4 className="font-bold text-gray-900 text-xl mb-1">Carbon Sequestered</h4>
                    <p className="text-gray-400 text-sm mb-6">CO₂ absorbed by crops</p>

                    <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-black text-emerald-600">{carbonMetrics.carbonSequestered}</span>
                        <span className="text-2xl font-bold text-gray-400 mb-1">kg</span>
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-sm">
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg font-bold">
                            {((carbonMetrics.carbonSequestered / carbonMetrics.totalEmissions) * 100).toFixed(1)}% Offset
                        </span>
                    </div>
                </div >
            </div >

            {/* Emissions Trend Chart */}
            < div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300" >
                <div className="flex justify-between items-center mb-8">
                    <h3 className="font-bold text-gray-800 flex items-center gap-3 text-lg">
                        <div className="w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                        Emissions Trend
                    </h3>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">Last 6 Months</span>
                </div>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis
                                dataKey="month"
                                tick={{ fontSize: 11, fill: '#9ca3af' }}
                                tickLine={false}
                                axisLine={false}
                                tickMargin={10}
                            />
                            <YAxis
                                tick={{ fontSize: 11, fill: '#9ca3af' }}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(val) => `${val}`}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
                                cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }}
                            />
                            <Bar
                                dataKey="emissions"
                                fill="#10b981"
                                radius={[12, 12, 0, 0]}
                                maxBarSize={60}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div >
        </div >
    );
}




function AIAnalyticsTab({ policyState, qTable }: any) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-rose-100 p-3 rounded-2xl text-rose-600">
                        <BrainCircuit className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-gray-900">AI Intelligence Core</h3>
                        <p className="text-gray-500 font-medium text-sm">Real-time Policy & Q-Learning State</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Policy State */}
                    <div className="bg-gray-50 rounded-3xl p-6 border border-gray-200">
                        <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Policy Penalties & Hyperparameters</h4>
                        {policyState ? (
                            <pre className="text-xs font-mono text-gray-700 overflow-x-auto bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                {JSON.stringify(policyState, null, 2)}
                            </pre>
                        ) : (
                            <div className="bg-white p-6 rounded-xl text-center text-gray-400 text-sm font-medium">
                                No policy state data available
                            </div>
                        )}
                    </div>

                    {/* Q-Table */}
                    <div className="bg-gray-50 rounded-3xl p-6 border border-gray-200">
                        <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Reinforcement Learning Q-Table</h4>
                        {qTable && qTable.length > 0 ? (
                            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm overflow-x-auto max-h-[300px] overflow-y-auto">
                                <pre className="text-xs font-mono text-gray-700">
                                    {JSON.stringify(qTable, null, 2)}
                                </pre>
                            </div>
                        ) : (
                            <div className="bg-white p-6 rounded-xl text-center text-gray-400 text-sm font-medium">
                                Q-Table is empty or initializing
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// --------------------------------------------------
// HELPERS
// --------------------------------------------------

function TabButton({ active, onClick, icon: Icon, label, color }: any) {
    const colors = {
        blue: active ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-gray-500 hover:bg-gray-100',
        green: active ? 'bg-green-600 text-white shadow-lg shadow-green-200' : 'text-gray-500 hover:bg-gray-100',
        amber: active ? 'bg-amber-500 text-white shadow-lg shadow-amber-200' : 'text-gray-500 hover:bg-gray-100',
        purple: active ? 'bg-purple-600 text-white shadow-lg shadow-purple-200' : 'text-gray-500 hover:bg-gray-100',
        emerald: active ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'text-gray-500 hover:bg-gray-100',
        rose: active ? 'bg-rose-600 text-white shadow-lg shadow-rose-200' : 'text-gray-500 hover:bg-gray-100',
    };

    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl transition-all duration-300 whitespace-nowrap font-bold text-sm ${colors[color as keyof typeof colors]}`}
        >
            <Icon className={`w-5 h-5 ${active ? 'scale-110' : 'scale-100'} transition-transform`} />
            {label}
        </button>
    );
}

function SensorCard({ label, value, icon: Icon, color, trend }: any) {
    const colors = {
        blue: 'bg-blue-50 text-blue-600 ring-4 ring-blue-50',
        green: 'bg-green-50 text-green-600 ring-4 ring-green-50',
        amber: 'bg-amber-50 text-amber-600 ring-4 ring-amber-50',
        cyan: 'bg-cyan-50 text-cyan-600 ring-4 ring-cyan-50',
    };

    return (
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl transition-colors ${colors[color as keyof typeof colors]}`}>
                    <Icon className="w-6 h-6" />
                </div>
                {trend && (
                    <span className={`text-xs font-bold px-2 py-1 rounded-lg ${trend.startsWith('+') ? 'bg-green-100 text-green-700' :
                        trend.startsWith('-') ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                        {trend}
                    </span>
                )}
            </div>
            <div>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1 group-hover:text-gray-600 transition-colors">{label}</p>
                <p className="text-3xl font-black text-gray-900 tracking-tight group-hover:scale-105 transition-transform origin-left">{value}</p>
            </div>
        </div>
    );
}
