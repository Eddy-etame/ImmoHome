import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '../database.types';

/**
 * Browser-side Supabase client. Use in client `<script>` islands for public
 * reads and authenticated actions. Access is governed by Row Level Security,
 * so the anon key is safe to ship.
 */
export const supabase = createBrowserClient<Database>(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY
);
