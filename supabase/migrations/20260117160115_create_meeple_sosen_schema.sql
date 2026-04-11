/*
  # Meeple Sosen Group Database Schema

  ## Overview
  This migration creates the database structure for The Meeple Sosen Group (MSG), 
  an elite English learning platform combining board gaming with language instruction.

  ## New Tables
  
  ### `member_profiles`
  Stores extended profile information for MSG members
  - `id` (uuid, primary key) - References auth.users
  - `display_name` (text) - Member's display name
  - `rank` (text) - Current rank (Regional Director, Chairman, etc.)
  - `xp_points` (integer) - Total experience points
  - `total_sessions` (integer) - Number of completed sessions
  - `preferred_games` (text array) - List of preferred board games
  - `joined_at` (timestamptz) - When member joined the guild
  - `avatar_url` (text) - Optional profile picture
  - `bio` (text) - Member biography
  
  ### `sessions`
  Tracks gaming sessions and bookings
  - `id` (uuid, primary key)
  - `member_id` (uuid) - References member_profiles
  - `game_title` (text) - Board game played
  - `session_date` (timestamptz) - Scheduled date/time
  - `duration_minutes` (integer) - Session length
  - `status` (text) - pending, completed, cancelled
  - `xp_earned` (integer) - XP earned from this session
  - `notes` (text) - Session notes
  - `created_at` (timestamptz)

  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Members can only view/edit their own profile
  - Members can only view their own sessions
  - Authenticated users can create new sessions
*/

-- Create member_profiles table
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

-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid REFERENCES member_profiles(id) ON DELETE CASCADE NOT NULL,
  game_title text NOT NULL,
  session_date timestamptz NOT NULL,
  duration_minutes integer DEFAULT 120 NOT NULL,
  status text DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'completed', 'cancelled')),
  xp_earned integer DEFAULT 0 NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE member_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for member_profiles
CREATE POLICY "Members can view own profile"
  ON member_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Members can update own profile"
  ON member_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Members can insert own profile"
  ON member_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- RLS Policies for sessions
CREATE POLICY "Members can view own sessions"
  ON sessions FOR SELECT
  TO authenticated
  USING (member_id = auth.uid());

CREATE POLICY "Members can create sessions"
  ON sessions FOR INSERT
  TO authenticated
  WITH CHECK (member_id = auth.uid());

CREATE POLICY "Members can update own sessions"
  ON sessions FOR UPDATE
  TO authenticated
  USING (member_id = auth.uid())
  WITH CHECK (member_id = auth.uid());

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_sessions_member_id ON sessions(member_id);
CREATE INDEX IF NOT EXISTS idx_sessions_date ON sessions(session_date);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update updated_at on member_profiles
CREATE TRIGGER update_member_profiles_updated_at 
  BEFORE UPDATE ON member_profiles 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();