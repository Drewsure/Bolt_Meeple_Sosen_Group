/*
  TTGJ game-to-place discovery foundation.

  BoardGameGeek remains the canonical global title identity through games.bgg_id.
  TTGJ owns the Japan-specific layer: claimable venues, verified venue/game
  relationships, English-support notes, and the public tourist pipeline.
*/

CREATE TABLE IF NOT EXISTS ttgj_venues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id text UNIQUE,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  name_japanese text NOT NULL DEFAULT '',
  category text NOT NULL,
  address text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT '',
  prefecture text NOT NULL DEFAULT '',
  postal_code text NOT NULL DEFAULT '',
  latitude double precision,
  longitude double precision,
  phone text NOT NULL DEFAULT '',
  website_url text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  hours text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  specialties text[] NOT NULL DEFAULT ARRAY[]::text[],
  library_size_band text NOT NULL DEFAULT 'not_supplied'
    CHECK (library_size_band IN ('not_supplied', 'under_100', '100_plus', '300_plus', '500_plus')),
  game_catalog_status text NOT NULL DEFAULT 'not_supplied'
    CHECK (game_catalog_status IN ('not_supplied', 'library_size_confirmed', 'featured_games_only', 'full_searchable_library')),
  english_support text NOT NULL DEFAULT 'not_confirmed'
    CHECK (english_support IN ('not_confirmed', 'limited', 'available', 'bilingual')),
  price_range text NOT NULL DEFAULT '',
  social_url text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  publication_status text NOT NULL DEFAULT 'draft'
    CHECK (publication_status IN ('draft', 'published', 'archived')),
  verification_status text NOT NULL DEFAULT 'imported'
    CHECK (verification_status IN ('imported', 'owner_confirmed', 'editor_verified')),
  owner_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (latitude IS NULL OR latitude BETWEEN -90 AND 90),
  CHECK (longitude IS NULL OR longitude BETWEEN -180 AND 180)
);

CREATE INDEX IF NOT EXISTS ttgj_venues_public_directory_idx
  ON ttgj_venues(publication_status, prefecture, city, name);

CREATE INDEX IF NOT EXISTS ttgj_venues_owner_idx
  ON ttgj_venues(owner_user_id)
  WHERE owner_user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS ttgj_venues_geo_idx
  ON ttgj_venues(latitude, longitude)
  WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

CREATE TABLE IF NOT EXISTS ttgj_venue_claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id uuid NOT NULL REFERENCES ttgj_venues(id) ON DELETE CASCADE,
  claimant_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'submitted'
    CHECK (status IN ('submitted', 'approved', 'rejected', 'withdrawn')),
  evidence_note text NOT NULL DEFAULT '',
  reviewer_note text NOT NULL DEFAULT '',
  reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz,
  UNIQUE (venue_id, claimant_user_id)
);

CREATE INDEX IF NOT EXISTS ttgj_venue_claims_status_idx
  ON ttgj_venue_claims(status, submitted_at);

CREATE TABLE IF NOT EXISTS ttgj_venue_games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id uuid NOT NULL REFERENCES ttgj_venues(id) ON DELETE CASCADE,
  game_id uuid NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  availability_type text NOT NULL DEFAULT 'playable'
    CHECK (availability_type IN ('playable', 'retail_stock', 'orderable', 'event_only')),
  publication_status text NOT NULL DEFAULT 'draft'
    CHECK (publication_status IN ('draft', 'published', 'archived')),
  verification_status text NOT NULL DEFAULT 'reported'
    CHECK (verification_status IN ('reported', 'owner_confirmed', 'editor_verified')),
  english_rules_available boolean,
  language_guidance text NOT NULL DEFAULT '',
  price_note text NOT NULL DEFAULT '',
  availability_note text NOT NULL DEFAULT '',
  source_note text NOT NULL DEFAULT '',
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (venue_id, game_id, availability_type)
);

CREATE INDEX IF NOT EXISTS ttgj_venue_games_game_lookup_idx
  ON ttgj_venue_games(game_id, publication_status, availability_type);

CREATE INDEX IF NOT EXISTS ttgj_venue_games_venue_lookup_idx
  ON ttgj_venue_games(venue_id, publication_status, availability_type);

CREATE TABLE IF NOT EXISTS ttgj_venue_game_imports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id uuid NOT NULL REFERENCES ttgj_venues(id) ON DELETE CASCADE,
  uploaded_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  raw_titles text[] NOT NULL DEFAULT ARRAY[]::text[],
  status text NOT NULL DEFAULT 'submitted'
    CHECK (status IN ('submitted', 'matching', 'review_ready', 'completed', 'rejected')),
  reviewer_note text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ttgj_venue_game_imports_venue_idx
  ON ttgj_venue_game_imports(venue_id, status, created_at DESC);

