# ScoutSmart Setup Guide

This guide will help you set up ScoutSmart with Supabase authentication, storage, and row-level security.

## Prerequisites

- Node.js 18+ installed
- A Supabase project created ([create one here](https://supabase.com))
- Git installed

## Step 1: Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd ScoutSmart

# Install dependencies
npm install
```

## Step 2: Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=your_supabase_connection_string

# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Getting Your Supabase Credentials

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** > **API**
4. Copy the following:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`
5. Go to **Settings** > **Database**
6. Under **Connection String** > **URI**, copy the connection string
7. Replace `[YOUR-PASSWORD]` with your database password → `DATABASE_URL`

## Step 3: Run Database Migrations

Run the SQL migrations in your Supabase SQL Editor:

1. Go to **SQL Editor** in your Supabase dashboard
2. Run each migration file in order:

   a. **Initial Schema** (`supabase/migrations/20250104_initial_schema.sql`)
   - This creates all the tables (scouts, schools, units, activities, etc.)

   b. **RLS and Storage** (`supabase/migrations/20250119_rls_and_storage.sql`)
   - This enables Row Level Security on all tables
   - Creates security policies based on user roles
   - Sets up storage buckets (payment-proofs, profile-photos, activity-photos)
   - Adds performance indexes

## Step 4: Create Admin Account

### Option A: Via Supabase Dashboard (Recommended)

1. Go to **Authentication** > **Users** in your Supabase dashboard
2. Click **"Add user"** (or **"Invite user"**)
3. Fill in the details:
   - **Email**: `admin@scoutsmart.com` (or your preferred email)
   - **Password**: Set a secure password
   - **Auto Confirm User**: ✓ Enable this
4. Click **"Create user"** or **"Send invitation"**
5. After the user is created, click on the user in the list
6. Scroll to **"User Metadata"** section
7. Click **"Edit"** and add this JSON:
   ```json
   {
     "role": "admin",
     "username": "Admin"
   }
   ```
8. Click **"Save"**

### Option B: Via SQL Function

1. First, create the user through Supabase Auth (using Dashboard or API)
2. Then, run this SQL in the SQL Editor:

```sql
-- Run the setup_admin_account function (from 20250119_create_admin.sql)
SELECT setup_admin_account('admin@scoutsmart.com', 'Admin');
```

### Option C: Via Supabase CLI (Local Development)

```bash
# Start Supabase locally
npx supabase start

# Create admin user
curl -X POST 'http://localhost:54321/auth/v1/signup' \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@scoutsmart.com",
    "password": "YourSecurePassword123!",
    "user_metadata": {
      "role": "admin",
      "username": "Admin"
    }
  }'
```

## Step 5: Verify Admin Account

Run this SQL query to verify the admin account:

```sql
SELECT 
  id,
  email,
  raw_user_meta_data->>'role' as user_role,
  raw_app_meta_data->>'role' as app_role,
  raw_user_meta_data->>'username' as username,
  confirmed_at
FROM auth.users
WHERE email = 'admin@scoutsmart.com';
```

You should see:
- `user_role` or `app_role` = `admin`
- `username` = `Admin`
- `confirmed_at` should have a timestamp (not null)

## Step 6: Configure Storage Buckets

The migration already created the storage buckets, but let's verify:

1. Go to **Storage** in your Supabase dashboard
2. You should see three buckets:
   - `payment-proofs` (Private)
   - `profile-photos` (Private)
   - `activity-photos` (Public)

If they don't exist, create them manually or run the storage section of the migration again.

## Step 7: Start the Development Server

```bash
npm run dev
```

The application should now be running at `http://localhost:5000`

## Step 8: Test Your Setup

1. **Visit the Landing Page**: Navigate to `http://localhost:5000/home`
   - You should see the landing page with About Us and Mission/Vision sections

2. **Login**: Click "Sign In" or go to `/login`
   - Email: `admin@scoutsmart.com`
   - Password: (the password you set)

3. **Access Dashboard**: After login, you should be redirected to the dashboard
   - Verify you can see all admin menu items
   - Check that your username appears in the sidebar

4. **Test File Upload**: Go to Registration page
   - Fill out the form
   - Try uploading a payment proof (should be < 5MB, JPG/PNG/PDF)
   - Submit the registration

5. **Test RLS**: 
   - All database operations should work through the authenticated user
   - Try creating/editing scouts, schools, units, etc.

## Troubleshooting

### Issue: "Failed to upload file"

**Solution**: Check that:
- Storage buckets are created
- Storage policies are enabled (check the migration)
- Your Supabase URL and keys are correct in `.env`

### Issue: "Access Denied" after login

**Solution**: 
- Verify the admin user has the `role` field set in user_metadata
- Check the SQL query in Step 5
- Try logging out and logging back in

### Issue: "Invalid login credentials"

**Solution**:
- Verify the user's `confirmed_at` is not null (user must be confirmed)
- Check that the email/password are correct
- If using auto-confirm, make sure it was enabled during user creation

### Issue: RLS policies blocking operations

**Solution**:
- Verify all tables have RLS enabled: `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`
- Check that policies were created correctly
- Verify your JWT includes the role in user_metadata or app_metadata

## Additional Admin Users

To create more admin users:

```sql
-- After creating the user through Supabase Auth
SELECT setup_admin_account('newadmin@example.com', 'New Admin Name');
```

To create staff users (can manage scouts but not settings):

1. Create user through Supabase Auth
2. Set user_metadata role to `"staff"`:
   ```json
   {
     "role": "staff",
     "username": "Staff Name"
   }
   ```

## Production Deployment

For production deployment:

1. Create a production Supabase project
2. Update `.env` with production credentials
3. Run all migrations on production database
4. Create admin account following the steps above
5. Deploy your application
6. **Important**: Remove or secure the `setup_admin_account` function:
   ```sql
   DROP FUNCTION IF EXISTS setup_admin_account(TEXT, TEXT);
   ```

## Security Checklist

- [ ] Admin account created with strong password
- [ ] Environment variables configured (`.env` in `.gitignore`)
- [ ] RLS enabled on all tables
- [ ] Storage policies configured
- [ ] Test that non-admin users cannot access admin-only features
- [ ] Verify file upload size limits (5MB default)
- [ ] Setup admin function removed in production

## Next Steps

- Configure email templates in Supabase (Auth > Email Templates)
- Set up password reset flow
- Configure OAuth providers if needed (Google, Facebook, etc.)
- Set up monitoring and logging
- Configure backup strategy for your database

## Support

For issues or questions:
- Check the [Supabase Documentation](https://supabase.com/docs)
- Review the migration files in `supabase/migrations/`
- Check the `implementation.md` for feature status

---

**ScoutSmart** - Boy Scouts of the Philippines Management System




