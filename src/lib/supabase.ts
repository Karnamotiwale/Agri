// ============================================
// REAL SUPABASE CLIENT
// Replaces the previous mock stub to enable live
// IoT data fetching directly from PostgreSQL
// ============================================

import { createClient } from "@supabase/supabase-js"
import { MOCK_USER } from '../mock/mockAuth';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.warn("Missing Supabase env vars. Features requiring real DB connection may fail.");
}

export const supabase = createClient(supabaseUrl || "", supabaseKey || "")

// Preserve mock auth functions to avoid breaking the rest of the frontend
export async function getCurrentUserId(): Promise<string | null> {
    return MOCK_USER.id;
}

export async function isAuthenticated(): Promise<boolean> {
    return true;
}
