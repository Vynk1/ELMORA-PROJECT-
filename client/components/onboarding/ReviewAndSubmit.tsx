'use client';

import { useState } from 'react';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from "react-router-dom";
import { supabase } from '../../lib/supabase';
import { QUESTIONS } from '../../lib/questions';
import { scoreAssessment } from '../../lib/score';
import { CheckCircleIcon, UserIcon, CameraIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

export default function ReviewAndSubmit() {
  const { answers, basics, photo, updateAi, nextStep, prevStep, setSubmitting, setError } = useOnboarding();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Calculate assessment results
  const assessmentResult = scoreAssessment(answers);

  const handleSubmit = async () => {
    if (!user) {
      setSubmitError('User not authenticated');
      return;
    }

    setIsSubmitting(true);
    setSubmitting(true);
    setSubmitError(null);
    setError(undefined);

    try {
      // 1. Call AI analysis API
      const analysisPayload = {
        answers: answers.map(a => ({
          id: a.id,
          choice: a.choice,
          points: a.points
        })),
        basics
      };

      const analysisResponse = await fetch('/api/analyze-wellbeing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(analysisPayload)
      });

      if (!analysisResponse.ok) {
        throw new Error(`AI analysis failed: ${analysisResponse.status}`);
      }

      const aiResults = await analysisResponse.json();

      // 2. Upload data to Supabase
      const promises = [];

      // Update profiles table
      const profileUpdate = {
        display_name: basics.name,
        bio: basics.bio,
        avatar_url: photo.url || null,
        assessment_completed: true,
        assessment_score: aiResults.score,
        assessment_category: aiResults.category
      };

      promises.push(
        supabase
          .from('profiles')
          .upsert({ user_id: user.id, ...profileUpdate })
          .select()
      );

      // Insert assessment results
      const assessmentData = {
        user_id: user.id,
        answers: answers.map(a => ({
          id: a.id,
          choice: a.choice,
          points: a.points
        })),
        score: aiResults.score,
        category: aiResults.category,
        ai_insights: {
          insights: aiResults.insights,
          recommendations: aiResults.recommendations
        }
      };

      promises.push(
        supabase
          .from('assessment_results')
          .insert(assessmentData)
          .select()
      );

      // Wait for all operations to complete
      const results = await Promise.all(promises);

      // Check for errors
      for (const result of results) {
        if (result.error) {
          console.error('Supabase operation failed:', result.error);
          throw new Error(result.error.message || 'Database operation failed');
        }
      }

      // 3. Update context with AI results
      updateAi({
        score: aiResults.score,
        category: aiResults.category,
        insights: aiResults.insights,
        recommendations: aiResults.recommendations
      });

      // 4. Move to results step
      nextStep();

    } catch (error) {
      console.error('Submission error:', error);
      
      let errorMessage = 'Failed to complete onboarding. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('unique constraint')) {
          errorMessage = 'Assessment already completed. Redirecting to dashboard...';
          // Wait a moment then redirect
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 2000);
        } else {
          errorMessage = error.message;
        }
      }
      
      setSubmitError(errorMessage);
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Review sections */}
      <div className="space-y-8">
        {/* Assessment Review */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-6">
          <div className="flex items-center mb-4">
            <ClipboardDocumentListIcon className="w-6 h-6 text-purple-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-800">Assessment Complete</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Questions Answered</p>
              <p className="text-2xl font-bold text-purple-600">{answers.length} / 10</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Preliminary Score</p>
              <p className="text-2xl font-bold text-purple-600">
                {assessmentResult.score} / 30
              </p>
            </div>
          </div>
          <div className="mt-4 p-4 bg-white rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Category:</strong> {assessmentResult.category}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Final results will include personalized AI insights after submission.
            </p>
          </div>
        </div>

        {/* Profile Review */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center mb-4">
            <UserIcon className="w-6 h-6 text-gray-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-800">Profile Information</h3>
          </div>
          <div className="flex items-center space-x-4">
            {photo.url ? (
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
                <img src={photo.url} alt="Profile" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                <CameraIcon className="w-6 h-6 text-gray-400" />
              </div>
            )}
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800">{basics.name}</h4>
              {basics.bio ? (
                <p className="text-gray-600 text-sm mt-1">{basics.bio}</p>
              ) : (
                <p className="text-gray-400 text-sm mt-1">No bio added</p>
              )}
            </div>
          </div>
        </div>

        {/* Selected Answers Preview */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Assessment Responses</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {answers.map((answer) => {
              const question = QUESTIONS.find(q => q.id === answer.id);
              const option = question?.options.find(opt => opt.key === answer.choice);
              
              return (
                <div key={answer.id} className="border border-gray-100 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-800 mb-2">
                    {question?.text}
                  </p>
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-medium mr-3">
                      {answer.choice}
                    </div>
                    <p className="text-sm text-gray-600 flex-1">
                      {option?.label}
                    </p>
                    <span className="text-xs text-gray-400">
                      {answer.points} pts
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Submit section */}
      <div className="mt-12 p-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
        <div className="text-center">
          <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Ready to Get Your Insights?</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            We'll analyze your responses using AI to provide personalized insights about your well-being mindset 
            and recommendations for growth. This takes just a moment.
          </p>
          
          {submitError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg" role="alert">
              <p className="text-red-800 text-sm">{submitError}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={prevStep}
              disabled={isSubmitting}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Back to Photo
            </button>
            <button
              onClick={()=>{
                navigate("/dashboard");
              }}
              disabled={isSubmitting}
              className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
                isSubmitting
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-400/50'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-400 border-t-transparent mr-2" />
                  Analyzing Your Results...
                </div>
              ) : (
                'Submit & See My Insights'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* What happens next */}
      <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-xl">
        <h4 className="font-semibold text-blue-800 mb-3">What happens next?</h4>
        <ul className="text-sm text-blue-700 space-y-2">
          <li className="flex items-center">
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3"></span>
            Your responses are analyzed using advanced AI
          </li>
          <li className="flex items-center">
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3"></span>
            We generate personalized insights about your well-being mindset
          </li>
          <li className="flex items-center">
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3"></span>
            You receive specific recommendations for growth
          </li>
          <li className="flex items-center">
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3"></span>
            Your profile is created and you can access your dashboard
          </li>
        </ul>
      </div>
    </div>
  );
}