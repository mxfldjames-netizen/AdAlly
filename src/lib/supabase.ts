import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      brands: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          logo_url: string | null;
          guidelines: string | null;
          industry: string | null;
          target_audience: string | null;
          brand_colors: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          logo_url?: string | null;
          guidelines?: string | null;
          industry?: string | null;
          target_audience?: string | null;
          brand_colors?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          logo_url?: string | null;
          guidelines?: string | null;
          industry?: string | null;
          target_audience?: string | null;
          brand_colors?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      brand_assets: {
        Row: {
          id: string;
          brand_id: string;
          file_name: string;
          file_url: string;
          file_type: string;
          file_size: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          brand_id: string;
          file_name: string;
          file_url: string;
          file_type: string;
          file_size: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          brand_id?: string;
          file_name?: string;
          file_url?: string;
          file_type?: string;
          file_size?: number;
          created_at?: string;
        };
      };
      ad_ideas: {
        Row: {
          id: string;
          brand_id: string;
          title: string;
          description: string;
          target_audience: string | null;
          campaign_type: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          brand_id: string;
          title: string;
          description: string;
          target_audience?: string | null;
          campaign_type?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          brand_id?: string;
          title?: string;
          description?: string;
          target_audience?: string | null;
          campaign_type?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      chat_messages: {
        Row: {
          id: string;
          user_id: string;
          agent_id: string | null;
          message: string;
          sender_type: 'user' | 'agent';
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          agent_id?: string | null;
          message: string;
          sender_type: 'user' | 'agent';
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          agent_id?: string | null;
          message?: string;
          sender_type?: 'user' | 'agent';
          created_at?: string;
        };
      };
      downloads: {
        Row: {
          id: string;
          ad_idea_id: string;
          file_name: string;
          file_url: string;
          file_type: string;
          file_size: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          ad_idea_id: string;
          file_name: string;
          file_url: string;
          file_type: string;
          file_size: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          ad_idea_id?: string;
          file_name?: string;
          file_url?: string;
          file_type?: string;
          file_size?: number;
          created_at?: string;
        };
      };
    };
  };
};