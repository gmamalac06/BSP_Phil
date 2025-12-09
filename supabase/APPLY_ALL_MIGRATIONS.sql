-- ============================================
-- SCOUTSMART - COMPLETE MIGRATION SCRIPT
-- ============================================
-- This script consolidates all new migrations for ScoutSmart
-- Run this in your Supabase SQL Editor to apply all changes
--
-- IMPORTANT: Make sure you've already run 20250104_initial_schema.sql
-- If not, run that first, then run this file.
--
-- Date: January 19, 2025
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
-- PART 2: ENABLE ROW LEVEL SECURITY
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

-- Helper function to get user role
CREATE OR REPLACE FUNCTION auth.user_role() 
RETURNS TEXT AS $$
  SELECT COALESCE(
    (auth.jwt() -> 'user_metadata' ->> 'role'),
    (auth.jwt() -> 'app_metadata' ->> 'role'),
    'user'
  )::TEXT;
$$ LANGUAGE SQL SECURITY DEFINER;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION auth.is_admin() 
RETURNS BOOLEAN AS $$
  SELECT auth.user_role() = 'admin';
$$ LANGUAGE SQL SECURITY DEFINER;

-- Helper function to check if user is staff or admin
CREATE OR REPLACE FUNCTION auth.is_staff() 
RETURNS BOOLEAN AS $$
  SELECT auth.user_role() IN ('admin', 'staff');
$$ LANGUAGE SQL SECURITY DEFINER;

-- ============================================
-- SCOUTS TABLE POLICIES
-- ============================================

-- Admin and staff can view all scouts
CREATE POLICY "Admin and staff can view all scouts"
  ON scouts FOR SELECT
  TO authenticated
  USING (auth.is_staff());

-- Admin and staff can insert scouts
CREATE POLICY "Admin and staff can insert scouts"
  ON scouts FOR INSERT
  TO authenticated
  WITH CHECK (auth.is_staff());

-- Admin and staff can update scouts
CREATE POLICY "Admin and staff can update scouts"
  ON scouts FOR UPDATE
  TO authenticated
  USING (auth.is_staff())
  WITH CHECK (auth.is_staff());

-- Only admin can delete scouts
CREATE POLICY "Only admin can delete scouts"
  ON scouts FOR DELETE
  TO authenticated
  USING (auth.is_admin());

-- ============================================
-- SCHOOLS TABLE POLICIES
-- ============================================

-- Everyone can view schools
CREATE POLICY "Everyone can view schools"
  ON schools FOR SELECT
  TO authenticated
  USING (true);

-- Admin and staff can insert schools
CREATE POLICY "Admin and staff can insert schools"
  ON schools FOR INSERT
  TO authenticated
  WITH CHECK (auth.is_staff());

-- Admin and staff can update schools
CREATE POLICY "Admin and staff can update schools"
  ON schools FOR UPDATE
  TO authenticated
  USING (auth.is_staff())
  WITH CHECK (auth.is_staff());

-- Only admin can delete schools
CREATE POLICY "Only admin can delete schools"
  ON schools FOR DELETE
  TO authenticated
  USING (auth.is_admin());

-- ============================================
-- UNITS TABLE POLICIES
-- ============================================

-- Everyone can view units
CREATE POLICY "Everyone can view units"
  ON units FOR SELECT
  TO authenticated
  USING (true);

-- Admin and staff can insert units
CREATE POLICY "Admin and staff can insert units"
  ON units FOR INSERT
  TO authenticated
  WITH CHECK (auth.is_staff());

-- Admin and staff can update units
CREATE POLICY "Admin and staff can update units"
  ON units FOR UPDATE
  TO authenticated
  USING (auth.is_staff())
  WITH CHECK (auth.is_staff());

-- Only admin can delete units
CREATE POLICY "Only admin can delete units"
  ON units FOR DELETE
  TO authenticated
  USING (auth.is_admin());

-- ============================================
-- ACTIVITIES TABLE POLICIES
-- ============================================

-- Everyone can view activities
CREATE POLICY "Everyone can view activities"
  ON activities FOR SELECT
  TO authenticated
  USING (true);

-- Admin and staff can manage activities
CREATE POLICY "Admin and staff can insert activities"
  ON activities FOR INSERT
  TO authenticated
  WITH CHECK (auth.is_staff());

CREATE POLICY "Admin and staff can update activities"
  ON activities FOR UPDATE
  TO authenticated
  USING (auth.is_staff())
  WITH CHECK (auth.is_staff());

CREATE POLICY "Admin and staff can delete activities"
  ON activities FOR DELETE
  TO authenticated
  USING (auth.is_staff());

-- ============================================
-- ACTIVITY_ATTENDANCE TABLE POLICIES
-- ============================================

-- Everyone can view attendance
CREATE POLICY "Everyone can view attendance"
  ON activity_attendance FOR SELECT
  TO authenticated
  USING (true);

-- Admin and staff can manage attendance
CREATE POLICY "Admin and staff can insert attendance"
  ON activity_attendance FOR INSERT
  TO authenticated
  WITH CHECK (auth.is_staff());

CREATE POLICY "Admin and staff can update attendance"
  ON activity_attendance FOR UPDATE
  TO authenticated
  USING (auth.is_staff())
  WITH CHECK (auth.is_staff());

