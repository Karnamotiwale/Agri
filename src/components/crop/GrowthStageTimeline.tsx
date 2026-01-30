import React, { useEffect, useState } from 'react';
import { cropService } from '../../services/crop.service';
import { Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface Props {
    cropId: string;
}

export function GrowthStageTimeline({ cropId }: Props) {
    const { getCrop } = useApp();
    const crop = getCrop(cropId);
    const [stageData, setStageData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStages();
    }, [cropId, crop?.sowingDate]);

    const loadStages = async () => {
        try {
            let daysSinceSowing = 0;
            if (crop?.sowingDate) {
                const sDate = new Date(crop.sowingDate);
                const now = new Date();
                daysSinceSowing = Math.max(0, Math.floor((now.getTime() - sDate.getTime()) / (1000 * 60 * 60 * 24)));
            }

            const data = await cropService.getGrowthStages(cropId, daysSinceSowing);
            setStageData(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getIconForStage = (cropType: string, stageName: string) => {
        const icons: any = {
            rice: { Nursery: '🌱', Transplanting: '🚜', Tillering: '🌿', Flowering: '🌸', Maturity: '🌾' },
            wheat: { Germination: '🌱', Tillering: '🌿', CRI: '🧪', Flowering: '🌸', Maturity: '🌾' },
            maize: { Emergence: '🌱', Vegetative: '🌿', Tasseling: '🌽', 'Grain filling': '🌽', Harvest: '🚜' },
            sugarcane: { Germination: '🌱', Tillering: '🌿', 'Grand growth': '🎋', Maturity: '🎋' },
            pulses: { Germination: '🌱', Vegetative: '🌿', Flowering: '🌸', 'Pod filling': '🫘', Harvest: '🚜' }
        };
        return icons[cropType.toLowerCase()]?.[stageName] || '🌱';
    };

    if (loading) return <div className="h-24 bg-gray-100 animate-pulse rounded-2xl mx-6"></div>;
    if (!stageData) return null;

    return (
        <div className="px-6 space-y-4">
            <div className="flex items-center gap-2">
                <span className="text-xl">🌱</span>
                <h2 className="text-xl font-bold text-gray-900">Crop Growth Progress</h2>
            </div>

            <div className="relative flex justify-between items-start pt-4 pb-8 overflow-x-auto no-scrollbar">
                {/* Connector Line */}
                <div className="absolute top-8 left-4 right-4 h-0.5 bg-gray-100 -z-10" />
                <div
                    className="absolute top-8 left-4 h-0.5 bg-green-500 -z-10 transition-all duration-1000"
                    style={{ width: `${(stageData.stages.findIndex((s: any) => s.status === 'active') / (stageData.stages.length - 1)) * 100}%` }}
                />

                {stageData.stages.map((stage: any, i: number) => (
                    <div key={i} className="flex flex-col items-center min-w-[64px] relative">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm border-2 transition-all ${stage.status === 'completed' ? 'bg-green-500 border-green-500 text-white' :
                            stage.status === 'active' ? 'bg-white border-green-500 text-2xl scale-125 z-10 shadow-green-100' :
                                'bg-gray-50 border-gray-200 text-gray-400 grayscale'
                            }`}>
                            {stage.status === 'completed' ? <Check className="w-5 h-5" /> : getIconForStage(crop?.cropType || 'wheat', stage.name)}
                        </div>
                        <span className={`text-[9px] font-bold mt-3 uppercase tracking-tight text-center ${stage.status === 'active' ? 'text-green-700' : 'text-gray-400'
                            }`}>
                            {stage.name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
