import { createClient } from '@supabase/supabase-js';
import type { Database } from '../database.types';

/**
 * Service-role Supabase client. SERVER ONLY — importing this in any code that
 * reaches the browser would leak full database access. It bypasses Row Level
 * Security, so use it exclusively inside API routes/SSR for privileged,
 * owner-gated operations (audit log writes, maintenance actions, seeding).
 */
export const supabaseAdmin = createClient<Database>(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);
