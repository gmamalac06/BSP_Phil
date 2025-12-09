import { supabase } from "./supabase";

export interface UploadResult {
  url: string;
  path: string;
}

/**
 * Upload a file to Supabase Storage
 * @param bucket - The storage bucket name
 * @param file - The file to upload
 * @param path - Optional custom path within the bucket
 * @returns The public URL and path of the uploaded file
 */
export async function uploadFile(
  bucket: 'payment-proofs' | 'profile-photos' | 'activity-photos',
  file: File,
  path?: string
): Promise<UploadResult> {
  try {
    // Generate a unique filename if path not provided
    const fileName = path || `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    
    // Upload the file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return {
      url: publicUrl,
      path: data.path
    };
  } catch (error: any) {
    throw new Error(`Failed to upload file: ${error.message}`);
  }
}

/**
 * Delete a file from Supabase Storage
 * @param bucket - The storage bucket name
 * @param path - The file path within the bucket
 */
export async function deleteFile(
  bucket: 'payment-proofs' | 'profile-photos' | 'activity-photos',
  path: string
): Promise<void> {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) throw error;
  } catch (error: any) {
    throw new Error(`Failed to delete file: ${error.message}`);
  }
}

/**
 * Get a signed URL for private files
 * @param bucket - The storage bucket name
 * @param path - The file path within the bucket
 * @param expiresIn - Expiration time in seconds (default: 3600 = 1 hour)
 * @returns The signed URL
 */
export async function getSignedUrl(
  bucket: 'payment-proofs' | 'profile-photos' | 'activity-photos',
  path: string,
  expiresIn: number = 3600
): Promise<string> {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);

    if (error) throw error;

    return data.signedUrl;
  } catch (error: any) {
    throw new Error(`Failed to get signed URL: ${error.message}`);
  }
}

/**
 * Upload payment proof for scout registration
 * @param scoutId - The scout's ID
 * @param file - The payment proof file
 * @returns The URL of the uploaded file
 */
export async function uploadPaymentProof(
  scoutId: string,
  file: File
): Promise<string> {
  const path = `scouts/${scoutId}/payment-${Date.now()}.${file.name.split('.').pop()}`;
  const result = await uploadFile('payment-proofs', file, path);
  return result.url;
}

/**
 * Upload profile photo
 * @param scoutId - The scout's ID
 * @param file - The profile photo file
 * @returns The URL of the uploaded file
 */
export async function uploadProfilePhoto(
  scoutId: string,
  file: File
): Promise<string> {
  const path = `scouts/${scoutId}/profile.${file.name.split('.').pop()}`;
  const result = await uploadFile('profile-photos', file, path);
  return result.url;
}

/**
 * Upload activity photo
 * @param activityId - The activity's ID
 * @param file - The activity photo file
 * @returns The URL of the uploaded file
 */
export async function uploadActivityPhoto(
  activityId: string,
  file: File
): Promise<string> {
  const path = `activities/${activityId}/${Date.now()}.${file.name.split('.').pop()}`;
  const result = await uploadFile('activity-photos', file, path);
  return result.url;
}

/**
 * Validate file before upload
 * @param file - The file to validate
 * @param maxSizeMB - Maximum file size in MB (default: 5)
 * @param allowedTypes - Allowed MIME types
 */
export function validateFile(
  file: File,
  maxSizeMB: number = 5,
  allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
): { valid: boolean; error?: string } {
  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File size must be less than ${maxSizeMB}MB`
    };
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type must be one of: ${allowedTypes.map(t => t.split('/')[1]).join(', ')}`
    };
  }

  return { valid: true };
}




