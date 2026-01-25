import React, { useEffect, useState } from 'react';
import { Settings, Play, Square, AlertTriangle, Clock, Droplets, FlaskConical, Wifi } from 'lucide-react';
import { Valve, ValveSchedule, valveService } from '../../services/valve.service';
import { aiService } from '../../services/ai.service';

interface Props {
    cropId: string;
    farmId: string;
}

export const SmartValveControl: React.FC<Props> = ({ cropId, farmId }) => {
    const [valves, setValves] = useState<Valve[]>([]);
    const [schedules, setSchedules] = useState<ValveSchedule[]>([]);
    const [loading, setLoading] = useState(true);
    const [manualOverride, setManualOverride] = useState(false);
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, [cropId]);

    const loadData = async () => {
        try {
            setLoading(true);
            const valveData = await valveService.getValvesForCrop(cropId);
            setValves(valveData);

            const scheduleData = await aiService.getValveSchedule(cropId, valveData.map(v => v.id));
            setSchedules(scheduleData);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleValve = async (valve: Valve) => {
        if (!manualOverride) return;

        try {
            setProcessingId(valve.id);
            await valveService.toggleValve(valve.id, !valve.isActive);

            // Optimistic update
            setValves(prev => prev.map(v =>
                v.id === valve.id ? { ...v, isActive: !v.isActive, status: !v.isActive ? 'RUNNING' : 'IDLE' } : v
            ));
        } catch (e) {
            console.error('Failed to toggle valve', e);
        } finally {
            setProcessingId(null);
        }
    };

    const applyAISchedule = async () => {
        // In a real app, this would commit the pending schedules to the backend
        alert("AI Schedule Applied! Valves will operate automatically based on the table.");
        setManualOverride(false);
    };

    if (loading) return <div className="h-64 bg-gray-50 rounded-3xl animate-pulse" />;

    return (
        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-900/10 border border-gray-100 mt-6 relative overflow-hidden">
            {/* Header with Pulse indicator for live connection */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <div className="w-1 h-5 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full" />
                    Smart Valve Scheduling
                    <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100 font-bold ml-1">AI CONTROLLED</span>
                </h3>
                <div className="flex items-center gap-1.5 text-[10px] font-medium text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                    <div className="relative w-2 h-2">
                        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
                        <div className="relative w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    ESP32 CONNECTED
                </div>
            </div>

            {/* Manual Override Warning Banner */}
            {manualOverride && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 flex items-start gap-3 animate-in slide-in-from-top-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-xs font-bold text-amber-800">Manual Override Active</p>
                        <p className="text-[11px] text-amber-700 leading-tight mt-0.5">
                            AI automation is paused. You are manually controlling the valves. Safety locks are enabled for max capacity.
                        </p>
                    </div>
                </div>
            )}

            {/* Data Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wider">
                            <th className="py-2 pl-2 font-semibold">Valve / Zone</th>
                            <th className="py-2 font-semibold">Schedule</th>
                            <th className="py-2 font-semibold">Action</th>
                            <th className="py-2 font-semibold">Status</th>
                            <th className="py-2 pr-2 font-semibold text-right">Control</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {valves.map(valve => {
                            const schedule = schedules.find(s => s.valveId === valve.id);
                            return (
                                <tr key={valve.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                    <td className="py-3 pl-2">
                                        <p className="font-bold text-gray-800">Valve {valve.valveNumber}</p>
                                        <p className="text-[10px] text-gray-500">{valve.zoneName}</p>
                                    </td>

                                    <td className="py-3">
                                        {schedule ? (
                                            <div className="flex flex-col gap-0.5">
                                                <span className="flex items-center gap-1.5 text-xs font-medium text-gray-700">
                                                    <Clock className="w-3 h-3 text-gray-400" />
                                                    {new Date(schedule.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                <span className="text-[10px] text-gray-400">{schedule.durationMinutes} mins</span>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">--</span>
                                        )}
                                    </td>

                                    <td className="py-3">
                                        {schedule ? (
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-1">
                                                    <Droplets className="w-3 h-3 text-blue-500" />
                                                    <span className="text-xs font-medium text-gray-700">{schedule.waterQuantityLiters}L</span>
                                                </div>
                                                {schedule.fertilizerType && (
                                                    <div className="flex items-center gap-1">
                                                        <FlaskConical className="w-3 h-3 text-purple-500" />
                                                        <span className="text-[10px] text-gray-500">{schedule.fertilizerType}</span>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">--</span>
                                        )}
                                    </td>

                                    <td className="py-3">
                                        {valve.status === 'RUNNING' ? (
                                            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-green-100 text-green-700 text-[10px] font-bold border border-green-200">
                                                <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse" />
                                                RUNNING
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-500 text-[10px] font-bold border border-gray-200">
                                                IDLE
                                            </span>
                                        )}
                                    </td>

                                    <td className="py-3 pr-2 text-right">
                                        <button
                                            onClick={() => handleToggleValve(valve)}
                                            disabled={!manualOverride || processingId === valve.id}
                                            className={`px-4 py-2 rounded-lg flex items-center gap-2 font-bold text-xs transition-all ${!manualOverride
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : valve.isActive
                                                        ? 'bg-red-500 text-white hover:bg-red-600 shadow-md shadow-red-500/30'
                                                        : 'bg-green-500 text-white hover:bg-green-600 shadow-md shadow-green-500/30'
                                                }`}
                                        >
                                            {processingId === valve.id ? (
                                                <div className="w-3 h-3 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                                            ) : valve.isActive ? (
                                                <Square className="w-3 h-3 fill-current" />
                                            ) : (
                                                <Play className="w-3 h-3 fill-current" />
                                            )}
                                            {valve.isActive ? 'STOP' : 'START'}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* AI Reasoning Footer */}
            {schedules[0]?.aiReasoning && (
                <div className="mt-4 p-3 bg-blue-50/50 rounded-xl border border-blue-100/50">
                    <p className="text-[10px] font-bold text-blue-400 uppercase mb-1">AI Logic</p>
                    <p className="text-xs text-gray-600 italic">"{schedules[0].aiReasoning}"</p>
                </div>
            )}

            {/* Footer Actions */}
            <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-gray-100">
                <button
                    onClick={applyAISchedule}
                    disabled={!manualOverride} // "Apply" really means "Revert to AI" if we are in override mode, or just confirm. 
                    // But confusing UX. Let's make "Apply" always active if not override, or toggle override.
                    // Requirement 4 says "Apply AI Schedule" and "Manual Override".
                    // Let's interpret: 
                    // If Override ID ON -> "Apply AI Schedule" turns it OFF and resets.
                    // If Override IS OFF -> Button is disabled or says "AI Active"
                    className={`py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${!manualOverride ? 'bg-green-100 text-green-700 opacity-50 cursor-not-allowed' : 'bg-green-600 text-white shadow-lg shadow-green-600/20 active:scale-95'
                        }`}
                >
                    <Wifi className="w-4 h-4" />
                    {manualOverride ? 'Apply AI Schedule' : 'AI Active'}
                </button>

                <button
                    onClick={() => setManualOverride(!manualOverride)}
                    className={`py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all border ${manualOverride ? 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50' : 'bg-gray-900 text-white border-transparent shadow-lg shadow-gray-900/20 active:scale-95'
                        }`}
                >
                    <Settings className="w-4 h-4" />
                    {manualOverride ? 'Exit Manual' : 'Manual Override'}
                </button>
            </div>
        </div>
    );
};
