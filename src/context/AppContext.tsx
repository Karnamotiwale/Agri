import React, { createContext, useContext, useReducer, useCallback, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';
import { authService } from '../services/auth.service';
import { farmService } from '../services/farm.service';
import { cropService } from '../services/crop.service';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface LandLocation {
  id: string;
  name: string;
  area: number;
  x: number;
  y: number;
}

export interface Farm {
  id: string;
  name: string;
  location: string;
  area: string;
  lands: LandLocation[];
  crops: string[];
  primaryCrop?: string;
  latitude?: number;
  longitude?: number;
}

export interface CropStage {
  name: string;
  description: string;
  date: string;
  isActive: boolean;
}

export interface Crop {
  id: string;
  name: string;
  image: string;
  location: string;
  landArea: string;
  landSize: string;
  sowingDate: string;
  sowingPeriod: string;
  currentStage: string;
  stageDate: string;
  stages: CropStage[];
  farmId: string;
  seedsPlanted?: string;
  cropType?: string;
}

export interface AuthState {
  isLoggedIn: boolean;
  email?: string;
  phone?: string;
  hasCompletedOnboarding: boolean;
  isSystemReady: boolean;
}

export interface CropControls {
  irrigation: boolean;
  fertilization: boolean;
}

export interface HealthDetectionResult {
  id: string;
  cropId: string;
  farmId: string;
  imageUrl: string;
  status: 'healthy' | 'mild_stress' | 'diseased';
  detectedIssues: string[];
  explanation: string;
  recommendedActions: string[];
  confidenceScore: number;
  timestamp: string;
}

export interface CropHistoryEntry {
  id: string;
  cropId: string;
  farmId: string;
  timestamp: string;
  sensorSnapshot: {
    moisture: number;
    ph: number;
    npk: string;
  };
  actionTaken: 'irrigation' | 'fertilization' | 'delay' | 'no_action';
  aiRecommendation: string;
  outcome: 'success' | 'neutral' | 'negative';
  notes?: string;
}

export interface AppState {
  auth: AuthState;
  farms: Farm[];
  crops: Crop[];
  cropControls: Record<string, CropControls>;
  dashboardActiveTab: string;
  healthDetections: HealthDetectionResult[];
  cropHistory: CropHistoryEntry[];
}

// ---------------------------------------------------------------------------
// Initial State
// ---------------------------------------------------------------------------

const initialCropControls: Record<string, CropControls> = {};

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

type AppAction =
  | { type: 'LOGIN'; email?: string; phone?: string }
  | { type: 'LOGOUT' }
  | { type: 'SET_ONBOARDING_COMPLETE' }
  | { type: 'SET_SYSTEM_READY' }
  | { type: 'SET_FARMS'; farms: Farm[] }
  | { type: 'ADD_FARM'; farm: Farm }
  | { type: 'ADD_CROPS'; crops: Crop[] }
  | { type: 'ADD_CROP'; crop: Crop; farmId: string }
  | { type: 'SET_CROP_CONTROL'; cropId: string; key: 'irrigation' | 'fertilization'; value: boolean }
  | { type: 'SET_DASHBOARD_TAB'; tab: string }
  | { type: 'INIT_CROP_CONTROLS'; cropId: string }
  | { type: 'ADD_HEALTH_DETECTION'; result: HealthDetectionResult }
  | { type: 'ADD_CROP_HISTORY'; entry: CropHistoryEntry };

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        auth: {
          ...state.auth,
          isLoggedIn: true,
          email: action.email,
          phone: action.phone,
        },
      };
    case 'LOGOUT':
      return {
        ...state,
        auth: {
          isLoggedIn: false,
          hasCompletedOnboarding: state.auth.hasCompletedOnboarding,
          isSystemReady: state.auth.isSystemReady,
        },
      };
    case 'SET_ONBOARDING_COMPLETE':
      return {
        ...state,
        auth: { ...state.auth, hasCompletedOnboarding: true },
      };
    case 'SET_SYSTEM_READY':
      return {
        ...state,
        auth: { ...state.auth, isSystemReady: true },
      };
    case 'ADD_FARM': {
      const exists = state.farms.some((f) => f.id === action.farm.id);
      return {
        ...state,
        farms: exists ? state.farms : [...state.farms, action.farm],
      };
    }
    case 'SET_FARMS':
      return { ...state, farms: action.farms };
    case 'ADD_CROPS': {
      const byId = new Map(state.crops.map((c) => [c.id, c]));
      action.crops.forEach((c) => byId.set(c.id, c));
      return { ...state, crops: Array.from(byId.values()) };
    }
    case 'ADD_CROP': {
      const cropExists = state.crops.some((c) => c.id === action.crop.id);
      const updatedCrops = cropExists ? state.crops : [...state.crops, action.crop];
      const updatedFarms = state.farms.map((f) =>
        f.id === action.farmId
          ? { ...f, crops: f.crops.includes(action.crop.id) ? f.crops : [...f.crops, action.crop.id] }
          : f
      );
      const updatedControls = cropExists
        ? state.cropControls
        : {
          ...state.cropControls,
          [action.crop.id]: { irrigation: false, fertilization: false },
        };
      return { ...state, crops: updatedCrops, farms: updatedFarms, cropControls: updatedControls };
    }
    case 'SET_CROP_CONTROL': {
      const prev = state.cropControls[action.cropId] || { irrigation: false, fertilization: false };
      return {
        ...state,
        cropControls: {
          ...state.cropControls,
          [action.cropId]: { ...prev, [action.key]: action.value },
        },
      };
    }
    case 'SET_DASHBOARD_TAB':
      return { ...state, dashboardActiveTab: action.tab };
    case 'INIT_CROP_CONTROLS':
      if (state.cropControls[action.cropId]) return state;
      return {
        ...state,
        cropControls: {
          ...state.cropControls,
          [action.cropId]: { irrigation: false, fertilization: false },
        },
      };
    case 'ADD_HEALTH_DETECTION':
      return {
        ...state,
        healthDetections: [...state.healthDetections, action.result],
      };
    case 'ADD_CROP_HISTORY':
      return {
        ...state,
        cropHistory: [...state.cropHistory, action.entry],
      };
    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const initialState: AppState = {
  auth: {
    isLoggedIn: false,
    hasCompletedOnboarding: true,
    isSystemReady: true,
  },
  farms: [],
  crops: [],
  cropControls: initialCropControls,
  dashboardActiveTab: 'home',
  healthDetections: [],
  cropHistory: [],
};

