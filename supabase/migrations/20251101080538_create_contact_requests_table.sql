/*
  # Create Contact Requests Table

  1. New Tables
    - `contact_requests`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `email` (text, not null)
      - `prompt` (text, not null - project description)
      - `file_urls` (text array - URLs of uploaded files)
      - `status` (text: 'new', 'reviewed', 'in_progress', 'completed')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `contact_requests` table
    - Public can insert new requests
    - Only admin can read/update existing requests
*/

CREATE TABLE IF NOT EXISTS contact_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  prompt text NOT NULL,
  file_urls text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'in_progress', 'completed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact requests"
  ON contact_requests
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own requests"
  ON contact_requests
  FOR SELECT
  TO authenticated
  USING (email = auth.jwt()->>'email' OR auth.jwt()->>'email' LIKE '%admin%');

CREATE POLICY "Admin can view all requests"
  ON contact_requests
  FOR SELECT
  TO authenticated
  USING (auth.jwt()->>'email' LIKE '%admin%');

CREATE POLICY "Admin can update requests"
  ON contact_requests
  FOR UPDATE
  TO authenticated
  USING (auth.jwt()->>'email' LIKE '%admin%')
  WITH CHECK (auth.jwt()->>'email' LIKE '%admin%');

CREATE INDEX idx_contact_requests_email ON contact_requests(email);
CREATE INDEX idx_contact_requests_status ON contact_requests(status);
CREATE INDEX idx_contact_requests_created_at ON contact_requests(created_at);
