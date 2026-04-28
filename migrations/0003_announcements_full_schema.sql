-- Ensures all camelCase announcement columns exist.
-- Idempotent: safe to re-run. Reloads PostgREST schema cache at the end.
ALTER TABLE "announcements" ADD COLUMN IF NOT EXISTS "eventDate" timestamp;
ALTER TABLE "announcements" ADD COLUMN IF NOT EXISTS "eventTime" text;
ALTER TABLE "announcements" ADD COLUMN IF NOT EXISTS "endDate" timestamp;
ALTER TABLE "announcements" ADD COLUMN IF NOT EXISTS "endTime" text;
ALTER TABLE "announcements" ADD COLUMN IF NOT EXISTS "photo" text;
ALTER TABLE "announcements" ADD COLUMN IF NOT EXISTS "smsNotified" boolean DEFAULT false;

-- Force PostgREST (Supabase API) to refresh its schema cache.
NOTIFY pgrst, 'reload schema';
