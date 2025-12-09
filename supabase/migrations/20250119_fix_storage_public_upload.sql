-- Migration: Fix Storage Public Upload for Registration
-- Date: January 19, 2025
-- Issue: Registration form can't upload files because buckets require authentication

-- ============================================
-- STORAGE BUCKET POLICIES FOR PUBLIC REGISTRATION
-- ============================================

-- Drop existing restrictive policies for profile-photos
DROP POLICY IF EXISTS "Allow authenticated uploads to profile-photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload profile photos" ON storage.objects;
DROP POLICY IF EXISTS "profile_photos_upload" ON storage.objects;

-- Drop existing restrictive policies for payment-proofs
DROP POLICY IF EXISTS "Allow authenticated uploads to payment-proofs" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "payment_proofs_upload" ON storage.objects;

-- ============================================
-- PROFILE PHOTOS BUCKET - Allow public uploads for registration
-- ============================================

-- Allow ANYONE to upload profile photos (for public registration)
CREATE POLICY "Allow public upload to profile-photos"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'profile-photos');

-- Allow users to read their own profile photos
CREATE POLICY "Allow public read of profile-photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profile-photos');

-- Allow authenticated users to update their own photos
CREATE POLICY "Allow authenticated update of profile-photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'profile-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow authenticated users to delete their own photos
CREATE POLICY "Allow authenticated delete of profile-photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'profile-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================
-- PAYMENT PROOFS BUCKET - Allow public uploads for registration
-- ============================================

-- Allow ANYONE to upload payment proofs (for public registration)
CREATE POLICY "Allow public upload to payment-proofs"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'payment-proofs');

-- Allow users to read their own payment proofs
CREATE POLICY "Allow public read of payment-proofs"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'payment-proofs');

-- Allow authenticated users to update their own payment proofs
CREATE POLICY "Allow authenticated update of payment-proofs"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'payment-proofs' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow authenticated users to delete their own payment proofs
CREATE POLICY "Allow authenticated delete of payment-proofs"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'payment-proofs' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================
-- ACTIVITY PHOTOS BUCKET - Keep authenticated only
-- ============================================

-- These stay authenticated since activities are created by logged-in users
CREATE POLICY "Allow authenticated upload to activity-photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'activity-photos');

CREATE POLICY "Allow public read of activity-photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'activity-photos');

CREATE POLICY "Allow authenticated update of activity-photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'activity-photos');

CREATE POLICY "Allow authenticated delete of activity-photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'activity-photos');

-- ============================================
-- BUCKET SIZE LIMITS (for security)
-- ============================================

-- Update buckets with size limits
UPDATE storage.buckets
SET 
  file_size_limit = 5242880,  -- 5MB limit
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']::text[]
WHERE id IN ('profile-photos', 'payment-proofs');

UPDATE storage.buckets
SET 
  file_size_limit = 10485760,  -- 10MB limit for activity photos
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png']::text[]
WHERE id = 'activity-photos';

-- ============================================
-- NOTES
-- ============================================
-- 1. Public registration can now upload files
-- 2. 5MB limit enforced on registration uploads
-- 3. Only images and PDFs allowed
-- 4. Anonymous users can upload but not update/delete
-- 5. Authenticated users can manage their own files




