import { supabase } from '../lib/supabase';

const STORAGE_BUCKET = 'product-images';

export const uploadImage = async (file, folder = 'products') => {
  try {
    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    if (!file.type.startsWith('image/')) {
      return { success: false, error: 'File must be an image' };
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return { success: false, error: 'File size must be less than 5MB' };
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

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

    const { data: { publicUrl } } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(fileName);

    return { success: true, url: publicUrl };
  } catch (error) {
    console.error('Upload error:', error);
    return { success: false, error: 'Failed to upload image' };
  }
};

export const deleteImage = async (url) => {
  try {
    if (!url) {
      return { success: false, error: 'No URL provided' };
    }

    const urlParts = url.split('/');
    const bucketIndex = urlParts.findIndex(part => part === STORAGE_BUCKET);
    
    if (bucketIndex === -1) {
      return { success: false, error: 'Invalid image URL' };
    }

    const filePath = urlParts.slice(bucketIndex + 1).join('/');

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

export const validateImageFile = (file) => {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'File must be an image' };
  }

  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 5MB' };
  }

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only JPEG, PNG, and WebP images are allowed' };
  }

  return { valid: true };
};
