/*
  Public TTGJ directory content with trusted editorial management.

  Published rows are readable through the public Data API. Drafts and all
  writes remain restricted to users whose trusted app_metadata role is admin
  or catalog_editor. Never grant this role through user-editable metadata.
*/

CREATE TABLE IF NOT EXISTS ttgj_catalog_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL CHECK (kind IN (
    'event', 'creator', 'group', 'online_sale', 'retailer',
    'game', 'experience', 'guide'
  )),
  slug text NOT NULL,
  title text NOT NULL,
  meta text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  tags text[] NOT NULL DEFAULT ARRAY[]::text[],
  action_label text NOT NULL DEFAULT 'Explore',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured boolean NOT NULL DEFAULT false,
  starts_at timestamptz,
  ends_at timestamptz,
  location text,
  event_type text,
  website_url text,
  image_url text,
  sort_order integer NOT NULL DEFAULT 100,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (kind, slug)
);

CREATE INDEX IF NOT EXISTS ttgj_catalog_entries_kind_status_idx
  ON ttgj_catalog_entries(kind, status, sort_order, title);

CREATE INDEX IF NOT EXISTS ttgj_catalog_entries_event_date_idx
  ON ttgj_catalog_entries(starts_at)
  WHERE kind = 'event' AND status = 'published';

DROP TRIGGER IF EXISTS update_ttgj_catalog_entries_updated_at ON ttgj_catalog_entries;
CREATE TRIGGER update_ttgj_catalog_entries_updated_at
  BEFORE UPDATE ON ttgj_catalog_entries
  FOR EACH ROW EXECUTE FUNCTION set_catalogue_updated_at();

ALTER TABLE ttgj_catalog_entries ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON ttgj_catalog_entries TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON ttgj_catalog_entries TO authenticated;

DROP POLICY IF EXISTS "Published TTGJ content is publicly readable" ON ttgj_catalog_entries;
CREATE POLICY "Published TTGJ content is publicly readable"
  ON ttgj_catalog_entries FOR SELECT TO anon, authenticated
  USING (status = 'published');

DROP POLICY IF EXISTS "TTGJ editors can read all content" ON ttgj_catalog_entries;
CREATE POLICY "TTGJ editors can read all content"
  ON ttgj_catalog_entries FOR SELECT TO authenticated
  USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'catalog_editor'));

DROP POLICY IF EXISTS "TTGJ editors can add content" ON ttgj_catalog_entries;
CREATE POLICY "TTGJ editors can add content"
  ON ttgj_catalog_entries FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'catalog_editor'));

DROP POLICY IF EXISTS "TTGJ editors can update content" ON ttgj_catalog_entries;
CREATE POLICY "TTGJ editors can update content"
  ON ttgj_catalog_entries FOR UPDATE TO authenticated
  USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'catalog_editor'))
  WITH CHECK ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'catalog_editor'));

DROP POLICY IF EXISTS "TTGJ editors can delete content" ON ttgj_catalog_entries;
CREATE POLICY "TTGJ editors can delete content"
  ON ttgj_catalog_entries FOR DELETE TO authenticated
  USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'catalog_editor'));
