import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  ChevronDown,
  Calendar,
  Droplets,
  Sprout,
  FlaskConical,
  Eye,
  LayoutGrid,
  RefreshCw,
  Clock,
  Leaf,
  AlertCircle,
  Wifi
} from 'lucide-react';
import { BottomNav } from '../../components/layout/BottomNav';
import { supabase } from '../../lib/supabase';
import { useFarm } from '../../context/FarmContext';
import type { ActivityLog } from '../../services/activity.service';
import { activityService } from '../../services/activity.service';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatTime(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function getActivityIcon(type: string) {
  const t = (type || '').toLowerCase();
  if (t.includes('irrigat')) return <Droplets className="w-5 h-5" />;
  if (t.includes('fertili')) return <FlaskConical className="w-5 h-5" />;
  if (t.includes('plant')) return <Sprout className="w-5 h-5" />;
  if (t.includes('harvest')) return <Leaf className="w-5 h-5" />;
  return <Eye className="w-5 h-5" />;
}

function getActivityColor(type: string): { bg: string; icon: string; ring: string } {
  const t = (type || '').toLowerCase();
  if (t.includes('irrigat')) return { bg: 'bg-blue-50', icon: 'text-blue-600 bg-blue-100', ring: 'border-blue-100' };
  if (t.includes('fertili')) return { bg: 'bg-amber-50', icon: 'text-amber-600 bg-amber-100', ring: 'border-amber-100' };
  if (t.includes('plant')) return { bg: 'bg-green-50', icon: 'text-green-600 bg-green-100', ring: 'border-green-100' };
  if (t.includes('harvest')) return { bg: 'bg-orange-50', icon: 'text-orange-600 bg-orange-100', ring: 'border-orange-100' };
  return { bg: 'bg-purple-50', icon: 'text-purple-600 bg-purple-100', ring: 'border-purple-100' };
}

function getGrowthStageBadge(stage: string): string {
  const s = (stage || '').toLowerCase();
  if (s.includes('germin')) return 'bg-lime-100 text-lime-700 border border-lime-200';
  if (s.includes('vegetat')) return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
  if (s.includes('flower')) return 'bg-pink-100 text-pink-700 border border-pink-200';
  if (s.includes('fruit')) return 'bg-orange-100 text-orange-700 border border-orange-200';
  if (s.includes('harvest')) return 'bg-amber-100 text-amber-700 border border-amber-200';
  return 'bg-gray-100 text-gray-600 border border-gray-200';
}

// ─────────────────────────────────────────────────────────────────────────────
// Activity Card
// ─────────────────────────────────────────────────────────────────────────────

function ActivityCard({ log, farmName, isNew }: { log: ActivityLog; farmName?: string; isNew?: boolean }) {
  const c = getActivityColor(log.activity_type);
  const showGrowthBadge = log.growth_stage && log.growth_stage !== 'Unknown';

  return (
    <div
      className={`bg-white rounded-3xl overflow-hidden border transition-all active:scale-[0.99] ${
        isNew ? 'shadow-xl shadow-green-100 border-green-200 animate-pulse-once' : 'shadow-md shadow-gray-100 border-gray-100'
      }`}
    >
      {/* Header strip */}
      <div className={`${c.bg} px-5 py-4 flex items-center gap-3 border-b ${c.ring}`}>
        <div className={`p-2.5 rounded-2xl ${c.icon} flex-shrink-0`}>
          {getActivityIcon(log.activity_type)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-black text-gray-900 truncate">{log.activity_type || 'Activity'}</h3>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Clock className="w-3 h-3 text-gray-400" />
            <span className="text-xs text-gray-500 font-medium">
              {formatDate(log.created_at)} · {formatTime(log.created_at)}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          {showGrowthBadge && (
            <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full whitespace-nowrap ${getGrowthStageBadge(log.growth_stage)}`}>
              {log.growth_stage}
            </span>
          )}
          {farmName && (
            <span className="text-[10px] text-gray-400 font-semibold flex items-center gap-0.5">
              <MapPin className="w-2.5 h-2.5" />{farmName}
            </span>
          )}
        </div>
      </div>

      {/* Details grid */}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <LayoutGrid className="w-3 h-3 text-gray-300" />
          <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Detail Specifications</span>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          {log.operation && <Detail label="Operation" value={log.operation} />}
          {log.method && <Detail label="Method" value={log.method} />}
          {log.objective && <Detail label="Objective" value={log.objective} />}
          {log.water_source && <Detail label="Water Source" value={log.water_source} />}
          {log.weather_condition && log.weather_condition !== 'Unknown' && (
            <Detail label="Weather" value={log.weather_condition} />
          )}
          {log.notes && (
            <div className="col-span-2">
              <Detail label="Notes" value={log.notes} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{label}</p>
      <p className="text-xs font-bold text-gray-700 leading-tight">{value || '—'}</p>
    </div>
  );
}

function EmptyState({ farmName }: { farmName?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
      <div className="w-16 h-16 rounded-3xl bg-gray-50 flex items-center justify-center mb-4">
        <Calendar className="w-8 h-8 text-gray-300" />
      </div>
      <h3 className="text-base font-black text-gray-900 mb-2">No Activities Yet</h3>
      <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
        {farmName
          ? `Activities for "${farmName}" will appear here when you perform irrigation, fertilization, or monitoring operations.`
          : 'Select a farm to see its activities, or perform an operation to log the first activity.'}
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const FILTERS = ['All', 'Irrigation', 'Fertilization', 'Planting', 'Monitoring', 'Harvesting'];

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────

export default function ActivityLogsPage() {
  const navigate = useNavigate();

  // Use FarmContext as the single source of truth for farm data
  const { farms, selectedFarm, selectedFarmId, setSelectedFarmId } = useFarm();

  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [isRealtime, setIsRealtime] = useState(false);
  const [newLogIds, setNewLogIds] = useState<Set<string>>(new Set());
  const realtimeChannelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // ── Fetch activity logs from backend API ────────────────────────────────────
  const fetchLogs = useCallback(async (quiet = false) => {
    if (!quiet) setLoading(true);
    else setRefreshing(true);
    setError(null);

    try {
      const data = await activityService.getLogsByField(selectedFarmId);
      setLogs(data);
      setLastRefreshed(new Date());
    } catch {
      setError('Failed to load activity logs. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedFarmId]);

  // Fetch on mount + when farm changes
  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // ── Subscribe to Supabase Realtime on field_activities ─────────────────────
  useEffect(() => {
    // Remove old subscription
    if (realtimeChannelRef.current) {
      supabase.removeChannel(realtimeChannelRef.current);
    }

    const filterConfig = selectedFarmId
      ? { event: 'INSERT' as const, schema: 'public', table: 'field_activities', filter: `field_id=eq.${selectedFarmId}` }
      : { event: 'INSERT' as const, schema: 'public', table: 'field_activities' };

    const channel = supabase
      .channel(`activities-${selectedFarmId ?? 'all'}`)
      .on(
        'postgres_changes',
        filterConfig,
        (payload) => {
          console.log('[ActivityLogs] Realtime INSERT:', payload.new);
          const newLog = payload.new as ActivityLog;
          setLogs(prev => [newLog, ...prev].slice(0, 20)); // keep max 20, newest first
          setNewLogIds(prev => new Set([...prev, newLog.id]));
          // Clear "new" highlight after 3s
          setTimeout(() => {
            setNewLogIds(prev => {
              const next = new Set(prev);
              next.delete(newLog.id);
              return next;
            });
          }, 3000);
          setLastRefreshed(new Date());
          setIsRealtime(true);
        }
      )
      .subscribe((status) => {
        setIsRealtime(status === 'SUBSCRIBED');
        console.log('[ActivityLogs] Realtime status:', status);
      });

    realtimeChannelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedFarmId]);

  // Auto-refresh every 30s as backup
  useEffect(() => {
    const timer = setInterval(() => fetchLogs(true), 30_000);
    return () => clearInterval(timer);
  }, [fetchLogs]);

  // ── Filtering ───────────────────────────────────────────────────────────────
  const filteredLogs = activeFilter === 'All'
    ? logs
    : logs.filter(l => (l.activity_type || '').toLowerCase().includes(activeFilter.toLowerCase()));

  // ── Loading state ───────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFB] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-gray-400">Loading activities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFB] pb-28">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="px-5 pt-12 pb-5 flex items-center gap-3">
        <button
          onClick={() => navigate('/services')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-900" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-black text-gray-900">Activity Logs</h1>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-xs text-gray-400 font-medium">
              {lastRefreshed.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </p>
            {isRealtime && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-green-600">
                <Wifi className="w-3 h-3" /> Live
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => fetchLogs(true)}
          disabled={refreshing}
          className="p-2.5 bg-white rounded-2xl shadow-sm border border-gray-100 transition-all active:scale-95"
        >
          <RefreshCw
            className={`text-gray-600 ${refreshing ? 'animate-spin' : ''}`}
            style={{ width: 18, height: 18 }}
          />
        </button>
      </div>

      {/* ── Farm Selector (driven by FarmContext) ───────────────────────────── */}
      <div className="px-5 mb-5">
        <div className="relative inline-block w-full max-w-[240px]">
          <select
            value={selectedFarmId || ''}
            onChange={(e) => setSelectedFarmId(e.target.value || null)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          >
            <option value="">All Farms</option>
            {farms.map((farm) => (
              <option key={farm.id} value={farm.id}>{farm.farm_name}</option>
            ))}
          </select>
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl shadow-sm border border-gray-100 cursor-pointer w-full">
            <MapPin className="w-4 h-4 text-green-600 flex-shrink-0" />
            <span className="text-sm font-bold text-gray-900 truncate">
              {selectedFarm?.farm_name || 'All Farms'}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-400 ml-auto flex-shrink-0" />
          </div>
        </div>
      </div>

      {/* ── Filter Pills ────────────────────────────────────────────────────── */}
      <div className="px-5 mb-5 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        <div className="flex gap-2 w-max pb-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                activeFilter === f
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ── Error State ─────────────────────────────────────────────────────── */}
      {error && (
        <div className="mx-5 mb-4 p-4 bg-red-50 rounded-2xl border border-red-100 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-600 font-medium">{error}</p>
        </div>
      )}

      {/* ── Activity Count ──────────────────────────────────────────────────── */}
      {!error && (
        <div className="px-5 mb-3">
          <p className="text-xs text-gray-400 font-semibold">
            {filteredLogs.length} {activeFilter === 'All' ? 'total' : activeFilter.toLowerCase()}{' '}
            activit{filteredLogs.length !== 1 ? 'ies' : 'y'}
            {selectedFarm ? ` · ${selectedFarm.farm_name}` : ' · All Farms'}
          </p>
        </div>
      )}

      {/* ── Activity List ───────────────────────────────────────────────────── */}
      <div className="px-5 space-y-4">
        {filteredLogs.length === 0 ? (
          <EmptyState farmName={selectedFarm?.farm_name} />
        ) : (
          filteredLogs.map((log) => (
            <ActivityCard
              key={log.id}
              log={log}
              farmName={selectedFarm?.farm_name}
              isNew={newLogIds.has(log.id)}
            />
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
}
