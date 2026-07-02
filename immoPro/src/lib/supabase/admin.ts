import { createClient } from '@supabase/supabase-js';
import type { Database } from '../database.types';

/**
 * Service-role Supabase client. SERVER ONLY — importing this in any code that
 * reaches the browser would leak full database access. It bypasses Row Level
 * Security, so use it exclusively inside API routes/SSR for privileged,
 * owner-gated operations (audit log writes, maintenance actions, seeding).
 */
const ADMIN_URL =
  import.meta.env.PUBLIC_SUPABASE_URL || (globalThis as any).process?.env?.PUBLIC_SUPABASE_URL;
const SERVICE_KEY =
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY || (globalThis as any).process?.env?.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdmin = createClient<Database>(
  ADMIN_URL,
  SERVICE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);
