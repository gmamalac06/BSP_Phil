-- ============================================
-- SCOUTSMART - COMPLETE DATABASE SCHEMA
-- ============================================
-- Version: 2.0
-- Date: December 2024
-- Description: Complete database schema for Boy Scouts of the Philippines
--              management system. This is a single consolidated script.
-- 
-- INSTRUCTIONS:
-- 1. Create a new Supabase project
-- 2. Go to SQL Editor
-- 3. Copy and paste this entire script
-- 4. Click "Run" to execute
-- 5. Create an admin user in Authentication > Users
-- 6. Update that user's metadata with: {"role": "admin", "username": "YourName"}
-- ============================================

-- ============================================
-- PART 1: DROP EXISTING OBJECTS (Clean Start)
-- ============================================
-- Drop policies first (they depend on functions)
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname, tablename 
        FROM pg_policies 
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I', pol.policyname, pol.tablename);
    END LOOP;
END $$;

-- Drop helper functions
DROP FUNCTION IF EXISTS public.get_user_role() CASCADE;
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;
DROP FUNCTION IF EXISTS public.is_staff() CASCADE;

-- Drop tables in correct order (respecting foreign keys)
DROP TABLE IF EXISTS activity_attendance CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS reports CASCADE;
DROP TABLE IF EXISTS settings CASCADE;
DROP TABLE IF EXISTS announcements CASCADE;
DROP TABLE IF EXISTS activities CASCADE;
DROP TABLE IF EXISTS scouts CASCADE;
DROP TABLE IF EXISTS units CASCADE;
DROP TABLE IF EXISTS schools CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- PART 2: CREATE TABLES
-- ============================================

-- Users table (integrates with Supabase Auth)
CREATE TABLE "users" (
    "id" varchar PRIMARY KEY NOT NULL,
    "email" text NOT NULL,
    "username" text NOT NULL,
    "role" text DEFAULT 'user' NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    CONSTRAINT "users_email_unique" UNIQUE("email"),
    CONSTRAINT "users_username_unique" UNIQUE("username")
);
COMMENT ON TABLE users IS 'User accounts integrated with Supabase Auth';

-- Schools table
CREATE TABLE "schools" (
    "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "name" text NOT NULL,
    "municipality" text NOT NULL,
    "principal" text,
    "created_at" timestamp DEFAULT now() NOT NULL
);
COMMENT ON TABLE schools IS 'Educational institutions in the scouting program';

-- Units table
CREATE TABLE "units" (
    "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "name" text NOT NULL,
    "leader" text NOT NULL,
    "school_id" varchar,
    "status" text DEFAULT 'active' NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL
);
COMMENT ON TABLE units IS 'Scout units/patrols organized by schools';

-- Scouts table
CREATE TABLE "scouts" (
    "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "uid" text NOT NULL,
    "name" text NOT NULL,
    "unit_id" varchar,
    "school_id" varchar,
    "municipality" text NOT NULL,
    "gender" text NOT NULL,
    "status" text DEFAULT 'pending' NOT NULL,
    "membership_years" integer DEFAULT 0,
    "date_of_birth" timestamp,
    "address" text,
    "parent_guardian" text,
    "contact_number" text,
    "email" text,
    "rank" text,
    "payment_proof" text,
    "profile_photo" text,
    "blood_type" text,
    "emergency_contact" text,
    "created_at" timestamp DEFAULT now() NOT NULL,
    CONSTRAINT "scouts_uid_unique" UNIQUE("uid")
);
COMMENT ON TABLE scouts IS 'Individual scout members with full profile';
COMMENT ON COLUMN scouts.uid IS 'Unique scout ID (e.g., BSP-2024-001234)';
COMMENT ON COLUMN scouts.rank IS 'Scout rank: tenderfoot, second-class, first-class, eagle';
COMMENT ON COLUMN scouts.payment_proof IS 'URL to payment proof document in Supabase storage';
COMMENT ON COLUMN scouts.profile_photo IS 'URL to profile photo in Supabase storage';
COMMENT ON COLUMN scouts.blood_type IS 'Blood type: A+, B+, O+, AB+, A-, B-, O-, AB-';

-- Activities table
CREATE TABLE "activities" (
    "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "title" text NOT NULL,
    "description" text NOT NULL,
    "date" timestamp NOT NULL,
    "location" text NOT NULL,
    "capacity" integer NOT NULL,
    "status" text DEFAULT 'upcoming' NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL
);
COMMENT ON TABLE activities IS 'Scout activities, events, and training sessions';

