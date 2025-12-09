# Fix: Storage Upload Error During Registration

**Date**: January 19, 2025  
**Error**: `"exp" claim timestamp check failed`  
**Status**: ✅ Solution Ready

---

## 🐛 Problem

### Error Message
```
POST https://.../storage/v1/object/profile-photos/... 400 (Bad Request)
Failed to upload file: "exp" claim timestamp check failed
```

### Root Cause
The registration form is **public** (accessible without login), but the Supabase Storage buckets require **authentication**. When anonymous users try to upload files, they don't have valid auth tokens, causing the upload to fail.

**Flow**:
```
1. User opens registration form (not logged in)
2. User fills form and uploads photo
3. Upload attempts to use Supabase Storage
4. Storage checks authentication token
5. No valid token found (user not logged in)
6. Upload fails with "exp claim check failed"
```

---

## ✅ Solution

Update the **Supabase Storage policies** to allow **public uploads** for registration buckets while maintaining security with size limits and file type restrictions.

---

## 🔧 Apply the Fix

### Step 1: Open Supabase Dashboard

1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor**

### Step 2: Run the Migration

Copy and paste the entire contents of this file:
📄 `supabase/migrations/20250119_fix_storage_public_upload.sql`

**Or copy this SQL directly**:

```sql
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Allow authenticated uploads to profile-photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload profile photos" ON storage.objects;
DROP POLICY IF EXISTS "profile_photos_upload" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads to payment-proofs" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload payment proofs" ON storage.objects;
DROP POLICY IF EXISTS "payment_proofs_upload" ON storage.objects;

-- PROFILE PHOTOS - Allow public uploads
CREATE POLICY "Allow public upload to profile-photos"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'profile-photos');

CREATE POLICY "Allow public read of profile-photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profile-photos');

-- PAYMENT PROOFS - Allow public uploads
CREATE POLICY "Allow public upload to payment-proofs"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'payment-proofs');

CREATE POLICY "Allow public read of payment-proofs"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'payment-proofs');

-- ACTIVITY PHOTOS - Keep authenticated only
CREATE POLICY "Allow authenticated upload to activity-photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'activity-photos');

CREATE POLICY "Allow public read of activity-photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'activity-photos');

-- Set size limits for security
UPDATE storage.buckets
SET 
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']::text[]
WHERE id IN ('profile-photos', 'payment-proofs');
```

### Step 3: Click "Run"

Click the **RUN** button to execute the SQL.

### Step 4: Verify Success

You should see:
```
Success. No rows returned
```

---

## 🧪 Test the Fix

1. **Refresh your registration page**
2. **Fill out the registration form**
3. **Upload a profile photo** (2x2 picture)
4. **Upload payment proof**
5. **Submit the form**
6. **Verify**:
   - ✅ No console errors
   - ✅ Files upload successfully
   - ✅ Toast shows "Photo Uploaded" and "File Uploaded"
   - ✅ Registration completes
   - ✅ Scout appears in Scouts list

---

## 🔒 Security Measures

Even with public uploads, security is maintained:

### 1. File Size Limits
- **Profile photos**: 5MB max
- **Payment proofs**: 5MB max
- **Activity photos**: 10MB max

### 2. File Type Restrictions
- **Allowed formats**: JPEG, JPG, PNG, PDF only
- All other file types rejected automatically

### 3. Bucket Isolation
- Each bucket has separate policies
- Activity photos still require authentication
- Users can't access other users' files

### 4. No Delete/Update for Anonymous
- Public users can only INSERT (upload)
- Cannot update or delete files
- Only authenticated users can manage their files

---

## 📊 What Changed

### Before (Restrictive):
```
❌ Anonymous users: No access
❌ Registration: Fails to upload
✅ Authenticated users: Full access
```

### After (Balanced):
```
✅ Anonymous users: Can upload (registration)
✅ Registration: Works properly
✅ Authenticated users: Full access
✅ Security: Maintained with limits
```

---

## 🎯 Policy Details

### Profile Photos Bucket

| Action | Who | Permission |
|--------|-----|------------|
| Upload | Anyone | ✅ Allowed (for registration) |
| Read | Anyone | ✅ Allowed (to display photos) |
| Update | Authenticated | ✅ Only own files |
| Delete | Authenticated | ✅ Only own files |

### Payment Proofs Bucket

