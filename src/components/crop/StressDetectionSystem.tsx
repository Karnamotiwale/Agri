import React, { useState, useRef } from 'react';
import { aiService, StressAnalysisResult } from '../../services/ai.service';
import { Camera, Search, AlertTriangle, CheckCircle, Loader2, BarChart3, Wind, Droplets, Sun } from 'lucide-react';

interface Props {
    cropId: string;
}

export function StressDetectionSystem({ cropId }: Props) {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [result, setResult] = useState<StressAnalysisResult | null>(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) {
            setFile(selected);
            setPreview(URL.createObjectURL(selected));
            setResult(null);
        }
    };

    const handleAnalyze = async () => {
        if (!file) return;
        setLoading(true);
        try {
            const res = await aiService.detectCropStress(cropId, file);
            setResult(res);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="px-6 space-y-6">
            <div className="flex items-center gap-2">
                <span className="text-xl">🌡️</span>
                <h2 className="text-xl font-bold text-gray-900">Crop Stress Analysis</h2>
            </div>

            <p className="text-sm text-gray-500">
                Upload a photo to detect invisible stress factors like water deficiency or nutrient imbalance.
            </p>

            <div className="bg-white rounded-3xl border-2 border-dashed border-orange-200 p-6 flex flex-col items-center justify-center relative overflow-hidden">
                {preview ? (
                    <div className="space-y-4 w-full">
                        <img src={preview} alt="Crop Preview" className="w-full aspect-video object-cover rounded-2xl" />
                        {!result && (
                            <button
                                onClick={handleAnalyze}
                                disabled={loading}
                                className="w-full py-4 bg-orange-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-200 active:scale-95 transition-all"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                                {loading ? 'Scanning Stress Markers...' : 'Analyze Stress Levels'}
                            </button>
                        )}
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full py-3 bg-gray-50 text-gray-600 rounded-2xl text-xs font-bold uppercase"
                        >
                            Retake Photo
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex flex-col items-center py-10 w-full"
                    >
                        <div className="p-5 bg-orange-50 rounded-full mb-4">
                            <Camera className="w-8 h-8 text-orange-500" />
                        </div>
                        <p className="font-bold text-gray-800">Check for Stress</p>
                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-1">Water • Nutrients • Heat</p>
                    </button>
                )}
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            </div>

            {/* Analysis Result */}
            {result && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
                    {/* Main Status Card */}
                    <div className={`p-6 rounded-3xl border ${result.stressLevel === 'HIGH' ? 'bg-red-50 border-red-100' :
                            result.stressLevel === 'MEDIUM' ? 'bg-yellow-50 border-yellow-100' :
                                'bg-green-50 border-green-100'
                        }`}>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-1">Visual Stress Level</h3>
                                <p className={`text-2xl font-black ${result.stressLevel === 'HIGH' ? 'text-red-600' :
                                        result.stressLevel === 'MEDIUM' ? 'text-yellow-600' :
                                            'text-green-600'
                                    }`}>
                                    {result.stressLevel}
                                </p>
                            </div>
                            <div className={`p-3 rounded-2xl ${result.stressLevel === 'HIGH' ? 'bg-red-100' :
                                    result.stressLevel === 'MEDIUM' ? 'bg-yellow-100' :
                                        'bg-green-100'
                                }`}>
                                {result.stressLevel === 'LOW' ? (
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                ) : (
                                    <AlertTriangle className={`w-6 h-6 ${result.stressLevel === 'HIGH' ? 'text-red-600' : 'text-yellow-600'
                                        }`} />
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mb-6 p-3 bg-white/60 rounded-xl">
                            <span className="text-2xl">⚠️</span>
                            <div>
                                <p className="text-[10px] uppercase font-bold text-gray-400">Primary Stressor</p>
                                <p className="font-bold text-gray-800">{result.primaryStressor}</p>
                            </div>
                        </div>

                        {/* Factors Visualization */}
                        <div className="space-y-3">
                            <p className="text-[10px] uppercase font-bold text-gray-400">Stress Markers Detected</p>
                            {result.factors.map((factor, idx) => (
                                <div key={idx} className="space-y-1">
                                    <div className="flex justify-between text-xs font-medium text-gray-700">
                                        <span>{factor.name}</span>
                                        <span>{(factor.value * 100).toFixed(0)}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-black/5 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${factor.value > 0.7 ? 'bg-red-500' :
                                                    factor.value > 0.4 ? 'bg-yellow-500' : 'bg-green-500'
                                                }`}
                                            style={{ width: `${factor.value * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recommendations */}
                    <div className="bg-indigo-600 text-white p-6 rounded-3xl shadow-xl shadow-indigo-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <BarChart3 className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="font-bold">AI Recommendations</h3>
                        </div>
                        <ul className="space-y-3">
                            {result.recommendations.map((rec, i) => (
                                <li key={i} className="flex gap-3 text-sm opacity-90 leading-relaxed bg-white/10 p-3 rounded-xl border border-white/5">
                                    <span className="mt-0.5">•</span>
                                    {rec}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}
