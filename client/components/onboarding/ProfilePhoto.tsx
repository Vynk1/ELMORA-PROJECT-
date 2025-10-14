'use client';

import { useState, useRef, useCallback } from 'react';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { CameraIcon, CloudArrowUpIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function ProfilePhoto() {
  const { photo, updatePhoto, nextStep, prevStep } = useOnboarding();
  const { user } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(photo.url || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Image compression utility
  const compressImage = (file: File, maxSize: number = 300): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();

      img.onload = () => {
        // Calculate square dimensions (crop to center)
        const size = Math.min(img.width, img.height);
        const startX = (img.width - size) / 2;
        const startY = (img.height - size) / 2;

        // Set canvas to square
        canvas.width = maxSize;
        canvas.height = maxSize;

        // Draw cropped and resized image
        ctx.drawImage(
          img,
          startX, startY, size, size,
          0, 0, maxSize, maxSize
        );

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          0.8
        );
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const validateFile = (file: File): string | null => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      return 'Please upload a valid image file (JPEG, PNG, or WebP)';
    }

    if (file.size > maxSize) {
      return 'Image must be smaller than 10MB';
    }

    return null;
  };

  const handleFileSelect = async (file: File) => {
    setError(null);

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      // Create preview
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      // Compress image
      const compressedFile = await compressImage(file);
      
      // Update context with compressed file
      updatePhoto({ file: compressedFile, url: previewUrl });
    } catch (err) {
      setError('Failed to process image. Please try again.');
      console.error('Image processing error:', err);
    }
  };

  const uploadToSupabase = async (file: File): Promise<string | null> => {
    if (!user) return null;

    try {
      const fileName = `${user.id}.jpg`;
      const filePath = `${user.id}/${fileName}`;

      // Delete existing photo if any
      await supabase.storage
        .from('profiles')
        .remove([filePath]);

      // Upload new photo
      const { data, error } = await supabase.storage
        .from('profiles')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: publicData } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      return publicData.publicUrl;
    } catch (err) {
      console.error('Upload error:', err);
      return null;
    }
  };

  const handleUpload = async () => {
    if (!photo.file) return;

    setIsUploading(true);
    setError(null);

    try {
      const url = await uploadToSupabase(photo.file);
      
      if (url) {
        updatePhoto({ ...photo, url });
      } else {
        setError('Failed to upload image. Please try again.');
      }
    } catch (err) {
      setError('Upload failed. Please check your connection and try again.');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const removePhoto = () => {
    setPreview(null);
    setError(null);
    updatePhoto({});
  };

  const handleNext = () => {
    nextStep();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="space-y-8">
        {/* Upload area */}
        <div className="text-center">
          {preview ? (
            // Preview and upload section
            <div className="space-y-6">
              <div className="relative inline-block">
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-purple-200 shadow-lg">
                  <img 
                    src={preview} 
                    alt="Profile preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={removePhoto}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors focus:outline-none focus:ring-4 focus:ring-red-400/50"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>

              {photo.file && !photo.url && (
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-4 focus:ring-green-400/50"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <CloudArrowUpIcon className="w-4 h-4 mr-2" />
                      Upload Photo
                    </>
                  )}
                </button>
              )}

              {photo.url && (
                <p className="text-green-600 font-medium">
                  ✓ Photo uploaded successfully!
                </p>
              )}
            </div>
          ) : (
            // Drag and drop area
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`border-2 border-dashed rounded-xl p-12 transition-all duration-200 ${
                isDragging
                  ? 'border-purple-400 bg-purple-50'
                  : 'border-gray-300 hover:border-purple-300 hover:bg-purple-50/50'
              }`}
            >
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                  <CameraIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Add your profile photo
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Drag and drop an image here, or click to select
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-400/50"
                  >
                    Choose File
                  </button>
                </div>
                <p className="text-sm text-gray-500">
                  Supports JPEG, PNG, and WebP • Max 10MB
                </p>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>

        {/* Error message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl" role="alert">
            <p className="text-red-800 text-center">{error}</p>
          </div>
        )}

        {/* Info cards */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <h4 className="font-semibold text-blue-800 mb-2">Photo Tips</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Use a clear, well-lit photo</li>
              <li>• Face the camera directly</li>
              <li>• Avoid sunglasses or hats</li>
              <li>• Keep it professional yet friendly</li>
            </ul>
          </div>
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
            <h4 className="font-semibold text-purple-800 mb-2">Privacy & Safety</h4>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• Photo is optional</li>
              <li>• Can be updated anytime</li>
              <li>• Automatically cropped to square</li>
              <li>• Compressed for faster loading</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between items-center pt-8 mt-8 border-t border-gray-200">
        <button
          onClick={prevStep}
          className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Profile
        </button>

        <button
          onClick={handleNext}
          disabled={isUploading}
          className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            !isUploading
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-400/50'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isUploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent mr-2" />
              Processing...
            </>
          ) : (
            <>
              Continue to Review
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </>
          )}
        </button>
      </div>

      {/* Optional skip message */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">
          Profile photos help create a more personal experience, but you can always add one later in your settings.
        </p>
      </div>
    </div>
  );
}