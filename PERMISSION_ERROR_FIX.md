# Permission & Column Errors Fixed

## ❌ Errors You May Have Encountered

1. ```ERROR: 42501: permission denied for schema auth```
2. ```ERROR: 42703: column "priority" does not exist```
3. ```ERROR: 42703: column "timestamp" does not exist```
4. Missing `settings` table

## ✅ What Was Wrong

1. **Permission Error**: The original migration tried to create helper functions in the `auth` schema, which requires special permissions that aren't available in the Supabase SQL Editor.
2. **Priority Column**: The migration tried to create an index on `announcements(priority)` but that column doesn't exist (should be `type`).
3. **Timestamp Column**: The migration tried to create an index on `audit_logs(timestamp)` but the column is named `created_at`.
4. **Settings Table**: RLS policies were being applied to a `settings` table that didn't exist yet.

## ✅ The Fix

I've created a **FIXED** version that moves the helper functions to the `public` schema instead, which you have full access to.

## 🚀 What To Do Now

### Use the FIXED Migration File

Instead of `APPLY_ALL_MIGRATIONS.sql`, use:

**`supabase/APPLY_ALL_MIGRATIONS_FIXED.sql`** ← Use this one!

### Steps:

1. **Open Supabase Dashboard** → SQL Editor → New query
2. **Open the file**: `supabase/APPLY_ALL_MIGRATIONS_FIXED.sql`
3. **Copy everything** (Ctrl+A, Ctrl+C)
4. **Paste** into SQL Editor
5. **Click Run** ✅

This should work without any permission errors!

## 🔧 What Changed in the Fixed Version

### 1. Helper Functions (Permission Fix)
**Before (didn't work):**
```sql
CREATE OR REPLACE FUNCTION auth.user_role() ...
CREATE OR REPLACE FUNCTION auth.is_admin() ...
CREATE OR REPLACE FUNCTION auth.is_staff() ...
```

**After (works):**
```sql
CREATE OR REPLACE FUNCTION public.get_user_role() ...
CREATE OR REPLACE FUNCTION public.is_admin() ...
CREATE OR REPLACE FUNCTION public.is_staff() ...
```

### 2. Announcements Index (Column Fix)
**Before:** `CREATE INDEX ... ON announcements(priority);` ❌  
**After:** `CREATE INDEX ... ON announcements(type);` ✅

### 3. Audit Logs Index (Column Fix)
**Before:** `CREATE INDEX ... ON audit_logs(timestamp);` ❌  
**After:** `CREATE INDEX ... ON audit_logs(created_at);` ✅

### 4. Settings Table (Added)
**Before:** Table didn't exist, but RLS policies tried to use it ❌  
**After:** Table is created before applying RLS policies ✅

All the RLS policies now reference `public.is_admin()` and `public.is_staff()` instead of trying to access the `auth` schema.

## 📋 What the Fixed Migration Includes

✅ **New scout fields** (email, rank, payment_proof)  
✅ **Settings table** creation (if missing)  
✅ **Row Level Security** enabled on all tables  
✅ **Helper functions** (in public schema - works!)  
✅ **RLS policies** for all tables (including settings)  
✅ **Storage buckets** (payment-proofs, profile-photos, activity-photos)  
✅ **Storage policies** (role-based access)  
✅ **Performance indexes** (with correct column names)  
✅ **DROP IF EXISTS** statements (safe to re-run)

## ⚠️ Note About Admin Setup

The `setup_admin_account()` function was removed from the migration because it also requires elevated permissions.

**Instead, create admin users manually:**

1. Go to **Authentication** → **Users** in Supabase Dashboard
2. Click **"Add user"**
3. Enter email/password
4. Enable **"Auto Confirm User"** ✓
5. After creation, click on the user
6. Edit **"User Metadata"** and add:
   ```json
   {
     "role": "admin",
     "username": "Admin"
   }
   ```
7. Save

## ✅ Verify It Worked

After running the fixed migration, check:

1. **Functions created:**
   ```sql
   SELECT routine_name 
   FROM information_schema.routines 
   WHERE routine_schema = 'public' 
   AND routine_name IN ('get_user_role', 'is_admin', 'is_staff');
   ```
   Should return 3 rows.

2. **RLS enabled:**
   ```sql
   SELECT tablename, rowsecurity 
   FROM pg_tables 
   WHERE schemaname = 'public' 
   AND rowsecurity = true;
   ```
   Should show all your tables.

3. **Storage buckets:**
   - Go to **Storage** in Supabase Dashboard
   - Should see: `payment-proofs`, `profile-photos`, `activity-photos`

## 🎉 After Migration Success

1. ✅ Create your admin account (steps above)
2. ✅ Test login at `http://localhost:5000`
3. ✅ Try uploading a file in Registration
4. ✅ Check that all features work

## 🆘 Still Having Issues?

### "Function does not exist"

Make sure you ran the **FIXED** version of the migration, not the original one.

### "Storage buckets not created"

Manually create them:
- Go to Storage → New bucket
- Name: `payment-proofs`, Public: OFF
- Name: `profile-photos`, Public: OFF
- Name: `activity-photos`, Public: ON

### "RLS policies still blocking"

Make sure:
1. You're logged in as a user with role set
2. The user's metadata includes `"role": "admin"` or `"role": "staff"`
3. Try logging out and back in

---

**You're good to go!** The fixed migration should work perfectly. 🚀

