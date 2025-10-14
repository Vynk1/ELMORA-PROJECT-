'use client';

import { useState, useEffect } from 'react';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { UserIcon, PencilIcon } from '@heroicons/react/24/outline';

export default function ProfileBasics() {
  const { basics, updateBasics, nextStep, prevStep } = useOnboarding();
  const [formData, setFormData] = useState({
    name: basics.name || '',
    bio: basics.bio || '',
  });
  const [errors, setErrors] = useState<{name?: string; bio?: string}>({});
  const [touched, setTouched] = useState<{name?: boolean; bio?: boolean}>({});

  const bioMaxLength = 140;
  const bioRemaining = bioMaxLength - formData.bio.length;

  useEffect(() => {
    // Sync with context when component mounts
    setFormData({
      name: basics.name || '',
      bio: basics.bio || '',
    });
  }, [basics]);

  const validateForm = () => {
    const newErrors: {name?: string; bio?: string} = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'Name must be less than 50 characters';
    }

    if (formData.bio.length > bioMaxLength) {
      newErrors.bio = `Bio must be ${bioMaxLength} characters or less`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: 'name' | 'bio', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Update context in real-time
    const updatedBasics = { ...formData, [field]: value };
    updateBasics(updatedBasics);

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleInputBlur = (field: 'name' | 'bio') => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateForm();
  };

  const handleNext = () => {
    setTouched({ name: true, bio: true });
    if (validateForm()) {
      updateBasics(formData);
      nextStep();
    }
  };

  const isValid = formData.name.trim().length >= 2 && formData.bio.length <= bioMaxLength;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="space-y-8">
        {/* Name input */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Display Name *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <UserIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              onBlur={() => handleInputBlur('name')}
              className={`block w-full pl-10 pr-3 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-400/50 transition-all duration-200 ${
                errors.name && touched.name
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-gray-200 focus:border-purple-500'
              }`}
              placeholder="Enter your display name"
              maxLength={50}
            />
          </div>
          {errors.name && touched.name && (
            <p className="mt-2 text-sm text-red-600" role="alert">
              {errors.name}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            This is how you'll appear to others on Elmora
          </p>
        </div>

        {/* Bio input */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
            Bio (Optional)
          </label>
          <div className="relative">
            <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
              <PencilIcon className="h-5 w-5 text-gray-400" />
            </div>
            <textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              onBlur={() => handleInputBlur('bio')}
              rows={4}
              className={`block w-full pl-10 pr-3 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-400/50 transition-all duration-200 resize-none ${
                errors.bio && touched.bio
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-gray-200 focus:border-purple-500'
              }`}
              placeholder="Tell us a bit about yourself, your interests, or what brought you to Elmora..."
              maxLength={bioMaxLength}
            />
          </div>
          <div className="flex justify-between items-center mt-2">
            <div>
              {errors.bio && touched.bio && (
                <p className="text-sm text-red-600" role="alert">
                  {errors.bio}
                </p>
              )}
            </div>
            <p className={`text-xs ${
              bioRemaining < 20 ? 'text-orange-500' : 'text-gray-500'
            }`}>
              {bioRemaining} characters remaining
            </p>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Share what makes you unique - your wellness goals, hobbies, or motivation
          </p>
        </div>

        {/* Preview card */}
        {(formData.name || formData.bio) && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Preview</h3>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center mb-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {formData.name.charAt(0).toUpperCase() || '?'}
                </div>
                <div className="ml-3">
                  <h4 className="font-semibold text-gray-800">
                    {formData.name || 'Your Name'}
                  </h4>
                  <p className="text-sm text-gray-500">New member</p>
                </div>
              </div>
              {formData.bio && (
                <p className="text-gray-700 text-sm leading-relaxed">
                  {formData.bio}
                </p>
              )}
            </div>
          </div>
        )}
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
          Back to Assessment
        </button>

        <button
          onClick={handleNext}
          disabled={!isValid}
          className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            isValid
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-400/50'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Continue to Photo
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Help text */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-800">
              <strong>Privacy note:</strong> Your display name will be visible to other users. Your bio is optional and can be updated later in your profile settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}