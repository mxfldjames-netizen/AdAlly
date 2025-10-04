/*
  # Authentication and User Management Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `full_name` (text, nullable)
      - `avatar_url` (text, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `brands`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `name` (text)
      - `description` (text, nullable)
      - `logo_url` (text, nullable)
      - `guidelines` (text, nullable)
      - `industry` (text, nullable)
      - `target_audience` (text, nullable)
      - `brand_colors` (text array, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `brand_assets`
      - `id` (uuid, primary key)
      - `brand_id` (uuid, references brands)
      - `file_name` (text)
      - `file_url` (text)
      - `file_type` (text)
      - `file_size` (integer)
      - `created_at` (timestamp)
    
    - `ad_ideas`
      - `id` (uuid, primary key)
      - `brand_id` (uuid, references brands)
      - `title` (text)
      - `description` (text)
      - `target_audience` (text, nullable)
      - `campaign_type` (text, nullable)
      - `status` (text, default 'draft')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `chat_messages`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `agent_id` (text, nullable)
      - `message` (text)
      - `sender_type` (enum: 'user' or 'agent')
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for chat messages and brand management
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
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
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
  brand_id uuid REFERENCES brands(id) ON DELETE CASCADE NOT NULL,
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_type text NOT NULL,
  file_size integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create ad_ideas table
CREATE TABLE IF NOT EXISTS ad_ideas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid REFERENCES brands(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  target_audience text,
  campaign_type text,
  status text DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  agent_id text,
  message text NOT NULL,
  sender_type text CHECK (sender_type IN ('user', 'agent')) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Brands policies
CREATE POLICY "Users can read own brands"
  ON brands
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own brands"
  ON brands
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own brands"
  ON brands
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own brands"
  ON brands
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Brand assets policies
CREATE POLICY "Users can read own brand assets"
  ON brand_assets
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM brands 
      WHERE brands.id = brand_assets.brand_id 
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own brand assets"
  ON brand_assets
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM brands 
      WHERE brands.id = brand_assets.brand_id 
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own brand assets"
  ON brand_assets
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM brands 
      WHERE brands.id = brand_assets.brand_id 
      AND brands.user_id = auth.uid()
    )
  );

-- Ad ideas policies
CREATE POLICY "Users can read own ad ideas"
  ON ad_ideas
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM brands 
      WHERE brands.id = ad_ideas.brand_id 
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own ad ideas"
  ON ad_ideas
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM brands 
      WHERE brands.id = ad_ideas.brand_id 
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own ad ideas"
  ON ad_ideas
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM brands 
      WHERE brands.id = ad_ideas.brand_id 
      AND brands.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own ad ideas"
  ON ad_ideas
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM brands 
      WHERE brands.id = ad_ideas.brand_id 
      AND brands.user_id = auth.uid()
    )
  );

-- Chat messages policies
CREATE POLICY "Users can read own chat messages"
  ON chat_messages
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat messages"
  ON chat_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create storage bucket for brand assets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('brand-assets', 'brand-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for brand assets
CREATE POLICY "Users can upload brand assets"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'brand-assets');

CREATE POLICY "Users can view brand assets"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'brand-assets');

CREATE POLICY "Users can delete own brand assets"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'brand-assets' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create function to handle updated_at timestamps
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER brands_updated_at
  BEFORE UPDATE ON brands
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER ad_ideas_updated_at
  BEFORE UPDATE ON ad_ideas
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();