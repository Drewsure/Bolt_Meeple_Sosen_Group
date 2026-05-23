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

DROP POLICY IF EXISTS "Admins can add catalogue games" ON games;
CREATE POLICY "Admins can add catalogue games"
  ON games FOR INSERT TO authenticated
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
