/*
  TTGJ staff operations foundation.

  These tables hold automation configuration, audit logs, publication work,
  and verification queues. Scheduled execution still requires trusted server
  jobs such as Supabase Cron or Edge Functions. Never expose service-role
  credentials to the browser.
*/

CREATE TABLE IF NOT EXISTS ttgj_automation_jobs (
  id text PRIMARY KEY,
  title text NOT NULL,
  owner_desk text NOT NULL,
  cadence text NOT NULL,
  status text NOT NULL DEFAULT 'planned'
    CHECK (status IN ('manual', 'planned', 'enabled', 'paused')),
  description text NOT NULL DEFAULT '',
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  last_run_at timestamptz,
  next_run_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ttgj_automation_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  automation_job_id text NOT NULL REFERENCES ttgj_automation_jobs(id) ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('queued', 'running', 'succeeded', 'failed', 'cancelled')),
  started_at timestamptz,
  finished_at timestamptz,
  processed_count integer NOT NULL DEFAULT 0,
  result_summary text NOT NULL DEFAULT '',
  error_summary text NOT NULL DEFAULT '',
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ttgj_publication_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel text NOT NULL CHECK (channel IN ('seo', 'geo', 'aeo', 'editorial')),
  content_type text NOT NULL,
  source_id text,
  title text NOT NULL,
  target_slug text,
  status text NOT NULL DEFAULT 'backlog'
    CHECK (status IN ('backlog', 'draft', 'review', 'ready', 'published', 'archived')),
  scheduled_for timestamptz,
  published_at timestamptz,
  assigned_to uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ttgj_verification_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_type text NOT NULL CHECK (task_type IN (
    'venue', 'owner_claim', 'event', 'retailer', 'affiliate_link',
    'mystery_experience', 'game_import', 'publication'
  )),
  source_id text,
  title text NOT NULL,
  status text NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'in_progress', 'verified', 'blocked', 'archived')),
  priority text NOT NULL DEFAULT 'normal'
    CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  due_at timestamptz,
  last_verified_at timestamptz,
  assigned_to uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ttgj_automation_runs_job_created_idx
  ON ttgj_automation_runs(automation_job_id, created_at DESC);
CREATE INDEX IF NOT EXISTS ttgj_publication_queue_status_schedule_idx
  ON ttgj_publication_queue(status, scheduled_for, channel);
CREATE INDEX IF NOT EXISTS ttgj_verification_tasks_status_due_idx
  ON ttgj_verification_tasks(status, priority, due_at);

DROP TRIGGER IF EXISTS update_ttgj_automation_jobs_updated_at ON ttgj_automation_jobs;
CREATE TRIGGER update_ttgj_automation_jobs_updated_at
  BEFORE UPDATE ON ttgj_automation_jobs
  FOR EACH ROW EXECUTE FUNCTION set_catalogue_updated_at();

DROP TRIGGER IF EXISTS update_ttgj_publication_queue_updated_at ON ttgj_publication_queue;
CREATE TRIGGER update_ttgj_publication_queue_updated_at
  BEFORE UPDATE ON ttgj_publication_queue
  FOR EACH ROW EXECUTE FUNCTION set_catalogue_updated_at();

DROP TRIGGER IF EXISTS update_ttgj_verification_tasks_updated_at ON ttgj_verification_tasks;
CREATE TRIGGER update_ttgj_verification_tasks_updated_at
  BEFORE UPDATE ON ttgj_verification_tasks
  FOR EACH ROW EXECUTE FUNCTION set_catalogue_updated_at();

ALTER TABLE ttgj_automation_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ttgj_automation_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ttgj_publication_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE ttgj_verification_tasks ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON ttgj_automation_jobs TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ttgj_automation_runs TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ttgj_publication_queue TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ttgj_verification_tasks TO authenticated;

DROP POLICY IF EXISTS "TTGJ staff manage automation jobs" ON ttgj_automation_jobs;
CREATE POLICY "TTGJ staff manage automation jobs"
  ON ttgj_automation_jobs FOR ALL TO authenticated
  USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'catalog_editor'))
  WITH CHECK ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'catalog_editor'));

DROP POLICY IF EXISTS "TTGJ staff manage automation runs" ON ttgj_automation_runs;
CREATE POLICY "TTGJ staff manage automation runs"
  ON ttgj_automation_runs FOR ALL TO authenticated
  USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'catalog_editor'))
  WITH CHECK ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'catalog_editor'));

DROP POLICY IF EXISTS "TTGJ staff manage publication queue" ON ttgj_publication_queue;
CREATE POLICY "TTGJ staff manage publication queue"
  ON ttgj_publication_queue FOR ALL TO authenticated
  USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'catalog_editor'))
  WITH CHECK ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'catalog_editor'));

DROP POLICY IF EXISTS "TTGJ staff manage verification tasks" ON ttgj_verification_tasks;
CREATE POLICY "TTGJ staff manage verification tasks"
  ON ttgj_verification_tasks FOR ALL TO authenticated
  USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'catalog_editor'))
  WITH CHECK ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'catalog_editor'));

INSERT INTO ttgj_automation_jobs (id, title, owner_desk, cadence, status, description)
VALUES
  ('venues', 'Venue verification refresh', 'Directory desk', 'Weekly', 'manual', 'Check websites, hours, addresses, English support, and last-verified dates.'),
  ('claims', 'Owner claim review', 'Partner desk', 'Daily', 'planned', 'Approve venue ownership, publish corrections, and notify the claimant.'),
  ('bgg', 'BGG title matching', 'Catalogue desk', 'On upload', 'planned', 'Match owner CSV uploads and featured games to stable BoardGameGeek identities.'),
  ('events', 'Event expiry and recurring schedules', 'Events desk', 'Nightly', 'planned', 'Flag past events, expand recurring dates, and request organizer confirmation.'),
  ('retailers', 'Retailer and affiliate link checks', 'Shopping desk', 'Monthly', 'manual', 'Review official URLs, disclosures, and partnership status before publication.'),
  ('mystery', 'Mystery experience verification', 'Experiences desk', 'Weekly', 'manual', 'Check language support, booking links, duration, group size, price, and location.')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  owner_desk = EXCLUDED.owner_desk,
  cadence = EXCLUDED.cadence,
  description = EXCLUDED.description;
