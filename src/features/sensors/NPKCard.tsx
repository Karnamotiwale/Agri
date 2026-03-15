import { useSensors } from '../../hooks/useSensors';
import { Leaf } from 'lucide-react';

interface Props {
  farmId?: string;
}

// Optimal NPK ranges (mg/kg soil)
const OPTIMAL = {
  nitrogen:   { min: 15, max: 40, unit: 'mg/kg' },
  phosphorus: { min: 10, max: 30, unit: 'mg/kg' },
  potassium:  { min: 15, max: 40, unit: 'mg/kg' },
};

function getNPKStatus(val: number, key: keyof typeof OPTIMAL) {
  const { min, max } = OPTIMAL[key];
  if (val < min)  return { label: '📉 Low',     color: '#F97316', bg: '#FFF7ED' };
  if (val > max)  return { label: '📈 High',    color: '#1E40AF', bg: '#EFF6FF' };
  return           { label: '✅ Optimal',       color: '#2E7D32', bg: '#F0FAF0' };
}

function NPKBar({ label, value, nutrientKey, color }: { label: string; value: number | null; nutrientKey: keyof typeof OPTIMAL; color: string }) {
  const max = OPTIMAL[nutrientKey].max * 1.5; // scale bar to 150% of optimal max
  const pct = value !== null ? Math.min(100, Math.round((value / max) * 100)) : 0;
  const status = value !== null ? getNPKStatus(value, nutrientKey) : null;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold" style={{ color: '#4F6F52' }}>{label}</span>
        <div className="flex items-center gap-2">
          {status && (
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{ background: status.bg, color: status.color }}>
              {status.label}
            </span>
          )}
          <span className="text-sm font-black" style={{ color: '#1B3A1B' }}>
            {value !== null ? `${value}` : '—'}
            <span className="text-[9px] font-bold ml-0.5" style={{ color: '#9CA3AF' }}>mg/kg</span>
          </span>
        </div>
      </div>
      <div className="w-full h-2 rounded-full" style={{ background: '#F0FAF0' }}>
        <div
          className="h-2 rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

export default function NPKCard({ farmId }: Props) {
  const { data, loading, lastUpdated, error } = useSensors(farmId);

  return (
    <div className="agri-card" style={{ borderLeft: '4px solid #C7E76C' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#F0FAF0' }}>
            <Leaf className="w-4 h-4" style={{ color: '#2E7D32' }} />
          </div>
          <span className="text-sm font-black" style={{ color: '#1B3A1B' }}>NPK Sensor</span>
        </div>
        <span className="text-[10px] font-black px-2 py-1 rounded-full animate-pulse" style={{ background: '#E6F4EA', color: '#2E7D32' }}>
          RS485 Modbus
        </span>
      </div>

      {loading ? (
        <div className="h-20 flex items-center justify-center">
          <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#C7E76C', borderTopColor: 'transparent' }} />
        </div>
      ) : error && !data ? (
        <p className="text-xs text-gray-400 py-6 text-center">No NPK sensor connected yet</p>
      ) : (
        <div className="space-y-4">
          <NPKBar label="Nitrogen (N)"   value={data?.nitrogen   ?? null} nutrientKey="nitrogen"   color="#4CAF50" />
          <NPKBar label="Phosphorus (P)" value={data?.phosphorus ?? null} nutrientKey="phosphorus" color="#F6C945" />
          <NPKBar label="Potassium (K)"  value={data?.potassium  ?? null} nutrientKey="potassium"  color="#FF7043" />
        </div>
      )}

      {/* Last updated */}
      {lastUpdated && (
        <p className="text-[9px] font-bold mt-4" style={{ color: '#C7D4C7' }}>
          Live · Updated {lastUpdated.toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}
