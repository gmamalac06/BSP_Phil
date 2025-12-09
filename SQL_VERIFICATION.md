# SQL Migration Verification Report

## 📋 Overview

This document provides a complete breakdown of all SQL statements used in the ScoutSmart application to help you verify the database structure.

---

## 🗂️ Migration Files

### Primary Migration File
- **Location:** `supabase/migrations/20250104_initial_schema.sql`
- **Drizzle Generated:** `migrations/0000_overconfident_nekra.sql`
- **Status:** ✅ Successfully applied to Supabase database

---

## 📊 Complete SQL Breakdown

### 1. **USERS TABLE**

```sql
CREATE TABLE IF NOT EXISTS "users" (
  "id" varchar PRIMARY KEY NOT NULL,
  "email" text NOT NULL,
  "username" text NOT NULL,
  "role" text DEFAULT 'user' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "users_email_unique" UNIQUE("email"),
  CONSTRAINT "users_username_unique" UNIQUE("username")
);
```

**Purpose:** Stores user accounts (integrated with Supabase Auth)
**Primary Key:** `id` (UUID from Supabase Auth)
**Unique Constraints:** `email`, `username`
**Default Values:** `role='user'`, `created_at=now()`
**No Foreign Keys**

---

### 2. **SCHOOLS TABLE**

```sql
CREATE TABLE IF NOT EXISTS "schools" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" text NOT NULL,
  "municipality" text NOT NULL,
  "principal" text,
  "created_at" timestamp DEFAULT now() NOT NULL
);
```

**Purpose:** Educational institutions participating in scouting
**Primary Key:** `id` (auto-generated UUID)
**Default Values:** `id=gen_random_uuid()`, `created_at=now()`
**Nullable Fields:** `principal`
**No Foreign Keys**

---

### 3. **UNITS TABLE**

```sql
CREATE TABLE IF NOT EXISTS "units" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" text NOT NULL,
  "leader" text NOT NULL,
  "school_id" varchar,
  "status" text DEFAULT 'active' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);

-- Foreign Key
ALTER TABLE "units"
  ADD CONSTRAINT "units_school_id_schools_id_fk"
  FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id")
  ON DELETE cascade ON UPDATE no action;
```

**Purpose:** Scout units/patrols within schools
**Primary Key:** `id` (auto-generated UUID)
**Default Values:** `id=gen_random_uuid()`, `status='active'`, `created_at=now()`
**Foreign Key:** `school_id` → `schools.id` (CASCADE DELETE)
**Behavior:** When a school is deleted, all its units are also deleted

---

### 4. **SCOUTS TABLE**

```sql
CREATE TABLE IF NOT EXISTS "scouts" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "uid" text NOT NULL,
  "name" text NOT NULL,
  "unit_id" varchar,
  "school_id" varchar,
  "municipality" text NOT NULL,
  "gender" text NOT NULL,
  "status" text DEFAULT 'pending' NOT NULL,
  "membership_years" integer DEFAULT 0,
  "date_of_birth" timestamp,
  "address" text,
  "parent_guardian" text,
  "contact_number" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "scouts_uid_unique" UNIQUE("uid")
);

-- Foreign Keys
ALTER TABLE "scouts"
  ADD CONSTRAINT "scouts_unit_id_units_id_fk"
  FOREIGN KEY ("unit_id") REFERENCES "public"."units"("id")
  ON DELETE set null ON UPDATE no action;

ALTER TABLE "scouts"
  ADD CONSTRAINT "scouts_school_id_schools_id_fk"
  FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id")
  ON DELETE set null ON UPDATE no action;
```

**Purpose:** Individual scout members with complete profile
**Primary Key:** `id` (auto-generated UUID)
**Unique Constraint:** `uid` (scout identification number like BSP-2024-001234)
**Default Values:** `id=gen_random_uuid()`, `status='pending'`, `membership_years=0`, `created_at=now()`
**Foreign Keys:**
- `unit_id` → `units.id` (SET NULL on delete)
- `school_id` → `schools.id` (SET NULL on delete)

