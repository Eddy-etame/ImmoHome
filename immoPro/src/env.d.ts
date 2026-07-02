/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** Supabase project URL (safe to expose to the browser). */
  readonly PUBLIC_SUPABASE_URL: string;
  /** Supabase anon key (safe to expose; RLS enforces access). */
  readonly PUBLIC_SUPABASE_ANON_KEY: string;
  /** Supabase service-role key. SERVER ONLY — never referenced in client code. */
  readonly SUPABASE_SERVICE_ROLE_KEY: string;
  /** Legacy external contact-form endpoint (being migrated to /api/leads). */
  readonly PUBLIC_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
