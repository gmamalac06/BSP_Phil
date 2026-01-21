-- Migration: Create Carousel Slides Table
-- Date: January 18, 2026
-- Purpose: Create the carousel_slides table for landing page event carousel

-- ============================================
-- CREATE CAROUSEL SLIDES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS carousel_slides (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    link_url TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_by VARCHAR REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_carousel_slides_active ON carousel_slides(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_carousel_slides_order ON carousel_slides(display_order);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE carousel_slides ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Public slides are viewable by everyone" ON carousel_slides;
DROP POLICY IF EXISTS "Admins can insert slides" ON carousel_slides;
DROP POLICY IF EXISTS "Admins can update slides" ON carousel_slides;
DROP POLICY IF EXISTS "Admins can delete slides" ON carousel_slides;

-- Allow everyone to view active slides (for public landing page)
CREATE POLICY "Public slides are viewable by everyone" 
ON carousel_slides FOR SELECT 
USING (true);

-- Allow admins to insert slides
CREATE POLICY "Admins can insert slides" 
ON carousel_slides FOR INSERT 
WITH CHECK (
    auth.uid()::text IN (
        SELECT id FROM users WHERE role = 'admin'
    )
);

-- Allow admins to update slides
CREATE POLICY "Admins can update slides" 
ON carousel_slides FOR UPDATE 
USING (
    auth.uid()::text IN (
        SELECT id FROM users WHERE role = 'admin'
    )
);

-- Allow admins to delete slides
CREATE POLICY "Admins can delete slides" 
ON carousel_slides FOR DELETE 
USING (
    auth.uid()::text IN (
        SELECT id FROM users WHERE role = 'admin'
    )
);

-- ============================================
-- NOTES
-- ============================================
-- 1. Table uses snake_case for column names (PostgreSQL convention)
-- 2. Public can view all slides
-- 3. Only admins can create/update/delete slides
-- 4. display_order determines the order slides appear in carousel
-- 5. is_active allows hiding slides without deleting them
