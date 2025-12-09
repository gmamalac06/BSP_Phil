# Supabase Database Migrations

This folder contains all database migrations for the ScoutSmart application.

## 📁 Folder Structure

```
supabase/
├── migrations/
│   └── 20250104_initial_schema.sql  # Initial database schema
└── README.md  # This file
```

## 🗃️ Database Schema Overview

### Tables (9 total):

1. **users** - User accounts (integrates with Supabase Auth)
   - Fields: id, email, username, role, created_at
   - Unique: email, username

2. **schools** - Educational institutions
   - Fields: id, name, municipality, principal, created_at

3. **units** - Scout units/patrols
   - Fields: id, name, leader, school_id, status, created_at
   - References: schools

4. **scouts** - Individual scout members
   - Fields: id, uid, name, unit_id, school_id, municipality, gender, status, membership_years, date_of_birth, address, parent_guardian, contact_number, created_at
   - Unique: uid
   - References: units, schools

5. **activities** - Scout activities and events
   - Fields: id, title, description, date, location, capacity, status, created_at

6. **activity_attendance** - Activity participation tracking
   - Fields: id, activity_id, scout_id, attended, created_at
   - References: activities, scouts

7. **announcements** - System notifications
   - Fields: id, title, content, type, author, sms_notified, created_at

8. **reports** - Generated reports
   - Fields: id, title, description, category, record_count, generated_by, created_at
   - References: users

9. **audit_logs** - Audit trail
   - Fields: id, user_id, action, details, category, ip_address, created_at
   - References: users

## 🔗 Foreign Key Relationships

```
schools
  ↓ (cascade delete)
units
  ↓ (set null)
scouts

activities
  ↓ (cascade delete)
activity_attendance ← scouts (cascade delete)

users
  ↓ (set null)
├── audit_logs
└── reports
```

## 🚀 How to Apply Migrations

### Option 1: Using Drizzle Kit (Already Done)
```bash
npm run db:push
```
This was already executed successfully and created all tables.

### Option 2: Manual via Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy contents of `migrations/20250104_initial_schema.sql`
4. Paste and run in SQL Editor

### Option 3: Supabase CLI (if installed)
```bash
supabase db push
```

## ✅ Current Migration Status

- ✅ Initial schema created (20250104_initial_schema.sql)
- ✅ All 9 tables successfully created in database
- ✅ Foreign key constraints applied
- ✅ Default values configured
- ✅ Unique constraints set

## 🔐 Row Level Security (RLS)

**⚠️ Important:** RLS policies need to be configured in Supabase Dashboard.

Recommended policies:

### For `scouts` table:
```sql
-- Enable RLS
ALTER TABLE scouts ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read scouts
CREATE POLICY "Allow authenticated read access"
  ON scouts FOR SELECT
  TO authenticated
  USING (true);

-- Allow admin to do everything
CREATE POLICY "Allow admin full access"
  ON scouts FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');
```

### For `users` table:
```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Admin can read all users
CREATE POLICY "Admin can read all users"
  ON users FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');
```

Repeat similar patterns for other tables based on your security requirements.

## 📊 Database Schema Diagram

```
┌─────────────┐
│   schools   │
└──────┬──────┘
       │
       │ 1:N
       ▼
┌─────────────┐      ┌──────────────┐
│    units    │◄─────┤    scouts    │
└──────┬──────┘      └──────┬───────┘
       │                    │
       │                    │
       └────────────────────┘

┌──────────────┐      ┌────────────────────────┐
│  activities  │◄─────┤ activity_attendance    │
└──────────────┘      └───────────┬────────────┘
                                  │
                                  ▼
                          ┌──────────────┐
                          │    scouts    │
                          └──────────────┘

┌─────────────┐
│    users    │
└──────┬──────┘
       │
       ├─────► audit_logs
       └─────► reports
```

## 🔍 Verification Queries

### Check all tables exist:
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

### Check foreign keys:
```sql
SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name,
  rc.delete_rule
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
JOIN information_schema.referential_constraints AS rc
  ON rc.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY';
```

### Count records in each table:
```sql
SELECT
  'scouts' as table_name, COUNT(*) as count FROM scouts
UNION ALL
SELECT 'schools', COUNT(*) FROM schools
UNION ALL
SELECT 'units', COUNT(*) FROM units
UNION ALL
SELECT 'activities', COUNT(*) FROM activities
UNION ALL
SELECT 'announcements', COUNT(*) FROM announcements
UNION ALL
SELECT 'reports', COUNT(*) FROM reports
UNION ALL
SELECT 'audit_logs', COUNT(*) FROM audit_logs;
```

## 📝 Migration History

| Date       | Version | Description                    | Status      |
|------------|---------|--------------------------------|-------------|
| 2025-01-04 | 0000    | Initial schema with 9 tables   | ✅ Applied  |

## 🔄 Future Migrations

When schema changes are needed:

1. Update `shared/schema.ts`
2. Run `npx drizzle-kit generate`
3. Review generated SQL in `migrations/` folder
4. Copy to `supabase/migrations/` with date prefix
5. Run `npm run db:push` or apply via Supabase Dashboard
6. Update this README with migration history

## 📚 References

- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Supabase Database Documentation](https://supabase.com/docs/guides/database)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
