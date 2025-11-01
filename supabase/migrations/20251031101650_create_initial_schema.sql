/*
  # Initial Database Schema for Adally

  ## Overview
  This migration creates the complete database schema for the Adally application,
  an AI-powered ad generation platform where users can manage brands, create ad ideas,
  chat with AI agents, and download generated content.

  ## New Tables

  ### 1. profiles
  - `id` (uuid, primary key) - References auth.users
  - `email` (text, unique, not null) - User's email address
  - `full_name` (text, nullable) - User's full name
  - `avatar_url` (text, nullable) - Profile picture URL
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last profile update timestamp

  ### 2. brands
  - `id` (uuid, primary key) - Unique brand identifier
  - `user_id` (uuid, not null) - References profiles.id
  - `name` (text, not null) - Brand name
  - `description` (text, nullable) - Brand description
  - `logo_url` (text, nullable) - Brand logo URL
  - `guidelines` (text, nullable) - Brand guidelines and creative direction
  - `industry` (text, nullable) - Industry/category
  - `target_audience` (text, nullable) - Target audience description
  - `brand_colors` (text[], nullable) - Array of brand color codes
  - `created_at` (timestamptz) - Brand creation timestamp
  - `updated_at` (timestamptz) - Last brand update timestamp

  ### 3. brand_assets
  - `id` (uuid, primary key) - Unique asset identifier
  - `brand_id` (uuid, not null) - References brands.id
  - `file_name` (text, not null) - Original file name
  - `file_url` (text, not null) - Storage URL
  - `file_type` (text, not null) - MIME type
  - `file_size` (integer, not null) - File size in bytes
  - `created_at` (timestamptz) - Upload timestamp

  ### 4. ad_ideas
  - `id` (uuid, primary key) - Unique ad idea identifier
  - `brand_id` (uuid, not null) - References brands.id
  - `title` (text, not null) - Ad title
  - `description` (text, not null) - Ad description
  - `target_audience` (text, nullable) - Target audience for this ad
  - `campaign_type` (text, nullable) - Type of campaign (video, static, etc.)
  - `status` (text, default 'new') - Status: new, in_progress, completed, etc.
  - `trial_request_id` (uuid, nullable) - References trial_requests.id
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 5. chat_messages
  - `id` (uuid, primary key) - Unique message identifier
  - `user_id` (uuid, not null) - References profiles.id
  - `agent_id` (text, nullable) - Agent identifier (system, etc.)
  - `message` (text, not null) - Message content
  - `sender_type` (text, not null) - Either 'user' or 'agent'
  - `created_at` (timestamptz) - Message timestamp

  ### 6. downloads
  - `id` (uuid, primary key) - Unique download identifier
  - `ad_idea_id` (uuid, not null) - References ad_ideas.id
  - `file_name` (text, not null) - File name
  - `file_url` (text, not null) - Download URL
  - `file_type` (text, not null) - MIME type
  - `file_size` (integer, not null) - File size in bytes
  - `created_at` (timestamptz) - Creation timestamp

  ### 7. user_subscriptions
  - `id` (uuid, primary key) - Unique subscription identifier
  - `user_id` (uuid, unique, not null) - References profiles.id
  - `tier` (text, default 'free') - Subscription tier: free, basic, creator, viral, admin
  - `status` (text, default 'active') - Subscription status
  - `started_at` (timestamptz) - Subscription start date
  - `expires_at` (timestamptz, nullable) - Subscription expiry date
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 8. trial_requests
  - `id` (uuid, primary key) - Unique trial request identifier
  - `user_id` (uuid, not null) - References profiles.id
  - `brand_id` (uuid, not null) - References brands.id
  - `status` (text, default 'pending') - Status: pending, ready, delivered
  - `requested_at` (timestamptz) - Request timestamp
  - `ready_at` (timestamptz, nullable) - When video will be ready
  - `delivered_at` (timestamptz, nullable) - When video was delivered
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security

  ### Row Level Security (RLS)
  - All tables have RLS enabled
  - Users can only access their own data
  - Strict ownership checks on all operations
  - No public access allowed without authentication

  ### Policies
  Each table has four separate policies:
  1. SELECT - Users can view their own data
  2. INSERT - Users can create their own data
  3. UPDATE - Users can update their own data
  4. DELETE - Users can delete their own data

  ## Notes
  - All IDs use UUID v4 for security
  - Timestamps use timestamptz for timezone support
  - Foreign keys have CASCADE delete to maintain referential integrity
  - All tables use meaningful default values
  - RLS ensures complete data isolation between users
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create brands table
CREATE TABLE IF NOT EXISTS brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  logo_url text,
  guidelines text,
  industry text,
  target_audience text,
  brand_colors text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create brand_assets table
CREATE TABLE IF NOT EXISTS brand_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_type text NOT NULL,
  file_size integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create ad_ideas table
CREATE TABLE IF NOT EXISTS ad_ideas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  target_audience text,
  campaign_type text,
  status text DEFAULT 'new',
  trial_request_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  agent_id text,
  message text NOT NULL,
  sender_type text NOT NULL CHECK (sender_type IN ('user', 'agent')),
  created_at timestamptz DEFAULT now()
);

-- Create downloads table
CREATE TABLE IF NOT EXISTS downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_idea_id uuid NOT NULL REFERENCES ad_ideas(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_type text NOT NULL,
  file_size integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create user_subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tier text DEFAULT 'free' CHECK (tier IN ('free', 'basic', 'creator', 'viral', 'admin')),
  status text DEFAULT 'active',
  started_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create trial_requests table
CREATE TABLE IF NOT EXISTS trial_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  brand_id uuid NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'ready', 'delivered')),
  requested_at timestamptz DEFAULT now(),
  ready_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add foreign key constraint for trial_request_id in ad_ideas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'ad_ideas_trial_request_id_fkey'
  ) THEN
    ALTER TABLE ad_ideas
    ADD CONSTRAINT ad_ideas_trial_request_id_fkey
    FOREIGN KEY (trial_request_id) REFERENCES trial_requests(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE trial_requests ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
  ON profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- Brands policies
CREATE POLICY "Users can view own brands"
  ON brands FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own brands"
  ON brands FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own brands"
  ON brands FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own brands"
  ON brands FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Brand assets policies
CREATE POLICY "Users can view brand assets for own brands"
  ON brand_assets FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM brands
      WHERE brands.id = brand_assets.brand_id
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert brand assets for own brands"
  ON brand_assets FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM brands
      WHERE brands.id = brand_assets.brand_id
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update brand assets for own brands"
  ON brand_assets FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM brands
      WHERE brands.id = brand_assets.brand_id
      AND brands.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM brands
      WHERE brands.id = brand_assets.brand_id
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete brand assets for own brands"
  ON brand_assets FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM brands
      WHERE brands.id = brand_assets.brand_id
      AND brands.user_id = auth.uid()
    )
  );

-- Ad ideas policies
CREATE POLICY "Users can view ad ideas for own brands"
  ON ad_ideas FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM brands
      WHERE brands.id = ad_ideas.brand_id
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert ad ideas for own brands"
  ON ad_ideas FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM brands
      WHERE brands.id = ad_ideas.brand_id
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update ad ideas for own brands"
  ON ad_ideas FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM brands
      WHERE brands.id = ad_ideas.brand_id
      AND brands.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM brands
      WHERE brands.id = ad_ideas.brand_id
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete ad ideas for own brands"
  ON ad_ideas FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM brands
      WHERE brands.id = ad_ideas.brand_id
      AND brands.user_id = auth.uid()
    )
  );

-- Chat messages policies
CREATE POLICY "Users can view own chat messages"
  ON chat_messages FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat messages"
  ON chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chat messages"
  ON chat_messages FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own chat messages"
  ON chat_messages FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Downloads policies
CREATE POLICY "Users can view downloads for own ad ideas"
  ON downloads FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ad_ideas
      JOIN brands ON brands.id = ad_ideas.brand_id
      WHERE ad_ideas.id = downloads.ad_idea_id
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert downloads for own ad ideas"
  ON downloads FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM ad_ideas
      JOIN brands ON brands.id = ad_ideas.brand_id
      WHERE ad_ideas.id = downloads.ad_idea_id
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update downloads for own ad ideas"
  ON downloads FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ad_ideas
      JOIN brands ON brands.id = ad_ideas.brand_id
      WHERE ad_ideas.id = downloads.ad_idea_id
      AND brands.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM ad_ideas
      JOIN brands ON brands.id = ad_ideas.brand_id
      WHERE ad_ideas.id = downloads.ad_idea_id
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete downloads for own ad ideas"
  ON downloads FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ad_ideas
      JOIN brands ON brands.id = ad_ideas.brand_id
      WHERE ad_ideas.id = downloads.ad_idea_id
      AND brands.user_id = auth.uid()
    )
  );

-- User subscriptions policies
CREATE POLICY "Users can view own subscription"
  ON user_subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscription"
  ON user_subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription"
  ON user_subscriptions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own subscription"
  ON user_subscriptions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Trial requests policies
CREATE POLICY "Users can view own trial requests"
  ON trial_requests FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trial requests"
  ON trial_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trial requests"
  ON trial_requests FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own trial requests"
  ON trial_requests FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS brands_user_id_idx ON brands(user_id);
CREATE INDEX IF NOT EXISTS brand_assets_brand_id_idx ON brand_assets(brand_id);
CREATE INDEX IF NOT EXISTS ad_ideas_brand_id_idx ON ad_ideas(brand_id);
CREATE INDEX IF NOT EXISTS ad_ideas_trial_request_id_idx ON ad_ideas(trial_request_id);
CREATE INDEX IF NOT EXISTS chat_messages_user_id_idx ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS downloads_ad_idea_id_idx ON downloads(ad_idea_id);
CREATE INDEX IF NOT EXISTS user_subscriptions_user_id_idx ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS trial_requests_user_id_idx ON trial_requests(user_id);
CREATE INDEX IF NOT EXISTS trial_requests_brand_id_idx ON trial_requests(brand_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_profiles_updated_at') THEN
    CREATE TRIGGER update_profiles_updated_at
      BEFORE UPDATE ON profiles
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_brands_updated_at') THEN
    CREATE TRIGGER update_brands_updated_at
      BEFORE UPDATE ON brands
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_ad_ideas_updated_at') THEN
    CREATE TRIGGER update_ad_ideas_updated_at
      BEFORE UPDATE ON ad_ideas
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_subscriptions_updated_at') THEN
    CREATE TRIGGER update_user_subscriptions_updated_at
      BEFORE UPDATE ON user_subscriptions
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_trial_requests_updated_at') THEN
    CREATE TRIGGER update_trial_requests_updated_at
      BEFORE UPDATE ON trial_requests
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;