DROP POLICY IF EXISTS "Admins can update users" ON users;
CREATE POLICY "Admins can update users" ON users FOR UPDATE USING (auth.uid()::text IN (SELECT id FROM users WHERE role = 'admin'));