**Behavior:** When unit or school is deleted, scout record remains but reference is nullified

---

### 5. **ACTIVITIES TABLE**

```sql
CREATE TABLE IF NOT EXISTS "activities" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "title" text NOT NULL,
  "description" text NOT NULL,
  "date" timestamp NOT NULL,
  "location" text NOT NULL,
  "capacity" integer NOT NULL,
  "status" text DEFAULT 'upcoming' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);
```

**Purpose:** Scout activities, events, and training sessions
**Primary Key:** `id` (auto-generated UUID)
**Default Values:** `id=gen_random_uuid()`, `status='upcoming'`, `created_at=now()`
**No Foreign Keys**

---

### 6. **ACTIVITY_ATTENDANCE TABLE**

```sql
CREATE TABLE IF NOT EXISTS "activity_attendance" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "activity_id" varchar NOT NULL,
  "scout_id" varchar NOT NULL,
  "attended" boolean DEFAULT false,
  "created_at" timestamp DEFAULT now() NOT NULL
);

-- Foreign Keys
ALTER TABLE "activity_attendance"
  ADD CONSTRAINT "activity_attendance_activity_id_activities_id_fk"
  FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id")
  ON DELETE cascade ON UPDATE no action;

ALTER TABLE "activity_attendance"
  ADD CONSTRAINT "activity_attendance_scout_id_scouts_id_fk"
  FOREIGN KEY ("scout_id") REFERENCES "public"."scouts"("id")
  ON DELETE cascade ON UPDATE no action;
```

**Purpose:** Junction table tracking scout participation in activities
**Primary Key:** `id` (auto-generated UUID)
**Default Values:** `id=gen_random_uuid()`, `attended=false`, `created_at=now()`
**Foreign Keys:**
- `activity_id` → `activities.id` (CASCADE DELETE)
- `scout_id` → `scouts.id` (CASCADE DELETE)

**Behavior:** When activity or scout is deleted, attendance records are also deleted

---

### 7. **ANNOUNCEMENTS TABLE**

```sql
CREATE TABLE IF NOT EXISTS "announcements" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "title" text NOT NULL,
  "content" text NOT NULL,
  "type" text NOT NULL,
  "author" text NOT NULL,
  "sms_notified" boolean DEFAULT false,
  "created_at" timestamp DEFAULT now() NOT NULL
);
```

**Purpose:** System announcements, policies, and event notifications
**Primary Key:** `id` (auto-generated UUID)
**Default Values:** `id=gen_random_uuid()`, `sms_notified=false`, `created_at=now()`
**No Foreign Keys**

---

### 8. **REPORTS TABLE**

```sql
CREATE TABLE IF NOT EXISTS "reports" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "title" text NOT NULL,
  "description" text NOT NULL,
  "category" text NOT NULL,
  "record_count" integer DEFAULT 0,
  "generated_by" varchar,
  "created_at" timestamp DEFAULT now() NOT NULL
);

-- Foreign Key
ALTER TABLE "reports"
  ADD CONSTRAINT "reports_generated_by_users_id_fk"
  FOREIGN KEY ("generated_by") REFERENCES "public"."users"("id")
  ON DELETE set null ON UPDATE no action;
```

**Purpose:** Generated analytics and documentation reports
**Primary Key:** `id` (auto-generated UUID)
**Default Values:** `id=gen_random_uuid()`, `record_count=0`, `created_at=now()`
**Foreign Key:** `generated_by` → `users.id` (SET NULL on delete)
**Behavior:** Report remains even if user is deleted

---

### 9. **AUDIT_LOGS TABLE**

```sql
CREATE TABLE IF NOT EXISTS "audit_logs" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" varchar,
  "action" text NOT NULL,
  "details" text NOT NULL,
  "category" text NOT NULL,
  "ip_address" text,
  "created_at" timestamp DEFAULT now() NOT NULL
);

-- Foreign Key
ALTER TABLE "audit_logs"
  ADD CONSTRAINT "audit_logs_user_id_users_id_fk"
  FOREIGN KEY ("user_id") REFERENCES "public"."users"("id")
  ON DELETE set null ON UPDATE no action;
```