CREATE OR REPLACE FUNCTION protect_ttgj_owner_managed_fields()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  is_trusted_editor boolean :=
    COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') IN ('admin', 'catalog_editor')
    OR COALESCE(auth.jwt() ->> 'role', '') = 'service_role';
BEGIN
  IF is_trusted_editor THEN
    RETURN NEW;
  END IF;

  IF TG_TABLE_NAME = 'ttgj_venues' THEN
    IF NEW.owner_user_id IS DISTINCT FROM OLD.owner_user_id
      OR NEW.publication_status IS DISTINCT FROM OLD.publication_status
      OR NEW.verification_status IS DISTINCT FROM OLD.verification_status
      OR NEW.source_id IS DISTINCT FROM OLD.source_id
      OR NEW.slug IS DISTINCT FROM OLD.slug
    THEN
      RAISE EXCEPTION 'Only a TTGJ editor can update protected venue fields.';
    END IF;
  ELSIF TG_TABLE_NAME = 'ttgj_venue_games' THEN
    IF NEW.verification_status = 'editor_verified'
      AND NEW.verification_status IS DISTINCT FROM OLD.verification_status
    THEN
      RAISE EXCEPTION 'Only a TTGJ editor can mark a venue game as editor verified.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_ttgj_venues_updated_at ON ttgj_venues;
CREATE TRIGGER update_ttgj_venues_updated_at
  BEFORE UPDATE ON ttgj_venues
  FOR EACH ROW EXECUTE FUNCTION set_catalogue_updated_at();

DROP TRIGGER IF EXISTS protect_ttgj_venues_owner_fields ON ttgj_venues;
CREATE TRIGGER protect_ttgj_venues_owner_fields
  BEFORE UPDATE ON ttgj_venues
  FOR EACH ROW EXECUTE FUNCTION protect_ttgj_owner_managed_fields();

DROP TRIGGER IF EXISTS update_ttgj_venue_games_updated_at ON ttgj_venue_games;
CREATE TRIGGER update_ttgj_venue_games_updated_at
  BEFORE UPDATE ON ttgj_venue_games
  FOR EACH ROW EXECUTE FUNCTION set_catalogue_updated_at();

DROP TRIGGER IF EXISTS update_ttgj_venue_game_imports_updated_at ON ttgj_venue_game_imports;
CREATE TRIGGER update_ttgj_venue_game_imports_updated_at
  BEFORE UPDATE ON ttgj_venue_game_imports
  FOR EACH ROW EXECUTE FUNCTION set_catalogue_updated_at();

DROP TRIGGER IF EXISTS protect_ttgj_venue_games_owner_fields ON ttgj_venue_games;
CREATE TRIGGER protect_ttgj_venue_games_owner_fields
  BEFORE UPDATE ON ttgj_venue_games
  FOR EACH ROW EXECUTE FUNCTION protect_ttgj_owner_managed_fields();

ALTER TABLE ttgj_venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE ttgj_venue_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE ttgj_venue_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE ttgj_venue_game_imports ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON ttgj_venues, ttgj_venue_games TO anon, authenticated;
GRANT SELECT, INSERT ON ttgj_venue_claims TO authenticated;
GRANT INSERT, UPDATE, DELETE ON ttgj_venues, ttgj_venue_games TO authenticated;
GRANT SELECT, INSERT ON ttgj_venue_game_imports TO authenticated;
GRANT UPDATE (status, reviewer_note, reviewed_by, reviewed_at) ON ttgj_venue_claims TO authenticated;

DROP POLICY IF EXISTS "Published TTGJ venues are publicly readable" ON ttgj_venues;
CREATE POLICY "Published TTGJ venues are publicly readable"
  ON ttgj_venues FOR SELECT TO anon, authenticated
  USING (publication_status = 'published');

DROP POLICY IF EXISTS "TTGJ editors can read all venues" ON ttgj_venues;
CREATE POLICY "TTGJ editors can read all venues"
  ON ttgj_venues FOR SELECT TO authenticated
  USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'catalog_editor'));

DROP POLICY IF EXISTS "TTGJ owners can read own venues" ON ttgj_venues;
CREATE POLICY "TTGJ owners can read own venues"
  ON ttgj_venues FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = owner_user_id);

DROP POLICY IF EXISTS "TTGJ editors can manage venues" ON ttgj_venues;
CREATE POLICY "TTGJ editors can manage venues"
  ON ttgj_venues FOR ALL TO authenticated
  USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'catalog_editor'))
  WITH CHECK ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'catalog_editor'));

DROP POLICY IF EXISTS "TTGJ owners can update own venues" ON ttgj_venues;
CREATE POLICY "TTGJ owners can update own venues"
  ON ttgj_venues FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = owner_user_id)
  WITH CHECK ((SELECT auth.uid()) = owner_user_id);

