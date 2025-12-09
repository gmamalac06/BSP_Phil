# 🚀 QUICK FIX: Storage Upload Error

**Error**: `"exp" claim timestamp check failed`  
**Fix Time**: 2 minutes

---

## ⚡ Quick Steps

### 1. Open Supabase Dashboard
Go to: https://supabase.com/dashboard

### 2. Open SQL Editor
Click: **SQL Editor** in left sidebar

### 3. Paste This SQL
```sql
-- Fix storage upload permissions for public registration

-- Drop old policies
DROP POLICY IF EXISTS "Allow authenticated uploads to profile-photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads to payment-proofs" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload payment proofs" ON storage.objects;

-- Allow public uploads for registration
CREATE POLICY "Allow public upload to profile-photos"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'profile-photos');

CREATE POLICY "Allow public read of profile-photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profile-photos');

CREATE POLICY "Allow public upload to payment-proofs"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'payment-proofs');

CREATE POLICY "Allow public read of payment-proofs"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'payment-proofs');

-- Set file size limits
UPDATE storage.buckets
SET 
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']::text[]
WHERE id IN ('profile-photos', 'payment-proofs');
```

### 4. Click RUN ▶️

### 5. Refresh Your Registration Page

### 6. Test Upload
Try uploading a photo - it should work now! ✅

---

## ✅ What This Does

- Allows **anonymous users** to upload during registration
- Keeps **5MB file size limit** for security
- Restricts to **images and PDFs** only
- Registration uploads now **work without login**

---

## 📖 Full Guide
See: `FIX_STORAGE_UPLOAD_ERROR.md` for detailed explanation

---

**That's it!** Upload should work now. 🎉




