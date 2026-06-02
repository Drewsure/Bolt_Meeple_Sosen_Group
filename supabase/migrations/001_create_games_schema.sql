/*
  BoardGameGeek-backed game catalogue and guild learning features.

  member_profiles retains the existing AuthContext-compatible shape. It is
  declared with IF NOT EXISTS because this 001 migration precedes the
  repository's existing auth migration and guild tables reference members.
*/

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS member_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  rank text DEFAULT 'Initiate' NOT NULL,
  xp_points integer DEFAULT 0 NOT NULL,
  total_sessions integer DEFAULT 0 NOT NULL,
  preferred_games text[] DEFAULT ARRAY[]::text[],
  joined_at timestamptz DEFAULT now() NOT NULL,
  avatar_url text,
  bio text,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bgg_id bigint,
  title text NOT NULL,
  original_name text,
  bgg_average numeric(8, 5),
  average_rating numeric(8, 5),
  weight numeric(6, 4),
  bgg_rank integer,
  min_players integer,
  max_players integer,
  duration_minutes integer,
  min_playtime_minutes integer,
  max_playtime_minutes integer,
  year_published integer,
  language_dependence text,
  image_id bigint,
  cover_image_url text,
  source_collection text,
  raw_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  item_type text NOT NULL DEFAULT 'standalone',
  complexity_level text,
  player_count text,
  description text,
  is_featured boolean NOT NULL DEFAULT false,
  is_silver_circle boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE games ADD COLUMN IF NOT EXISTS bgg_id bigint;
ALTER TABLE games ADD COLUMN IF NOT EXISTS original_name text;
ALTER TABLE games ADD COLUMN IF NOT EXISTS bgg_average numeric(8, 5);
ALTER TABLE games ADD COLUMN IF NOT EXISTS average_rating numeric(8, 5);
ALTER TABLE games ADD COLUMN IF NOT EXISTS weight numeric(6, 4);
ALTER TABLE games ADD COLUMN IF NOT EXISTS bgg_rank integer;
ALTER TABLE games ADD COLUMN IF NOT EXISTS min_players integer;
ALTER TABLE games ADD COLUMN IF NOT EXISTS max_players integer;
ALTER TABLE games ADD COLUMN IF NOT EXISTS duration_minutes integer;
ALTER TABLE games ADD COLUMN IF NOT EXISTS min_playtime_minutes integer;
ALTER TABLE games ADD COLUMN IF NOT EXISTS max_playtime_minutes integer;
ALTER TABLE games ADD COLUMN IF NOT EXISTS year_published integer;
ALTER TABLE games ADD COLUMN IF NOT EXISTS language_dependence text;
ALTER TABLE games ADD COLUMN IF NOT EXISTS image_id bigint;
ALTER TABLE games ADD COLUMN IF NOT EXISTS cover_image_url text;
ALTER TABLE games ADD COLUMN IF NOT EXISTS source_collection text;
ALTER TABLE games ADD COLUMN IF NOT EXISTS raw_data jsonb NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE games ADD COLUMN IF NOT EXISTS item_type text NOT NULL DEFAULT 'standalone';
ALTER TABLE games ADD COLUMN IF NOT EXISTS complexity_level text;
ALTER TABLE games ADD COLUMN IF NOT EXISTS player_count text;
ALTER TABLE games ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE games ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false;
ALTER TABLE games ADD COLUMN IF NOT EXISTS is_silver_circle boolean NOT NULL DEFAULT false;
ALTER TABLE games ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE games ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

CREATE UNIQUE INDEX IF NOT EXISTS games_bgg_id_key ON games(bgg_id);
CREATE UNIQUE INDEX IF NOT EXISTS games_title_key ON games(title);
CREATE INDEX IF NOT EXISTS games_rank_idx ON games(bgg_rank);
CREATE INDEX IF NOT EXISTS games_featured_idx ON games(is_featured) WHERE is_featured;
CREATE INDEX IF NOT EXISTS games_silver_circle_idx ON games(is_silver_circle) WHERE is_silver_circle;

CREATE TABLE IF NOT EXISTS game_learning_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid NOT NULL UNIQUE REFERENCES games(id) ON DELETE CASCADE,
  teaching_summary text,
  learning_objectives text[] NOT NULL DEFAULT ARRAY[]::text[],
  vocabulary_focus text[] NOT NULL DEFAULT ARRAY[]::text[],
  recommended_level text,
  session_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS guild_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid REFERENCES games(id) ON DELETE SET NULL,
  created_by uuid REFERENCES member_profiles(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text NOT NULL,
  challenge_type text NOT NULL DEFAULT 'session',
  xp_reward integer NOT NULL DEFAULT 0 CHECK (xp_reward >= 0),
  starts_at timestamptz,
  ends_at timestamptz,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS challenge_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id uuid NOT NULL REFERENCES guild_challenges(id) ON DELETE CASCADE,
  member_id uuid NOT NULL REFERENCES member_profiles(id) ON DELETE CASCADE,
  submission_text text,
  evidence_url text,
  status text NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'approved', 'rejected')),
  awarded_xp integer NOT NULL DEFAULT 0 CHECK (awarded_xp >= 0),
  submitted_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz,
  UNIQUE (challenge_id, member_id)
);

