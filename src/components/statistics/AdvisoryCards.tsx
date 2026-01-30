import React, { useEffect, useState } from 'react';
import { aiAdvisoryService, CropAdvisory } from '../../services/ai.service';
import { Info, AlertCircle, Droplets, FlaskConical, Bug, ChevronRight } from 'lucide-react';

interface Props {
    cropId: string;
}

export function AdvisoryCards({ cropId }: Props) {
    const [advisory, setAdvisory] = useState<CropAdvisory | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [cropId]);

    const loadData = async () => {
        const cacheKey = `advisory_${cropId}`;
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
            setAdvisory(JSON.parse(cached));
            setLoading(false);
        }

        try {
            const data = await aiAdvisoryService.getDetailedAdvisory(cropId);
            setAdvisory(data);
            localStorage.setItem(cacheKey, JSON.stringify(data));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="h-64 bg-gray-100 animate-pulse rounded-xl"></div>;
    if (!advisory) return null;

    const cards = [];

    // 1. Fertilizer Advisory
    if (advisory.fertilizer.recommended) {
        cards.push({
            title: 'Fertilizer Advisory',
            icon: <FlaskConical className="w-5 h-5 text-purple-600" />,
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-100',
            content: (
                <div className="space-y-2">
                    <p className="text-sm font-bold text-gray-800">{advisory.fertilizer.productName} ({advisory.fertilizer.type})</p>
                    <div className="flex justify-between text-xs text-gray-600">
                        <span>Dosage: {advisory.fertilizer.dosage}</span>
                        <span>Stage: {advisory.fertilizer.timing}</span>
                    </div>
                </div>
            )
        });
    }

    // 2. Pest Advisory
    if (advisory.pesticide.detected) {
        cards.push({
            title: 'Pest & Disease Advisory',
            icon: <Bug className="w-5 h-5 text-red-600" />,
            bgColor: 'bg-red-50',
            borderColor: 'border-red-100',
            content: (
                <div className="space-y-2">
                    <p className="text-sm font-bold text-gray-800">Risk: {advisory.pesticide.riskLevel}</p>
                    <p className="text-xs text-gray-600">Target: {advisory.pesticide.target}</p>
                    <p className="text-[10px] text-gray-500 italic">Action: {advisory.pesticide.productName}</p>
                </div>
            )
        });
    }

    // 3. Irrigation Advisory (Using decision reasoning if detailed isn't available, or mock if needed)
    cards.push({
        title: 'Irrigation Advisory',
        icon: <Droplets className="w-5 h-5 text-blue-600" />,
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-100',
        content: (
            <div className="space-y-2">
                <p className="text-sm font-bold text-gray-800">Optimal Schedule</p>
                <div className="flex justify-between text-xs text-gray-600">
                    <span>Quantity: 1200L</span>
                    <span>Risk: Low if followed</span>
                </div>
            </div>
        )
    });

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <span className="text-xl">🤖</span>
                <h2 className="text-xl font-bold text-gray-900">AI Advisory & Recommendations</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
                {cards.map((card, i) => (
                    <div key={i} className={`p-4 rounded-2xl border ${card.borderColor} ${card.bgColor} flex flex-col h-full`}>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                {card.icon}
                            </div>
                            <h3 className="text-sm font-bold text-gray-900">{card.title}</h3>
                        </div>

                        <div className="flex-1">
                            {card.content}
                        </div>

                        <div className="mt-4 pt-3 border-t border-black/5">
                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                                <Info className="w-3 h-3" /> WHY AI RECOMMENDED THIS
                            </h4>
                            <p className="text-[11px] text-gray-600 leading-tight">
                                {advisory.explainability.reason}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
