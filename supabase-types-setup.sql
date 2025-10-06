-- Types Management Setup for Admin Panel
-- Run this in your Supabase SQL Editor

-- Create the types table
CREATE TABLE IF NOT EXISTS types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT DEFAULT '#6B7280', -- Hex color for UI display
  image_url TEXT, -- URL for type image
  created_date TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- If table already exists, alter it to ensure proper UUID generation
ALTER TABLE types ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Add image_url column if it doesn't exist
ALTER TABLE types ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Create updated_at trigger for types
DROP TRIGGER IF EXISTS update_types_updated_at ON types;
CREATE TRIGGER update_types_updated_at BEFORE UPDATE ON types
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on types table
ALTER TABLE types ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access to types" ON types;
DROP POLICY IF EXISTS "Allow admin insert types" ON types;
DROP POLICY IF EXISTS "Allow admin update types" ON types;
DROP POLICY IF EXISTS "Allow admin delete types" ON types;
DROP POLICY IF EXISTS "Allow service role full access to types" ON types;

-- Policy 1: Allow public read access to types (for website visitors)
CREATE POLICY "Allow public read access to types" 
ON types FOR SELECT 
USING (true);

-- Policy 2: Allow admin users to insert types
CREATE POLICY "Allow admin insert types" 
ON types FOR INSERT 
WITH CHECK (
  auth.jwt() ->> 'email' = 'example@gmail.com'
  OR 
  auth.jwt() ->> 'role' = 'admin'
);

-- Policy 3: Allow admin users to update types
CREATE POLICY "Allow admin update types" 
ON types FOR UPDATE 
USING (
  auth.jwt() ->> 'email' = 'example@gmail.com'
  OR 
  auth.jwt() ->> 'role' = 'admin'
);

-- Policy 4: Allow admin users to delete types
CREATE POLICY "Allow admin delete types" 
ON types FOR DELETE 
USING (
  auth.jwt() ->> 'email' = 'example@gmail.com'
  OR 
  auth.jwt() ->> 'role' = 'admin'
);

-- Service role access
CREATE POLICY "Allow service role full access to types" 
ON types FOR ALL 
USING (auth.role() = 'service_role');

-- Insert sample types (optional)
INSERT INTO types (name, description, color, image_url) VALUES
('Furniture', 'Tables, chairs, sofas, and other furniture pieces', '#8B5CF6', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400'),
('Lighting', 'Lamps, chandeliers, and lighting fixtures', '#F59E0B', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'),
('Decor', 'Decorative items and accessories', '#EF4444', 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400'),
('Storage', 'Cabinets, shelves, and storage solutions', '#10B981', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400'),
('Textiles', 'Rugs, curtains, pillows, and fabric items', '#3B82F6', 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400'),
('Art', 'Paintings, sculptures, and wall art', '#F97316', 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400')
ON CONFLICT (name) DO NOTHING;
