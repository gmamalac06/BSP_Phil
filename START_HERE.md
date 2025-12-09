# 🚀 START HERE - Quick Setup

## Got Errors? (Permission, Column Issues)

✅ **ALL FIXED!** The migration file has been updated to fix:
- ✅ Permission denied for schema auth
- ✅ Column "priority" does not exist  
- ✅ Column "timestamp" does not exist
- ✅ Missing settings table

**Use the FIXED version below!**

---

## 📝 What You Need to Do (5 minutes)

### Step 1: Run the FIXED SQL Migration
 
1. Open your [Supabase Dashboard](https://app.supabase.com)
2. Go to **SQL Editor** → Click **"New query"**
3. Open this file: **`supabase/APPLY_ALL_MIGRATIONS_FIXED.sql`**
4. Copy **EVERYTHING** (Ctrl+A, Ctrl+C)
5. Paste into SQL Editor
6. Click **"Run"** (or Ctrl+Enter)

**Expected:** "Success. No rows returned" ✅

---

### Step 2: Create Your Admin Account

1. In Supabase Dashboard, go to **Authentication** → **Users**
2. Click **"Add user"** (or "Invite user")
3. Fill in:
   - **Email:** `admin@scoutsmart.com` (or your email)
   - **Password:** Your secure password
   - **Auto Confirm User:** ✓ Check this!
4. Click **"Create user"**
5. **Click on the user you just created**
6. Find **"User Metadata"** section
7. Click **"Edit"** and add this JSON:
   ```json
   {
     "role": "admin",
     "username": "Admin"
   }
   ```
8. Click **"Save"**

---

### Step 3: Verify Storage Buckets

1. Go to **Storage** in Supabase Dashboard
2. You should see 3 buckets:
   - `payment-proofs` (Private)
   - `profile-photos` (Private)
   - `activity-photos` (Public)

If not, refresh the page.

---

### Step 4: Test Your App

```bash
# In your terminal
npm run dev
```

Then visit: `http://localhost:5000`

**You should see:**
- ✅ Landing page (not login page!)
- ✅ Click "Sign In" → Login page
- ✅ Login with your admin credentials
- ✅ Redirected to Dashboard
- ✅ All menu items visible

---

## ✅ Quick Verification

Run this in SQL Editor to verify admin account:

```sql
SELECT 
  email,
  raw_user_meta_data->>'role' as role,
  raw_user_meta_data->>'username' as username,
  confirmed_at
FROM auth.users
WHERE email = 'admin@scoutsmart.com';
```

Should show:
- `role`: `admin`
- `confirmed_at`: Has a timestamp

---

## 🎯 That's It!

You're done! Start using ScoutSmart:

1. **Add Schools** - Go to Schools page
2. **Add Units** - Go to Units page
3. **Register Scouts** - Go to Registration (try file upload!)
4. **Create Activities** - Go to Activities page
5. **Post Announcements** - Go to Announcements page

---

## 📚 Need More Help?

| Issue | Read This |
|-------|-----------|
| Permission error explained | `PERMISSION_ERROR_FIX.md` |
| Detailed migration guide | `APPLY_MIGRATIONS_GUIDE.md` |
| What changed | `CHANGES_SUMMARY.md` |
| Admin quick reference | `ADMIN_QUICK_REFERENCE.md` |

---

## 🆘 Common Issues

### Landing page not showing
- Clear cache (Ctrl+Shift+R)
- Check URL is `http://localhost:5000/` (not `/login`)

### Can't login
- Check user is **confirmed** (`confirmed_at` not null)
- Check role is set in **User Metadata**
- Try logging out and back in

### File upload fails
- Check file is < 5MB
- Check file is JPG, PNG, or PDF
- Check storage buckets exist

---

**You're all set!** 🎉 Enjoy using ScoutSmart!

