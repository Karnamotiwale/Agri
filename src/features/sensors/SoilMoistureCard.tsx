import { useSensors } from '../../hooks/useSensors';
import { Droplets, Wifi, WifiOff } from 'lucide-react';

interface Props {
  farmId?: string;
}

// Moisture thresholds for visual feedback
function getMoistureStatus(val: number) {
  if (val < 300)  return { label: '🏜️ Very Dry',         color: '#EF4444', bg: '#FEF2F2', bar: '#EF4444' };
  if (val < 500)  return { label: '🔥 Dry — Irrigate',   color: '#F97316', bg: '#FFF7ED', bar: '#F97316' };
  if (val < 700)  return { label: '💧 Optimal',          color: '#2E7D32', bg: '#F0FAF0', bar: '#4CAF50' };
  return           { label: '🌊 Saturated',              color: '#1E40AF', bg: '#EFF6FF', bar: '#3B82F6' };
}

export default function SoilMoistureCard({ farmId }: Props) {
  const { data, loading, lastUpdated, error } = useSensors(farmId);

  const moisture = data?.soil_moisture ?? null;
  const status = moisture !== null ? getMoistureStatus(moisture) : null;
  // Raw sensor 0–1023 → percentage (approx)
  const pct = moisture !== null ? Math.min(100, Math.round((moisture / 1023) * 100)) : 0;

  return (
    <div
      className="agri-card flex-1 min-w-0"
      style={{ borderLeft: `4px solid ${status?.color ?? '#4CAF50'}` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: status?.bg ?? '#F0FAF0' }}>
            <Droplets className="w-4 h-4" style={{ color: status?.color ?? '#4CAF50' }} />
          </div>
          <span className="text-sm font-black" style={{ color: '#1B3A1B' }}>Soil Moisture</span>
        </div>
        {/* Live indicator */}
        {data
          ? <Wifi className="w-4 h-4 animate-pulse" style={{ color: '#4CAF50' }} />
          : <WifiOff className="w-4 h-4 text-gray-400" />
        }
      </div>

      {loading ? (
        <div className="h-16 flex items-center justify-center">
          <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#C7E76C', borderTopColor: 'transparent' }} />
        </div>
      ) : error && !data ? (
        <p className="text-xs text-gray-400 py-4 text-center">No sensor connected yet</p>
      ) : (
        <>
          {/* Value */}
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-3xl font-black" style={{ color: '#1B3A1B' }}>{moisture ?? '—'}</span>
            <span className="text-xs font-bold" style={{ color: '#9CA3AF' }}>raw</span>
            <span className="ml-auto text-lg font-black" style={{ color: status?.color }}>{pct}%</span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 rounded-full mb-3" style={{ background: '#F0FAF0' }}>
            <div
              className="h-2 rounded-full transition-all duration-700"
              style={{ width: `${pct}%`, background: status?.bar ?? '#4CAF50' }}
            />
          </div>

          {/* Status tag */}
          <span
            className="text-[11px] font-black px-2.5 py-1 rounded-full"
            style={{ background: status?.bg, color: status?.color }}
          >
            {status?.label}
          </span>
        </>
      )}

      {/* Last updated */}
      {lastUpdated && (
        <p className="text-[9px] font-bold mt-3" style={{ color: '#C7D4C7' }}>
          Updated {lastUpdated.toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}
