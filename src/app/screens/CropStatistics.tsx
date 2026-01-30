import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '../components/Header';
import { useApp, Crop } from '../../context/AppContext';
import { cropService } from '../../services/crop.service';
import { Loader2 } from 'lucide-react';

// New Modular Components
import { TodayTasks } from '../../components/statistics/TodayTasks';
import { AdvisoryCards } from '../../components/statistics/AdvisoryCards';
import { ActionButtons } from '../../components/statistics/ActionButtons';
import { CropTraceGraphs } from '../../components/statistics/CropTraceGraphs';
import { CropIntelligence } from '../../components/statistics/CropIntelligence';
import { MarketInsights } from '../../components/statistics/MarketInsights';
import { FinancialSummary } from '../../components/statistics/FinancialSummary';

export function CropStatistics() {
    const navigate = useNavigate();
    const { id: cropId } = useParams();
    const { crops } = useApp();
    const [journeyData, setJourneyData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);

    // AUTO-REFRESH RULE: Refresh every 10 minutes
    useEffect(() => {
        const interval = setInterval(() => {
            console.log("Background Refresh: Syncing crop statistics...");
            setRefreshKey(prev => prev + 1);
        }, 10 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const crop = crops.find((c: Crop) => c.id === cropId);

    useEffect(() => {
        if (cropId) {
            loadContext();
        }
    }, [cropId]);

    const loadContext = async () => {
        try {
            const data = await cropService.getCropJourney(cropId!);
            setJourneyData(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!cropId || !crop) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
                <Header title="Status" showBack onBackClick={() => navigate('/dashboard')} />
                <div className="flex-1 flex flex-col items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-green-600 mb-4" />
                    <p className="text-gray-500">Connecting to crop intelligence...</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <Header title="Crop Intelligence" showBack onBackClick={() => navigate('/dashboard')} />

            <div className="px-6 py-6 pb-8 space-y-12">

                {/* 1. CURRENT TASKS & ACTIONS (TOP PRIORITY) */}
                <TodayTasks key={`tasks-${refreshKey}`} cropId={cropId} farmId={crop.farmId} />

                {/* 2. AI ADVISORY PANEL */}
                <AdvisoryCards key={`adv-${refreshKey}`} cropId={cropId} />

                {/* 3. ACTION BUTTONS */}
                <ActionButtons key={`btns-${refreshKey}`} cropId={cropId} />

                <hr className="border-gray-200" />

                {/* 4. CROP JOURNEY & FIELD TRENDS */}
                <CropTraceGraphs key={`trace-${refreshKey}`} cropId={cropId} />

                {/* 5, 6, 7. CROP INTELLIGENCE, ENVIRONMENT, PRODUCTION */}
                <CropIntelligence key={`intl-${refreshKey}`} crop={crop} journeyData={journeyData} />

                {/* 8. HARVEST & POST-HARVEST INSIGHTS */}
                <MarketInsights key={`market-${refreshKey}`} cropId={cropId} />

                {/* 9. FINANCIAL & RECORD KEEPING */}
                <FinancialSummary key={`fin-${refreshKey}`} cropId={cropId} />

                <div className="py-8 text-center">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
                        UX4G Compliant • AI-Driven Dashboard
                    </p>
                </div>
            </div>
        </div>
    );
}
