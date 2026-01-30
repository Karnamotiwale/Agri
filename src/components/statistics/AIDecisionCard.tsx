import React, { useEffect, useState } from 'react';
import { aiService } from '../../services/ai.service';
import { AlertCircle, CheckCircle, Droplets, ArrowRight } from 'lucide-react';

interface Props {
    cropId: string;
}

export function AIDecisionCard({ cropId }: Props) {
    const [decision, setDecision] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDecision();
    }, [cropId]);

    const loadDecision = async () => {
        setLoading(true);
        try {
            const data = await aiService.getDecision(cropId);
            setDecision(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-10 bg-gray-100 rounded w-full"></div>
            </div>
        );
    }

    if (!decision) return null;

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-indigo-50 rounded-lg">
                    <img src="/icons/ai-brain.svg" className="w-6 h-6" alt="AI" onError={(e) => (e.currentTarget.style.display = 'none')} />
                    {/* Fallback icon if image fails */}
                    <AlertCircle className="w-6 h-6 text-indigo-600 hidden group-hover:block" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-900">AI Decision Engine</h2>
                    <p className="text-xs text-gray-500">Based on recent field analysis</p>
                </div>
                <span className="ml-auto bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">
                    {decision.confidence ? Math.round(decision.confidence * 100) : 90}% Conf.
                </span>
            </div>

            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl p-5 text-white shadow-lg shadow-indigo-200">
                <div className="flex items-start justify-between">
                    <div>
                        <span className="text-indigo-100 text-xs font-bold uppercase tracking-wider">Recommended Action</span>
                        <h3 className="text-3xl font-bold mt-1 mb-2">{decision.decision}</h3>
                        <p className="text-indigo-100 text-sm leading-relaxed opacity-90">
                            {decision.reason}
                        </p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                        {decision.decision === 'IRRIGATE' ? <Droplets className="w-8 h-8 text-white" /> : <CheckCircle className="w-8 h-8 text-white" />}
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs text-indigo-200">Decided at {new Date(decision.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <button className="text-xs font-bold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                        View Logic <ArrowRight className="w-3 h-3" />
                    </button>
                </div>
            </div>
        </div>
    );
}
