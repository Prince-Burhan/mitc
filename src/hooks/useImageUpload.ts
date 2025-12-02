import { useState } from 'react';
import { uploadImage, uploadMultipleImages } from '../services/cloudinaryService';
import { validateImageFile } from '../utils/validators';
import toast from 'react-hot-toast';

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadSingle = async (file: File) => {
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      toast.error(validation.error!);
      return null;
    }

    try {
      setUploading(true);
      setProgress(0);
      
      const result = await uploadImage(file);
      
      setProgress(100);
      toast.success('Image uploaded successfully');
      
      return result.url;
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload image');
      return null;
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const uploadMultiple = async (files: File[]) => {
    // Validate all files
    for (const file of files) {
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        toast.error(`${file.name}: ${validation.error}`);
        return [];
      }
    }

    try {
      setUploading(true);
      setProgress(0);
      
      const results = await uploadMultipleImages(files);
      
      setProgress(100);
      toast.success(`${results.length} images uploaded successfully`);
      
      return results.map((r) => r.url);
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload images');
      return [];
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return {
    uploadSingle,
    uploadMultiple,
    uploading,
    progress,
  };
};