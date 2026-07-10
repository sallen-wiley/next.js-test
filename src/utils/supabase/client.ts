import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseKey);
};

export const getSupabaseConfigError = () =>
  "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment.";

export const createClient = () => {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error(getSupabaseConfigError());
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
};
