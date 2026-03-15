/**
 * FarmMap.tsx — Bulletproof OpenStreetMap component for KisaanSaathi
 *
 * Approach:
 *  • Pure Leaflet (no React-Leaflet) for maximum control
 *  • leaflet-draw imported via dynamic import to avoid ESM/CJS conflicts
 *  • Comprehensive error boundaries + try/catch everywhere
 *  • GPS with graceful fallback (India center)
 *  • Click-to-place draggable farm marker
 *  • Polygon draw toolbar for field boundary
 */
import { Component, type ReactNode, useEffect, useRef, useState } from 'react';
import type L from 'leaflet';

// ─── Props ──────────────────────────────────────────────────────────────────
interface FarmMapProps {
  onLocationChange?: (lat: number, lng: number, address?: string) => void;
  onPolygonChange?: (geojson: GeoJSON.Polygon | null) => void;
  height?: number | string;
}

// ─── Error Boundary ─────────────────────────────────────────────────────────
interface EBState { hasError: boolean; error?: string }
class MapErrorBoundary extends Component<{ children: ReactNode }, EBState> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(err: Error): EBState {
    return { hasError: true, error: err.message };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: 24, background: '#FFF3E0', borderRadius: 16, textAlign: 'center',
          border: '2px solid #FF9800', color: '#E65100',
        }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🗺️</div>
          <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>Map failed to load</p>
          <p style={{ fontSize: 13, color: '#795548' }}>
            {this.state.error ?? 'Unknown error. Please refresh the page.'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            style={{
              marginTop: 12, padding: '8px 20px', background: '#FF9800',
              color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700,
            }}
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Map Inner Component ─────────────────────────────────────────────────────
function FarmMapInner({ onLocationChange, onPolygonChange, height = 420 }: FarmMapProps) {
  const divRef     = useRef<HTMLDivElement>(null);
  const mapRef     = useRef<L.Map | null>(null);
  const markerRef  = useRef<L.Marker | null>(null);
  const itemsRef   = useRef<L.FeatureGroup | null>(null);

  const [status, setStatus] = useState<'detecting' | 'found' | 'denied' | 'ready'>('detecting');

  // ── Nominatim reverse geocode ──────────────────────────────────────────
  const geocode = async (lat: number, lng: number): Promise<string> => {
    try {
      const r = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`, 
        { headers: { 'Accept-Language': 'en' } });
      const d = await r.json();
      return d?.display_name ?? `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    } catch { return `${lat.toFixed(5)}, ${lng.toFixed(5)}`; }
  };

  // ── Init map + leaflet-draw (dynamic import) ──────────────────────────
  useEffect(() => {
    if (!divRef.current || mapRef.current) return;

    let map: L.Map;
    let cancelled = false;

    (async () => {
      try {
        // Dynamic import to avoid top-level CJS/ESM conflict
        const L = (await import('leaflet')).default;
        await import('leaflet/dist/leaflet.css');
        await import('leaflet-draw');
        await import('leaflet-draw/dist/leaflet.draw.css');

        if (cancelled || !divRef.current) return;

        // Fix marker icons
        L.Icon.Default.mergeOptions({
          iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });

        // Create map
        map = L.map(divRef.current, { center: [20.5937, 78.9629], zoom: 5 });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© <a href="https://www.openstreetmap.org">OpenStreetMap</a>',
          maxZoom: 19,
        }).addTo(map);

        // Feature group for drawn shapes
        const items = new L.FeatureGroup().addTo(map);
        itemsRef.current = items;

        // Draw control — only polygon
        const LDraw = (L as any);
        if (LDraw.Control?.Draw) {
          const ctrl = new LDraw.Control.Draw({
            edit: { featureGroup: items },
            draw: {
              polyline: false, circle: false, rectangle: false,
              circlemarker: false, marker: false,
              polygon: {
                allowIntersection: false, showArea: true,
                shapeOptions: { color: '#4CAF50', weight: 3, fillOpacity: 0.2 },
              },
            },
          });
          map.addControl(ctrl);
        }

        // Click to place/move marker
        map.on('click', async (e: any) => {
          const { lat, lng } = e.latlng;
          if (markerRef.current) {
            markerRef.current.setLatLng([lat, lng]);
          } else {
            const m = L.marker([lat, lng], { draggable: true }).addTo(map);
            m.on('dragend', async () => {
              const p = m.getLatLng();
              const addr = await geocode(p.lat, p.lng);
              onLocationChange?.(p.lat, p.lng, addr);
            });
            markerRef.current = m;
          }
          const addr = await geocode(lat, lng);
          onLocationChange?.(lat, lng, addr);
        });

        const emitPolygon = () => {
          try {
            const geo = items.toGeoJSON() as GeoJSON.FeatureCollection;
            const f = geo.features?.[0];
            onPolygonChange?.(f?.geometry?.type === 'Polygon' ? f.geometry as GeoJSON.Polygon : null);
          } catch { onPolygonChange?.(null); }
        };

        // Draw events
        const DrawEvent = (L as any).Draw?.Event ?? {};
        if (DrawEvent.CREATED) map.on(DrawEvent.CREATED, (e: any) => { items.clearLayers(); items.addLayer(e.layer); emitPolygon(); });
        if (DrawEvent.EDITED)  map.on(DrawEvent.EDITED, emitPolygon);
        if (DrawEvent.DELETED) map.on(DrawEvent.DELETED, () => onPolygonChange?.(null));

        mapRef.current = map;

        // Detect GPS
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
              if (!cancelled && mapRef.current) {
                mapRef.current.flyTo([coords.latitude, coords.longitude], 15, { animate: true });
                setStatus('found');
              }
            },
            () => setStatus('denied'),
            { enableHighAccuracy: true, timeout: 10_000 }
          );
        } else {
          setStatus('ready');
        }

      } catch (err) {
        console.error('FarmMap init error:', err);
        setStatus('ready');
      }
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const banners = {
    detecting: { text: '📍 Detecting your location…',                              bg: '#FF9800' },
    found:     { text: '✅ Location found! Click the map to pin your farm.',        bg: '#4CAF50' },
    denied:    { text: '⚠️ GPS unavailable. Click the map to mark your farm.',      bg: '#FF5722' },
    ready:     { text: '🗺️ Click on the map to mark your farm location.',           bg: '#1565C0' },
  };
  const b = banners[status] ?? banners.ready;

  return (
    <div style={{ width: '100%', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.10)' }}>
      <div style={{ padding: '9px 16px', background: b.bg, color: '#fff', fontSize: 13, fontWeight: 600 }}>
        {b.text}
      </div>
      <div ref={divRef} style={{ width: '100%', height }} />
      <div style={{
        background: '#F8FBF8', borderTop: '1px solid #ddd',
        padding: '10px 16px', display: 'flex', flexWrap: 'wrap',
        gap: 18, fontSize: 12, color: '#4F6F52', fontWeight: 600,
      }}>
        <span>📍 Click map → Pin farm</span>
        <span>🔷 Polygon tool → Draw field boundary</span>
        <span>✏️ Edit / delete anytime</span>
      </div>
    </div>
  );
}

// ─── Exported Component (wrapped in Error Boundary) ──────────────────────────
export function FarmMap(props: FarmMapProps) {
  return (
    <MapErrorBoundary>
      <FarmMapInner {...props} />
    </MapErrorBoundary>
  );
}
