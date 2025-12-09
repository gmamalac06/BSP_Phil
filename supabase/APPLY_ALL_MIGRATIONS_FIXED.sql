-- ============================================
-- SCOUTSMART - COMPLETE MIGRATION SCRIPT (FIXED)
-- ============================================
-- This script consolidates all new migrations for ScoutSmart
-- Run this in your Supabase SQL Editor to apply all changes
--
-- IMPORTANT: Make sure you've already run 20250104_initial_schema.sql
-- If not, run that first, then run this file.
--
-- Date: January 19, 2025
-- Fixed: Moved helper functions from auth schema to public schema
-- ============================================

-- ============================================
-- PART 1: ADD NEW SCOUT FIELDS
-- From: 20250119_add_scout_fields.sql
-- ============================================

-- Add email, rank, and paymentProof fields to scouts table

-- Add email field
ALTER TABLE scouts 
ADD COLUMN IF NOT EXISTS email TEXT;

-- Add rank field
ALTER TABLE scouts 
ADD COLUMN IF NOT EXISTS rank TEXT;

-- Add payment_proof field (stores URL to file in Supabase storage)
ALTER TABLE scouts 
ADD COLUMN IF NOT EXISTS payment_proof TEXT;

-- Add comments for documentation
COMMENT ON COLUMN scouts.email IS 'Scout email address for communication';
COMMENT ON COLUMN scouts.rank IS 'Current scout rank: tenderfoot, second-class, first-class, eagle';
COMMENT ON COLUMN scouts.payment_proof IS 'URL to payment proof document in Supabase storage';

-- Create index on email for faster searches
CREATE INDEX IF NOT EXISTS idx_scouts_email_lookup ON scouts(email) WHERE email IS NOT NULL;

-- ============================================
-- PART 2: CREATE SETTINGS TABLE (if missing)
-- ============================================

-- Create settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS "settings" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "category" text NOT NULL,
  "key" text NOT NULL UNIQUE,
  "value" text NOT NULL,
  "label" text NOT NULL,
  "description" text,
  "type" text NOT NULL,
  "updated_by" varchar,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

-- Add foreign key for updated_by
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'settings_updated_by_users_id_fk'
  ) THEN
    ALTER TABLE "settings"
      ADD CONSTRAINT "settings_updated_by_users_id_fk"
      FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id")
      ON DELETE set null ON UPDATE no action;
  END IF;
END $$;

-- ============================================
-- PART 3: ENABLE ROW LEVEL SECURITY
-- From: 20250119_rls_and_storage.sql
-- ============================================

-- Enable Row Level Security on all tables
ALTER TABLE scouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Helper function to get user role (in public schema, not auth)
CREATE OR REPLACE FUNCTION public.get_user_role() 
RETURNS TEXT AS $$
  SELECT COALESCE(
    auth.jwt() -> 'user_metadata' ->> 'role',
    auth.jwt() -> 'app_metadata' ->> 'role',
    'user'
  )::TEXT;
$$ LANGUAGE SQL STABLE;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin() 
RETURNS BOOLEAN AS $$
  SELECT public.get_user_role() = 'admin';
$$ LANGUAGE SQL STABLE;

-- Helper function to check if user is staff or admin
CREATE OR REPLACE FUNCTION public.is_staff() 
RETURNS BOOLEAN AS $$
  SELECT public.get_user_role() IN ('admin', 'staff');
$$ LANGUAGE SQL STABLE;

-- ============================================
-- SCOUTS TABLE POLICIES
-- ============================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admin and staff can view all scouts" ON scouts;
DROP POLICY IF EXISTS "Admin and staff can insert scouts" ON scouts;
DROP POLICY IF EXISTS "Admin and staff can update scouts" ON scouts;
DROP POLICY IF EXISTS "Only admin can delete scouts" ON scouts;

-- Admin and staff can view all scouts
CREATE POLICY "Admin and staff can view all scouts"
  ON scouts FOR SELECT
  TO authenticated
  USING (public.is_staff());

-- Admin and staff can insert scouts
CREATE POLICY "Admin and staff can insert scouts"
  ON scouts FOR INSERT
  TO authenticated
  WITH CHECK (public.is_staff());

-- Admin and staff can update scouts
CREATE POLICY "Admin and staff can update scouts"
  ON scouts FOR UPDATE
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- Only admin can delete scouts
CREATE POLICY "Only admin can delete scouts"
  ON scouts FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ============================================
-- SCHOOLS TABLE POLICIES
-- ============================================

DROP POLICY IF EXISTS "Everyone can view schools" ON schools;
DROP POLICY IF EXISTS "Admin and staff can insert schools" ON schools;
DROP POLICY IF EXISTS "Admin and staff can update schools" ON schools;
DROP POLICY IF EXISTS "Only admin can delete schools" ON schools;

-- Everyone can view schools
CREATE POLICY "Everyone can view schools"
  ON schools FOR SELECT
  TO authenticated
  USING (true);

