/*
  # Add Downloads Table and Update Ad Ideas

  1. New Tables
    - `downloads`
      - `id` (uuid, primary key)
      - `ad_idea_id` (uuid, foreign key to ad_ideas)
      - `file_name` (text)
      - `file_url` (text)
      - `file_type` (text)
      - `file_size` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `downloads` table
    - Add policies for authenticated users to manage their own downloads

  3. Changes
    - Update ad_ideas status check constraint to include 'completed'
*/

-- Create downloads table
CREATE TABLE IF NOT EXISTS downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_idea_id uuid NOT NULL REFERENCES ad_ideas(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_type text NOT NULL,
  file_size integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;

-- Add policies for downloads
CREATE POLICY "Users can read own downloads"
  ON downloads
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ad_ideas ai
      JOIN brands b ON ai.brand_id = b.id
      WHERE ai.id = downloads.ad_idea_id AND b.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own downloads"
  ON downloads
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM ad_ideas ai
      JOIN brands b ON ai.brand_id = b.id
      WHERE ai.id = downloads.ad_idea_id AND b.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own downloads"
  ON downloads
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ad_ideas ai
      JOIN brands b ON ai.brand_id = b.id
      WHERE ai.id = downloads.ad_idea_id AND b.user_id = auth.uid()
    )
  );

-- Update ad_ideas status constraint to include 'completed'
DO $$
BEGIN
  -- Drop existing constraint if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'ad_ideas_status_check' 
    AND table_name = 'ad_ideas'
  ) THEN
    ALTER TABLE ad_ideas DROP CONSTRAINT ad_ideas_status_check;
  END IF;
  
  -- Add new constraint with 'completed' status
  ALTER TABLE ad_ideas ADD CONSTRAINT ad_ideas_status_check 
    CHECK (status IN ('draft', 'new', 'in_progress', 'completed', 'cancelled'));
END $$;