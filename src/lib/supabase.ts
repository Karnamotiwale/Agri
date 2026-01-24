import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("CRITICAL: Missing Supabase Environment Variables!");
    console.error("URL:", supabaseUrl);
    console.error("KEY:", supabaseKey);
} else {
    console.log("Supabase Client Initializing with:", supabaseUrl);
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '');

/**
 * Get the current authenticated user's ID
 * @returns User ID if authenticated, null otherwise
 */
export async function getCurrentUserId(): Promise<string | null> {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error) {
            console.error("Error getting current user:", error.message);
            return null;
        }

        return user?.id || null;
    } catch (err) {
        console.error("Exception getting current user:", err);
        return null;
    }
}

/**
 * Check if user is authenticated
 * @returns true if user is authenticated, false otherwise
 */
export async function isAuthenticated(): Promise<boolean> {
    const userId = await getCurrentUserId();
    return userId !== null;
}