-- Admin and staff can insert schools
CREATE POLICY "Admin and staff can insert schools"
  ON schools FOR INSERT
  TO authenticated
  WITH CHECK (public.is_staff());

-- Admin and staff can update schools
CREATE POLICY "Admin and staff can update schools"
  ON schools FOR UPDATE
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- Only admin can delete schools
CREATE POLICY "Only admin can delete schools"
  ON schools FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ============================================
-- UNITS TABLE POLICIES
-- ============================================

DROP POLICY IF EXISTS "Everyone can view units" ON units;
DROP POLICY IF EXISTS "Admin and staff can insert units" ON units;
DROP POLICY IF EXISTS "Admin and staff can update units" ON units;
DROP POLICY IF EXISTS "Only admin can delete units" ON units;

-- Everyone can view units
CREATE POLICY "Everyone can view units"
  ON units FOR SELECT
  TO authenticated
  USING (true);

-- Admin and staff can insert units
CREATE POLICY "Admin and staff can insert units"
  ON units FOR INSERT
  TO authenticated
  WITH CHECK (public.is_staff());

-- Admin and staff can update units
CREATE POLICY "Admin and staff can update units"
  ON units FOR UPDATE
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- Only admin can delete units
CREATE POLICY "Only admin can delete units"
  ON units FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ============================================
-- ACTIVITIES TABLE POLICIES
-- ============================================

DROP POLICY IF EXISTS "Everyone can view activities" ON activities;
DROP POLICY IF EXISTS "Admin and staff can insert activities" ON activities;
DROP POLICY IF EXISTS "Admin and staff can update activities" ON activities;
DROP POLICY IF EXISTS "Admin and staff can delete activities" ON activities;

-- Everyone can view activities
CREATE POLICY "Everyone can view activities"
  ON activities FOR SELECT
  TO authenticated
  USING (true);

-- Admin and staff can manage activities
CREATE POLICY "Admin and staff can insert activities"
  ON activities FOR INSERT
  TO authenticated
  WITH CHECK (public.is_staff());

CREATE POLICY "Admin and staff can update activities"
  ON activities FOR UPDATE
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

CREATE POLICY "Admin and staff can delete activities"
  ON activities FOR DELETE
  TO authenticated
  USING (public.is_staff());

-- ============================================
-- ACTIVITY_ATTENDANCE TABLE POLICIES
-- ============================================

DROP POLICY IF EXISTS "Everyone can view attendance" ON activity_attendance;
DROP POLICY IF EXISTS "Admin and staff can insert attendance" ON activity_attendance;
DROP POLICY IF EXISTS "Admin and staff can update attendance" ON activity_attendance;
DROP POLICY IF EXISTS "Admin and staff can delete attendance" ON activity_attendance;

-- Everyone can view attendance
CREATE POLICY "Everyone can view attendance"
  ON activity_attendance FOR SELECT
  TO authenticated
  USING (true);

-- Admin and staff can manage attendance
CREATE POLICY "Admin and staff can insert attendance"
  ON activity_attendance FOR INSERT
  TO authenticated
  WITH CHECK (public.is_staff());

CREATE POLICY "Admin and staff can update attendance"
  ON activity_attendance FOR UPDATE
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

CREATE POLICY "Admin and staff can delete attendance"
  ON activity_attendance FOR DELETE
  TO authenticated
  USING (public.is_staff());

-- ============================================
-- ANNOUNCEMENTS TABLE POLICIES
-- ============================================

DROP POLICY IF EXISTS "Everyone can view announcements" ON announcements;
DROP POLICY IF EXISTS "Admin and staff can insert announcements" ON announcements;
DROP POLICY IF EXISTS "Admin and staff can update announcements" ON announcements;
DROP POLICY IF EXISTS "Admin and staff can delete announcements" ON announcements;

-- Everyone can view announcements
CREATE POLICY "Everyone can view announcements"
  ON announcements FOR SELECT
  TO authenticated
  USING (true);

-- Admin and staff can manage announcements
CREATE POLICY "Admin and staff can insert announcements"
  ON announcements FOR INSERT
  TO authenticated
  WITH CHECK (public.is_staff());

CREATE POLICY "Admin and staff can update announcements"
  ON announcements FOR UPDATE
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

CREATE POLICY "Admin and staff can delete announcements"
  ON announcements FOR DELETE
  TO authenticated
  USING (public.is_staff());

-- ============================================
-- REPORTS TABLE POLICIES
-- ============================================

DROP POLICY IF EXISTS "Admin and staff can view reports" ON reports;
DROP POLICY IF EXISTS "Admin and staff can insert reports" ON reports;
DROP POLICY IF EXISTS "Admin and staff can update reports" ON reports;
DROP POLICY IF EXISTS "Admin and staff can delete reports" ON reports;

-- Admin and staff can view reports
CREATE POLICY "Admin and staff can view reports"
  ON reports FOR SELECT
  TO authenticated
  USING (public.is_staff());

-- Admin and staff can manage reports
CREATE POLICY "Admin and staff can insert reports"
  ON reports FOR INSERT
  TO authenticated
  WITH CHECK (public.is_staff());

