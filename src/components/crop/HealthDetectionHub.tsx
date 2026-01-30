import React, { useState, useRef } from 'react';
import { aiService } from '../../services/ai.service';
import { Camera, Search, AlertCircle, CheckCircle2, Loader2, Info } from 'lucide-react';

interface Props {
    cropId: string;
}

export function HealthDetectionHub({ cropId }: Props) {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [result, setResult] = useState<any>(null);
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
            const res = await aiService.detectCropHealth(cropId, file);
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
                <span className="text-xl">🧪</span>
                <h2 className="text-xl font-bold text-gray-900">Crop Health Detection</h2>
            </div>

            <div className="bg-white rounded-3xl border-2 border-dashed border-gray-200 p-6 flex flex-col items-center justify-center relative overflow-hidden">
                {preview ? (
                    <div className="space-y-4 w-full">
                        <img src={preview} alt="Plant Preview" className="w-full aspect-square object-cover rounded-2xl" />
                        {!result && (
                            <button
                                onClick={handleAnalyze}
                                disabled={loading}
                                className="w-full py-4 bg-green-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-200 active:scale-95 transition-all"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                                {loading ? 'Analyzing Plant Tissue...' : 'Run AI Diagnosis'}
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
                        className="flex flex-col items-center py-10"
                    >
                        <div className="p-5 bg-green-50 rounded-full mb-4">
                            <Camera className="w-8 h-8 text-green-600" />
                        </div>
                        <p className="font-bold text-gray-800">Upload Crop Sample</p>
                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-1">AI Scan for Disease & Stress</p>
                    </button>
                )}
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            </div>

            {/* AI Result Section */}
            {result && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
                    <div className={`p-5 rounded-3xl border ${result.status === 'diseased' ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'
                        }`}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`p-2 rounded-xl bg-white shadow-sm`}>
                                {result.status === 'diseased' ? <AlertCircle className="w-5 h-5 text-red-600" /> : <CheckCircle2 className="w-5 h-5 text-green-600" />}
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-gray-900 uppercase">AI Diagnosis Result</h3>
                                <p className={`text-xl font-black ${result.status === 'diseased' ? 'text-red-600' : 'text-green-600'}`}>
                                    {result.issue || 'Healthy Crop'}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3 pt-3 border-t border-black/5">
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Recommended Treatment</p>
                                <p className="text-sm font-bold text-gray-800">{result.solution}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Prevention Strategy</p>
                                <p className="text-sm text-gray-600 leading-relaxed">{result.prevention}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-600 p-5 rounded-3xl text-white shadow-xl shadow-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                            <Info className="w-4 h-4" />
                            <h4 className="text-[10px] font-bold uppercase tracking-widest">Why AI recommended this</h4>
                        </div>
                        <p className="text-xs leading-relaxed opacity-90">
                            Based on your crop variety and the leaf patterns detected, this solution has a <span className="font-bold">{(result.confidence * 100).toFixed(0)}% accuracy rate</span> in similar climate zones.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
