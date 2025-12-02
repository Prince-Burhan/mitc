import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { CloudinarySettings, CloudinaryUploadResult } from '../types/settings';

const MAX_FILE_SIZE = 700 * 1024; // 700KB

/**
 * Get Cloudinary settings from Firestore
 */
export const getCloudinarySettings = async (): Promise<CloudinarySettings | null> => {
  try {
    const settingsRef = doc(db, 'settings', 'integrations');
    const settingsSnap = await getDoc(settingsRef);

    if (!settingsSnap.exists()) {
      return null;
    }

    const data = settingsSnap.data();
    return data.cloudinary || null;
  } catch (error) {
    console.error('Error getting Cloudinary settings:', error);
    return null;
  }
};

/**
 * Save Cloudinary settings to Firestore
 */
export const saveCloudinarySettings = async (settings: CloudinarySettings): Promise<void> => {
  try {
    const settingsRef = doc(db, 'settings', 'integrations');
    await setDoc(
      settingsRef,
      {
        cloudinary: {
          ...settings,
          apiSecret: settings.apiSecret, // In production, use backend to store this
        },
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Error saving Cloudinary settings:', error);
    throw new Error('Failed to save Cloudinary settings');
  }
};

/**
 * Test Cloudinary connection
 */
export const testCloudinaryConnection = async (
  settings: CloudinarySettings
): Promise<{ success: boolean; message: string }> => {
  try {
    // Create a simple test upload with a 1x1 pixel data URL
    const testImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

    const formData = new FormData();
    formData.append('file', testImage);
    formData.append('upload_preset', settings.uploadPreset);
    formData.append('api_key', settings.apiKey);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${settings.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (response.ok) {
      const result = await response.json();
      // Delete the test image immediately
      // Note: Deletion requires authenticated request, skip for now
      return { success: true, message: 'Connection successful' };
    } else {
      const error = await response.json();
      return { success: false, message: error.error?.message || 'Connection failed' };
    }
  } catch (error: any) {
    return { success: false, message: error.message || 'Connection test failed' };
  }
};

/**
 * Compress image file
 */
export const compressImage = async (file: File, maxSizeKB: number = 700): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions while maintaining aspect ratio
        const maxDimension = 2048;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = (height / width) * maxDimension;
            width = maxDimension;
          } else {
            width = (width / height) * maxDimension;
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Try different quality levels
        const tryCompress = (quality: number) => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Compression failed'));
                return;
              }

              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });

              if (compressedFile.size <= maxSizeKB * 1024 || quality <= 0.1) {
                resolve(compressedFile);
              } else {
                // Try with lower quality
                tryCompress(quality - 0.1);
              }
            },
            'image/jpeg',
            quality
          );
        };

        tryCompress(0.9);
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

/**
 * Upload image to Cloudinary with automatic compression
 */
export const uploadToCloudinary = async (
  file: File,
  folder?: string
): Promise<CloudinaryUploadResult> => {
  try {
    // Get Cloudinary settings
    const settings = await getCloudinarySettings();

    if (!settings || !settings.enabled) {
      throw new Error('Cloudinary is not configured or enabled');
    }

    let fileToUpload = file;

    // Compress if file is too large
    if (file.size > MAX_FILE_SIZE) {
      console.log(`File size ${(file.size / 1024).toFixed(2)}KB exceeds ${MAX_FILE_SIZE / 1024}KB, compressing...`);
      try {
        fileToUpload = await compressImage(file);
        console.log(`Compressed to ${(fileToUpload.size / 1024).toFixed(2)}KB`);
      } catch (error) {
        console.warn('Compression failed, uploading original file:', error);
        // Continue with original file
      }
    }

    // Prepare upload
    const formData = new FormData();
    formData.append('file', fileToUpload);
    formData.append('upload_preset', settings.uploadPreset);
    formData.append('api_key', settings.apiKey);

    if (folder) {
      formData.append('folder', folder);
    }

    // Upload to Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${settings.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Upload failed');
    }

    const result = await response.json();
    return result as CloudinaryUploadResult;
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    throw new Error(error.message || 'Failed to upload image to Cloudinary');
  }
};

/**
 * Upload multiple images to Cloudinary
 */
export const uploadMultipleToCloudinary = async (
  files: File[],
  folder?: string
): Promise<CloudinaryUploadResult[]> => {
  const results: CloudinaryUploadResult[] = [];

  for (const file of files) {
    try {
      const result = await uploadToCloudinary(file, folder);
      results.push(result);
    } catch (error) {
      console.error(`Failed to upload ${file.name}:`, error);
      // Continue with other files
    }
  }

  return results;
};

/**
 * Delete image from Cloudinary
 * Note: This requires server-side implementation with API secret
 */
export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  // This should be implemented as a Cloud Function or backend API
  // because it requires the API secret which should never be exposed client-side
  console.warn('Delete functionality requires backend implementation');
  throw new Error('Delete functionality not implemented - requires backend');
};

// Legacy exports for backward compatibility
export interface UploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export const uploadImage = async (file: File): Promise<UploadResult> => {
  const result = await uploadToCloudinary(file, 'mitc-store');
  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format,
    bytes: result.bytes,
  };
};

export const uploadMultipleImages = async (files: File[]): Promise<UploadResult[]> => {
  const results = await uploadMultipleToCloudinary(files, 'mitc-store');
  return results.map(result => ({
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format,
    bytes: result.bytes,
  }));
};

export const deleteImage = async (publicId: string): Promise<void> => {
  await deleteFromCloudinary(publicId);
};
