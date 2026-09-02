// ============================================================================
// KUHUDE - Supabase Admin Client (Service Role)
// ============================================================================

import { createClient } from '@supabase/supabase-js';

// This client bypasses RLS - use ONLY on the server for admin operations
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
