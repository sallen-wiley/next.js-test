import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Check if admin features are available (service role key configured)
 */
export const isAdminAvailable = () => {
  return !!(supabaseUrl && supabaseServiceKey);
};

/**
 * Admin Supabase client with service role key.
 * Use ONLY in server-side API routes for privileged operations.
 * NEVER expose this client to the browser.
 * Returns null if service key is not configured.
 */
export const createAdminClient = () => {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn("Admin client unavailable: Missing SUPABASE_SERVICE_ROLE_KEY");
    return null;
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
