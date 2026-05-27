/*
  Secure administrative intake for newly submitted games.

  The public client can continue reading the catalogue. New records and
  uploaded covers require an authenticated JWT whose app_metadata role was
  set to admin by a trusted server-side administrator.
*/

GRANT INSERT (
  bgg_id, title, original_name, bgg_average, average_rating, weight, bgg_rank,
  min_players, max_players, duration_minutes, min_playtime_minutes,
  max_playtime_minutes, year_published, language_dependence, cover_image_url,
  source_collection, item_type, complexity_level, player_count, description,
  is_featured, is_silver_circle
) ON games TO authenticated;

GRANT UPDATE (cover_image_url, description) ON games TO authenticated;

DROP POLICY IF EXISTS "Admins can add catalogue games" ON games;
CREATE POLICY "Admins can add catalogue games"
  ON games FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "Members can update game images" ON games;
DROP POLICY IF EXISTS "Admins can repair catalogue cards" ON games;
CREATE POLICY "Admins can repair catalogue cards"
  ON games FOR UPDATE TO authenticated
  USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE TABLE IF NOT EXISTS game_admin_update_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  requirement_note text NOT NULL,
  changed_cover_image boolean NOT NULL DEFAULT false,
  changed_description boolean NOT NULL DEFAULT false,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE game_admin_update_notes ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT ON game_admin_update_notes TO authenticated;

DROP POLICY IF EXISTS "Admins can read game update notes" ON game_admin_update_notes;
CREATE POLICY "Admins can read game update notes"
  ON game_admin_update_notes FOR SELECT TO authenticated
  USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "Admins can record game update notes" ON game_admin_update_notes;
CREATE POLICY "Admins can record game update notes"
  ON game_admin_update_notes FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

INSERT INTO storage.buckets (id, name, public)
VALUES ('game-covers', 'game-covers', true)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

DROP POLICY IF EXISTS "Admins can upload game covers" ON storage.objects;
CREATE POLICY "Admins can upload game covers"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'game-covers'
    AND (SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );
