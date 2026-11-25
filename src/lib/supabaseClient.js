import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();

export const authConfigured = Boolean(supabaseUrl && supabaseKey);
export const supabase = authConfigured ? createClient(supabaseUrl, supabaseKey) : null;

export function authRedirect(path) {
  return new URL(path, window.location.origin).href;
}