interface AppContextValue extends AppState {
  login: (email?: string, phone?: string) => void;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  setOnboardingComplete: () => void;
  setSystemReady: () => void;
  addFarm: (farm: Farm) => Promise<string | null>;
  addCrop: (crop: Crop, farmId: string) => Promise<boolean>;
  setCropControl: (cropId: string, key: 'irrigation' | 'fertilization', value: boolean) => void;
  setDashboardTab: (tab: string) => void;
  getCrop: (id: string) => Crop | undefined;
  getCropControl: (cropId: string) => CropControls;
  getAllCrops: () => Crop[];
  getFarm: (id: string) => Farm | undefined;
  addHealthDetection: (result: HealthDetectionResult) => void;
  addCropHistory: (entry: CropHistoryEntry) => void;
  getCropHistory: (cropId: string) => CropHistoryEntry[];
  getHealthDetections: (cropId: string) => HealthDetectionResult[];
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const { user } = useAuth();

  // Helper to fetch initial data
  const fetchData = useCallback(async () => {
    try {
      const farms = await farmService.getAllFarms();
      const crops = await cropService.getAllCrops();

      // Populate initial controls for crops
      crops.forEach(c => {
        dispatch({ type: 'INIT_CROP_CONTROLS', cropId: c.id });
      });

      // Link crops to farms in local state
      const farmsWithCrops = farms.map(f => ({
        ...f,
        crops: crops.filter(c => c.farmId === f.id).map(c => c.id)
      }));

      dispatch({ type: 'SET_FARMS', farms: farmsWithCrops });
      dispatch({ type: 'ADD_CROPS', crops });
    } catch (err) {
      console.error("Failed to fetch initial data", err);
    }
  }, []);

  // Sync AuthContext state with AppContext state
  useEffect(() => {
    if (user) {
      dispatch({ type: 'LOGIN', email: user.email, phone: user.phone });
      fetchData();
    } else {
      dispatch({ type: 'LOGOUT' });
    }
  }, [user, fetchData]);

