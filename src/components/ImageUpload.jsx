import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader } from 'lucide-react';
import { uploadImage, validateImageFile } from '../utils/imageUpload';

export default function ImageUpload({ 
  onImageUploaded, 
  currentImage = null, 
  folder = 'products',
  className = '',
  label = 'Upload Image'
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = async (file) => {
    setError('');
    
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setIsUploading(true);

    try {
      const result = await uploadImage(file, folder);
      
      if (result.success) {
        onImageUploaded(result.url);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    onImageUploaded('');
    setError('');
  };

  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-slate-900 mb-2">
        {label}
      </label>
      
      {currentImage ? (
        <div className="relative group">
          <img
            src={currentImage}
            alt="Current"
            className="w-full h-48 object-cover rounded-xl border border-slate-200"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center space-x-3">
            <button
              type="button"
              onClick={openFileDialog}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={removeImage}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
            dragActive
              ? 'border-emerald-500 bg-emerald-50'
              : error
              ? 'border-red-300 bg-red-50'
              : 'border-slate-300 hover:border-emerald-400 hover:bg-emerald-50'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={openFileDialog}
        >
          {isUploading ? (
            <div className="flex flex-col items-center">
              <Loader className="w-8 h-8 text-emerald-600 animate-spin mb-3" />
              <p className="text-slate-600 font-medium">Uploading image...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-3">
                {error ? (
                  <X className="w-6 h-6 text-red-500" />
                ) : (
                  <Upload className="w-6 h-6 text-slate-400" />
                )}
              </div>
              <p className="text-slate-900 font-medium mb-1">
                {error ? 'Upload Failed' : 'Drop image here or click to browse'}
              </p>
              <p className="text-slate-500 text-sm">
                {error ? error : 'PNG, JPG, WebP up to 5MB'}
              </p>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  );
}

export function MultiImageUpload({ 
  onImagesUploaded, 
  currentImages = [], 
  folder = 'gallery',
  maxImages = 5,
  className = '',
  label = 'Upload Gallery Images'
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFilesSelect = async (files) => {
    setError('');
    
    if (currentImages.length + files.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    setIsUploading(true);

    try {
      const uploadPromises = Array.from(files).map(file => {
        const validation = validateImageFile(file);
        if (!validation.valid) {
          throw new Error(validation.error);
        }
        return uploadImage(file, folder);
      });

      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter(result => result.success);
      
      if (successfulUploads.length > 0) {
        const newUrls = successfulUploads.map(result => result.url);
        onImagesUploaded([...currentImages, ...newUrls]);
      }

      const failedUploads = results.filter(result => !result.success);
      if (failedUploads.length > 0) {
        setError(`${failedUploads.length} images failed to upload`);
      }
    } catch (error) {
      setError(error.message || 'Failed to upload images');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFilesSelect(files);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFilesSelect(files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const removeImage = (index) => {
    const newImages = currentImages.filter((_, i) => i !== index);
    onImagesUploaded(newImages);
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-semibold text-slate-900">
          {label}
        </label>
        <span className="text-xs text-slate-500">
          {currentImages.length}/{maxImages} images
        </span>
      </div>

      {currentImages.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-4">
          {currentImages.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Gallery ${index + 1}`}
                className="w-full h-20 object-cover rounded-lg border border-slate-200"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {currentImages.length < maxImages && (
        <div
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
            dragActive
              ? 'border-emerald-500 bg-emerald-50'
              : error
              ? 'border-red-300 bg-red-50'
              : 'border-slate-300 hover:border-emerald-400 hover:bg-emerald-50'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={openFileDialog}
        >
          {isUploading ? (
            <div className="flex flex-col items-center">
              <Loader className="w-6 h-6 text-emerald-600 animate-spin mb-2" />
              <p className="text-slate-600 text-sm">Uploading images...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <ImageIcon className="w-6 h-6 text-slate-400 mb-2" />
              <p className="text-slate-900 text-sm font-medium mb-1">
                Add more images
              </p>
              <p className="text-slate-500 text-xs">
                {error || 'Drop images here or click to browse'}
              </p>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  );
}