CREATE TABLE IF NOT EXISTS badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text NOT NULL,
  image_url text,
  criteria text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS member_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid NOT NULL REFERENCES member_profiles(id) ON DELETE CASCADE,
  badge_id uuid NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  awarded_at timestamptz NOT NULL DEFAULT now(),
  awarded_for text,
  UNIQUE (member_id, badge_id)
);

CREATE TABLE IF NOT EXISTS guild_tips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid REFERENCES games(id) ON DELETE CASCADE,
  member_id uuid NOT NULL REFERENCES member_profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  is_featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS challenge_submissions_member_idx ON challenge_submissions(member_id);
CREATE INDEX IF NOT EXISTS member_badges_member_idx ON member_badges(member_id);
CREATE INDEX IF NOT EXISTS guild_tips_game_idx ON guild_tips(game_id);

CREATE OR REPLACE FUNCTION set_catalogue_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_games_updated_at ON games;
CREATE TRIGGER update_games_updated_at
  BEFORE UPDATE ON games
  FOR EACH ROW EXECUTE FUNCTION set_catalogue_updated_at();

DROP TRIGGER IF EXISTS update_game_learning_profiles_updated_at ON game_learning_profiles;
CREATE TRIGGER update_game_learning_profiles_updated_at
  BEFORE UPDATE ON game_learning_profiles
  FOR EACH ROW EXECUTE FUNCTION set_catalogue_updated_at();

DROP TRIGGER IF EXISTS update_guild_challenges_updated_at ON guild_challenges;
CREATE TRIGGER update_guild_challenges_updated_at
  BEFORE UPDATE ON guild_challenges
  FOR EACH ROW EXECUTE FUNCTION set_catalogue_updated_at();

DROP TRIGGER IF EXISTS update_guild_tips_updated_at ON guild_tips;
CREATE TRIGGER update_guild_tips_updated_at
  BEFORE UPDATE ON guild_tips
  FOR EACH ROW EXECUTE FUNCTION set_catalogue_updated_at();

ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_learning_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE guild_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE guild_tips ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON games FROM anon, authenticated;
GRANT SELECT (
  id, bgg_id, title, original_name, bgg_average, average_rating, weight,
  bgg_rank, min_players, max_players, duration_minutes, min_playtime_minutes,
  max_playtime_minutes, year_published, language_dependence, image_id,
  cover_image_url, source_collection, item_type, complexity_level, player_count,
  description, is_featured, is_silver_circle, created_at, updated_at
) ON games TO anon, authenticated;
GRANT UPDATE (cover_image_url) ON games TO authenticated;

DROP POLICY IF EXISTS "Games are publicly readable" ON games;
CREATE POLICY "Games are publicly readable"
  ON games FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Members can update game images" ON games;
CREATE POLICY "Members can update game images"
  ON games FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

GRANT SELECT ON game_learning_profiles, guild_challenges, badges, guild_tips TO anon, authenticated;
GRANT SELECT ON challenge_submissions, member_badges TO authenticated;
GRANT INSERT (challenge_id, member_id, submission_text, evidence_url),
  UPDATE (submission_text, evidence_url) ON challenge_submissions TO authenticated;
GRANT INSERT (game_id, member_id, title, content),
  UPDATE (title, content) ON guild_tips TO authenticated;

DROP POLICY IF EXISTS "Learning profiles are publicly readable" ON game_learning_profiles;
CREATE POLICY "Learning profiles are publicly readable"
  ON game_learning_profiles FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Challenges are publicly readable" ON guild_challenges;
CREATE POLICY "Challenges are publicly readable"
  ON guild_challenges FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Members can view own challenge submissions" ON challenge_submissions;
CREATE POLICY "Members can view own challenge submissions"
  ON challenge_submissions FOR SELECT TO authenticated USING ((SELECT auth.uid()) = member_id);

DROP POLICY IF EXISTS "Members can submit own challenges" ON challenge_submissions;
CREATE POLICY "Members can submit own challenges"
  ON challenge_submissions FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = member_id);

DROP POLICY IF EXISTS "Members can update own challenge submissions" ON challenge_submissions;
CREATE POLICY "Members can update own challenge submissions"
  ON challenge_submissions FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = member_id) WITH CHECK ((SELECT auth.uid()) = member_id);

DROP POLICY IF EXISTS "Badges are publicly readable" ON badges;
CREATE POLICY "Badges are publicly readable"
  ON badges FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Members can view own badges" ON member_badges;
CREATE POLICY "Members can view own badges"
  ON member_badges FOR SELECT TO authenticated USING ((SELECT auth.uid()) = member_id);

DROP POLICY IF EXISTS "Tips are publicly readable" ON guild_tips;
CREATE POLICY "Tips are publicly readable"
  ON guild_tips FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Members can add own tips" ON guild_tips;
CREATE POLICY "Members can add own tips"
  ON guild_tips FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = member_id);

DROP POLICY IF EXISTS "Members can update own tips" ON guild_tips;
CREATE POLICY "Members can update own tips"
  ON guild_tips FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = member_id) WITH CHECK ((SELECT auth.uid()) = member_id);