CREATE POLICY "Admin and staff can delete attendance"
  ON activity_attendance FOR DELETE
  TO authenticated
  USING (auth.is_staff());

-- ============================================
-- ANNOUNCEMENTS TABLE POLICIES
-- ============================================

-- Everyone can view announcements
CREATE POLICY "Everyone can view announcements"
  ON announcements FOR SELECT
  TO authenticated
  USING (true);

-- Admin and staff can manage announcements
CREATE POLICY "Admin and staff can insert announcements"
  ON announcements FOR INSERT
  TO authenticated
  WITH CHECK (auth.is_staff());

CREATE POLICY "Admin and staff can update announcements"
  ON announcements FOR UPDATE
  TO authenticated
  USING (auth.is_staff())
  WITH CHECK (auth.is_staff());

CREATE POLICY "Admin and staff can delete announcements"
  ON announcements FOR DELETE
  TO authenticated
  USING (auth.is_staff());

-- ============================================
-- REPORTS TABLE POLICIES
-- ============================================

-- Admin and staff can view reports
CREATE POLICY "Admin and staff can view reports"
  ON reports FOR SELECT
  TO authenticated
  USING (auth.is_staff());

-- Admin and staff can manage reports
CREATE POLICY "Admin and staff can insert reports"
  ON reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.is_staff());

CREATE POLICY "Admin and staff can update reports"
  ON reports FOR UPDATE
  TO authenticated
  USING (auth.is_staff())
  WITH CHECK (auth.is_staff());

CREATE POLICY "Admin and staff can delete reports"
  ON reports FOR DELETE
  TO authenticated
  USING (auth.is_staff());

-- ============================================
-- AUDIT_LOGS TABLE POLICIES
-- ============================================

-- Only admin can view audit logs
CREATE POLICY "Only admin can view audit logs"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (auth.is_admin());

-- Only admin can insert audit logs (system should handle this)
CREATE POLICY "Only admin can insert audit logs"
  ON audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.is_admin());

-- No one can update or delete audit logs (immutable)

-- ============================================
-- SETTINGS TABLE POLICIES
-- ============================================

-- Everyone can view settings
CREATE POLICY "Everyone can view settings"
  ON settings FOR SELECT
  TO authenticated
  USING (true);

-- Only admin can manage settings
CREATE POLICY "Only admin can insert settings"
  ON settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.is_admin());

CREATE POLICY "Only admin can update settings"
  ON settings FOR UPDATE
  TO authenticated
  USING (auth.is_admin())
  WITH CHECK (auth.is_admin());

CREATE POLICY "Only admin can delete settings"
  ON settings FOR DELETE
  TO authenticated
  USING (auth.is_admin());

-- ============================================
-- PART 3: STORAGE BUCKETS SETUP
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
-- STORAGE POLICIES
-- ============================================

-- Payment Proofs: Admin and staff can upload
CREATE POLICY "Admin and staff can upload payment proofs"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'payment-proofs' AND
    auth.is_staff()
  );

-- Payment Proofs: Admin and staff can view
CREATE POLICY "Admin and staff can view payment proofs"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'payment-proofs' AND
    auth.is_staff()
  );

-- Payment Proofs: Admin can delete
CREATE POLICY "Admin can delete payment proofs"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'payment-proofs' AND
    auth.is_admin()
  );

-- Profile Photos: Admin and staff can upload
CREATE POLICY "Admin and staff can upload profile photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'profile-photos' AND
    auth.is_staff()
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
    auth.is_staff()
  );

-- Activity Photos: Admin and staff can upload
CREATE POLICY "Admin and staff can upload activity photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'activity-photos' AND
    auth.is_staff()
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
    auth.is_admin()
  );

-- ============================================
-- PART 4: PERFORMANCE INDEXES
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
CREATE INDEX IF NOT EXISTS idx_announcements_priority ON announcements(priority);

-- Index for audit logs
CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action);

-- ============================================
-- PART 5: ADMIN ACCOUNT SETUP FUNCTION
-- From: 20250119_create_admin.sql
-- ============================================

CREATE OR REPLACE FUNCTION setup_admin_account(
  admin_email TEXT,
  admin_username TEXT DEFAULT 'Admin'
)
RETURNS TEXT
SECURITY DEFINER
AS $$
DECLARE
  user_id UUID;
BEGIN
  -- Find the user by email
  SELECT id INTO user_id
  FROM auth.users
  WHERE email = admin_email;

  IF user_id IS NULL THEN
    RETURN 'User not found. Please create the user first through Supabase Auth.';
  END IF;

  -- Update user metadata to set admin role
  UPDATE auth.users
  SET 
    raw_user_meta_data = jsonb_build_object(
      'role', 'admin',
      'username', admin_username
    ),
    raw_app_meta_data = jsonb_build_object(
      'role', 'admin',
      'provider', 'email'
    )
  WHERE id = user_id;

  RETURN 'Admin account setup complete for: ' || admin_email;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- MIGRATION COMPLETE!
-- ============================================
-- 
-- Next steps:
-- 1. Create an admin user in Authentication > Users
-- 2. Run: SELECT setup_admin_account('your-email@example.com', 'Your Name');
-- 3. Verify storage buckets were created in Storage section
-- 4. Test login and file upload functionality
--
-- ============================================




