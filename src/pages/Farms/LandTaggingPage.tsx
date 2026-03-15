/**
 * LandTaggingPage.tsx
 * ====================================================
 * Full farm land registration page with:
 *  ✅ GPS-based map centering
 *  ✅ Click-to-place farm marker
 *  ✅ Polygon drawing for field boundary
 *  ✅ Reverse geocoding via Nominatim
 *  ✅ Save to backend (Supabase + local fallback)
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Save, ChevronLeft, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { FarmMap } from '../../components/maps/FarmMap';
import { farmService } from '../../services/farm.service';
import { BottomNav } from '../../components/layout/BottomNav';

// ─── State types ─────────────────────────────────────────────────────────────
interface LocationState {
  lat: number | null;
  lng: number | null;
  address: string;
}

type SaveStatus = 'idle' | 'saving' | 'success' | 'error';

// ─────────────────────────────────────────────────────────────────────────────
export default function LandTaggingPage() {
  const navigate = useNavigate();

  const [farmName, setFarmName]       = useState('');
  const [location, setLocation]       = useState<LocationState>({ lat: null, lng: null, address: '' });
  const [polygon, setPolygon]         = useState<GeoJSON.Polygon | null>(null);
  const [saveStatus, setSaveStatus]   = useState<SaveStatus>('idle');
  const [errorMsg, setErrorMsg]       = useState('');

  const isReadyToSave = farmName.trim().length > 0 && location.lat !== null;

  // ── Handler: location picked from map ──────────────────────────────────
  const handleLocationChange = (lat: number, lng: number, address?: string) => {
    setLocation({ lat, lng, address: address || `${lat.toFixed(5)}, ${lng.toFixed(5)}` });
  };

  // ── Handler: polygon drawn ──────────────────────────────────────────────
  const handlePolygonChange = (geo: GeoJSON.Polygon | null) => {
    setPolygon(geo);
  };

  // ── Save farm to database ───────────────────────────────────────────────
  const handleSave = async () => {
    if (!isReadyToSave || location.lat === null || location.lng === null) return;
    setSaveStatus('saving');
    setErrorMsg('');

    try {
      await farmService.saveFarmLocation({
        farm_name: farmName.trim(),
        latitude: location.lat,
        longitude: location.lng,
        address: location.address,
        boundary_geojson: polygon,
      });
      setSaveStatus('success');
      setTimeout(() => navigate('/farms'), 1800);
    } catch (err: any) {
      setSaveStatus('error');
      setErrorMsg(err?.message || 'Failed to save farm. Please try again.');
    }
  };

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: 'var(--background, #F0F7F0)', paddingBottom: 100 }}>

      {/* ── Header ── */}
      <div style={{
        background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #388E3C 100%)',
        padding: '48px 20px 28px',
        borderRadius: '0 0 2rem 2rem',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            borderRadius: '50%',
            width: 40, height: 40,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0,
          }}
        >
          <ChevronLeft size={22} color="#fff" />
        </button>
        <div>
          <h1 style={{ margin: 0, color: '#fff', fontSize: 22, fontWeight: 900, letterSpacing: '-0.5px' }}>
            🗺️ Tag Your Farm Land
          </h1>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 3 }}>
            Mark your field on the map to register it
          </p>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Farm Name Input Card */}
        <div style={card}>
          <label style={label}>
            <MapPin size={15} color="#4CAF50" style={{ flexShrink: 0 }} />
            Farm Name
          </label>
          <input
            type="text"
            placeholder="e.g. Main Wheat Field, North Block..."
            value={farmName}
            onChange={(e) => setFarmName(e.target.value)}
            style={input}
          />
        </div>

        {/* Map Card */}
        <div style={card}>
          <p style={{ ...label, marginBottom: 12 }}>
            <span>📍</span> Click map to place marker · Draw boundary with polygon tool
          </p>
          <FarmMap
            height={450}
            onLocationChange={handleLocationChange}
            onPolygonChange={handlePolygonChange}
          />
        </div>

        {/* Location Summary Card */}
        {(location.lat !== null || polygon) && (
          <div style={{ ...card, background: 'linear-gradient(135deg, #E8F5E9, #F1F8E9)', border: '1.5px solid #A5D6A7' }}>
            <p style={{ margin: 0, fontWeight: 800, fontSize: 14, color: '#1B5E20', marginBottom: 8 }}>
              ✅ Location Captured
            </p>
            {location.lat !== null && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: 13, color: '#2E7D32' }}>
                <span>📍 <strong>Lat:</strong> {location.lat.toFixed(6)} &nbsp; <strong>Lng:</strong> {location.lng?.toFixed(6)}</span>
                {location.address && (
                  <span>🏘️ {location.address}</span>
                )}
              </div>
            )}
            {polygon && (
              <div style={{ marginTop: 8, fontSize: 12, color: '#558B2F', fontWeight: 700 }}>
                🔷 Farm boundary drawn ({polygon.coordinates[0].length - 1} points)
              </div>
            )}
          </div>
        )}

        {/* Error banner */}
        {saveStatus === 'error' && (
          <div style={{
            background: '#FFF0F0', border: '1.5px solid #FF8080',
            borderRadius: 16, padding: '12px 16px',
            display: 'flex', gap: 10, alignItems: 'center',
            color: '#CC0000', fontSize: 13, fontWeight: 600,
          }}>
            <AlertCircle size={18} />
            {errorMsg}
          </div>
        )}

        {/* Success banner */}
        {saveStatus === 'success' && (
          <div style={{
            background: '#E8F5E9', border: '1.5px solid #66BB6A',
            borderRadius: 16, padding: '12px 16px',
            display: 'flex', gap: 10, alignItems: 'center',
            color: '#1B5E20', fontSize: 13, fontWeight: 700,
          }}>
            <CheckCircle2 size={18} />
            🎉 Farm saved successfully! Redirecting...
          </div>
        )}

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={!isReadyToSave || saveStatus === 'saving' || saveStatus === 'success'}
          style={{
            width: '100%',
            padding: '16px 20px',
            borderRadius: 18,
            border: 'none',
            background: isReadyToSave && saveStatus === 'idle'
              ? 'linear-gradient(135deg, #2E7D32, #4CAF50)'
              : '#C8E6C9',
            color: isReadyToSave && saveStatus === 'idle' ? '#fff' : '#81C784',
            fontWeight: 800,
            fontSize: 16,
            cursor: isReadyToSave && saveStatus === 'idle' ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            boxShadow: isReadyToSave && saveStatus === 'idle'
              ? '0 6px 20px rgba(46,125,50,0.35)'
              : 'none',
            transition: 'all 0.2s',
          }}
        >
          {saveStatus === 'saving' ? (
            <><Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Saving Farm…</>
          ) : saveStatus === 'success' ? (
            <><CheckCircle2 size={20} /> Farm Saved! ✅</>
          ) : (
            <><Save size={20} /> Save Farm Location</>
          )}
        </button>

        {!isReadyToSave && (
          <p style={{ textAlign: 'center', fontSize: 12, color: '#78909C', margin: 0 }}>
            ⬆️ Enter a farm name and click on the map to enable saving
          </p>
        )}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      <BottomNav />
    </div>
  );
}

// ─── Shared inline styles ────────────────────────────────────────────────────
const card: React.CSSProperties = {
  background: '#fff',
  borderRadius: 20,
  padding: '16px 16px',
  boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
};

const label: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  fontSize: 13,
  fontWeight: 700,
  color: '#2D4A2D',
  marginBottom: 8,
};

const input: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: 14,
  border: '1.5px solid #C8E6C9',
  fontSize: 15,
  fontWeight: 600,
  color: '#1B3A1B',
  background: '#F8FBF8',
  outline: 'none',
  boxSizing: 'border-box',
};
