import React, { useState, useEffect } from 'react';
import { Crop } from '../../context/AppContext';
import { AlertCircle, CheckCircle2, Leaf, Activity, TrendingDown, AlertTriangle, Info } from 'lucide-react';
import { pesticideService, PesticideRecommendationData, PesticideHistoryEntry } from '../../services/pesticide.service';

interface Props {
    crop: Crop;
    currentSensorData?: {
        temperature?: number;
        humidity?: number;
        moisture?: number;
    };
}

export function PesticideRecommendation({ crop, currentSensorData }: Props) {
    const [recommendation, setRecommendation] = useState<PesticideRecommendationData | null>(null);
    const [history, setHistory] = useState<PesticideHistoryEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPesticideData();
    }, [crop.id, crop.name, currentSensorData]);

    const loadPesticideData = async () => {
        setLoading(true);
        try {
            // Get recommendation based on current conditions
            const rec = await pesticideService.getPesticideRecommendation(
                crop.name.toLowerCase(),
                undefined, // disease - would come from AI detection
                undefined, // pest - would come from AI detection
                crop.currentStage,
                currentSensorData?.humidity,
                currentSensorData?.temperature,
                currentSensorData?.moisture
            );
            setRecommendation(rec);

            // Get history
            const hist = await pesticideService.getPesticideHistory(crop.id);
            setHistory(hist);
        } catch (error) {
            console.error('Failed to load pesticide data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Current Recommendation */}
            {recommendation && recommendation.status === 'recommendation' && (
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-3xl border border-orange-100 shadow-sm">
                    <div className="flex items-start gap-4">
                        <div className="bg-orange-100 p-3 rounded-2xl text-orange-600 shrink-0">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-lg font-black text-gray-900">Pesticide Recommended</h3>
                                <span className="text-xs font-bold bg-orange-200 text-orange-800 px-2 py-1 rounded-lg uppercase">
                                    {recommendation.category}
                                </span>
                            </div>

                            {recommendation.disease && (
                                <p className="text-sm text-gray-600 mb-3">
                                    <span className="font-bold">Detected:</span> {recommendation.disease}
                                </p>
                            )}
                            {recommendation.pest && (
                                <p className="text-sm text-gray-600 mb-3">
                                    <span className="font-bold">Detected:</span> {recommendation.pest}
                                </p>
                            )}
                            {recommendation.reason && (
                                <p className="text-sm text-gray-600 mb-3">{recommendation.reason}</p>
                            )}

                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <div className="bg-white p-3 rounded-xl">
                                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Pesticide</p>
                                    <p className="text-sm font-bold text-gray-900">{recommendation.pesticide}</p>
                                </div>
                                <div className="bg-white p-3 rounded-xl">
                                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Type</p>
                                    <p className="text-sm font-bold text-gray-900 capitalize">{recommendation.type}</p>
                                </div>
                                <div className="bg-white p-3 rounded-xl">
                                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Dosage</p>
                                    <p className="text-sm font-bold text-gray-900">{recommendation.dosage}</p>
                                </div>
                                <div className="bg-white p-3 rounded-xl">
                                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Spray Interval</p>
                                    <p className="text-sm font-bold text-gray-900">{recommendation.spray_interval}</p>
                                </div>
                            </div>

                            {recommendation.carbon_impact && (
                                <div className="flex items-center gap-2 p-3 bg-white rounded-xl mb-3">
                                    <Leaf className="w-4 h-4 text-orange-600" />
                                    <span className="text-xs font-bold text-gray-600">Carbon Impact:</span>
                                    <span className={`text-xs font-bold ${recommendation.carbon_impact > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                                        {recommendation.carbon_impact_label}
                                    </span>
                                </div>
                            )}

                            {recommendation.safety_notes && (
                                <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-xl border border-blue-100">
                                    <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                                    <p className="text-xs text-blue-800">{recommendation.safety_notes}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Monitor Status */}
            {recommendation && recommendation.status === 'monitor' && (
                <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-6 rounded-3xl border border-yellow-100 shadow-sm">
                    <div className="flex items-start gap-4">
                        <div className="bg-yellow-100 p-3 rounded-2xl text-yellow-600 shrink-0">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-black text-gray-900 mb-2">Moderate Risk Detected</h3>
                            <p className="text-sm text-gray-600 mb-3">{recommendation.message}</p>
                            <div className="flex gap-4 text-sm">
                                {recommendation.humidity && (
                                    <div>
                                        <span className="text-gray-500">Humidity:</span> <span className="font-bold text-gray-900">{recommendation.humidity}%</span>
                                    </div>
                                )}
                                {recommendation.temperature && (
                                    <div>
                                        <span className="text-gray-500">Temp:</span> <span className="font-bold text-gray-900">{recommendation.temperature}°C</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* No Action */}
            {recommendation && recommendation.status === 'no_action' && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-3xl border border-green-100 shadow-sm">
                    <div className="flex items-start gap-4">
                        <div className="bg-green-100 p-3 rounded-2xl text-green-600 shrink-0">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-black text-gray-900 mb-2">No Action Required</h3>
                            <p className="text-sm text-gray-600 mb-1">{recommendation.message}</p>
                            <p className="text-xs text-green-700 font-medium">{recommendation.recommendation}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Stage Advisory */}
            {recommendation && recommendation.stage_advisory && (
                <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100">
                    <p className="text-sm text-purple-800">{recommendation.stage_advisory}</p>
                </div>
            )}

            {/* Usage History */}
            {history.length > 0 && (
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <Activity className="w-5 h-5 text-gray-600" />
                        <h3 className="text-lg font-black text-gray-900">Pesticide Usage History</h3>
                    </div>
                    <div className="space-y-3">
                        {history.map((entry) => {
                            const daysAgo = Math.floor((Date.now() - new Date(entry.applied_date).getTime()) / (1000 * 60 * 60 * 24));
                            return (
                                <div key={entry.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-900 text-sm">{entry.pesticide_name}</p>
                                        <p className="text-xs text-gray-500 capitalize">{entry.type} • {entry.dosage}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-gray-900">{daysAgo} days ago</p>
                                        <p className={`text-xs font-bold ${entry.carbon_impact > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                                            {entry.carbon_impact > 0 ? '+' : ''}{entry.carbon_impact}%
                                        </p>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Total Carbon Impact */}
                        <div className="mt-4 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-green-100">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <TrendingDown className="w-5 h-5 text-green-600" />
                                    <span className="text-sm font-bold text-gray-900">Total Carbon Footprint</span>
                                </div>
                                {(() => {
                                    const total = history.reduce((sum, h) => sum + h.carbon_impact, 0);
                                    return (
                                        <span className={`text-lg font-black ${total > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                                            {total > 0 ? '+' : ''}{total.toFixed(1)}%
                                        </span>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