  // Realtime Subscriptions with user_id filtering
  useEffect(() => {
    let farmsChannel: any = null;
    let cropsChannel: any = null;

    const setupRealtimeSubscriptions = async () => {
      try {
        if (!user) {
          console.log('No authenticated user, skipping real-time subscriptions');
          return;
        }

        const userId = user.id;

        // Subscribe to farms changes for this user
        farmsChannel = supabase
          .channel('farms_changes')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'farms',
              filter: `user_id=eq.${userId}`
            },
            (payload) => {
              console.log('Farm change detected:', payload);
              fetchData();
            }
          )
          .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
              console.log('Subscribed to farms real-time updates');
            }
          });

        // Subscribe to crops changes for this user
        cropsChannel = supabase
          .channel('crops_changes')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'crops',
              filter: `user_id=eq.${userId}`
            },
            (payload) => {
              console.log('Crop change detected:', payload);
              fetchData();
            }
          )
          .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
              console.log('Subscribed to crops real-time updates');
            }
          });
      } catch (err) {
        console.error('Error setting up real-time subscriptions:', err);
      }
    };

    setupRealtimeSubscriptions();

    return () => {
      if (farmsChannel) {
        supabase.removeChannel(farmsChannel);
      }
      if (cropsChannel) {
        supabase.removeChannel(cropsChannel);
      }
    };
  }, [user, fetchData]);


  const login = useCallback(async (email?: string, phone?: string) => {
    // For phone/email login form
    if (email) {
      // MOCK LOGIN: Bypassing real Supabase Auth for now to ensure access
      console.log("Mock Login: Skipping Supabase Auth for", email);

      /* 
      const defaultPassword = 'agrismart_password_123';
      // Try to sign in first
      const { error: signInError } = await authService.signIn(email, defaultPassword);

      if (signInError) {
        // If sign in fails, try to sign up (maybe new user)
        console.log("Sign in failed, trying sign up...", signInError.message);
        const { error: signUpError } = await authService.signUp(email, defaultPassword);

        if (signUpError) {
          // Both failed
          console.error("Auth failed:", signUpError);
          throw signUpError;
        }
      }
      */
    }
    // Note: Phone auth mock not fully implemented in backend restore yet aside from 'login' dispatch
    // Use dispatch to ensure local state updates even if backend part is partial for phone
    dispatch({ type: 'LOGIN', email, phone });
  }, []);

  const loginWithGoogle = useCallback(async () => {
    console.log("AppContext: Initiating Google Login...");
    const { error } = await authService.signInWithGoogle();
    if (error) {
      console.error("Supabase Auth Error:", error);
      alert(`Login failed: ${error.message}`);
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.signOut();
  }, []);

  const setOnboardingComplete = useCallback(() => dispatch({ type: 'SET_ONBOARDING_COMPLETE' }), []);
  const setSystemReady = useCallback(() => dispatch({ type: 'SET_SYSTEM_READY' }), []);

  const addFarm = useCallback(async (farm: Farm) => {
    try {
      const newFarm = await farmService.createFarm(farm);
      if (newFarm) {
        dispatch({ type: 'ADD_FARM', farm: newFarm });
        return newFarm.id;
      }
    } catch (e) {
      console.error("Add Farm Failed", e);
    }
    return null;
  }, []);

  const addCrop = useCallback(async (crop: Crop, farmId: string) => {
    try {
      const newCrop = await cropService.createCrop(crop, farmId);
      if (newCrop) {
        dispatch({ type: 'ADD_CROP', crop: newCrop, farmId });
        return true;
      }
    } catch (e) {
      console.error("Add Crop Failed", e);
    }
    return false;
  }, []);

  const setCropControl = useCallback((cropId: string, key: 'irrigation' | 'fertilization', value: boolean) => {
    dispatch({ type: 'SET_CROP_CONTROL', cropId, key, value });
  }, []);

  const setDashboardTab = useCallback((tab: string) => dispatch({ type: 'SET_DASHBOARD_TAB', tab }), []);

  const getCrop = useCallback(
    (id: string) => state.crops.find((c) => c.id === id),
    [state.crops]
  );

  const getFarm = useCallback(
    (id: string) => state.farms.find((f) => f.id === id),
    [state.farms]
  );

  const getCropControl = useCallback(
    (cropId: string): CropControls => {
      const c = state.cropControls[cropId];
      return c || { irrigation: false, fertilization: false };
    },
    [state.cropControls]
  );

  const getAllCrops = useCallback(() => state.crops, [state.crops]);

  const addHealthDetection = useCallback((result: HealthDetectionResult) => {
    dispatch({ type: 'ADD_HEALTH_DETECTION', result });
  }, []);

  const addCropHistory = useCallback((entry: CropHistoryEntry) => {
    dispatch({ type: 'ADD_CROP_HISTORY', entry });
  }, []);

  const getCropHistory = useCallback(
    (cropId: string) => state.cropHistory.filter((h) => h.cropId === cropId).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    [state.cropHistory]
  );

  const getHealthDetections = useCallback(
    (cropId: string) => state.healthDetections.filter((h) => h.cropId === cropId).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    [state.healthDetections]
  );

  const value: AppContextValue = {
    ...state,
    login,
    loginWithGoogle,
    logout,
    setOnboardingComplete,
    setSystemReady,
    addFarm,
    addCrop,
    setCropControl,
    setDashboardTab,
    getCrop,
    getCropControl,
    getAllCrops,
    getFarm,
    addHealthDetection,
    addCropHistory,
    getCropHistory,
    getHealthDetections,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
