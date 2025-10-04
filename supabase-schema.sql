-- Create products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR NOT NULL CHECK (category IN (
    'living_room', 'bedroom', 'kitchen', 'bathroom', 
    'office', 'outdoor', 'lighting', 'decor'
  )),
  image_url TEXT,
  gallery_images TEXT[],
  dimensions VARCHAR,
  materials VARCHAR,
  colors_available TEXT[],
  in_stock BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_products_in_stock ON products(in_stock);
CREATE INDEX idx_products_created_date ON products(created_date);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON products
  FOR SELECT USING (true);

-- Create policy to allow authenticated users to insert/update/delete
-- (You can modify this based on your authentication requirements)
CREATE POLICY "Allow authenticated users full access" ON products
  FOR ALL USING (auth.role() = 'authenticated');

-- Insert sample data
INSERT INTO products (name, description, price, category, image_url, in_stock, featured, dimensions, materials, colors_available) VALUES
(
  'Modern Sofa Set',
  'Comfortable 3-seater sofa with premium fabric upholstery',
  45000,
  'living_room',
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
  true,
  true,
  '200cm x 90cm x 85cm',
  'Premium fabric, hardwood frame',
  ARRAY['Gray', 'Navy Blue', 'Beige']
),
(
  'Oak Dining Table',
  'Solid oak dining table for 6 people',
  35000,
  'kitchen',
  'https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=800',
  true,
  true,
  '180cm x 90cm x 75cm',
  'Solid oak wood',
  ARRAY['Natural Oak', 'Dark Walnut']
),
(
  'Bedside Lamp',
  'Modern ceramic bedside lamp with warm lighting',
  8500,
  'lighting',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
  true,
  false,
  '25cm x 25cm x 45cm',
  'Ceramic base, fabric shade',
  ARRAY['White', 'Black', 'Blue']
),
(
  'Leather Armchair',
  'Premium leather armchair with ergonomic design',
  28000,
  'living_room',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
  true,
  true,
  '80cm x 85cm x 95cm',
  'Genuine leather, steel frame',
  ARRAY['Brown', 'Black', 'Cognac']
),
(
  'Kitchen Island',
  'Multi-functional kitchen island with storage',
  55000,
  'kitchen',
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
  true,
  false,
  '120cm x 60cm x 90cm',
  'Solid wood, granite top',
  ARRAY['Natural Wood', 'White']
),
(
  'Garden Bench',
  'Weather-resistant outdoor bench',
  15000,
  'outdoor',
  'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800',
  true,
  false,
  '150cm x 45cm x 80cm',
  'Teak wood, stainless steel',
  ARRAY['Natural Teak', 'Gray Wash']
);
