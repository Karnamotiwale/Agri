import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '../components/Header';

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
    CheckCircle2,
    Circle,
    Clock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useCropSensors } from '../../hooks/useCropSensors';
import { getCurrentStage, getGrowthProgress, CROP_GROWTH_STAGES } from '../../config/cropGrowthStages';
import { AIFertilizerPesticideAdvisory } from '../../components/analytics/AIFertilizerPesticideAdvisory';
import { AIYieldPrediction } from '../../components/analytics/AIYieldPrediction';
import { ResourceUsageAnalytics } from '../../components/analytics/ResourceUsageAnalytics';

export function CropStatistics() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { getCrop } = useApp();
    const sensors = useCropSensors(id || '1');
    const cropFromStore = getCrop(id || '1');



    // Calculate growth stage based on planting date
    const sowingDate = cropFromStore?.sowingDate || '15 Nov 2024';
    const daysSincePlanting = Math.floor(
        (Date.now() - new Date(sowingDate).getTime()) / (1000 * 60 * 60 * 24)
    );

    // Determine crop type (normalize to match config keys)
    const cropType = (cropFromStore?.name || 'Maize')
        .replace(/wild /i, '')
        .replace(/onion/i, 'Maize'); // Default to Maize for demo

    const currentStage = getCurrentStage(cropType, daysSincePlanting);
    const growthProgress = getGrowthProgress(cropType, daysSincePlanting);
    const allStages = CROP_GROWTH_STAGES[cropType] || CROP_GROWTH_STAGES.Default;

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
                {/* Live Growth Stage Tracker */}
                <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-3xl p-6 shadow-xl text-white relative overflow-hidden">
                    {/* Decorative background */}
                    <div className="absolute -right-12 -top-12 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>

                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-2xl font-bold">Day {daysSincePlanting}</h2>
                                <p className="text-emerald-100 text-sm">Since Planting</p>
                            </div>
                            <div className="text-right">
                                <div className="text-5xl" role="img" aria-label={currentStage?.stage}>
                                    {currentStage?.icon || '🌱'}
                                </div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-emerald-100">Growth Progress</span>
                                <span className="text-sm font-bold">{Math.round(growthProgress)}%</span>
                            </div>
                            <div className="h-3 bg-emerald-900/30 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-white rounded-full transition-all duration-700"
                                    style={{ width: `${growthProgress}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                            <h3 className="font-bold text-lg mb-1">{currentStage?.stage}</h3>
                            <p className="text-sm text-emerald-100">{currentStage?.description}</p>
                        </div>
                    </div>
                </div>

                {/* Growth Stage Timeline */}
                <div className="bg-white rounded-3xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-green-600" />
                        Growth Timeline
                    </h3>
                    <div className="space-y-4">
                        {allStages.map((stage, idx) => {
                            const isActive = stage === currentStage;
                            const isPast = daysSincePlanting > stage.dayEnd;
                            const isFuture = daysSincePlanting < stage.dayStart;

                            return (
                                <div key={idx} className={`relative pl-10 pb-4 ${idx < allStages.length - 1 ? 'border-l-2 ml-3' : ''
                                    } ${isPast ? 'border-green-300' : isActive ? 'border-green-500' : 'border-gray-200'
                                    }`}>
                                    <div className={`absolute left-0 top-0 -ml-[13px] w-6 h-6 rounded-full flex items-center justify-center ${isPast ? 'bg-green-500' : isActive ? 'bg-green-600 ring-4 ring-green-100' : 'bg-gray-200'
                                        }`}>
                                        {isPast ? (
                                            <CheckCircle2 className="w-4 h-4 text-white" />
                                        ) : (
                                            <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-white' : 'bg-white'
                                                }`}></div>
                                        )}
                                    </div>
                                    <div className={`${isActive ? 'bg-green-50 border-2 border-green-200 p-3 rounded-xl' : ''
                                        }`}>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-2xl">{stage.icon}</span>
                                                    <h4 className={`font-bold ${isActive ? 'text-green-700' : isPast ? 'text-gray-700' : 'text-gray-400'
                                                        }`}>{stage.stage}</h4>
                                                </div>
                                                <p className={`text-xs mt-1 ${isActive ? 'text-green-600' : 'text-gray-500'
                                                    }`}>Day {stage.dayStart}-{stage.dayEnd}</p>
                                            </div>
                                        </div>
                                        {isActive && (
                                            <p className="text-sm text-gray-600 mt-2">{stage.description}</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Current Tasks & Guidance */}
                {currentStage && (
                    <div className="bg-white rounded-3xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                            Current Tasks & Actions
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase mb-2">What to do now</p>
                                <ul className="space-y-2">
                                    {currentStage.tasks.map((task, idx) => (
                                        <li key={idx} className="flex items-start gap-3">
                                            <Circle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-sm text-gray-700">{task}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="border-t border-gray-100 pt-3">
                                <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Irrigation</p>
                                <p className="text-sm text-gray-700 flex items-center gap-2">
                                    <Droplets className="w-4 h-4 text-blue-500" />
                                    {currentStage.irrigation}
                                </p>
                            </div>

                            {currentStage.fertilization && (
                                <div className="border-t border-gray-100 pt-3">
                                    <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Fertilization</p>
                                    <p className="text-sm text-gray-700 flex items-center gap-2">
                                        <Leaf className="w-4 h-4 text-green-500" />
                                        {currentStage.fertilization}
                                    </p>
                                </div>
                            )}

                            <div className="border-t border-gray-100 pt-3">
                                <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Pest Watch</p>
                                <div className="flex flex-wrap gap-2">
                                    {currentStage.pestWatch.map((pest, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full">
                                            {pest}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-3">
                                <p className="text-xs font-semibold text-gray-400 uppercase mb-2">What to Observe</p>
                                <ul className="space-y-1">
                                    {currentStage.observations.map((obs, idx) => (
                                        <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                                            <span className="text-green-500 mt-0.5">•</span>
                                            {obs}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* AI Fertilizer & Pesticide Advisory Module (Replaces Graph) */}
                <div className="mb-2">
                    <AIFertilizerPesticideAdvisory
                        cropId={id}
                        cropName={cropData.cropName}
                        stage={currentStage?.stage || 'Vegetative'}
                    />
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
