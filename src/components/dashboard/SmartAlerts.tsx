import { useEffect, useState, useCallback } from 'react';
import { api } from '../../services/api';
import { X, Bell, RefreshCw } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────
interface SmartAlert {
  id?: string;
  type: string;
  title: string;
  severity: 'warning' | 'critical';
  message: string;
  icon: string;
  value?: any;
  unit?: string;
}

// ── Colour helpers ─────────────────────────────────────────────────────────
const severityStyles: Record<string, { bg: string; border: string; pill: string; text: string }> = {
  critical: {
    bg:     'linear-gradient(135deg, #FFF0F0 0%, #FFE4E4 100%)',
    border: '#FF8080',
    pill:   '#FF4444',
    text:   '#CC0000',
  },
  warning: {
    bg:     'linear-gradient(135deg, #FFFBEB 0%, #FFF3CD 100%)',
    border: '#FFCA28',
    pill:   '#FF9800',
    text:   '#7A5000',
  },
};

const typeGradients: Record<string, string> = {
  water_low:  'linear-gradient(135deg, #E3F2FD, #BBDEFB)',
  water_high: 'linear-gradient(135deg, #E0F7FA, #B2EBF2)',
  npk_low:    'linear-gradient(135deg, #F1F8E9, #DCEDC8)',
  npk_high:   'linear-gradient(135deg, #FFF8E1, #FFE082)',
};

