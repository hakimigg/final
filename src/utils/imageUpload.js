import { supabase } from '../lib/supabase';

// Storage bucket name
const STORAGE_BUCKET = 'product-images';

/**
 * Upload an image file to Supabase Storage
 * @param {File} file - The image file to upload
 * @param {string} folder - Optional folder path (e.g., 'products', 'gallery')
 * @returns {Promise<{success: boolean, url?: string, error?: string}>}
 */
export const uploadImage = async (file, folder = 'products') => {
  try {
    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return { success: false, error: 'File must be an image' };
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return { success: false, error: 'File size must be less than 5MB' };
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      return { success: false, error: error.message };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(fileName);

    return { success: true, url: publicUrl };
  } catch (error) {
    console.error('Upload error:', error);
    return { success: false, error: 'Failed to upload image' };
  }
};

/**
 * Delete an image from Supabase Storage
 * @param {string} url - The public URL of the image to delete
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteImage = async (url) => {
  try {
    if (!url) {
      return { success: false, error: 'No URL provided' };
    }

    // Extract file path from URL
    const urlParts = url.split('/');
    const bucketIndex = urlParts.findIndex(part => part === STORAGE_BUCKET);
    
    if (bucketIndex === -1) {
      return { success: false, error: 'Invalid image URL' };
    }

    const filePath = urlParts.slice(bucketIndex + 1).join('/');

    // Delete file from Supabase Storage
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Delete error:', error);
    return { success: false, error: 'Failed to delete image' };
  }
};

/**
 * Upload multiple images
 * @param {File[]} files - Array of image files to upload
 * @param {string} folder - Optional folder path
 * @returns {Promise<{success: boolean, urls?: string[], errors?: string[]}>}
 */
export const uploadMultipleImages = async (files, folder = 'gallery') => {
  try {
    const uploadPromises = files.map(file => uploadImage(file, folder));
    const results = await Promise.all(uploadPromises);

    const successfulUploads = results.filter(result => result.success);
    const failedUploads = results.filter(result => !result.success);

    const urls = successfulUploads.map(result => result.url);
    const errors = failedUploads.map(result => result.error);

    return {
      success: successfulUploads.length > 0,
      urls,
      errors: errors.length > 0 ? errors : undefined
    };
  } catch (error) {
    console.error('Multiple upload error:', error);
    return { success: false, errors: ['Failed to upload images'] };
  }
};

/**
 * Validate image file
 * @param {File} file - The file to validate
 * @returns {{valid: boolean, error?: string}}
 */
export const validateImageFile = (file) => {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'File must be an image' };
  }

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 5MB' };
  }

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only JPEG, PNG, and WebP images are allowed' };
  }

  return { valid: true };
};
