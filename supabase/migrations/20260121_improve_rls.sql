-- Improvements to RLS policies to support registration flows

-- 1. Allow authenticated users to insert their own profile into public.users
-- This is required because register.tsx explicitly inserts into public.users after auth.signUp
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid()::text = id);

-- 2. Allow public (anon) users to register as scouts
-- Required for public scout registration page
DROP POLICY IF EXISTS "Public can register as scout" ON scouts;
CREATE POLICY "Public can register as scout" ON scouts FOR INSERT WITH CHECK (status = 'pending');

-- 3. Allow public to read carousel slides (already in original but good to reaffirm)
DROP POLICY IF EXISTS "Public slides are viewable by everyone" ON carousel_slides;
CREATE POLICY "Public slides are viewable by everyone" ON carousel_slides FOR SELECT USING (true);

-- 4. Allow public to read settings (needed for system name etc on login/register)
DROP POLICY IF EXISTS "Public settings are viewable by everyone" ON settings;
CREATE POLICY "Public settings are viewable by everyone" ON settings FOR SELECT USING (true);
