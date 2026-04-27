-- Add optional end date/time fields to announcements (for all types).
-- Names are quoted camelCase to match the existing eventDate / eventTime columns
-- created via the Supabase dashboard.
ALTER TABLE "announcements" ADD COLUMN IF NOT EXISTS "endDate" timestamp;
ALTER TABLE "announcements" ADD COLUMN IF NOT EXISTS "endTime" text;
