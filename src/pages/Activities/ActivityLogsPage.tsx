import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  ChevronDown, 
  Calendar, 
  Settings, 
  Info,
  Clock,
  LayoutGrid
} from 'lucide-react';
import { BottomNav } from '../../components/layout/BottomNav';
import { activityService, ActivityLog } from '../../services/activity.service';

export default function ActivityLogsPage() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLogs() {
      const data = await activityService.getAllLogs();
      setLogs(data);
      setLoading(false);
    }
    loadLogs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFB] pb-24">
      {/* Header */}
      <div className="px-6 pt-12 pb-4 flex items-center gap-4">
        <button 
          onClick={() => navigate('/services')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-900" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Activity Logs</h1>
      </div>

      {/* Location Selector */}
      <div className="px-6 mb-8">
        <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100">
          <MapPin className="w-4 h-4 text-gray-900" />
          <span className="text-sm font-bold text-gray-900">hehehe, hahaha</span>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </div>
      </div>

      <div className="px-4 space-y-6">
        {logs.map((log) => (
          <div key={log.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl shadow-gray-200/50 border border-gray-100 transition-all active:scale-[0.98]">
            {/* Part 1: General Info */}
            <div className="p-8 pb-6 border-b border-dashed border-gray-100">
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gray-50 rounded-2xl">
                     <Calendar className="w-6 h-6 text-gray-900" />
                  </div>
                  <div>
                     <h3 className="text-lg font-black text-gray-900">{log.general.activityType}</h3>
                     <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{log.general.date}</p>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-y-6">
                  <InfoItem label="Rotation" value={log.general.rotationAtDate} />
                  <InfoItem label="Sowing Date" value={log.general.sowingDate} />
                  <InfoItem label="Harvest Date" value={log.general.harvestDate} />
                  <InfoItem label="Status" value="Completed" highlight />
               </div>
            </div>

            {/* Part 2: Details */}
            <div className="p-8 pt-6 bg-gray-50/30">
               <div className="flex items-center gap-3 mb-6">
                  <LayoutGrid className="w-4 h-4 text-gray-400" />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Detail Specifications</span>
               </div>
               
               <div className="grid grid-cols-2 gap-y-6">
                  <DetailItem label="Weather" value={log.details.weatherStatus} />
                  <DetailItem label="Method" value={log.details.method} />
                  <DetailItem label="Objective" value={log.details.objective} />
                  <DetailItem label="Water Src" value={log.details.waterSource} />
                  <DetailItem label="Operation" value={log.details.operation} fullWidth />
               </div>
            </div>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}

function InfoItem({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-sm font-black ${highlight ? 'text-green-600' : 'text-gray-900'}`}>{value}</p>
    </div>
  );
}

function DetailItem({ label, value, fullWidth }: { label: string; value: string; fullWidth?: boolean }) {
  return (
    <div className={fullWidth ? 'col-span-2' : ''}>
      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-xs font-bold text-gray-700 leading-tight">{value}</p>
    </div>
  );
}