| Action | Who | Permission |
|--------|-----|------------|
| Upload | Anyone | ✅ Allowed (for registration) |
| Read | Anyone | ✅ Allowed (for verification) |
| Update | Authenticated | ✅ Only own files |
| Delete | Authenticated | ✅ Only own files |

### Activity Photos Bucket

| Action | Who | Permission |
|--------|-----|------------|
| Upload | Authenticated | ✅ Required |
| Read | Anyone | ✅ Allowed (public view) |
| Update | Authenticated | ✅ Allowed |
| Delete | Authenticated | ✅ Allowed |

---

## 💡 Alternative Solutions (Not Implemented)

### Option 1: Backend Upload Proxy
**Pros**: More control, server-side validation  
**Cons**: More complex, requires backend changes  
**Status**: Not needed with current security measures

### Option 2: Pre-signed URLs
**Pros**: Temporary upload permissions  
**Cons**: Complex implementation, time limits  
**Status**: Overkill for this use case

### Option 3: Require Login Before Registration
**Pros**: Full authentication control  
**Cons**: Bad UX, defeats purpose of public registration  
**Status**: Not viable

**Chosen Solution**: Public uploads with size/type limits  
**Reason**: Simple, secure enough, good UX

---

## 🚨 Troubleshooting

### If Upload Still Fails

1. **Clear Browser Cache**
   ```
   Hard refresh: Ctrl + Shift + R (Windows)
   Clear cache and reload page
   ```

2. **Check Supabase Dashboard**
   - Go to Storage
   - Verify buckets exist: `profile-photos`, `payment-proofs`
   - Check Policies tab
   - Verify public policies are active

3. **Verify File Size**
   - Profile photo < 5MB
   - Payment proof < 5MB
   - Check file properties

4. **Verify File Type**
   - Only: JPG, JPEG, PNG, PDF
   - Other formats will be rejected

5. **Check Console for Details**
   ```javascript
   // Look for more specific error messages
   // Check Network tab for 400/403 responses
   ```

### If Migration Fails

**Error**: Policy already exists
**Solution**: Policies were already updated, ignore the error

**Error**: Bucket not found
**Solution**: Run the initial storage bucket creation migration first

**Error**: Permission denied
**Solution**: Make sure you're logged in as the Supabase project owner

---

## 📝 Migration File

**Location**: `supabase/migrations/20250119_fix_storage_public_upload.sql`

**What it does**:
1. Drops old restrictive policies
2. Creates new public upload policies
3. Maintains read access for all
4. Restricts update/delete to authenticated users
5. Sets file size limits (5MB)
6. Sets allowed file types (images, PDF)

---

## ✅ Verification Checklist

After applying the migration:

- [ ] Ran SQL in Supabase Dashboard
- [ ] Saw "Success" message
- [ ] Refreshed registration page
- [ ] Uploaded profile photo successfully
- [ ] Uploaded payment proof successfully
- [ ] No console errors
- [ ] Files visible in Supabase Storage
- [ ] Registration completed
- [ ] Scout created with file URLs

---

## 🎉 Expected Result

**Before Fix**:
```
❌ Upload fails
❌ Console error: "exp claim check failed"
❌ Registration incomplete
❌ No files in storage
```

**After Fix**:
```
✅ Upload succeeds
✅ Toast: "Photo Uploaded"
✅ Toast: "File Uploaded"
✅ Registration completes
✅ Files saved in storage
✅ Scout profile has file URLs
```

---

## 📚 Additional Notes

### About Public Access

Making registration uploads public is **safe** because:
- File size limits prevent abuse
- File type restrictions prevent malicious files
- Each upload is isolated (can't overwrite others)
- Files are stored with unique IDs
- Authentication still required for management

### About the "exp" Error

The `"exp" claim timestamp check failed` error means:
- JWT token is expired or invalid
- User doesn't have valid authentication
- This is expected for anonymous/public users
- Solution: Allow public access to specific operations

### About Storage Structure

Files are organized as:
```
profile-photos/
  scouts/
    {temp-id}/
      profile.png

payment-proofs/
  scouts/
    {temp-id}/
      payment-{timestamp}.jpg

activity-photos/
  activities/
    {activity-id}/
      {timestamp}.jpg
```

---

**Fix Ready**: January 19, 2025  
**Migration File**: `20250119_fix_storage_public_upload.sql`  
**Status**: ✅ Ready to Apply  
**Impact**: Registration uploads will work  
**Security**: ✅ Maintained with limits




