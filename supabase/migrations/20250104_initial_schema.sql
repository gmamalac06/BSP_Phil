-- ScoutSmart Initial Schema Migration
-- Generated: 2025-01-04
-- Database: Supabase PostgreSQL
-- Description: Complete schema for Boy Scouts of the Philippines management system

-- ============================================================================
-- TABLE: users
-- Description: User accounts integrated with Supabase Auth
-- ============================================================================
CREATE TABLE IF NOT EXISTS "users" (
	"id" varchar PRIMARY KEY NOT NULL,  -- UUID from Supabase Auth
	"email" text NOT NULL,
	"username" text NOT NULL,
	"role" text DEFAULT 'user' NOT NULL,  -- admin, staff, user
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);

-- ============================================================================
-- TABLE: schools
-- Description: Educational institutions participating in scouting program
-- ============================================================================
CREATE TABLE IF NOT EXISTS "schools" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"municipality" text NOT NULL,
	"principal" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- ============================================================================
-- TABLE: units
-- Description: Scout units/patrols within schools
-- ============================================================================
CREATE TABLE IF NOT EXISTS "units" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"leader" text NOT NULL,
	"school_id" varchar,
	"status" text DEFAULT 'active' NOT NULL,  -- active, inactive
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- ============================================================================
-- TABLE: scouts
-- Description: Individual scout members with detailed information
-- ============================================================================
CREATE TABLE IF NOT EXISTS "scouts" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"uid" text NOT NULL,  -- Unique scout ID (e.g., BSP-2024-001234)
	"name" text NOT NULL,
	"unit_id" varchar,
	"school_id" varchar,
	"municipality" text NOT NULL,
	"gender" text NOT NULL,  -- Male, Female, Other
	"status" text DEFAULT 'pending' NOT NULL,  -- active, pending, expired
	"membership_years" integer DEFAULT 0,
	"date_of_birth" timestamp,
	"address" text,
	"parent_guardian" text,
	"contact_number" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "scouts_uid_unique" UNIQUE("uid")
);

-- ============================================================================
-- TABLE: activities
-- Description: Scout activities and events
-- ============================================================================
CREATE TABLE IF NOT EXISTS "activities" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"date" timestamp NOT NULL,
	"location" text NOT NULL,
	"capacity" integer NOT NULL,
	"status" text DEFAULT 'upcoming' NOT NULL,  -- upcoming, ongoing, completed, cancelled
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- ============================================================================
-- TABLE: activity_attendance
-- Description: Junction table tracking scout participation in activities
-- ============================================================================
CREATE TABLE IF NOT EXISTS "activity_attendance" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"activity_id" varchar NOT NULL,
	"scout_id" varchar NOT NULL,
	"attended" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- ============================================================================
-- TABLE: announcements
-- Description: System announcements, policies, and event notifications
-- ============================================================================
CREATE TABLE IF NOT EXISTS "announcements" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"type" text NOT NULL,  -- announcement, policy, event
	"author" text NOT NULL,
	"sms_notified" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- ============================================================================
-- TABLE: reports
-- Description: Generated reports for analytics and documentation
-- ============================================================================
CREATE TABLE IF NOT EXISTS "reports" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,  -- enrollment, membership, activities
	"record_count" integer DEFAULT 0,
	"generated_by" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- ============================================================================
-- TABLE: audit_logs
-- Description: Audit trail for system actions and user activities
-- ============================================================================
CREATE TABLE IF NOT EXISTS "audit_logs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar,
	"action" text NOT NULL,
	"details" text NOT NULL,
	"category" text NOT NULL,  -- create, update, delete, login, system
	"ip_address" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- ============================================================================
-- FOREIGN KEY CONSTRAINTS
-- ============================================================================

-- Activity Attendance References
ALTER TABLE "activity_attendance"
  ADD CONSTRAINT "activity_attendance_activity_id_activities_id_fk"
  FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id")
  ON DELETE cascade ON UPDATE no action;

ALTER TABLE "activity_attendance"
  ADD CONSTRAINT "activity_attendance_scout_id_scouts_id_fk"
  FOREIGN KEY ("scout_id") REFERENCES "public"."scouts"("id")
  ON DELETE cascade ON UPDATE no action;

-- Audit Logs References
ALTER TABLE "audit_logs"
  ADD CONSTRAINT "audit_logs_user_id_users_id_fk"
  FOREIGN KEY ("user_id") REFERENCES "public"."users"("id")
  ON DELETE set null ON UPDATE no action;

-- Reports References
ALTER TABLE "reports"
  ADD CONSTRAINT "reports_generated_by_users_id_fk"
  FOREIGN KEY ("generated_by") REFERENCES "public"."users"("id")
  ON DELETE set null ON UPDATE no action;

-- Scouts References
ALTER TABLE "scouts"
  ADD CONSTRAINT "scouts_unit_id_units_id_fk"
  FOREIGN KEY ("unit_id") REFERENCES "public"."units"("id")
  ON DELETE set null ON UPDATE no action;

ALTER TABLE "scouts"
  ADD CONSTRAINT "scouts_school_id_schools_id_fk"
  FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id")
  ON DELETE set null ON UPDATE no action;

-- Units References
ALTER TABLE "units"
  ADD CONSTRAINT "units_school_id_schools_id_fk"
  FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id")
  ON DELETE cascade ON UPDATE no action;

-- ============================================================================
-- INDEXES (Optional - uncomment if needed for performance)
-- ============================================================================
-- CREATE INDEX IF NOT EXISTS idx_scouts_status ON scouts(status);
-- CREATE INDEX IF NOT EXISTS idx_scouts_school ON scouts(school_id);
-- CREATE INDEX IF NOT EXISTS idx_scouts_unit ON scouts(unit_id);
-- CREATE INDEX IF NOT EXISTS idx_activities_status ON activities(status);
-- CREATE INDEX IF NOT EXISTS idx_announcements_type ON announcements(type);
-- CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
-- CREATE INDEX IF NOT EXISTS idx_audit_logs_category ON audit_logs(category);
-- CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) - To be configured in Supabase Dashboard
-- ============================================================================
-- Note: Enable RLS for each table and add appropriate policies:
-- 1. Enable RLS: ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
-- 2. Add policies for authenticated users
-- 3. Add role-based access control (admin, staff, user)

-- ============================================================================
-- COMMENTS
-- ============================================================================
COMMENT ON TABLE users IS 'User accounts integrated with Supabase Auth';
COMMENT ON TABLE schools IS 'Educational institutions in the scouting program';
COMMENT ON TABLE units IS 'Scout units/patrols organized by schools';
COMMENT ON TABLE scouts IS 'Individual scout members with full profile';
COMMENT ON TABLE activities IS 'Scout activities, events, and training sessions';
COMMENT ON TABLE activity_attendance IS 'Tracks scout participation in activities';
COMMENT ON TABLE announcements IS 'System notifications and policy updates';
COMMENT ON TABLE reports IS 'Generated analytics and documentation reports';
COMMENT ON TABLE audit_logs IS 'System audit trail for all user actions';

-- Migration completed successfully!
