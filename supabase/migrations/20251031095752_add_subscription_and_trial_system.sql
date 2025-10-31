/*
  # Add Subscription and Trial System

  1. New Tables
    - `user_subscriptions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `tier` (text: 'free', 'basic', 'creator', 'viral')
      - `status` (text: 'active', 'cancelled')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `trial_requests`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `brand_id` (uuid, references brands)
      - `status` (text: 'pending', 'ready', 'delivered')
      - `requested_at` (timestamp)
      - `ready_at` (timestamp)
      - `delivered_at` (timestamp)

  2. Changes to existing tables
    - Add `trial_request_id` column to `ad_ideas` for linking trial videos

  3. Security
    - Enable RLS on new tables
    - Add appropriate policies for data access
*/

-- Create user_subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  tier text NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'basic', 'creator', 'viral')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create trial_requests table
CREATE TABLE IF NOT EXISTS trial_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  brand_id uuid NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'ready', 'delivered')),
  requested_at timestamptz DEFAULT now(),
  ready_at timestamptz,
  delivered_at timestamptz
);

-- Add trial_request_id to ad_ideas if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ad_ideas' AND column_name = 'trial_request_id'
  ) THEN
    ALTER TABLE ad_ideas ADD COLUMN trial_request_id uuid REFERENCES trial_requests(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE trial_requests ENABLE ROW LEVEL SECURITY;

-- User Subscriptions Policies
CREATE POLICY "Users can read own subscription"
  ON user_subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription"
  ON user_subscriptions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Trial Requests Policies
CREATE POLICY "Users can read own trial requests"
  ON trial_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create trial requests"
  ON trial_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trial requests"
  ON trial_requests
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create initial subscription for new users (trigger function)
CREATE OR REPLACE FUNCTION create_user_subscription()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_subscriptions (user_id, tier, status)
  VALUES (NEW.id, 'free', 'active')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create subscription on user signup
DROP TRIGGER IF EXISTS on_user_signup ON auth.users;
CREATE TRIGGER on_user_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_subscription();