// ── Main Component ─────────────────────────────────────────────────────────
export default function SmartAlerts() {
  const [alerts, setAlerts]         = useState<SmartAlert[]>([]);
  const [dismissed, setDismissed]   = useState<Set<string>>(new Set());
  const [loading, setLoading]       = useState(false);
  const [visible, setVisible]       = useState<SmartAlert[]>([]);
  const [hasNewAlert, setHasNewAlert] = useState(false);

  // Generate mock demo alerts so the UI is visible even without live sensors
  const DEMO_ALERTS: SmartAlert[] = [
    {
      id: 'demo-1',
      type: 'water_low',
      title: 'Low Water 💧',
      severity: 'critical',
      message: '🚨🌵 Bhai, khet pyasa hai! Soil moisture sirf 22% hai — jaldi paani de nahi toh fasal ro degi! 💧😢',
      icon: '💧',
      value: 22,
      unit: '%',
    },
    {
      id: 'demo-2',
      type: 'npk_low',
      title: 'Low Nutrients 🌱',
      severity: 'warning',
      message: '😞🌱 Aye yaar! Fasal bhooki hai bhai — Nitrogen sirf 42 mg/kg. Thoda khad daal do, plant ko energy chahiye! 💊🌾',
      icon: '🌱',
      value: { N: 42, P: 18, K: 35 },
      unit: 'mg/kg',
    },
  ];

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    try {
      // Try live farm alert endpoint first
      const res = await api.get('/api/v1/alerts/latest?limit=5');
      const liveAlerts: SmartAlert[] = res.data || [];

      if (liveAlerts.length > 0) {
        setAlerts(liveAlerts);
      } else {
        // Fall back to demo alerts so developer can see the UI
        setAlerts(DEMO_ALERTS);
      }
    } catch {
      setAlerts(DEMO_ALERTS);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch + polling every 90s
  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 90_000);
    return () => clearInterval(interval);
  }, [fetchAlerts]);

  // Filter dismissed
  useEffect(() => {
    const vis = alerts.filter(a => !dismissed.has(a.id ?? a.type));
    setVisible(vis);
    if (vis.length > 0) setHasNewAlert(true);
  }, [alerts, dismissed]);

  const dismiss = (id: string) => setDismissed(prev => new Set([...prev, id]));

  if (visible.length === 0) return null;

  return (
    <div
      style={{
        padding: '0 16px',
        marginBottom: 16,
        animation: 'slideDown 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 32, height: 32,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #FF6B35, #FF3B30)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(255,59,48,0.4)',
              animation: hasNewAlert ? 'pulse 1.5s ease infinite' : 'none',
            }}
          >
            <Bell size={16} color="#fff" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 15, color: '#1B3A1B', letterSpacing: '-0.3px' }}>
            🤖 Smart Farm Alerts
          </span>
          <span style={{
            background: '#FF3B30', color: '#fff',
            borderRadius: 20, padding: '1px 8px', fontSize: 11, fontWeight: 700,
          }}>
            {visible.length}
          </span>
        </div>
        <button
          onClick={fetchAlerts}
          disabled={loading}
          style={{
            background: 'transparent', border: 'none', cursor: 'pointer', padding: 4,
            opacity: loading ? 0.5 : 1,
            animation: loading ? 'spin 1s linear infinite' : 'none',
          }}
        >
          <RefreshCw size={16} color="#4F6F52" />
        </button>
      </div>

      {/* Alert Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {visible.map((alert, idx) => {
          const styleSet = severityStyles[alert.severity] ?? severityStyles.warning;
          const cardBg   = typeGradients[alert.type] ?? styleSet.bg;
          const key      = alert.id ?? alert.type + idx;

          return (
            <div
              key={key}
              style={{
                background: cardBg,
                border: `1.5px solid ${styleSet.border}`,
                borderRadius: 20,
                padding: '14px 16px',
                display: 'flex',
                gap: 14,
                alignItems: 'flex-start',
                position: 'relative',
                boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
                animation: `bounceIn 0.5s cubic-bezier(0.34,1.56,0.64,1) ${idx * 0.08}s both`,
                overflow: 'hidden',
              }}
            >
              {/* Glow shimmer */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                background: `linear-gradient(90deg, transparent, ${styleSet.border}, transparent)`,
                borderRadius: '20px 20px 0 0',
              }} />

              {/* Big emoji */}
              <span style={{ fontSize: 36, lineHeight: 1, flexShrink: 0, marginTop: 2 }}>
                {alert.icon}
              </span>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <span style={{ fontWeight: 800, fontSize: 14, color: '#1B3A1B' }}>
                    {alert.title}
                  </span>
                  <span style={{
                    background: styleSet.pill, color: '#fff',
                    borderRadius: 10, padding: '1px 7px', fontSize: 10, fontWeight: 700,
                    textTransform: 'uppercase',
                  }}>
                    {alert.severity}
                  </span>
                </div>

                <p style={{
                  margin: 0,
                  fontSize: 13.5,
                  lineHeight: 1.55,
                  color: '#2D4A2D',
                  fontWeight: 500,
                  wordBreak: 'break-word',
                }}>
                  {alert.message}
                </p>

                {/* Value badge */}
                {alert.value !== undefined && (
                  <div style={{
                    marginTop: 8,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    background: 'rgba(255,255,255,0.7)',
                    border: `1px solid ${styleSet.border}`,
                    borderRadius: 10,
                    padding: '2px 10px',
                    fontSize: 12,
                    fontWeight: 700,
                    color: styleSet.text,
                  }}>
                    📊&nbsp;
                    {typeof alert.value === 'object'
                      ? `N:${alert.value.N ?? '—'} P:${alert.value.P ?? '—'} K:${alert.value.K ?? '—'} ${alert.unit ?? ''}`
                      : `${alert.value} ${alert.unit ?? ''}`}
                  </div>
                )}
              </div>

              {/* Dismiss button */}
              <button
                onClick={() => dismiss(key)}
                style={{
                  position: 'absolute', top: 10, right: 10,
                  background: 'rgba(0,0,0,0.08)', border: 'none',
                  borderRadius: '50%', width: 24, height: 24,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', flexShrink: 0,
                }}
              >
                <X size={13} color="#666" />
              </button>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounceIn {
          from { opacity: 0; transform: scale(0.85) translateY(-8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 4px 12px rgba(255,59,48,0.4); transform: scale(1); }
          50%       { box-shadow: 0 4px 20px rgba(255,59,48,0.7); transform: scale(1.1); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
