# How to Apply SQL Migrations to Your Supabase Project

This guide will help you apply all the new SQL migrations to your existing Supabase database.

## 📋 Prerequisites

- You have a Supabase project
- You have already run the initial schema migration (`20250104_initial_schema.sql`)
- You have access to your Supabase Dashboard

## 🚀 Quick Steps

### Step 1: Open Supabase SQL Editor

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Click on **"SQL Editor"** in the left sidebar
4. Click **"New query"**

### Step 2: Copy the Migration SQL

1. Open the file: **`supabase/APPLY_ALL_MIGRATIONS_FIXED.sql`** ⚠️ Use the FIXED version!
2. Copy **ALL** the content (Ctrl+A, Ctrl+C)

### Step 3: Run the Migration

1. Paste the SQL into the SQL Editor
2. Click the **"Run"** button (or press Ctrl+Enter)
3. Wait for execution to complete

**Expected result:** You should see "Success. No rows returned" (this is normal!)

### Step 4: Verify Storage Buckets

1. Click on **"Storage"** in the left sidebar
2. You should see 3 new buckets:
   - ✅ `payment-proofs` (Private)
   - ✅ `profile-photos` (Private)
   - ✅ `activity-photos` (Public)

If they don't appear, refresh the page.

### Step 5: Create Admin Account

#### Option A: Via Dashboard (Recommended)

1. Go to **Authentication > Users**
2. Click **"Add user"** or **"Invite user"**
3. Fill in:
   - **Email**: `admin@scoutsmart.com` (or your preferred email)
   - **Password**: Your secure password
   - **Auto Confirm User**: ✓ Check this box
4. Click **"Create user"** or **"Send invitation"**
5. Click on the newly created user
6. Find the **"User Metadata"** section
7. Click **"Edit"** and add:
   ```json
   {
     "role": "admin",
     "username": "Admin"
   }
   ```
8. Click **"Save"**

#### Option B: Manually Set Metadata (Alternative)

1. Create the user through Authentication > Users
2. Click on the user in the list
3. In the **Raw User Meta Data** section, edit the JSON directly:
   ```json
   {
     "role": "admin",
     "username": "Admin"
   }
   ```
4. Save

### Step 6: Verify Admin Account

Run this query in SQL Editor:

```sql
SELECT 
  email,
  raw_user_meta_data->>'role' as role,
  raw_user_meta_data->>'username' as username,
  confirmed_at
FROM auth.users
WHERE email = 'admin@scoutsmart.com';
```

**Expected result:**
- `role`: `admin`
- `username`: `Admin`
- `confirmed_at`: Has a timestamp (not null)

### Step 7: Test Your Setup

1. Open your ScoutSmart app: `http://localhost:5000`
2. You should see the **Landing Page** (not login page)
3. Click **"Sign In"**
4. Login with your admin credentials
5. You should be redirected to the **Dashboard**
6. Try uploading a file in the **Registration** page

## ✅ Verification Checklist

- [ ] Landing page shows at `/` (root URL)
- [ ] Login page works at `/login`
- [ ] After login, redirected to `/dashboard`
- [ ] Can see all menu items as admin
- [ ] Storage buckets exist (check Storage section)
- [ ] Can upload payment proof in Registration
- [ ] User info shows correctly in sidebar
- [ ] Logout button works

## 🔍 What Was Applied?

The consolidated migration includes:

1. **New Scout Fields**
   - Added `email` field
   - Added `rank` field
   - Added `payment_proof` field (for file URLs)

2. **Row Level Security (RLS)**
   - Enabled RLS on all tables
   - Created role-based policies for all operations
   - Added helper functions for role checking

3. **Storage Buckets**
   - `payment-proofs` - For scout payment receipts (private)
   - `profile-photos` - For scout photos (private)
   - `activity-photos` - For activity images (public)

4. **Storage Policies**
   - Role-based upload/view/delete permissions
   - Separate policies for each bucket

5. **Performance Indexes**
   - Indexes on frequently queried fields
   - Improves query performance

6. **Admin Setup Function**
   - `setup_admin_account()` function for easy admin creation

## 🆘 Troubleshooting

### Error: "relation already exists"

**Solution:** Some policies might already exist. This is OK! The migration uses `IF NOT EXISTS` where possible. Continue with the next steps.

### Error: "storage.buckets does not exist"

**Solution:** Your Supabase project might not have storage enabled. Go to **Storage** in the dashboard and initialize it first.

### Error: "permission denied for schema auth"

**Solution:** Make sure you're running the SQL as the project owner/admin. Check your Supabase project permissions.

### Storage buckets not showing

**Solution:** 
1. Refresh the Storage page
2. Check if the SQL ran without errors
3. Manually create buckets:
   - Name: `payment-proofs`, Public: Off
   - Name: `profile-photos`, Public: Off
   - Name: `activity-photos`, Public: On

### Can't login after creating admin

**Solutions:**
1. Check that `confirmed_at` is not null (run verification query)
2. Verify the role is exactly `"admin"` in user_metadata
3. Try creating a new user with auto-confirm enabled
4. Check browser console for errors

### RLS blocking all operations

**Solution:** 
1. Verify the helper functions were created (`auth.user_role()`, etc.)
2. Check that policies were applied to all tables
3. Ensure your JWT includes the role in metadata
4. Try logging out and logging back in

## 📞 Need More Help?

- **Setup Guide**: See `SETUP_GUIDE.md`
- **Admin Reference**: See `ADMIN_QUICK_REFERENCE.md`
- **Implementation Details**: See `SUPABASE_IMPLEMENTATION_SUMMARY.md`
- **Supabase Docs**: [https://supabase.com/docs](https://supabase.com/docs)

## 🎯 After Migration

Once everything is working:

1. **Secure your admin account:**
   - Use a strong password
   - Enable 2FA if available

2. **Test all features:**
   - Scout registration with file upload
   - Creating schools, units, activities
   - Posting announcements
   - Viewing reports

3. **Create additional users:**
   - Staff accounts for regular operations
   - Test different role permissions

4. **Review security:**
   - Check that RLS is working
   - Test that non-admin users can't access admin-only features

---

**You're all set!** 🎉 Your ScoutSmart application is now fully configured with Supabase authentication, storage, and row-level security.

