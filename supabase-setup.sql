-- Supabase Database Setup for Beta Website
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Disable email confirmation for localhost development
-- This allows immediate signup without email verification
UPDATE auth.users SET email_confirmed_at = NOW() WHERE email_confirmed_at IS NULL;

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for product images bucket
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Authenticated users can upload images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update images" ON storage.objects FOR UPDATE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete images" ON storage.objects FOR DELETE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(10,2) NOT NULL CHECK (price > 0),
    category TEXT NOT NULL CHECK (category IN ('living_room', 'bedroom', 'kitchen', 'lighting', 'decor', 'outdoor')),
    image_url TEXT NOT NULL,
    gallery_images TEXT[] DEFAULT '{}',
    featured BOOLEAN DEFAULT FALSE,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_date trigger
CREATE OR REPLACE FUNCTION update_updated_date_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_date = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_date 
    BEFORE UPDATE ON products 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_date_column();

-- Insert sample products
INSERT INTO products (name, description, price, category, image_url, featured) VALUES
('Modern Sofa Set', 'Comfortable 3-seater sofa with premium fabric upholstery', 45000, 'living_room', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800', true),
('Oak Dining Table', 'Solid oak dining table for 6 people', 35000, 'kitchen', 'https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=800', true),
('Bedside Lamp', 'Modern ceramic bedside lamp with warm lighting', 8500, 'lighting', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800', false),
('Leather Armchair', 'Premium leather armchair with ergonomic design', 28000, 'living_room', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800', true),
('Kitchen Island', 'Multi-functional kitchen island with storage', 55000, 'kitchen', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800', false),
('Garden Bench', 'Weather-resistant outdoor bench', 15000, 'outdoor', 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800', true);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies for products table
-- Allow public read access
CREATE POLICY "Allow public read access on products" ON products
    FOR SELECT USING (true);

-- Allow authenticated users to insert, update, delete (for admin)
CREATE POLICY "Allow authenticated insert on products" ON products
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update on products" ON products
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete on products" ON products
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_created_date ON products(created_date);

-- Optional: Create a view for featured products
CREATE OR REPLACE VIEW featured_products AS
SELECT * FROM products WHERE featured = true ORDER BY created_date DESC;

-- Optional: Create a function to get products by category
CREATE OR REPLACE FUNCTION get_products_by_category(category_name TEXT)
RETURNS TABLE (
    id UUID,
    name TEXT,
    description TEXT,
    price NUMERIC,
    category TEXT,
    image_url TEXT,
    gallery_images TEXT[],
    featured BOOLEAN,
    created_date TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    IF category_name = 'all' OR category_name IS NULL THEN
        RETURN QUERY SELECT p.* FROM products p ORDER BY p.created_date DESC;
    ELSE
        RETURN QUERY SELECT p.* FROM products p WHERE p.category = category_name ORDER BY p.created_date DESC;
    END IF;
END;
$$ LANGUAGE plpgsql;
