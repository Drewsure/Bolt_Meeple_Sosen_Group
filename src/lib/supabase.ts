import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabasePublishableKey || 'placeholder-publishable-key',
);

export interface MemberProfile {
  id: string;
  display_name: string;
  rank: string;
  xp_points: number;
  total_sessions: number;
  preferred_games: string[];
  joined_at: string;
  avatar_url?: string;
  bio?: string;
  updated_at: string;
}

export interface Session {
  id: string;
  member_id: string;
  game_title: string;
  session_date: string;
  duration_minutes: number;
  status: 'pending' | 'completed' | 'cancelled';
  xp_earned: number;
  notes?: string;
  created_at: string;
}

export interface LeaderboardEntry {
  id: string;
  rank_title: string;
  total_xp: number;
  game_victories: number;
  linguistic_deployment_score: number;
}

export interface LanguageOverlayKit {
  id: string;
  session_number: number;
  title: string;
  difficulty_rating: string;
  strategic_briefing: string;
  estimated_prep_hours: number;
  key_phrases: Record<string, string>;
  vocabulary_list: Record<string, string>;
  audio_briefing_url?: string;
  created_at: string;
}
