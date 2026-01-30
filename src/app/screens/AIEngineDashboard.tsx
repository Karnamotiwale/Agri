import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Cpu, Activity, Home, MapPin,
    BarChart2, Landmark
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function AIEngineDashboard() {
    const navigate = useNavigate();
    const { t } = useTranslation();


    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-5 sticky top-0 z-10 shadow-sm">
                <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Cpu className="w-6 h-6 text-purple-600" />
                    {t('ai.title')}
                </h1>
                <p className="text-xs text-gray-500 mt-1">{t('ai.subtitle')}</p>
            </div>

            <div className="p-6 space-y-6">
                {/* Content Removed */}
            </div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200/80 px-4 py-3 z-[100] shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                <div className="flex justify-around max-w-lg mx-auto overflow-x-auto no-scrollbar">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex flex-col items-center min-w-[3.5rem] gap-1 px-1 py-1.5 rounded-xl transition-all duration-200 hover:bg-green-50/50 active:scale-95"
                    >
                        <Home className="w-6 h-6 text-gray-400" />
                        <span className="text-[10px] font-medium text-gray-500">Home</span>
                    </button>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex flex-col items-center min-w-[3.5rem] gap-1 px-1 py-1.5 rounded-xl transition-all duration-200 hover:bg-green-50/50 active:scale-95"
                    >
                        <BarChart2 className="w-6 h-6 text-gray-400" />
                        <span className="text-[10px] font-medium text-gray-500">Analytics</span>
                    </button>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex flex-col items-center min-w-[3.5rem] gap-1 px-1 py-1.5 rounded-xl transition-all duration-200 hover:bg-green-50/50 active:scale-95"
                    >
                        <Landmark className="w-6 h-6 text-gray-400" />
                        <span className="text-[10px] font-medium text-gray-500">Schemes</span>
                    </button>
                    <button
                        onClick={() => navigate('/sensor-guide')}
                        className="flex flex-col items-center min-w-[3.5rem] gap-1 px-1 py-1.5 rounded-xl transition-all duration-200 hover:bg-green-50/50 active:scale-95"
                    >
                        <Activity className="w-6 h-6 text-gray-400" />
                        <span className="text-[10px] font-medium text-gray-500">Sensors</span>
                    </button>
                    <button
                        onClick={() => navigate('/my-farm')}
                        className="flex flex-col items-center min-w-[3.5rem] gap-1 px-1 py-1.5 rounded-xl transition-all duration-200 hover:bg-green-50/50 active:scale-95"
                    >
                        <MapPin className="w-6 h-6 text-gray-400" />
                        <span className="text-[10px] font-medium text-gray-500">Crops</span>
                    </button>

                    {/* AI Engine Tab (Active) */}
                    <button
                        className="flex flex-col items-center min-w-[3.5rem] gap-1 px-1 py-1.5 rounded-xl transition-all duration-200 bg-purple-50"
                    >
                        <Cpu className="w-6 h-6 text-purple-600" />
                        <span className="text-[10px] font-medium text-purple-600 whitespace-nowrap">AI Engine</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
