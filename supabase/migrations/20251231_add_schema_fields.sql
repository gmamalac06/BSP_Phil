-- Migration: Add new fields to schools and announcements tables
-- Date: 2025-12-31

-- Add logo and school_number to schools table
ALTER TABLE schools ADD COLUMN IF NOT EXISTS logo TEXT;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS school_number TEXT;

-- Add event_date, event_time, and photo to announcements table  
ALTER TABLE announcements ADD COLUMN IF NOT EXISTS event_date TIMESTAMP;
ALTER TABLE announcements ADD COLUMN IF NOT EXISTS event_time TEXT;
ALTER TABLE announcements ADD COLUMN IF NOT EXISTS photo TEXT;