-- Activity Attendance junction table
CREATE TABLE "activity_attendance" (
    "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "activity_id" varchar NOT NULL,
    "scout_id" varchar NOT NULL,
    "attended" boolean DEFAULT false,
    "created_at" timestamp DEFAULT now() NOT NULL
);
COMMENT ON TABLE activity_attendance IS 'Tracks scout participation in activities';

-- Announcements table
CREATE TABLE "announcements" (
    "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "title" text NOT NULL,
    "content" text NOT NULL,
    "type" text NOT NULL,
    "author" text NOT NULL,
    "sms_notified" boolean DEFAULT false,
    "created_at" timestamp DEFAULT now() NOT NULL
);
COMMENT ON TABLE announcements IS 'System notifications and policy updates';

-- Reports table
CREATE TABLE "reports" (
    "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "title" text NOT NULL,
    "description" text NOT NULL,
    "category" text NOT NULL,
    "record_count" integer DEFAULT 0,
    "generated_by" varchar,
    "created_at" timestamp DEFAULT now() NOT NULL
);
COMMENT ON TABLE reports IS 'Generated analytics and documentation reports';

-- Audit Logs table
CREATE TABLE "audit_logs" (
    "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "user_id" varchar,
    "action" text NOT NULL,
    "details" text NOT NULL,
    "category" text NOT NULL,
    "ip_address" text,
    "created_at" timestamp DEFAULT now() NOT NULL
);
COMMENT ON TABLE audit_logs IS 'System audit trail for all user actions';

