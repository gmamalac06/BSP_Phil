# Admin Quick Reference

Quick reference guide for ScoutSmart administrators.

## 🔑 Default Admin Credentials

**Important:** Change these after first login!

- **Email:** `admin@scoutsmart.com` (or the email you configured)
- **Password:** (Set during admin account creation)

## 🌐 URLs

- **Landing Page:** `/home`
- **Login:** `/login`
- **Dashboard:** `/` (after login)

## 👤 User Roles

| Role | Capabilities |
|------|--------------|
| **Admin** | Full access to everything, including Settings and Audit Trail |
| **Staff** | Manage scouts, schools, units, activities, announcements, reports |
| **User** | View-only access (for future expansion) |

## 📝 Creating Additional Admin/Staff Users

### Via Supabase Dashboard:

1. Go to **Authentication > Users**
2. Click **"Add user"**
3. Set email and password
4. Enable **"Auto Confirm User"**
5. After creation, edit the user
6. Add to **User Metadata**:
   ```json
   {
     "role": "admin",
     "username": "Name"
   }
   ```
   (Use `"staff"` for staff role)

### Via SQL (after creating user in Auth):

```sql
SELECT setup_admin_account('email@example.com', 'Username');
```

## 📁 File Upload Limits

- **Maximum Size:** 5 MB
- **Allowed Types:** 
  - Images: JPG, JPEG, PNG
  - Documents: PDF

## 🗄️ Storage Buckets

| Bucket | Type | Used For |
|--------|------|----------|
| `payment-proofs` | Private | Scout payment receipts |
| `profile-photos` | Private | Scout profile pictures |
| `activity-photos` | Public | Activity event photos |

## 🔐 Database Access

All database operations go through Supabase with Row Level Security:
- Admins: Full access
- Staff: Limited to operational data
- Audit logs: Admin only
- Settings: Admin only

## 🔍 Verifying Admin Account

Run this in Supabase SQL Editor:

```sql
SELECT 
  email,
  raw_user_meta_data->>'role' as role,
  raw_user_meta_data->>'username' as username,
  confirmed_at
FROM auth.users
WHERE email = 'your-email@example.com';
```

Should show:
- `role`: `admin`
- `confirmed_at`: Has a timestamp

## 🆘 Common Issues

### Can't Login
- ✅ Check email/password
- ✅ Verify user is confirmed (`confirmed_at` not null)
- ✅ Check role is set in user metadata

### File Upload Fails
- ✅ File must be < 5MB
- ✅ Must be JPG, PNG, or PDF
- ✅ Check storage buckets exist
- ✅ Check storage policies are applied

### Access Denied to Admin Pages
- ✅ Verify role is exactly `"admin"` in user metadata
- ✅ Try logging out and back in
- ✅ Check browser console for errors

### RLS Blocking Operations
- ✅ Verify RLS policies are applied
- ✅ Check JWT token includes role
- ✅ Ensure user is authenticated

## 📊 Monitoring

### Check System Health

1. **Database Connection:**
   - Run any simple query in SQL Editor
   - Should execute without errors

2. **Auth Working:**
   - Try logging in
   - Check Users list in Auth section

3. **Storage Working:**
   - Try uploading a file in Registration
   - Check Storage section for uploaded files

4. **RLS Working:**
   - Try accessing Settings as admin (should work)
   - Try accessing Audit Trail as admin (should work)

## 🚀 Quick Start After Setup

1. **Login** at `/login`
2. **Add Schools:** Go to Schools page, click "Add School"
3. **Add Units:** Go to Units page, click "Add Unit"
4. **Register Scouts:** Go to Registration page, fill form
5. **Create Activities:** Go to Activities page, click "Create Activity"
6. **Post Announcements:** Go to Announcements page, click "New Announcement"

## 📞 Where to Get Help

1. **Setup Issues:** See `SETUP_GUIDE.md`
2. **Implementation Details:** See `SUPABASE_IMPLEMENTATION_SUMMARY.md`
3. **Feature Status:** See `implementation.md`
4. **Supabase Issues:** Check [Supabase Status](https://status.supabase.com/)

## 🔧 Maintenance Tasks

### Weekly
- [ ] Review audit logs for suspicious activity
- [ ] Check storage usage
- [ ] Verify backups are running

### Monthly
- [ ] Review user accounts and roles
- [ ] Update inactive scout statuses
- [ ] Generate reports for records

### As Needed
- [ ] Add new staff members
- [ ] Update system settings
- [ ] Clean up old files in storage

## ⚙️ Environment Variables Check

Ensure these are set in `.env`:

```env
DATABASE_URL=postgresql://...
VITE_SUPABASE_URL=https://...
VITE_SUPABASE_ANON_KEY=...
```

## 🔄 Updates and Migrations

When new migrations are added:

1. Go to Supabase SQL Editor
2. Run the new migration SQL
3. Verify no errors
4. Test affected functionality

## 🎯 Best Practices

### Security
- ✅ Use strong passwords
- ✅ Don't share admin credentials
- ✅ Create staff accounts for regular operations
- ✅ Review audit logs regularly
- ✅ Keep Supabase project secure

### Data Management
- ✅ Regularly export important data
- ✅ Verify payment proofs are uploaded
- ✅ Keep scout information up to date
- ✅ Archive inactive records appropriately

### User Experience
- ✅ Respond to registration submissions promptly
- ✅ Keep announcements current
- ✅ Update activity statuses
- ✅ Maintain accurate contact information

---

**Need more help?** Check the full documentation files or contact your system administrator.




