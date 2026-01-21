-- Migration: Create Carousel Slides Storage Bucket
-- Date: January 18, 2026
-- Purpose: Create storage bucket for landing page carousel event images

-- ============================================
-- CREATE CAROUSEL SLIDES BUCKET
-- ============================================

-- Create the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'carousel-slides',
  'carousel-slides',
  true,  -- Public bucket so images can be viewed on landing page
  5242880,  -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']::text[]
)
ON CONFLICT (id) DO UPDATE
SET 
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']::text[];

-- ============================================
-- STORAGE POLICIES FOR CAROUSEL SLIDES
-- ============================================

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow admin upload to carousel-slides" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read of carousel-slides" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin update of carousel-slides" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin delete of carousel-slides" ON storage.objects;

-- Allow ADMIN users to upload carousel images
CREATE POLICY "Allow admin upload to carousel-slides"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'carousel-slides' 
  AND auth.uid()::text IN (
    SELECT id FROM users WHERE role = 'admin'
  )
);

-- Allow EVERYONE to view carousel images (public landing page)
CREATE POLICY "Allow public read of carousel-slides"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'carousel-slides');

-- Allow ADMIN users to update carousel images
CREATE POLICY "Allow admin update of carousel-slides"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'carousel-slides'
  AND auth.uid()::text IN (
    SELECT id FROM users WHERE role = 'admin'
  )
);

-- Allow ADMIN users to delete carousel images
CREATE POLICY "Allow admin delete of carousel-slides"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'carousel-slides'
  AND auth.uid()::text IN (
    SELECT id FROM users WHERE role = 'admin'
  )
);

-- ============================================
-- NOTES
-- ============================================
-- 1. Only admins can upload/update/delete carousel images
-- 2. Everyone can view carousel images (for public landing page)
-- 3. 5MB file size limit enforced
-- 4. Only image formats allowed (JPEG, PNG, WebP)
-- 5. Bucket is public for easy access on landing page
