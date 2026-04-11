/*
  # Fix Games Table RLS Policy

  1. Issue
    - Games table RLS policy only allows authenticated users to read
    - Unauthenticated users cannot see the games collection
    - Need to allow public read access to games

  2. Changes
    - Drop existing restrictive authenticated-only policy
    - Add new permissive public read-only policy
    - All users (authenticated and unauthenticated) can now read games
    - No write/update/delete access for public users
*/

DROP POLICY "Games are publicly readable" ON games;

CREATE POLICY "Games are publicly readable to all"
  ON games
  FOR SELECT
  TO public
  USING (true);
