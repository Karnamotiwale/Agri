import React, { useState } from 'react';
import { aiService } from '../../services/ai.service';
import { Check, Clock, X, Loader2 } from 'lucide-react';

interface Props {
    cropId: string;
    actionId?: string;
}

export function ActionButtons({ cropId, actionId = 'current_decision' }: Props) {
    const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS'>('IDLE');
    const [choice, setChoice] = useState<string | null>(null);

    const handleAction = async (type: 'APPLY' | 'DELAY' | 'IGNORE') => {
        setStatus('LOADING');
        setChoice(type);
        try {
            await aiService.submitDecisionFeedback(cropId, actionId, type);
            setStatus('SUCCESS');
            // Reset after 3 seconds
            setTimeout(() => {
                setStatus('IDLE');
                setChoice(null);
            }, 3000);
        } catch (err) {
            console.error(err);
            setStatus('IDLE');
        }
    };

    if (status === 'SUCCESS') {
        return (
            <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-green-700 flex items-center justify-center gap-2 font-bold animate-in fade-in zoom-in duration-300">
                <Check className="w-5 h-5" /> Action Logged: {choice}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-3 gap-4">
            <button
                disabled={status === 'LOADING'}
                onClick={() => handleAction('APPLY')}
                className="flex flex-col items-center justify-center p-4 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-2xl shadow-lg shadow-green-200 transition-all active:scale-95"
            >
                {status === 'LOADING' && choice === 'APPLY' ? <Loader2 className="w-6 h-6 animate-spin mb-1" /> : <Check className="w-6 h-6 mb-1" />}
                <span className="text-sm font-bold">Apply</span>
            </button>

            <button
                disabled={status === 'LOADING'}
                onClick={() => handleAction('DELAY')}
                className="flex flex-col items-center justify-center p-4 bg-white border-2 border-orange-200 text-orange-600 hover:bg-orange-50 disabled:bg-gray-50 rounded-2xl transition-all active:scale-95"
            >
                {status === 'LOADING' && choice === 'DELAY' ? <Loader2 className="w-6 h-6 animate-spin mb-1" /> : <Clock className="w-6 h-6 mb-1" />}
                <span className="text-sm font-bold">Delay</span>
            </button>

            <button
                disabled={status === 'LOADING'}
                onClick={() => handleAction('IGNORE')}
                className="flex flex-col items-center justify-center p-4 bg-white border-2 border-red-100 text-red-500 hover:bg-red-50 disabled:bg-gray-50 rounded-2xl transition-all active:scale-95"
            >
                {status === 'LOADING' && choice === 'IGNORE' ? <Loader2 className="w-6 h-6 animate-spin mb-1" /> : <X className="w-6 h-6 mb-1" />}
                <span className="text-sm font-bold">Ignore</span>
            </button>
        </div>
    );
}