-- Settings table
CREATE TABLE "settings" (
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
COMMENT ON TABLE settings IS 'System configuration settings';

-- ============================================
-- PART 3: FOREIGN KEY CONSTRAINTS
-- ============================================

-- Units -> Schools
ALTER TABLE "units"
    ADD CONSTRAINT "units_school_id_schools_id_fk"
    FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id")
    ON DELETE CASCADE ON UPDATE NO ACTION;

-- Scouts -> Units
ALTER TABLE "scouts"
    ADD CONSTRAINT "scouts_unit_id_units_id_fk"
    FOREIGN KEY ("unit_id") REFERENCES "public"."units"("id")
    ON DELETE SET NULL ON UPDATE NO ACTION;

-- Scouts -> Schools
ALTER TABLE "scouts"
    ADD CONSTRAINT "scouts_school_id_schools_id_fk"
    FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id")
    ON DELETE SET NULL ON UPDATE NO ACTION;

-- Activity Attendance -> Activities
ALTER TABLE "activity_attendance"
    ADD CONSTRAINT "activity_attendance_activity_id_activities_id_fk"
    FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id")
    ON DELETE CASCADE ON UPDATE NO ACTION;

-- Activity Attendance -> Scouts
ALTER TABLE "activity_attendance"
    ADD CONSTRAINT "activity_attendance_scout_id_scouts_id_fk"
    FOREIGN KEY ("scout_id") REFERENCES "public"."scouts"("id")
    ON DELETE CASCADE ON UPDATE NO ACTION;

-- Reports -> Users
ALTER TABLE "reports"
    ADD CONSTRAINT "reports_generated_by_users_id_fk"
    FOREIGN KEY ("generated_by") REFERENCES "public"."users"("id")
    ON DELETE SET NULL ON UPDATE NO ACTION;

-- Audit Logs -> Users
ALTER TABLE "audit_logs"
    ADD CONSTRAINT "audit_logs_user_id_users_id_fk"
    FOREIGN KEY ("user_id") REFERENCES "public"."users"("id")
    ON DELETE SET NULL ON UPDATE NO ACTION;

-- Settings -> Users
ALTER TABLE "settings"
    ADD CONSTRAINT "settings_updated_by_users_id_fk"
    FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id")
    ON DELETE SET NULL ON UPDATE NO ACTION;

-- ============================================
-- PART 4: HELPER FUNCTIONS (Non-Recursive)
-- ============================================
-- These functions are designed to avoid infinite recursion
-- by NOT querying any RLS-protected tables

-- Get user role from JWT metadata (NO table queries = NO recursion)
CREATE OR REPLACE FUNCTION public.get_user_role() 
RETURNS TEXT AS $$
BEGIN
    RETURN COALESCE(
        current_setting('request.jwt.claims', true)::json->>'role',
        (current_setting('request.jwt.claims', true)::json->'user_metadata'->>'role'),
        (current_setting('request.jwt.claims', true)::json->'app_metadata'->>'role'),
        'user'
    );
EXCEPTION
    WHEN OTHERS THEN
        RETURN 'user';
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin() 
RETURNS BOOLEAN AS $$
BEGIN
    RETURN public.get_user_role() = 'admin';
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Check if current user is staff or admin
CREATE OR REPLACE FUNCTION public.is_staff() 
RETURNS BOOLEAN AS $$
BEGIN
    RETURN public.get_user_role() IN ('admin', 'staff');
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- ============================================
-- PART 5: ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE scouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PART 6: RLS POLICIES
-- ============================================

-- USERS TABLE POLICIES
CREATE POLICY "users_select_own" ON users FOR SELECT TO authenticated
    USING (auth.uid()::text = id);

CREATE POLICY "users_select_admin" ON users FOR SELECT TO authenticated
    USING (public.is_admin());

CREATE POLICY "users_insert" ON users FOR INSERT TO authenticated
    WITH CHECK (auth.uid()::text = id);

CREATE POLICY "users_update_own" ON users FOR UPDATE TO authenticated
    USING (auth.uid()::text = id)
    WITH CHECK (auth.uid()::text = id);

CREATE POLICY "users_update_admin" ON users FOR UPDATE TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- SCHOOLS TABLE POLICIES
CREATE POLICY "schools_select_all" ON schools FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "schools_insert_staff" ON schools FOR INSERT TO authenticated
    WITH CHECK (public.is_staff());

CREATE POLICY "schools_update_staff" ON schools FOR UPDATE TO authenticated
    USING (public.is_staff())
    WITH CHECK (public.is_staff());

CREATE POLICY "schools_delete_admin" ON schools FOR DELETE TO authenticated
    USING (public.is_admin());

-- UNITS TABLE POLICIES
CREATE POLICY "units_select_all" ON units FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "units_insert_staff" ON units FOR INSERT TO authenticated
    WITH CHECK (public.is_staff());

CREATE POLICY "units_update_staff" ON units FOR UPDATE TO authenticated
    USING (public.is_staff())
    WITH CHECK (public.is_staff());

CREATE POLICY "units_delete_admin" ON units FOR DELETE TO authenticated
    USING (public.is_admin());

-- SCOUTS TABLE POLICIES
CREATE POLICY "scouts_select_staff" ON scouts FOR SELECT TO authenticated
    USING (public.is_staff());

CREATE POLICY "scouts_insert_staff" ON scouts FOR INSERT TO authenticated
    WITH CHECK (public.is_staff());

CREATE POLICY "scouts_update_staff" ON scouts FOR UPDATE TO authenticated
    USING (public.is_staff())
    WITH CHECK (public.is_staff());

CREATE POLICY "scouts_delete_admin" ON scouts FOR DELETE TO authenticated
    USING (public.is_admin());

-- Allow scouts to view their own record by UID (for student login feature)
CREATE POLICY "scouts_select_own" ON scouts FOR SELECT TO authenticated
    USING (uid = current_setting('request.jwt.claims', true)::json->>'sub');

-- ACTIVITIES TABLE POLICIES
CREATE POLICY "activities_select_all" ON activities FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "activities_insert_staff" ON activities FOR INSERT TO authenticated
    WITH CHECK (public.is_staff());

CREATE POLICY "activities_update_staff" ON activities FOR UPDATE TO authenticated
    USING (public.is_staff())
    WITH CHECK (public.is_staff());

CREATE POLICY "activities_delete_staff" ON activities FOR DELETE TO authenticated
    USING (public.is_staff());

-- ACTIVITY ATTENDANCE TABLE POLICIES
CREATE POLICY "attendance_select_all" ON activity_attendance FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "attendance_insert_staff" ON activity_attendance FOR INSERT TO authenticated
    WITH CHECK (public.is_staff());

CREATE POLICY "attendance_update_staff" ON activity_attendance FOR UPDATE TO authenticated
    USING (public.is_staff())
    WITH CHECK (public.is_staff());

CREATE POLICY "attendance_delete_staff" ON activity_attendance FOR DELETE TO authenticated
    USING (public.is_staff());

-- ANNOUNCEMENTS TABLE POLICIES
CREATE POLICY "announcements_select_all" ON announcements FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "announcements_insert_staff" ON announcements FOR INSERT TO authenticated
    WITH CHECK (public.is_staff());

CREATE POLICY "announcements_update_staff" ON announcements FOR UPDATE TO authenticated
    USING (public.is_staff())
    WITH CHECK (public.is_staff());

CREATE POLICY "announcements_delete_staff" ON announcements FOR DELETE TO authenticated
    USING (public.is_staff());

-- REPORTS TABLE POLICIES
CREATE POLICY "reports_select_staff" ON reports FOR SELECT TO authenticated
    USING (public.is_staff());

CREATE POLICY "reports_insert_staff" ON reports FOR INSERT TO authenticated
    WITH CHECK (public.is_staff());

CREATE POLICY "reports_update_staff" ON reports FOR UPDATE TO authenticated
    USING (public.is_staff())
    WITH CHECK (public.is_staff());

CREATE POLICY "reports_delete_staff" ON reports FOR DELETE TO authenticated
    USING (public.is_staff());

-- AUDIT LOGS TABLE POLICIES (Admin only, immutable)
CREATE POLICY "audit_logs_select_admin" ON audit_logs FOR SELECT TO authenticated
    USING (public.is_admin());

CREATE POLICY "audit_logs_insert_admin" ON audit_logs FOR INSERT TO authenticated
    WITH CHECK (public.is_admin());

-- No UPDATE or DELETE policies - audit logs are immutable

-- SETTINGS TABLE POLICIES
CREATE POLICY "settings_select_all" ON settings FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "settings_insert_admin" ON settings FOR INSERT TO authenticated
    WITH CHECK (public.is_admin());

CREATE POLICY "settings_update_admin" ON settings FOR UPDATE TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "settings_delete_admin" ON settings FOR DELETE TO authenticated
    USING (public.is_admin());

-- ============================================
-- PART 7: PERFORMANCE INDEXES
-- ============================================

-- Scouts indexes
CREATE INDEX idx_scouts_status ON scouts(status);
CREATE INDEX idx_scouts_school_id ON scouts(school_id);
CREATE INDEX idx_scouts_unit_id ON scouts(unit_id);
CREATE INDEX idx_scouts_municipality ON scouts(municipality);
CREATE INDEX idx_scouts_email ON scouts(email) WHERE email IS NOT NULL;

-- Activities indexes
CREATE INDEX idx_activities_date ON activities(date);
CREATE INDEX idx_activities_status ON activities(status);

-- Activity Attendance indexes
CREATE INDEX idx_attendance_activity_id ON activity_attendance(activity_id);
CREATE INDEX idx_attendance_scout_id ON activity_attendance(scout_id);

-- Announcements indexes
CREATE INDEX idx_announcements_created_at ON announcements(created_at);
CREATE INDEX idx_announcements_type ON announcements(type);

-- Audit Logs indexes
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_category ON audit_logs(category);

-- Units indexes
CREATE INDEX idx_units_school_id ON units(school_id);
CREATE INDEX idx_units_status ON units(status);

-- ============================================
-- PART 8: STORAGE BUCKETS
-- ============================================

-- Create storage buckets (for file uploads)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('payment-proofs', 'payment-proofs', false, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']),
    ('profile-photos', 'profile-photos', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('activity-photos', 'activity-photos', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ============================================
-- PART 9: STORAGE POLICIES
-- ============================================

-- Drop existing storage policies
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'storage' AND tablename = 'objects'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
    END LOOP;
END $$;

-- Payment Proofs bucket policies
CREATE POLICY "payment_proofs_insert" ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'payment-proofs' AND public.is_staff());

CREATE POLICY "payment_proofs_select" ON storage.objects FOR SELECT TO authenticated
    USING (bucket_id = 'payment-proofs' AND public.is_staff());

CREATE POLICY "payment_proofs_update" ON storage.objects FOR UPDATE TO authenticated
    USING (bucket_id = 'payment-proofs' AND public.is_staff())
    WITH CHECK (bucket_id = 'payment-proofs' AND public.is_staff());

CREATE POLICY "payment_proofs_delete" ON storage.objects FOR DELETE TO authenticated
    USING (bucket_id = 'payment-proofs' AND public.is_admin());

-- Profile Photos bucket policies (public viewing)
CREATE POLICY "profile_photos_insert" ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'profile-photos' AND public.is_staff());

CREATE POLICY "profile_photos_select" ON storage.objects FOR SELECT TO authenticated
    USING (bucket_id = 'profile-photos');

CREATE POLICY "profile_photos_select_public" ON storage.objects FOR SELECT TO anon
    USING (bucket_id = 'profile-photos');

CREATE POLICY "profile_photos_update" ON storage.objects FOR UPDATE TO authenticated
    USING (bucket_id = 'profile-photos' AND public.is_staff())
    WITH CHECK (bucket_id = 'profile-photos' AND public.is_staff());

CREATE POLICY "profile_photos_delete" ON storage.objects FOR DELETE TO authenticated
    USING (bucket_id = 'profile-photos' AND public.is_staff());

-- Activity Photos bucket policies (public viewing)
CREATE POLICY "activity_photos_insert" ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'activity-photos' AND public.is_staff());

CREATE POLICY "activity_photos_select" ON storage.objects FOR SELECT TO authenticated
    USING (bucket_id = 'activity-photos');

CREATE POLICY "activity_photos_select_public" ON storage.objects FOR SELECT TO anon
    USING (bucket_id = 'activity-photos');

CREATE POLICY "activity_photos_update" ON storage.objects FOR UPDATE TO authenticated
    USING (bucket_id = 'activity-photos' AND public.is_staff())
    WITH CHECK (bucket_id = 'activity-photos' AND public.is_staff());

CREATE POLICY "activity_photos_delete" ON storage.objects FOR DELETE TO authenticated
    USING (bucket_id = 'activity-photos' AND public.is_admin());

-- ============================================
-- PART 10: DEFAULT SETTINGS DATA
-- ============================================

INSERT INTO settings (category, key, value, label, description, type) VALUES
    -- General Settings
    ('general', 'system_name', 'ScoutSmart', 'System Name', 'Display name for the system', 'text'),
    ('general', 'organization', 'Boy Scouts of the Philippines', 'Organization', 'Organization name', 'text'),
    ('general', 'auto_generate_uid', 'true', 'Auto-generate Scout UIDs', 'Automatically generate unique IDs for new scouts', 'boolean'),
    ('general', 'require_payment_proof', 'true', 'Require payment proof', 'Make payment proof upload mandatory for registration', 'boolean'),
    
    -- Notification Settings
    ('notifications', 'enable_sms', 'true', 'Enable SMS Notifications', 'Send SMS alerts for announcements and updates', 'boolean'),
    ('notifications', 'activity_reminders', 'true', 'Activity Reminders', 'Send reminders before activities and events', 'boolean'),
    ('notifications', 'enrollment_notifications', 'true', 'Enrollment Notifications', 'Notify when new scouts are registered', 'boolean'),
    ('notifications', 'sms_sender', 'BSP-ScoutSmart', 'SMS Sender Name', 'Sender name for SMS messages', 'text'),
    
    -- Security Settings
    ('security', 'enable_audit_trail', 'true', 'Enable Audit Trail', 'Log all system activities and user actions', 'boolean'),
    ('security', 'two_factor_auth', 'false', 'Two-Factor Authentication', 'Require 2FA for admin and staff accounts', 'boolean'),
    ('security', 'session_timeout', '30', 'Session Timeout (minutes)', 'Auto logout after inactivity', 'number'),
    ('security', 'min_password_length', '8', 'Minimum Password Length', 'Minimum required password length', 'number'),
    
    -- Backup Settings
    ('backup', 'auto_backup', 'true', 'Enable Automatic Backups', 'Automatically backup database at scheduled intervals', 'boolean'),
    ('backup', 'backup_frequency', 'Daily at 2:00 AM', 'Backup Frequency', 'Backup schedule', 'text'),
    ('backup', 'retention_days', '30', 'Retention Period (days)', 'How long to keep backups', 'number')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- SCHEMA COMPLETE!
-- ============================================
-- 
-- NEXT STEPS:
-- 1. Go to Authentication > Users
-- 2. Click "Add user" and create an admin account
-- 3. After creating the user, click on them and go to "User Metadata"
-- 4. Add this JSON: {"role": "admin", "username": "Admin"}
-- 5. Update your .env file with the new Supabase URL and anon key
-- 6. Test login in your application
--
-- TABLES CREATED:
-- - users (staff and admin accounts)
-- - schools (educational institutions)
-- - units (scout patrols within schools)
-- - scouts (individual scout members)
-- - activities (events and activities)
-- - activity_attendance (tracks participation)
-- - announcements (system announcements)
-- - reports (generated reports)
-- - audit_logs (activity tracking)
-- - settings (system configuration)
--
-- STORAGE BUCKETS:
-- - payment-proofs (private)
-- - profile-photos (public)
-- - activity-photos (public)
--
-- ============================================
