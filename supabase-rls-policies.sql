-- RLS Policies for Admin Panel
-- Run these commands in your Supabase SQL Editor

-- First, create the products table if it doesn't exist
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price > 0),
  category TEXT NOT NULL CHECK (category IN ('living_room', 'bedroom', 'kitchen', 'bathroom', 'office', 'outdoor', 'lighting', 'decor')),
  image_url TEXT,
  gallery_images TEXT[],
  featured BOOLEAN DEFAULT false,
  created_date TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- If table already exists, alter it to ensure proper UUID generation
ALTER TABLE products ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on products table
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access to products" ON products;
DROP POLICY IF EXISTS "Allow admin insert products" ON products;
DROP POLICY IF EXISTS "Allow admin update products" ON products;
DROP POLICY IF EXISTS "Allow admin delete products" ON products;
DROP POLICY IF EXISTS "Allow service role full access" ON products;

-- Policy 1: Allow public read access to products (for website visitors)
CREATE POLICY "Allow public read access to products" 
ON products FOR SELECT 
USING (true);

-- Policy 2: Allow admin users to insert products
CREATE POLICY "Allow admin insert products" 
ON products FOR INSERT 
WITH CHECK (
  auth.jwt() ->> 'email' = 'example@gmail.com'
  OR 
  auth.jwt() ->> 'role' = 'admin'
);

-- Policy 3: Allow admin users to update products
CREATE POLICY "Allow admin update products" 
ON products FOR UPDATE 
USING (
  auth.jwt() ->> 'email' = 'example@gmail.com'
  OR 
  auth.jwt() ->> 'role' = 'admin'
);

-- Policy 4: Allow admin users to delete products
CREATE POLICY "Allow admin delete products" 
ON products FOR DELETE 
USING (
  auth.jwt() ->> 'email' = 'example@gmail.com'
  OR 
  auth.jwt() ->> 'role' = 'admin'
);

-- Note: Create admin user through Supabase Dashboard instead
-- Go to Authentication > Users > Add User
-- Email: example@gmail.com
-- Password: admin123
-- This is safer than direct database insertion

-- Alternative: Create a service role key policy (more secure)
-- This allows operations with the service role key
CREATE POLICY "Allow service role full access" 
ON products FOR ALL 
USING (auth.role() = 'service_role');

-- Create storage bucket for product images
-- Note: Run this in Supabase Dashboard > Storage, or use the dashboard to create bucket
-- Bucket name: product-images
-- Public: true (so images can be viewed on website)

-- Storage policies for product-images bucket
-- (These need to be created after the bucket exists)

-- Insert sample products (optional)
INSERT INTO products (name, description, price, category, image_url, featured) VALUES
('Modern Sofa Set', 'Comfortable 3-seater sofa with premium fabric upholstery', 45000.00, 'living_room', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800', true),
('Oak Dining Table', 'Solid oak dining table for 6 people', 35000.00, 'kitchen', 'https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=800', true),
('Bedside Lamp', 'Modern ceramic bedside lamp with warm lighting', 8500.00, 'lighting', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800', false),
('Leather Armchair', 'Premium leather armchair with ergonomic design', 28000.00, 'living_room', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800', true),
('Kitchen Island', 'Multi-functional kitchen island with storage', 55000.00, 'kitchen', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800', false),
('Garden Bench', 'Weather-resistant outdoor bench', 15000.00, 'outdoor', 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800', true)
ON CONFLICT DO NOTHING;
