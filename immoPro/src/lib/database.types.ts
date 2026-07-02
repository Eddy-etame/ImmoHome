// Hand-authored to match supabase/migrations/0001_init.sql.
// Regenerate anytime the schema changes with:
//   npx supabase gen types typescript --project-id tymvbatwokzjyrtspyid > src/lib/database.types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type PropertyType = 'VILLA' | 'APPARTEMENT' | 'TERRAIN';
export type PropertyStatus = 'available' | 'sold' | 'rented' | 'negotiating';
export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type LeadStatus = 'new' | 'contacted' | 'closed';
export type MessageSender = 'agent' | 'client';
export type UserRole = 'agent' | 'owner';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; email: string | null; full_name: string | null; role: UserRole; created_at: string };
        Insert: { id: string; email?: string | null; full_name?: string | null; role?: UserRole; created_at?: string };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      properties: {
        Row: {
          id: string; slug: string | null; title: string; title_en: string | null; city: string;
          price: number; surface: number; type: PropertyType; status: PropertyStatus;
          rooms: number | null; bathrooms: number | null; description: string | null; description_en: string | null;
          features: string[]; features_en: string[]; neighborhood: string | null; neighborhood_en: string | null;
          lat: number | null; lng: number | null; cover_image: string | null; published: boolean;
          created_by: string | null; created_at: string; updated_at: string;
        };
        Insert: {
          id?: string; slug?: string | null; title: string; title_en?: string | null; city: string;
          price?: number; surface?: number; type: PropertyType; status?: PropertyStatus;
          rooms?: number | null; bathrooms?: number | null; description?: string | null; description_en?: string | null;
          features?: string[]; features_en?: string[]; neighborhood?: string | null; neighborhood_en?: string | null;
          lat?: number | null; lng?: number | null; cover_image?: string | null; published?: boolean;
          created_by?: string | null; created_at?: string; updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['properties']['Insert']>;
      };
      property_images: {
        Row: { id: string; property_id: string; url: string; alt: string | null; sort_order: number; created_at: string };
        Insert: { id?: string; property_id: string; url: string; alt?: string | null; sort_order?: number; created_at?: string };
        Update: Partial<Database['public']['Tables']['property_images']['Insert']>;
      };
      clients: {
        Row: { id: string; name: string; email: string | null; phone: string | null; source: string | null; notes: string | null; created_by: string | null; created_at: string };
        Insert: { id?: string; name: string; email?: string | null; phone?: string | null; source?: string | null; notes?: string | null; created_by?: string | null; created_at?: string };
        Update: Partial<Database['public']['Tables']['clients']['Insert']>;
      };
      client_interactions: {
        Row: { id: string; client_id: string; type: string; note: string | null; remind_at: string | null; created_by: string | null; created_at: string };
        Insert: { id?: string; client_id: string; type?: string; note?: string | null; remind_at?: string | null; created_by?: string | null; created_at?: string };
        Update: Partial<Database['public']['Tables']['client_interactions']['Insert']>;
      };
      appointments: {
        Row: { id: string; client_id: string | null; property_id: string | null; scheduled_at: string; status: AppointmentStatus; notes: string | null; created_by: string | null; created_at: string };
        Insert: { id?: string; client_id?: string | null; property_id?: string | null; scheduled_at: string; status?: AppointmentStatus; notes?: string | null; created_by?: string | null; created_at?: string };
        Update: Partial<Database['public']['Tables']['appointments']['Insert']>;
      };
      leads: {
        Row: { id: string; name: string; email: string; phone: string | null; message: string; locale: string; status: LeadStatus; created_at: string };
        Insert: { id?: string; name: string; email: string; phone?: string | null; message: string; locale?: string; status?: LeadStatus; created_at?: string };
        Update: Partial<Database['public']['Tables']['leads']['Insert']>;
      };
      subscribers: {
        Row: { id: string; email: string; locale: string; created_at: string };
        Insert: { id?: string; email: string; locale?: string; created_at?: string };
        Update: Partial<Database['public']['Tables']['subscribers']['Insert']>;
      };
      conversations: {
        Row: { id: string; client_id: string | null; subject: string | null; created_at: string };
        Insert: { id?: string; client_id?: string | null; subject?: string | null; created_at?: string };
        Update: Partial<Database['public']['Tables']['conversations']['Insert']>;
      };
      messages: {
        Row: { id: string; conversation_id: string; sender: MessageSender; body: string; created_at: string };
        Insert: { id?: string; conversation_id: string; sender: MessageSender; body: string; created_at?: string };
        Update: Partial<Database['public']['Tables']['messages']['Insert']>;
      };
      audit_log: {
        Row: { id: number; actor: string | null; action: string; reason: string | null; target: string | null; created_at: string };
        Insert: { id?: number; actor?: string | null; action: string; reason?: string | null; target?: string | null; created_at?: string };
        Update: Partial<Database['public']['Tables']['audit_log']['Insert']>;
      };
      page_events: {
        Row: { id: number; path: string; referrer: string | null; created_at: string };
        Insert: { id?: number; path: string; referrer?: string | null; created_at?: string };
        Update: Partial<Database['public']['Tables']['page_events']['Insert']>;
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_staff: { Args: Record<string, never>; Returns: boolean };
      is_owner: { Args: Record<string, never>; Returns: boolean };
      jwt_role: { Args: Record<string, never>; Returns: string };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
