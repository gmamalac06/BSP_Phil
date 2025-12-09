-- Migration: Add approval status and affiliation fields to users table
-- This supports the security feature where staff/unit_leader registrations require admin approval

-- Add is_approved column to track whether user is approved by admin
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN NOT NULL DEFAULT false;

-- Add school_id column for staff members (which school they belong to)
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS school_id VARCHAR REFERENCES schools(id) ON DELETE SET NULL;

-- Add unit_id column for unit leaders (which unit they lead)
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS unit_id VARCHAR REFERENCES units(id) ON DELETE SET NULL;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_school_id ON public.users(school_id);
CREATE INDEX IF NOT EXISTS idx_users_unit_id ON public.users(unit_id);
CREATE INDEX IF NOT EXISTS idx_users_is_approved ON public.users(is_approved);

-- Update existing admin users to be approved
UPDATE public.users SET is_approved = true WHERE role = 'admin';

-- Comment on the columns
COMMENT ON COLUMN public.users.is_approved IS 'Whether the user account has been approved by an administrator';
COMMENT ON COLUMN public.users.school_id IS 'For staff: the school they are affiliated with';
COMMENT ON COLUMN public.users.unit_id IS 'For unit_leader: the unit they lead';

-- Verify the changes
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'users' AND table_schema = 'public'
ORDER BY ordinal_position;
