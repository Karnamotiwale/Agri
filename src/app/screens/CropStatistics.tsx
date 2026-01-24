import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '../components/Header';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
    Calendar,
    Droplets,
    Thermometer,
    Cloud,
    Sun,
    Sprout,
    Package,
    DollarSign,
    TrendingUp,
    Leaf,
    Wind,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useCropSensors } from '../../hooks/useCropSensors';

export function CropStatistics() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { getCrop } = useApp();
    const sensors = useCropSensors(id || '1');
    const cropFromStore = getCrop(id || '1');

    const [growthData, setGrowthData] = useState([
        { date: '15', height: 12 },
        { date: '16', height: 12.3 },
        { date: '17', height: 12.8 },
        { date: '18', height: 13.5 },
        { date: 'Today', height: 14.2 },
        { date: '20', height: 14.2 },
        { date: '21', height: 14.2 },
    ]);

    useEffect(() => {
        const t = setInterval(() => {
            setGrowthData((prev) => {
                const next = [...prev];
                const last = next[next.length - 1];
                const newHeight = Math.min(18, last.height + (Math.random() * 0.15));
                next[next.length - 1] = { ...last, height: Math.round(newHeight * 10) / 10 };
                return next;
            });
        }, 4000);
        return () => clearInterval(t);
    }, []);

    // Mock comprehensive crop data (driven by store where available)
    const cropData = {
        // General Information
        cropName: cropFromStore?.name ?? 'Wild Onion',
        cropType: 'Rabi',
        variety: 'Pusa White Round',
        maturityDuration: 'Medium (90-120 days)',
        diseaseResistance: 'Purple Blotch, Downy Mildew',
        droughtTolerance: 'Moderate',

        // Environmental & Site Information (pH, NPK from live sensors)
        soilType: 'Loamy',
        soilTexture: 'Well-drained, Sandy Loam',
        pH: sensors.ph.toFixed(2),
        nitrogen: sensors.n < 100 ? 'Low' : sensors.n < 180 ? 'Medium' : 'High',
        phosphorus: sensors.p < 25 ? 'Low' : sensors.p < 60 ? 'Medium' : 'High',
        potassium: sensors.k < 120 ? 'Low' : sensors.k < 250 ? 'Medium' : 'High',
        tempRange: '15°C - 25°C',
        rainfall: '450 mm',
        humidity: '65%',
        sunshineHours: '6-8 hours/day',
        previousCrops: 'Wheat, Mustard',

        // Production & Management
        landPreparation: 'Ploughing with Disc Harrow',
        sowingDate: cropFromStore?.sowingDate ?? '15 Nov 2024',
        seedRate: '8-10 kg/acre',
        plantingDepth: '2-3 cm',
        plantSpacing: '15 x 10 cm',
        fertilizerType: 'NPK 19:19:19',
        applicationRate: '50 kg/acre',
        applicationTiming: 'Basal + 2 top dressings',
        irrigationFrequency: 'Every 7-10 days',
        irrigationMethod: 'Drip Irrigation',
        waterSource: 'Borewell',
        pestIdentified: 'Thrips, Onion Maggot',
        pesticide: 'Imidacloprid 17.8% SL',
        sprayDates: '10 Dec, 25 Dec, 10 Jan',
        weedManagement: 'Manual weeding + Pendimethalin',

        // Harvest & Post-Harvest
        harvestDate: '15 Mar 2025 (Expected)',
        harvestMethod: 'Manual',
        yieldExpected: '8-10 tons/acre',
        storageMethod: 'Ventilated bags in cool storage',
        storageConditions: 'Temperature: 0-5°C, Humidity: 65-70%',

        // Financial & Record-Keeping
        seedCost: '₹2,500',
        fertilizerCost: '₹4,000',
        pesticideCost: '₹3,500',
        laborCost: '₹12,000',
        machineryCost: '₹5,000',
        totalInputCost: '₹27,000',
        salePrice: '₹25/kg (Expected)',
        expectedRevenue: '₹2,00,000 - ₹2,50,000',
        buyerInfo: 'Local Mandi / Direct to Retailer',
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-6">
            <Header title="Statistics" showBack onBackClick={() => navigate('/dashboard')} />

            <div className="px-6 py-6 pb-8 space-y-6">
                {/* Growth Graph Section */}
                <div className="bg-white rounded-3xl p-6 shadow-sm">
                    <h3 className="text-sm font-medium text-gray-500 mb-4">Height (cm)</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={growthData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis
                                dataKey="date"
                                tick={{ fill: '#9ca3af', fontSize: 12 }}
                                axisLine={{ stroke: '#e5e7eb' }}
                            />
                            <YAxis
                                domain={[10, 20]}
                                tick={{ fill: '#9ca3af', fontSize: 12 }}
                                axisLine={{ stroke: '#e5e7eb' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'white',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    fontSize: '12px',
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="height"
                                stroke="#10b981"
                                strokeWidth={2}
                                dot={{ fill: '#10b981', r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Section 1: General Crop Information */}
                <div className="bg-white rounded-3xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <Sprout className="w-5 h-5 text-green-600" />
                        <h3 className="text-lg font-bold text-gray-900">General Crop Information</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-start">
                            <span className="text-sm text-gray-500">Crop Name & Type:</span>
                            <span className="text-sm font-medium text-gray-900 text-right">
                                {cropData.cropName} – {cropData.cropType}
                            </span>
                        </div>
                        <div className="flex justify-between items-start">
                            <span className="text-sm text-gray-500">Variety:</span>
                            <span className="text-sm font-medium text-gray-900 text-right">
                                {cropData.variety}
                            </span>
                        </div>
                        <div className="border-t border-gray-100 pt-3">
                            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
                                Variety Characteristics
                            </p>
                            <div className="space-y-2">
                                <div className="flex justify-between items-start">
                                    <span className="text-sm text-gray-500">Maturity Duration:</span>
                                    <span className="text-sm font-medium text-gray-900 text-right">
                                        {cropData.maturityDuration}
                                    </span>
                                </div>
                                <div className="flex justify-between items-start">
                                    <span className="text-sm text-gray-500">Disease Resistance:</span>
                                    <span className="text-sm font-medium text-gray-900 text-right">
                                        {cropData.diseaseResistance}
                                    </span>
                                </div>
                                <div className="flex justify-between items-start">
                                    <span className="text-sm text-gray-500">Drought Tolerance:</span>
                                    <span className="text-sm font-medium text-gray-900 text-right">
                                        {cropData.droughtTolerance}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 2: Environmental & Site Information */}
                <div className="bg-white rounded-3xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <Leaf className="w-5 h-5 text-green-600" />
                        <h3 className="text-lg font-bold text-gray-900">Environmental & Site Information</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-start">
                            <span className="text-sm text-gray-500">Soil Type & Texture:</span>
                            <span className="text-sm font-medium text-gray-900 text-right">
                                {cropData.soilType} – {cropData.soilTexture}
                            </span>
                        </div>
                        <div className="border-t border-gray-100 pt-3">
                            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
                                Soil Fertility Status
                            </p>
                            <div className="space-y-2">
                                <div className="flex justify-between items-start">
                                    <span className="text-sm text-gray-500">pH Value:</span>
                                    <span className="text-sm font-medium text-gray-900">{cropData.pH}</span>
                                </div>
                                <div className="flex justify-between items-start">
                                    <span className="text-sm text-gray-500">Nitrogen (N):</span>
                                    <span className="text-sm font-medium text-gray-900">{cropData.nitrogen}</span>
                                </div>
                                <div className="flex justify-between items-start">
                                    <span className="text-sm text-gray-500">Phosphorus (P):</span>
                                    <span className="text-sm font-medium text-gray-900">{cropData.phosphorus}</span>
                                </div>
                                <div className="flex justify-between items-start">
                                    <span className="text-sm text-gray-500">Potassium (K):</span>
                                    <span className="text-sm font-medium text-gray-900">{cropData.potassium}</span>
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-gray-100 pt-3">
                            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
                                Climate / Weather Patterns
                            </p>
                            <div className="space-y-2">
                                <div className="flex justify-between items-start">
                                    <span className="text-sm text-gray-500 flex items-center gap-1">
                                        <Thermometer className="w-3 h-3" /> Temperature Range:
                                    </span>
                                    <span className="text-sm font-medium text-gray-900">{cropData.tempRange}</span>
                                </div>
                                <div className="flex justify-between items-start">
                                    <span className="text-sm text-gray-500 flex items-center gap-1">
                                        <Droplets className="w-3 h-3" /> Rainfall:
                                    </span>
                                    <span className="text-sm font-medium text-gray-900">{cropData.rainfall}</span>
                                </div>
                                <div className="flex justify-between items-start">
                                    <span className="text-sm text-gray-500 flex items-center gap-1">
                                        <Cloud className="w-3 h-3" /> Humidity:
                                    </span>
                                    <span className="text-sm font-medium text-gray-900">{cropData.humidity}</span>
                                </div>
                                <div className="flex justify-between items-start">
                                    <span className="text-sm text-gray-500 flex items-center gap-1">
                                        <Sun className="w-3 h-3" /> Sunshine Hours:
                                    </span>
                                    <span className="text-sm font-medium text-gray-900">{cropData.sunshineHours}</span>
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-gray-100 pt-3">
                            <div className="flex justify-between items-start">
                                <span className="text-sm text-gray-500">Field History:</span>
                                <span className="text-sm font-medium text-gray-900 text-right">
                                    {cropData.previousCrops}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 3: Production & Management Data */}
                <div className="bg-white rounded-3xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        <h3 className="text-lg font-bold text-gray-900">Production & Management Data</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-start">
                            <span className="text-sm text-gray-500">Land Preparation:</span>
                            <span className="text-sm font-medium text-gray-900 text-right">
                                {cropData.landPreparation}
                            </span>
                        </div>
                        <div className="border-t border-gray-100 pt-3">
                            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
                                Planting Details
                            </p>
                            <div className="space-y-2">
                                <div className="flex justify-between items-start">
                                    <span className="text-sm text-gray-500 flex items-center gap-1">
                                        <Calendar className="w-3 h-3" /> Sowing Date:
                                    </span>
                                    <span className="text-sm font-medium text-gray-900">{cropData.sowingDate}</span>
                                </div>
                                <div className="flex justify-between items-start">
                                    <span className="text-sm text-gray-500">Seed Rate:</span>
                                    <span className="text-sm font-medium text-gray-900">{cropData.seedRate}</span>
                                </div>
                                <div className="flex justify-between items-start">
                                    <span className="text-sm text-gray-500">Planting Depth:</span>
                                    <span className="text-sm font-medium text-gray-900">{cropData.plantingDepth}</span>
                                </div>
                                <div className="flex justify-between items-start">
                                    <span className="text-sm text-gray-500">Plant Spacing:</span>
                                    <span className="text-sm font-medium text-gray-900">{cropData.plantSpacing}</span>
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-gray-100 pt-3">
                            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
                                Nutrient Management
                            </p>
                            <div className="space-y-2">
                                <div className="flex justify-between items-start">
                                    <span className="text-sm text-gray-500">Fertilizer Type:</span>
                                    <span className="text-sm font-medium text-gray-900 text-right">
                                        {cropData.fertilizerType}
                                    </span>
                                </div>
                                <div className="flex justify-between items-start">
                                    <span className="text-sm text-gray-500">Application Rate:</span>
                                    <span className="text-sm font-medium text-gray-900">{cropData.applicationRate}</span>
                                </div>
                                <div className="flex justify-between items-start">
                                    <span className="text-sm text-gray-500">Application Timing:</span>
                                    <span className="text-sm font-medium text-gray-900 text-right">
                                        {cropData.applicationTiming}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-gray-100 pt-3">
                            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
                                Irrigation Schedule
                            </p>
                            <div className="space-y-2">
                                <div className="flex justify-between items-start">
                                    <span className="text-sm text-gray-500">Frequency:</span>
                                    <span className="text-sm font-medium text-gray-900">{cropData.irrigationFrequency}</span>
                                </div>
                                <div className="flex justify-between items-start">
                                    <span className="text-sm text-gray-500">Method:</span>
                                    <span className="text-sm font-medium text-gray-900">{cropData.irrigationMethod}</span>
                                </div>
                                <div className="flex justify-between items-start">
                                    <span className="text-sm text-gray-500">Water Source:</span>
                                    <span className="text-sm font-medium text-gray-900">{cropData.waterSource}</span>
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-gray-100 pt-3">
                            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
                                Pest & Disease Control
                            </p>
                            <div className="space-y-2">
                                <div className="flex justify-between items-start">
                                    <span className="text-sm text-gray-500">Pest Identified:</span>
                                    <span className="text-sm font-medium text-gray-900 text-right">
                                        {cropData.pestIdentified}
                                    </span>
                                </div>
                                <div className="flex justify-between items-start">
                                    <span className="text-sm text-gray-500">Pesticide Used:</span>
                                    <span className="text-sm font-medium text-gray-900 text-right">
                                        {cropData.pesticide}
                                    </span>
                                </div>
                                <div className="flex justify-between items-start">
                                    <span className="text-sm text-gray-500">Spray Dates:</span>
                                    <span className="text-sm font-medium text-gray-900 text-right">
                                        {cropData.sprayDates}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-gray-100 pt-3">
                            <div className="flex justify-between items-start">
                                <span className="text-sm text-gray-500">Weed Management:</span>
                                <span className="text-sm font-medium text-gray-900 text-right">
                                    {cropData.weedManagement}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 4: Harvest & Post-Harvest Data */}
                <div className="bg-white rounded-3xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <Package className="w-5 h-5 text-green-600" />
                        <h3 className="text-lg font-bold text-gray-900">Harvest & Post-Harvest Data</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-start">
                            <span className="text-sm text-gray-500 flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> Harvesting Date:
                            </span>
                            <span className="text-sm font-medium text-gray-900 text-right">
                                {cropData.harvestDate}
                            </span>
                        </div>
                        <div className="flex justify-between items-start">
                            <span className="text-sm text-gray-500">Harvesting Method:</span>
                            <span className="text-sm font-medium text-gray-900">{cropData.harvestMethod}</span>
                        </div>
                        <div className="flex justify-between items-start">
                            <span className="text-sm text-gray-500">Yield / Output:</span>
                            <span className="text-sm font-medium text-gray-900 text-right">
                                {cropData.yieldExpected}
                            </span>
                        </div>
                        <div className="border-t border-gray-100 pt-3">
                            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
                                Storage Information
                            </p>
                            <div className="space-y-2">
                                <div className="flex justify-between items-start">
                                    <span className="text-sm text-gray-500">Storage Method:</span>
                                    <span className="text-sm font-medium text-gray-900 text-right">
                                        {cropData.storageMethod}
                                    </span>
                                </div>
                                <div className="flex justify-between items-start">
                                    <span className="text-sm text-gray-500">Storage Conditions:</span>
                                    <span className="text-sm font-medium text-gray-900 text-right">
                                        {cropData.storageConditions}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 5: Financial & Record-Keeping */}
                <div className="bg-white rounded-3xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        <h3 className="text-lg font-bold text-gray-900">Financial & Record-Keeping</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="border-b border-gray-100 pb-3">
                            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
                                Input Costs
                            </p>
                            <div className="space-y-2">
                                <div className="flex justify-between items-start">
                                    <span className="text-sm text-gray-500">Seeds:</span>
                                    <span className="text-sm font-medium text-gray-900">{cropData.seedCost}</span>
                                </div>
                                <div className="flex justify-between items-start">
                                    <span className="text-sm text-gray-500">Fertilizers:</span>
                                    <span className="text-sm font-medium text-gray-900">{cropData.fertilizerCost}</span>
                                </div>
                                <div className="flex justify-between items-start">
                                    <span className="text-sm text-gray-500">Pesticides:</span>
                                    <span className="text-sm font-medium text-gray-900">{cropData.pesticideCost}</span>
                                </div>
                                <div className="flex justify-between items-start">
                                    <span className="text-sm text-gray-500">Labor:</span>
                                    <span className="text-sm font-medium text-gray-900">{cropData.laborCost}</span>
                                </div>
                                <div className="flex justify-between items-start">
                                    <span className="text-sm text-gray-500">Machinery:</span>
                                    <span className="text-sm font-medium text-gray-900">{cropData.machineryCost}</span>
                                </div>
                                <div className="flex justify-between items-start pt-2 border-t border-gray-100">
                                    <span className="text-sm font-semibold text-gray-700">Total Input Cost:</span>
                                    <span className="text-sm font-bold text-gray-900">{cropData.totalInputCost}</span>
                                </div>
                            </div>
                        </div>
                        <div className="pt-2">
                            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
                                Sales Data
                            </p>
                            <div className="space-y-2">
                                <div className="flex justify-between items-start">
                                    <span className="text-sm text-gray-500">Sale Price:</span>
                                    <span className="text-sm font-medium text-gray-900">{cropData.salePrice}</span>
                                </div>
                                <div className="flex justify-between items-start">
                                    <span className="text-sm text-gray-500">Expected Revenue:</span>
                                    <span className="text-sm font-medium text-green-600 text-right">
                                        {cropData.expectedRevenue}
                                    </span>
                                </div>
                                <div className="flex justify-between items-start">
                                    <span className="text-sm text-gray-500">Buyer Information:</span>
                                    <span className="text-sm font-medium text-gray-900 text-right">
                                        {cropData.buyerInfo}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