DROP POLICY IF EXISTS "Claimants can read own TTGJ venue claims" ON ttgj_venue_claims;
CREATE POLICY "Claimants can read own TTGJ venue claims"
  ON ttgj_venue_claims FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = claimant_user_id);

DROP POLICY IF EXISTS "Claimants can submit TTGJ venue claims" ON ttgj_venue_claims;
CREATE POLICY "Claimants can submit TTGJ venue claims"
  ON ttgj_venue_claims FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = claimant_user_id);

DROP POLICY IF EXISTS "TTGJ editors can read venue claims" ON ttgj_venue_claims;
CREATE POLICY "TTGJ editors can read venue claims"
  ON ttgj_venue_claims FOR SELECT TO authenticated
  USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'catalog_editor'));

DROP POLICY IF EXISTS "TTGJ editors can review venue claims" ON ttgj_venue_claims;
CREATE POLICY "TTGJ editors can review venue claims"
  ON ttgj_venue_claims FOR UPDATE TO authenticated
  USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'catalog_editor'))
  WITH CHECK ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'catalog_editor'));

DROP POLICY IF EXISTS "Published TTGJ venue games are publicly readable" ON ttgj_venue_games;
CREATE POLICY "Published TTGJ venue games are publicly readable"
  ON ttgj_venue_games FOR SELECT TO anon, authenticated
  USING (publication_status = 'published');

DROP POLICY IF EXISTS "TTGJ editors can manage venue games" ON ttgj_venue_games;
CREATE POLICY "TTGJ editors can manage venue games"
  ON ttgj_venue_games FOR ALL TO authenticated
  USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'catalog_editor'))
  WITH CHECK ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'catalog_editor'));

DROP POLICY IF EXISTS "TTGJ owners can manage own venue games" ON ttgj_venue_games;
CREATE POLICY "TTGJ owners can manage own venue games"
  ON ttgj_venue_games FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM ttgj_venues
      WHERE ttgj_venues.id = ttgj_venue_games.venue_id
        AND ttgj_venues.owner_user_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM ttgj_venues
      WHERE ttgj_venues.id = ttgj_venue_games.venue_id
        AND ttgj_venues.owner_user_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "TTGJ owners can submit own venue game imports" ON ttgj_venue_game_imports;
CREATE POLICY "TTGJ owners can submit own venue game imports"
  ON ttgj_venue_game_imports FOR INSERT TO authenticated
  WITH CHECK (
    (SELECT auth.uid()) = uploaded_by
    AND EXISTS (
      SELECT 1
      FROM ttgj_venues
      WHERE ttgj_venues.id = ttgj_venue_game_imports.venue_id
        AND ttgj_venues.owner_user_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "TTGJ owners can read own venue game imports" ON ttgj_venue_game_imports;
CREATE POLICY "TTGJ owners can read own venue game imports"
  ON ttgj_venue_game_imports FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = uploaded_by);

DROP POLICY IF EXISTS "TTGJ editors can manage venue game imports" ON ttgj_venue_game_imports;
CREATE POLICY "TTGJ editors can manage venue game imports"
  ON ttgj_venue_game_imports FOR ALL TO authenticated
  USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'catalog_editor'))
  WITH CHECK ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'catalog_editor'));

DROP VIEW IF EXISTS ttgj_game_venue_pipeline;
CREATE VIEW ttgj_game_venue_pipeline
WITH (security_invoker = true)
AS
SELECT
  games.bgg_id,
  games.id AS game_id,
  games.title AS game_title,
  games.cover_image_url,
  ttgj_venues.id AS venue_id,
  ttgj_venues.slug AS venue_slug,
  ttgj_venues.name AS venue_name,
  ttgj_venues.category AS venue_category,
  ttgj_venues.city,
  ttgj_venues.prefecture,
  ttgj_venues.latitude,
  ttgj_venues.longitude,
  ttgj_venues.english_support AS venue_english_support,
  ttgj_venue_games.availability_type,
  ttgj_venue_games.verification_status,
  ttgj_venue_games.english_rules_available,
  ttgj_venue_games.language_guidance,
  ttgj_venue_games.price_note,
  ttgj_venue_games.availability_note
FROM ttgj_venue_games
JOIN games ON games.id = ttgj_venue_games.game_id
JOIN ttgj_venues ON ttgj_venues.id = ttgj_venue_games.venue_id
WHERE ttgj_venue_games.publication_status = 'published'
  AND ttgj_venues.publication_status = 'published'
  AND games.bgg_id IS NOT NULL;

GRANT SELECT ON ttgj_game_venue_pipeline TO anon, authenticated;
