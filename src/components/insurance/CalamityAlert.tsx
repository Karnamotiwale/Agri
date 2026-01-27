import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface CalamityAlertProps {
    calamities: string[];
    onDismiss: () => void;
}

export function CalamityAlert({ calamities, onDismiss }: CalamityAlertProps) {
    if (calamities.length === 0) return null;

    return (
        <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-4 mb-6 shadow-xl shadow-red-900/20 animate-pulse">
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-white font-bold text-lg mb-1">⚠️ Calamity Alert</h3>
                        <p className="text-white/90 text-sm mb-3">
                            {calamities.length === 1
                                ? `${calamities[0]} detected in your area.`
                                : `Multiple risks detected: ${calamities.join(', ')}.`}
                        </p>
                        <p className="text-white text-xs font-medium">
                            🛡️ Emergency insurance coverage recommended. Check policies below.
                        </p>
                    </div>
                </div>
                <button
                    onClick={onDismiss}
                    className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors flex-shrink-0"
                >
                    <X className="w-5 h-5 text-white" />
                </button>
            </div>
        </div>
    );
}
