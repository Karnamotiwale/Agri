// ============================================
// FarmContext — Global Farm State with Supabase Realtime
// Single source of truth for all farm data across modules
// ============================================

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from 'react';
import { supabase } from '../lib/supabase';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface FarmRecord {
  id: string;
  farm_name: string;
  total_land_acres: number | null;
  total_land_ha?: number | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  // local fallback fields
  name?: string;
}

export interface FarmContextValue {
  farms: FarmRecord[];
  selectedFarm: FarmRecord | null;
  selectedFarmId: string | null;
  isLoading: boolean;
  setSelectedFarmId: (id: string | null) => void;
  refreshFarms: () => Promise<void>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────

const FarmContext = createContext<FarmContextValue | null>(null);

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ─────────────────────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────────────────────

export function FarmProvider({ children }: { children: ReactNode }) {
  const [farms, setFarms] = useState<FarmRecord[]>([]);
  const [selectedFarmId, setSelectedFarmIdInternal] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // ── Normalize a raw farm row (Supabase or local fallback) ──────────────────
  const normalizeFarm = (raw: any): FarmRecord => ({
    id: raw.id,
    farm_name: raw.farm_name || raw.name || 'Unnamed Farm',
    name: raw.farm_name || raw.name || 'Unnamed Farm',
    total_land_acres: raw.total_land_acres ?? null,
    total_land_ha: raw.total_land_ha ?? null,
    latitude: raw.latitude ?? null,
    longitude: raw.longitude ?? null,
    created_at: raw.created_at || new Date().toISOString(),
  });

  // ── Fetch farms from backend (which merges Supabase + local fallback) ──────
  const fetchFarms = useCallback(async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/farms`);
      if (!res.ok) throw new Error('Backend fetch failed');
      const data = await res.json();
      const normalized: FarmRecord[] = Array.isArray(data)
        ? data.map(normalizeFarm)
        : [];
      setFarms(normalized);

      // Auto-select first farm if none selected
      setSelectedFarmIdInternal(prev => {
        if (prev && normalized.find(f => f.id === prev)) return prev;
        return normalized.length > 0 ? normalized[0].id : null;
      });
    } catch (err) {
      console.warn('FarmContext: backend unavailable, trying Supabase directly...', err);
      try {
        const { data, error } = await supabase
          .from('farms')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) {
          const normalized = data.map(normalizeFarm);
          setFarms(normalized);
          setSelectedFarmIdInternal(prev => {
            if (prev && normalized.find(f => f.id === prev)) return prev;
            return normalized.length > 0 ? normalized[0].id : null;
          });
        }
      } catch (innerErr) {
        console.error('FarmContext: all fetch attempts failed', innerErr);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Subscribe to Supabase Realtime on farms table ─────────────────────────
  const subscribeToFarms = useCallback(() => {
    // Clean up any existing subscription
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channel = supabase
      .channel('farms-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'farms' },
        (payload) => {
          console.log('[FarmContext] Realtime farm change:', payload.eventType);
          if (payload.eventType === 'INSERT') {
            const newFarm = normalizeFarm(payload.new);
            setFarms(prev => [newFarm, ...prev]);
            // Auto-select newly added farm
            setSelectedFarmIdInternal(prev => prev ?? newFarm.id);
          } else if (payload.eventType === 'UPDATE') {
            const updated = normalizeFarm(payload.new);
            setFarms(prev => prev.map(f => f.id === updated.id ? updated : f));
          } else if (payload.eventType === 'DELETE') {
            const deletedId = payload.old?.id;
            setFarms(prev => {
              const remaining = prev.filter(f => f.id !== deletedId);
              return remaining;
            });
            setSelectedFarmIdInternal(prev => {
              if (prev === deletedId) {
                return farms.filter(f => f.id !== deletedId)[0]?.id ?? null;
              }
              return prev;
            });
          }
        }
      )
      .subscribe();

    channelRef.current = channel;
  }, [farms]);

  // Initial load + subscription
  useEffect(() => {
    fetchFarms().then(() => subscribeToFarms());

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, []);

  // Re-subscribe when farms list changes significantly (new farm added via backend)
  useEffect(() => {
    if (!isLoading) {
      subscribeToFarms();
    }
  }, [isLoading]);

  const setSelectedFarmId = useCallback((id: string | null) => {
    setSelectedFarmIdInternal(id);
  }, []);

  const selectedFarm = farms.find(f => f.id === selectedFarmId) ?? null;

  return (
    <FarmContext.Provider
      value={{
        farms,
        selectedFarm,
        selectedFarmId,
        isLoading,
        setSelectedFarmId,
        refreshFarms: fetchFarms,
      }}
    >
      {children}
    </FarmContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

export function useFarm(): FarmContextValue {
  const ctx = useContext(FarmContext);
  if (!ctx) throw new Error('useFarm must be used inside <FarmProvider>');
  return ctx;
}
