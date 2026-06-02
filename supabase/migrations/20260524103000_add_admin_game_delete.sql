/*
  Allow catalogue deletions only for trusted administrators.

  Public and ordinary authenticated users keep read-only access. Permanent
  deletion requires an authenticated JWT whose app_metadata role is admin.
*/

GRANT DELETE ON games TO authenticated;

DROP POLICY IF EXISTS "Admins can delete catalogue games" ON games;
CREATE POLICY "Admins can delete catalogue games"
  ON games FOR DELETE TO authenticated
  USING ((SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
