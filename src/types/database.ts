export interface Game {
  id: string;
  bgg_id: number | null;
  title: string;
  original_name: string | null;
  bgg_average: number | null;
  average_rating: number | null;
  weight: number | null;
  bgg_rank: number | null;
  min_players: number | null;
  max_players: number | null;
  duration_minutes: number | null;
  min_playtime_minutes: number | null;
  max_playtime_minutes: number | null;
  year_published: number | null;
  language_dependence: string | null;
  image_id: number | null;
  cover_image_url: string | null;
  source_collection: string | null;
  item_type: string;
  complexity_level: string | null;
  player_count: string | null;
  description: string | null;
  is_featured: boolean;
  is_silver_circle: boolean;
  created_at: string;
  updated_at: string;
  raw_data?: Record<string, string>;
}

export interface GameLearningProfile {
  id: string;
  game_id: string;
  teaching_summary: string | null;
  learning_objectives: string[];
  vocabulary_focus: string[];
  recommended_level: string | null;
  session_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface GuildChallenge {
  id: string;
  game_id: string | null;
  created_by: string | null;
  title: string;
  description: string;
  challenge_type: string;
  xp_reward: number;
  starts_at: string | null;
  ends_at: string | null;
  status: 'draft' | 'active' | 'completed' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface ChallengeSubmission {
  id: string;
  challenge_id: string;
  member_id: string;
  submission_text: string | null;
  evidence_url: string | null;
  status: 'submitted' | 'approved' | 'rejected';
  awarded_xp: number;
  submitted_at: string;
  reviewed_at: string | null;
}

export interface Badge {
  id: string;
  slug: string;
  name: string;
  description: string;
  image_url: string | null;
  criteria: string | null;
  created_at: string;
}

export interface MemberBadge {
  id: string;
  member_id: string;
  badge_id: string;
  awarded_at: string;
  awarded_for: string | null;
}

export interface GuildTip {
  id: string;
  game_id: string | null;
  member_id: string;
  title: string;
  content: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}
