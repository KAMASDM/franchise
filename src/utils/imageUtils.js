/**
 * Image Utilities
 * Provides image compression and optimization before upload
 */

import imageCompression from 'browser-image-compression';
import logger from './logger';

/**
 * Compress an image file
 * @param {File} file - The image file to compress
 * @param {Object} options - Compression options
 * @returns {Promise<File>} - Compressed image file
 */
export async function compressImage(file, options = {}) {
  const defaultOptions = {
    maxSizeMB: 1, // Maximum file size in MB
    maxWidthOrHeight: 1920, // Maximum width or height
    useWebWorker: true, // Use web worker for better performance
    fileType: file.type, // Maintain original file type
    ...options
  };
  
  try {
    logger.log('Compressing image:', file.name, 'Original size:', (file.size / 1024 / 1024).toFixed(2), 'MB');
    
    const compressedFile = await imageCompression(file, defaultOptions);
    
    logger.log('Compression complete:', compressedFile.name, 'New size:', (compressedFile.size / 1024 / 1024).toFixed(2), 'MB');
    
    return compressedFile;
  } catch (error) {
    logger.error('Image compression failed:', error);
    // Return original file if compression fails
    return file;
  }
}

/**
 * Compress multiple images
 * @param {File[]} files - Array of image files
 * @param {Object} options - Compression options
 * @returns {Promise<File[]>} - Array of compressed files
 */
export async function compressImages(files, options = {}) {
  try {
    const compressionPromises = files.map(file => compressImage(file, options));
    return await Promise.all(compressionPromises);
  } catch (error) {
    logger.error('Batch compression failed:', error);
    return files; // Return originals if batch compression fails
  }
}

/**
 * Validate image file type
 * @param {File} file - File to validate
 * @param {string[]} allowedTypes - Array of allowed MIME types
 * @returns {boolean} - True if valid
 */
export function isValidImageType(file, allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']) {
  return allowedTypes.includes(file.type);
}

/**
 * Validate image file size
 * @param {File} file - File to validate
 * @param {number} maxSizeMB - Maximum size in MB
 * @returns {boolean} - True if valid
 */
export function isValidImageSize(file, maxSizeMB = 5) {
  const fileSizeMB = file.size / 1024 / 1024;
  return fileSizeMB <= maxSizeMB;
}

/**
 * Get image dimensions
 * @param {File} file - Image file
 * @returns {Promise<{width: number, height: number}>}
 */
export function getImageDimensions(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({
        width: img.width,
        height: img.height
      });
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    
    img.src = url;
  });
}

/**
 * Create image preview URL
 * @param {File} file - Image file
 * @returns {string} - Object URL for preview
 */
export function createImagePreview(file) {
  return URL.createObjectURL(file);
}

/**
 * Revoke image preview URL to free memory
 * @param {string} url - Object URL to revoke
 */
export function revokeImagePreview(url) {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}

export default {
  compressImage,
  compressImages,
  isValidImageType,
  isValidImageSize,
  getImageDimensions,
  createImagePreview,
  revokeImagePreview,
};
