import React, { useEffect, useState } from 'react';
import { aiService } from '../../services/ai.service';
import { BookOpen, Lightbulb, Clock, CheckCircle2, History } from 'lucide-react';

interface Props {
    cropId: string;
}

export function CropHistoryLearning({ cropId }: Props) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [cropId]);

    const loadData = async () => {
        try {
            const res = await aiService.getLearningInsights(cropId);
            setData(res);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="h-48 bg-gray-100 animate-pulse rounded-2xl mx-6"></div>;
    if (!data) return null;

    return (
        <div className="px-6 space-y-6">
            <div className="flex items-center gap-2">
                <span className="text-xl">📚</span>
                <h2 className="text-xl font-bold text-gray-900">Crop History & AI Learning</h2>
            </div>

            {/* AI Learning Insight */}
            <div className="bg-purple-600 p-6 rounded-3xl text-white shadow-xl shadow-purple-100 relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                        <Lightbulb className="w-5 h-5 text-yellow-300" />
                        <h3 className="text-xs font-bold uppercase tracking-widest">What AI learned from this crop</h3>
                    </div>
                    <p className="text-sm font-medium leading-relaxed italic opacity-95">
                        "{data.learning}"
                    </p>
                </div>
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <BookOpen className="w-20 h-20" />
                </div>
            </div>

            {/* Chronological History */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                    <History className="w-4 h-4 text-gray-400" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Recent Activity Log</span>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
                    {data.history.map((item: any, i: number) => (
                        <div key={i} className="flex items-center gap-4 p-4 border-b border-gray-50 last:border-0">
                            <div className={`p-2 rounded-xl ${item.type === 'learning' ? 'bg-purple-50 text-purple-600' :
                                    item.type === 'health' ? 'bg-red-50 text-red-600' :
                                        'bg-green-50 text-green-600'
                                }`}>
                                {item.type === 'learning' ? <Lightbulb className="w-4 h-4" /> :
                                    item.type === 'health' ? <AlertCircle className="w-4 h-4" /> :
                                        <CheckCircle2 className="w-4 h-4" />}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-gray-800">{item.event}</p>
                                <p className="text-[10px] text-gray-400 font-medium">{item.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="py-4 flex justify-center">
                <span className="px-4 py-2 bg-gray-50 rounded-full text-[9px] font-black text-gray-300 uppercase tracking-[0.3em]">
                    End of Season 2026 Records
                </span>
            </div>
        </div>
    );
}

function AlertCircle({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
    );
}
