-- Enable RLS on all tables
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
ALTER TABLE carousel_slides ENABLE ROW LEVEL SECURITY;

-- Create policies

-- Schools: Public read, Admin write
DROP POLICY IF EXISTS "Public schools are viewable by everyone" ON schools;
CREATE POLICY "Public schools are viewable by everyone" ON schools FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can insert schools" ON schools;
CREATE POLICY "Admins can insert schools" ON schools FOR INSERT WITH CHECK (auth.uid()::text IN (SELECT id FROM users WHERE role = 'admin'));

DROP POLICY IF EXISTS "Admins can update schools" ON schools;
CREATE POLICY "Admins can update schools" ON schools FOR UPDATE USING (auth.uid()::text IN (SELECT id FROM users WHERE role = 'admin'));

DROP POLICY IF EXISTS "Admins can delete schools" ON schools;
CREATE POLICY "Admins can delete schools" ON schools FOR DELETE USING (auth.uid()::text IN (SELECT id FROM users WHERE role = 'admin'));

-- Units: Public read, Admin/Staff write
DROP POLICY IF EXISTS "Public units are viewable by everyone" ON units;
CREATE POLICY "Public units are viewable by everyone" ON units FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins and Staff can insert units" ON units;
CREATE POLICY "Admins and Staff can insert units" ON units FOR INSERT WITH CHECK (
  auth.uid()::text IN (SELECT id FROM users WHERE role IN ('admin', 'staff'))
);

DROP POLICY IF EXISTS "Admins and Staff can update units" ON units;
CREATE POLICY "Admins and Staff can update units" ON units FOR UPDATE USING (
  auth.uid()::text IN (SELECT id FROM users WHERE role IN ('admin', 'staff'))
);

DROP POLICY IF EXISTS "Admins and Staff can delete units" ON units;
CREATE POLICY "Admins and Staff can delete units" ON units FOR DELETE USING (
  auth.uid()::text IN (SELECT id FROM users WHERE role IN ('admin', 'staff'))
);

-- Scouts: Public read (for landing page lookup), Authenticated write
DROP POLICY IF EXISTS "Public scouts are viewable by everyone" ON scouts;
CREATE POLICY "Public scouts are viewable by everyone" ON scouts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert scouts" ON scouts;
CREATE POLICY "Authenticated users can insert scouts" ON scouts FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can update scouts" ON scouts;
CREATE POLICY "Authenticated users can update scouts" ON scouts FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can delete scouts" ON scouts;
CREATE POLICY "Authenticated users can delete scouts" ON scouts FOR DELETE USING (auth.role() = 'authenticated');

-- Activities: Public read, Authenticated write
DROP POLICY IF EXISTS "Public activities are viewable by everyone" ON activities;
CREATE POLICY "Public activities are viewable by everyone" ON activities FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert activities" ON activities;
CREATE POLICY "Authenticated users can insert activities" ON activities FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can update activities" ON activities;
CREATE POLICY "Authenticated users can update activities" ON activities FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can delete activities" ON activities;
CREATE POLICY "Authenticated users can delete activities" ON activities FOR DELETE USING (auth.role() = 'authenticated');

-- Activity Attendance: Authenticated read/write
DROP POLICY IF EXISTS "Authenticated users can view attendance" ON activity_attendance;
CREATE POLICY "Authenticated users can view attendance" ON activity_attendance FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can insert attendance" ON activity_attendance;
CREATE POLICY "Authenticated users can insert attendance" ON activity_attendance FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can update attendance" ON activity_attendance;
CREATE POLICY "Authenticated users can update attendance" ON activity_attendance FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can delete attendance" ON activity_attendance;
CREATE POLICY "Authenticated users can delete attendance" ON activity_attendance FOR DELETE USING (auth.role() = 'authenticated');

-- Announcements: Public read, Authenticated write
DROP POLICY IF EXISTS "Public announcements are viewable by everyone" ON announcements;
CREATE POLICY "Public announcements are viewable by everyone" ON announcements FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert announcements" ON announcements;
CREATE POLICY "Authenticated users can insert announcements" ON announcements FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can update announcements" ON announcements;
CREATE POLICY "Authenticated users can update announcements" ON announcements FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can delete announcements" ON announcements;
CREATE POLICY "Authenticated users can delete announcements" ON announcements FOR DELETE USING (auth.role() = 'authenticated');

-- Carousel Slides: Public read, Admin write
DROP POLICY IF EXISTS "Public slides are viewable by everyone" ON carousel_slides;
CREATE POLICY "Public slides are viewable by everyone" ON carousel_slides FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can insert slides" ON carousel_slides;
CREATE POLICY "Admins can insert slides" ON carousel_slides FOR INSERT WITH CHECK (auth.uid()::text IN (SELECT id FROM users WHERE role = 'admin'));

DROP POLICY IF EXISTS "Admins can update slides" ON carousel_slides;
CREATE POLICY "Admins can update slides" ON carousel_slides FOR UPDATE USING (auth.uid()::text IN (SELECT id FROM users WHERE role = 'admin'));

DROP POLICY IF EXISTS "Admins can delete slides" ON carousel_slides;
CREATE POLICY "Admins can delete slides" ON carousel_slides FOR DELETE USING (auth.uid()::text IN (SELECT id FROM users WHERE role = 'admin'));

-- Users: Public read (basic profile), Self update
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON users;
CREATE POLICY "Public profiles are viewable by everyone" ON users FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid()::text = id);

-- Settings: Public read, Admin write
DROP POLICY IF EXISTS "Public settings are viewable by everyone" ON settings;
CREATE POLICY "Public settings are viewable by everyone" ON settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can insert settings" ON settings;
CREATE POLICY "Admins can insert settings" ON settings FOR INSERT WITH CHECK (auth.uid()::text IN (SELECT id FROM users WHERE role = 'admin'));

DROP POLICY IF EXISTS "Admins can update settings" ON settings;
CREATE POLICY "Admins can update settings" ON settings FOR UPDATE USING (auth.uid()::text IN (SELECT id FROM users WHERE role = 'admin'));

DROP POLICY IF EXISTS "Admins can delete settings" ON settings;
CREATE POLICY "Admins can delete settings" ON settings FOR DELETE USING (auth.uid()::text IN (SELECT id FROM users WHERE role = 'admin'));

-- Reports: Authenticated read/write
DROP POLICY IF EXISTS "Authenticated users can view reports" ON reports;
CREATE POLICY "Authenticated users can view reports" ON reports FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can insert reports" ON reports;
CREATE POLICY "Authenticated users can insert reports" ON reports FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can update reports" ON reports;
CREATE POLICY "Authenticated users can update reports" ON reports FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can delete reports" ON reports;
CREATE POLICY "Authenticated users can delete reports" ON reports FOR DELETE USING (auth.role() = 'authenticated');

-- Audit Logs: Authenticated read, System insert
DROP POLICY IF EXISTS "Authenticated users can view audit logs" ON audit_logs;
CREATE POLICY "Authenticated users can view audit logs" ON audit_logs FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can insert audit logs" ON audit_logs;
CREATE POLICY "Authenticated users can insert audit logs" ON audit_logs FOR INSERT WITH CHECK (auth.role() = 'authenticated');
