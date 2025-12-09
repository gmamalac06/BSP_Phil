-- Migration: Add profile photo, blood type, and emergency contact to scouts table
-- Date: January 19, 2025

-- Add new columns to scouts table
ALTER TABLE scouts ADD COLUMN IF NOT EXISTS profile_photo text;
ALTER TABLE scouts ADD COLUMN IF NOT EXISTS blood_type text;
ALTER TABLE scouts ADD COLUMN IF NOT EXISTS emergency_contact text;

-- Add comments for documentation
COMMENT ON COLUMN scouts.profile_photo IS 'URL to profile photo in Supabase Storage (profile-photos bucket)';
COMMENT ON COLUMN scouts.blood_type IS 'Blood type: A+, B+, O+, AB+, A-, B-, O-, AB-';
COMMENT ON COLUMN scouts.emergency_contact IS 'Emergency contact phone number';




