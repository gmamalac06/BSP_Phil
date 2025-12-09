-- This script creates an admin account for ScoutSmart
-- Run this after setting up your Supabase project

-- Note: You'll need to create the user through Supabase Auth first
-- This can be done via the Supabase Dashboard or using the Supabase CLI

-- Example using Supabase CLI:
-- supabase auth signup --email admin@scoutsmart.com --password YourSecurePassword123!

-- After creating the user, update their metadata to set the role to 'admin'
-- This can be done through the Supabase Dashboard:
-- 1. Go to Authentication > Users
-- 2. Find the user (admin@scoutsmart.com)
-- 3. Click on the user
-- 4. In the "User Metadata" section, add:
--    { "role": "admin", "username": "Admin" }

-- Alternatively, you can use a function to update user metadata
-- (This requires service role key and should be run server-side)

-- For development, you can also manually insert the user's metadata after signup
-- Just ensure the user's JWT includes the role in user_metadata or app_metadata

-- ============================================
-- INSTRUCTIONS TO CREATE ADMIN ACCOUNT
-- ============================================

-- 1. Via Supabase Dashboard:
--    a. Go to Authentication > Users
--    b. Click "Add user" 
--    c. Create user with:
--       - Email: admin@scoutsmart.com
--       - Password: (set a secure password)
--       - Auto Confirm User: YES
--    d. After creation, click on the user
--    e. In "User Metadata" section, click "Edit"
--    f. Add JSON: {"role": "admin", "username": "Admin"}
--    g. Save

-- 2. Via Supabase CLI (after running supabase start):
--    Run these commands in your terminal:
--    
--    # Sign up the admin user
--    curl -X POST 'http://localhost:54321/auth/v1/signup' \
--    -H "apikey: YOUR_ANON_KEY" \
--    -H "Content-Type: application/json" \
--    -d '{
--      "email": "admin@scoutsmart.com",
--      "password": "Admin123!@#",
--      "user_metadata": {
--        "role": "admin",
--        "username": "Admin"
--      }
--    }'

-- 3. For production deployment:
--    Create a one-time use function to set up the admin:

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

-- Usage (after creating the user through Supabase Auth):
-- SELECT setup_admin_account('admin@scoutsmart.com', 'Admin');

-- ============================================
-- ADDITIONAL ADMIN ACCOUNTS (OPTIONAL)
-- ============================================

-- If you need to promote an existing user to admin:
-- SELECT setup_admin_account('existinguser@example.com', 'Username');

-- ============================================
-- VERIFICATION
-- ============================================

-- To verify the admin account was set up correctly:
-- SELECT 
--   id,
--   email,
--   raw_user_meta_data->>'role' as user_role,
--   raw_app_meta_data->>'role' as app_role,
--   raw_user_meta_data->>'username' as username
-- FROM auth.users
-- WHERE email = 'admin@scoutsmart.com';