CREATE POLICY "Admin and staff can update reports"
  ON reports FOR UPDATE
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

CREATE POLICY "Admin and staff can delete reports"
  ON reports FOR DELETE
  TO authenticated
  USING (public.is_staff());

-- ============================================
-- AUDIT_LOGS TABLE POLICIES
-- ============================================

DROP POLICY IF EXISTS "Only admin can view audit logs" ON audit_logs;
DROP POLICY IF EXISTS "Only admin can insert audit logs" ON audit_logs;

-- Only admin can view audit logs
CREATE POLICY "Only admin can view audit logs"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- Only admin can insert audit logs (system should handle this)
CREATE POLICY "Only admin can insert audit logs"
  ON audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

-- No one can update or delete audit logs (immutable)

-- ============================================
-- SETTINGS TABLE POLICIES
-- ============================================

DROP POLICY IF EXISTS "Everyone can view settings" ON settings;
DROP POLICY IF EXISTS "Only admin can insert settings" ON settings;
DROP POLICY IF EXISTS "Only admin can update settings" ON settings;
DROP POLICY IF EXISTS "Only admin can delete settings" ON settings;

-- Everyone can view settings
CREATE POLICY "Everyone can view settings"
  ON settings FOR SELECT
  TO authenticated
  USING (true);

-- Only admin can manage settings
CREATE POLICY "Only admin can insert settings"
  ON settings FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Only admin can update settings"
  ON settings FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Only admin can delete settings"
  ON settings FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ============================================
-- PART 4: STORAGE BUCKETS SETUP
-- ============================================

-- Create storage bucket for payment proofs
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-proofs', 'payment-proofs', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for profile photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-photos', 'profile-photos', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for activity photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('activity-photos', 'activity-photos', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- PART 5: STORAGE POLICIES
-- ============================================

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Admin and staff can upload payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Admin and staff can view payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "Admin and staff can upload profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Everyone can view profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Admin and staff can delete profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Admin and staff can upload activity photos" ON storage.objects;
DROP POLICY IF EXISTS "Everyone can view activity photos" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete activity photos" ON storage.objects;

-- Payment Proofs: Admin and staff can upload
CREATE POLICY "Admin and staff can upload payment proofs"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'payment-proofs' AND
    public.is_staff()
  );

-- Payment Proofs: Admin and staff can view
CREATE POLICY "Admin and staff can view payment proofs"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'payment-proofs' AND
    public.is_staff()
  );

-- Payment Proofs: Admin can delete
CREATE POLICY "Admin can delete payment proofs"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'payment-proofs' AND
    public.is_admin()
  );

-- Profile Photos: Admin and staff can upload
CREATE POLICY "Admin and staff can upload profile photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'profile-photos' AND
    public.is_staff()
  );

-- Profile Photos: Everyone can view
CREATE POLICY "Everyone can view profile photos"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'profile-photos');

-- Profile Photos: Admin and staff can delete
CREATE POLICY "Admin and staff can delete profile photos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'profile-photos' AND
    public.is_staff()
  );

-- Activity Photos: Admin and staff can upload
CREATE POLICY "Admin and staff can upload activity photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'activity-photos' AND
    public.is_staff()
  );

-- Activity Photos: Everyone can view (public bucket)
CREATE POLICY "Everyone can view activity photos"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'activity-photos');

-- Activity Photos: Admin can delete
CREATE POLICY "Admin can delete activity photos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'activity-photos' AND
    public.is_admin()
  );

-- ============================================
-- PART 6: PERFORMANCE INDEXES
-- ============================================

-- Index for scout searches
CREATE INDEX IF NOT EXISTS idx_scouts_school_id ON scouts(school_id);
CREATE INDEX IF NOT EXISTS idx_scouts_unit_id ON scouts(unit_id);
CREATE INDEX IF NOT EXISTS idx_scouts_status ON scouts(status);

-- Index for activities
CREATE INDEX IF NOT EXISTS idx_activities_date ON activities(date);
CREATE INDEX IF NOT EXISTS idx_activities_status ON activities(status);

-- Index for attendance
CREATE INDEX IF NOT EXISTS idx_attendance_activity ON activity_attendance(activity_id);
CREATE INDEX IF NOT EXISTS idx_attendance_scout ON activity_attendance(scout_id);

-- Index for announcements
CREATE INDEX IF NOT EXISTS idx_announcements_date ON announcements(created_at);
CREATE INDEX IF NOT EXISTS idx_announcements_type ON announcements(type);

-- Index for audit logs
CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_category ON audit_logs(category);

-- ============================================
-- MIGRATION COMPLETE!
-- ============================================
-- 
-- Next steps:
-- 1. Create an admin user in Authentication > Users
-- 2. Edit the user and add to User Metadata:
--    {"role": "admin", "username": "Admin"}
-- 3. Verify storage buckets were created in Storage section
-- 4. Test login and file upload functionality
--
-- ============================================