**Purpose:** Complete audit trail for all system actions
**Primary Key:** `id` (auto-generated UUID)
**Default Values:** `id=gen_random_uuid()`, `created_at=now()`
**Foreign Key:** `user_id` → `users.id` (SET NULL on delete)
**Behavior:** Audit logs remain even if user is deleted (for compliance)

---

## 🔗 Foreign Key Summary

| Child Table          | Column        | References     | On Delete   | Purpose                           |
|---------------------|---------------|----------------|-------------|-----------------------------------|
| units               | school_id     | schools(id)    | CASCADE     | Delete units when school deleted  |
| scouts              | unit_id       | units(id)      | SET NULL    | Keep scout, remove unit reference |
| scouts              | school_id     | schools(id)    | SET NULL    | Keep scout, remove school ref     |
| activity_attendance | activity_id   | activities(id) | CASCADE     | Delete attendance with activity   |
| activity_attendance | scout_id      | scouts(id)     | CASCADE     | Delete attendance with scout      |
| reports             | generated_by  | users(id)      | SET NULL    | Keep report, remove user ref      |
| audit_logs          | user_id       | users(id)      | SET NULL    | Keep log for compliance           |

---

## ✅ Verification Checklist

Run these queries in Supabase SQL Editor to verify:

### Check All Tables Exist
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

**Expected Result:** 9 tables (activities, activity_attendance, announcements, audit_logs, reports, schools, scouts, units, users)

### Verify All Columns
```sql
SELECT
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;
```

### Check Foreign Keys
```sql
SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS references_table,
  ccu.column_name AS references_column,
  rc.delete_rule
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu
  ON ccu.constraint_name = tc.constraint_name
JOIN information_schema.referential_constraints rc
  ON rc.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public';
```

**Expected Result:** 7 foreign key constraints

### Check Unique Constraints
```sql
SELECT
  tc.table_name,
  kcu.column_name,
  tc.constraint_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
WHERE tc.constraint_type = 'UNIQUE'
  AND tc.table_schema = 'public';
```

**Expected Result:** 3 unique constraints (users.email, users.username, scouts.uid)

---

## 🔐 Security Considerations

### Current State:
- ✅ Tables created with proper structure
- ✅ Foreign keys enforcing referential integrity
- ✅ Unique constraints preventing duplicates
- ⚠️ Row Level Security (RLS) **NOT YET ENABLED**

### Next Steps for Security:
1. Enable RLS on all tables via Supabase Dashboard
2. Create policies for role-based access control
3. Integrate with Supabase Auth for user management

---

## 📝 Notes

- **UUID Generation:** Using PostgreSQL's `gen_random_uuid()` for automatic ID generation
- **Timestamps:** All `created_at` fields use `now()` for automatic timestamp
- **Cascade Deletes:** Only used where child records are meaningless without parent
- **Set Null:** Used where child records should survive parent deletion
- **No Indexes Yet:** Add indexes later based on query performance needs

---

## 🎯 Migration Status

| Aspect               | Status      | Notes                                    |
|---------------------|-------------|------------------------------------------|
| Schema Defined      | ✅ Complete | All 9 tables with full structure         |
| SQL Generated       | ✅ Complete | Located in migrations/ and supabase/     |
| Applied to Database | ✅ Complete | Verified via `npm run db:push`           |
| Foreign Keys        | ✅ Complete | All 7 FK constraints applied             |
| Unique Constraints  | ✅ Complete | 3 unique constraints in place            |
| Default Values      | ✅ Complete | UUIDs, timestamps, status defaults set   |
| RLS Policies        | ⏳ Pending  | To be configured in Supabase Dashboard   |
| Indexes             | ⏳ Optional | Can add later for performance            |

---

**Last Updated:** 2025-01-04
**Database:** Supabase PostgreSQL (ap-southeast-1)
**Migration Tool:** Drizzle Kit + Manual SQL
