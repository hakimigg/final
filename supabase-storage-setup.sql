-- Storage Setup for Product Images
-- Run this AFTER creating the storage bucket through Supabase Dashboard

-- Storage policies for product-images bucket
-- Allow public read access to images (so they show on website)
CREATE POLICY "Allow public read access to product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Allow authenticated admin users to upload images
CREATE POLICY "Allow admin upload product images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' 
  AND (
    auth.jwt() ->> 'email' = 'example@gmail.com'
    OR auth.jwt() ->> 'role' = 'admin'
  )
);

-- Allow authenticated admin users to update images
CREATE POLICY "Allow admin update product images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'product-images' 
  AND (
    auth.jwt() ->> 'email' = 'example@gmail.com'
    OR auth.jwt() ->> 'role' = 'admin'
  )
);

-- Allow authenticated admin users to delete images
CREATE POLICY "Allow admin delete product images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images' 
  AND (
    auth.jwt() ->> 'email' = 'example@gmail.com'
    OR auth.jwt() ->> 'role' = 'admin'
  )
);

-- Alternative: Service role access (for server-side operations)
CREATE POLICY "Allow service role full access to product images"
ON storage.objects FOR ALL
USING (bucket_id = 'product-images' AND auth.role() = 'service_role');
