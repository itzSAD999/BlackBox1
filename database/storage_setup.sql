-- Storage Setup for BlackBox Project
-- This script sets up the necessary storage buckets and policies

-- Create storage bucket for repair images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'repair-images',
  'repair-images',
  true,
  5242880, -- 5MB in bytes
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for product images (if needed)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  10485760, -- 10MB in bytes
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- RLS Policies for repair-images bucket
CREATE POLICY "Users can upload their own repair images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'repair-images' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can view their own repair images"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'repair-images' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update their own repair images"
  ON storage.objects FOR UPDATE
  WITH CHECK (
    bucket_id = 'repair-images' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can delete their own repair images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'repair-images' AND
    auth.role() = 'authenticated'
  );

-- RLS Policies for product-images bucket
CREATE POLICY "Public can view product images"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'product-images'
  );

CREATE POLICY "Admins can manage product images"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'product-images' AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );
