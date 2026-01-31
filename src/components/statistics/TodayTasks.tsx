import React, { useEffect, useState } from 'react';
import { aiService, AIRecommendation } from '../../services/ai.service';
import { CheckCircle, Clock, AlertTriangle, Droplets, FlaskConical, Bug } from 'lucide-react';

interface Props {
    cropId: string;
    farmId?: string;
}

export function TodayTasks({ cropId, farmId }: Props) {
    const [decision, setDecision] = useState<any>(null);
    const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, [cropId, farmId]);

    const loadData = async () => {
        setLoading(true);
        setError(null);

        try {
            const [dec, recs] = await Promise.all([
                aiService.getDecision(cropId),
                farmId ? aiService.getRecommendations(farmId) : Promise.resolve([])
            ]);
            const filteredRecs = recs.filter(r => r.crop_id === cropId || r.crop_id === 'demo');
            setDecision(dec);
            setRecommendations(filteredRecs);
        } catch (err: any) {
            console.error('Failed to load tasks:', err);
            setError(err.message || 'Failed to load tasks');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="h-32 bg-gray-100 animate-pulse rounded-xl"></div>;

    if (error) {
        return (
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-800 font-bold">Failed to load tasks</p>
                <p className="text-sm text-red-600 mt-1">{error}</p>
                <button onClick={loadData} className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700">
                    Retry
                </button>
            </div>
        );
    }

    const tasks = [];

    if (decision) {
        tasks.push({
            name: `Irrigation: ${decision.decision}`,
            confidence: decision.confidence * 100,
            relevance: 'Now',
            icon: <Droplets className="w-5 h-5 text-blue-600" />,
            bgColor: 'bg-blue-50'
        });
    }

    recommendations.forEach(rec => {
        let icon = <Clock className="w-5 h-5 text-gray-600" />;
        let bgColor = 'bg-gray-50';

        if (rec.action === 'FERTILIZE') {
            icon = <FlaskConical className="w-5 h-5 text-purple-600" />;
            bgColor = 'bg-purple-50';
        } else if (rec.action === 'PEST_CONTROL') {
            icon = <Bug className="w-5 h-5 text-red-600" />;
            bgColor = 'bg-red-50';
        }

        tasks.push({
            name: rec.reasoning.split('.')[0], // Short name from reasoning
            confidence: rec.confidence * 100,
            relevance: rec.risk_level === 'High' ? 'Now' : 'Soon',
            icon,
            bgColor
        });
    });

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <span className="text-xl">📌</span>
                <h2 className="text-xl font-bold text-gray-900">Current Tasks & Actions</h2>
            </div>

            <div className="grid gap-4">
                {tasks.length > 0 ? tasks.map((task, i) => (
                    <div key={i} className={`flex items-center gap-4 p-4 rounded-xl border border-gray-100 ${task.bgColor}`}>
                        <div className="p-3 bg-white rounded-lg shadow-sm">
                            {task.icon}
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-gray-900">{task.name}</h3>
                            <div className="flex items-center gap-3 mt-1">
                                <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" /> {Math.round(task.confidence)}% Confidence
                                </span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${task.relevance === 'Now' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                                    }`}>
                                    {task.relevance}
                                </span>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <p className="text-gray-500 text-sm">No urgent tasks for today. Field is stable.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
