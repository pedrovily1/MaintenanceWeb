import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

console.log('[supabase] URL:', supabaseUrl, 'Key:', supabaseAnonKey?.slice(0, 10));

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: {
            getItem: (key) => localStorage.getItem(key),
            setItem: (key, value) => localStorage.setItem(key, value),
            removeItem: (key) => localStorage.removeItem(key),
        },
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    }
});