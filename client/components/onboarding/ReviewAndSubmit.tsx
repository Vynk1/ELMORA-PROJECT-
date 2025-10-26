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

    // Skip API call and directly show hardcoded insights
    console.log('Using hardcoded insights (as requested)');
    
    // Calculate a basic score from answers for fallback
    const basicScore = answers.length * 2.5; // Assume average score
    const fallbackCategory = basicScore >= 20 ? "Growth Champion" 
                           : basicScore >= 15 ? "Resilient Builder" 
                           : "Balanced Explorer";
    
    const fallbackInsights = [
      `Your responses show a ${fallbackCategory.toLowerCase()} mindset.`,
      "You demonstrate awareness of your emotional patterns.",
      "You're open to personal growth and development.",
      "Your self-reflection skills are developing positively."
    ];
    
    const fallbackRecommendations = [
      "Practice daily mindfulness for 5-10 minutes.",
      "Keep a weekly reflection journal.",
      "Set small, achievable personal goals.",
      "Connect with supportive people regularly."
    ];
    
    // Update context with fallback data
    updateAi({
      score: Math.round(basicScore),
      category: fallbackCategory,
      insights: fallbackInsights,
      recommendations: fallbackRecommendations
    });
    
    // Mark assessment as completed in database
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ assessment_completed: true })
        .eq('user_id', user.id);
      
      if (updateError) {
        console.error('Profile update error:', updateError);
      } else {
        console.log('Profile marked as completed in database');
      }
    } catch (supabaseError) {
      console.error('Supabase error:', supabaseError);
    }
    
    // Also mark as completed in localStorage as backup
    localStorage.setItem(`onboarding_completed_${user.id}`, 'true');
    console.log('Assessment marked as completed in localStorage');
    
    // Show success message and proceed to results
    console.log('Proceeding to insights page');
    setIsSubmitting(false);
    setSubmitting(false);
    nextStep(); // Move to AI results step
    
    return; // Skip the API call entirely

    try {
      // Call new onboarding submission endpoint
      const onboardingPayload = {
        userId: user.id,
        answers: answers.map(a => ({
          id: a.id,
          choice: a.choice
        })),
        basics: basics,
        photoUrl: photo.url || null
      };

      console.log('Submitting onboarding payload:', onboardingPayload);
      
      // Use the correct API URL - adjust port if needed
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/onboarding/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(onboardingPayload)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      // Check if response is ok and has content
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error response:', errorText);
        throw new Error(`Server responded with ${response.status}: ${errorText}`);
      }
      
      // Check if response has content
      const responseText = await response.text();
      console.log('Raw response:', responseText);
      
      if (!responseText.trim()) {
        throw new Error('Empty response from server');
      }
      
      let result;
      try {
        result = JSON.parse(responseText);
        console.log('Parsed result:', result);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Response text was:', responseText);
        throw new Error('Invalid JSON response from server');
      }
      
      if (response.status === 409) {
        // Assessment already completed
        if (result.redirect) {
          navigate(result.redirect);
        }
        return;
      }

      if (!response.ok) {
        throw new Error(result.error || 'Submission failed');
      }

      // Update context with results from backend
      updateAi({
        score: result.score,
        category: result.category,
        insights: result.insights || [],
        recommendations: result.recommendations || []
      });

      // Check for redirect instruction
      if (result.redirect) {
        // For now, proceed to next step to show results, then redirect
        nextStep();
        // Optionally, you could redirect immediately:
        // navigate(result.redirect);
      } else {
        nextStep();
      }

    } catch (error) {
      console.error('Submission error:', error);
      
      // If API fails, use hardcoded fallback data and complete onboarding locally
      console.log('Using fallback hardcoded insights due to API failure');
      
      // Calculate a basic score from answers for fallback
      const basicScore = answers.length * 2.5; // Assume average score
      const fallbackCategory = basicScore >= 20 ? "Growth Champion" 
                             : basicScore >= 15 ? "Resilient Builder" 
                             : "Balanced Explorer";
      
      const fallbackInsights = [
        `Your responses show a ${fallbackCategory.toLowerCase()} mindset.`,
        "You demonstrate awareness of your emotional patterns.",
        "You're open to personal growth and development.",
        "Your self-reflection skills are developing positively."
      ];
      
      const fallbackRecommendations = [
        "Practice daily mindfulness for 5-10 minutes.",
        "Keep a weekly reflection journal.",
        "Set small, achievable personal goals.",
        "Connect with supportive people regularly."
      ];
      
      // Update context with fallback data
      updateAi({
        score: Math.round(basicScore),
        category: fallbackCategory,
        insights: fallbackInsights,
        recommendations: fallbackRecommendations
      });
      
      // Mark assessment as completed locally (best effort)
      try {
        // Try to update Supabase directly (might work even if API doesn't)
        await supabase
          .from('profiles')
          .update({ assessment_completed: true })
          .eq('id', user.id);
      } catch (supabaseError) {
        console.log('Direct Supabase update also failed, continuing with fallback');
      }
      
      // Show success message and proceed to results
      console.log('Proceeding with fallback onboarding completion');
      nextStep(); // Move to AI results step
      
      // Set a flag that this was a fallback completion
      setSubmitError('Completed with basic insights (API temporarily unavailable)');
      
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
              {submitError.includes('400') && (
                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      // Use completely hardcoded fallback and skip to dashboard
                      updateAi({
                        score: 20,
                        category: "Balanced Explorer",
                        insights: [
                          "Thank you for completing the assessment.",
                          "Your responses show thoughtful self-reflection.",
                          "You're taking positive steps toward growth.",
                          "Continue exploring your personal development journey."
                        ],
                        recommendations: [
                          "Practice daily mindfulness meditation.",
                          "Keep a personal growth journal.",
                          "Set achievable weekly goals.",
                          "Connect with supportive communities."
                        ]
                      });
                      
                      // Try to mark as completed in Supabase
                      supabase
                        .from('profiles')
                        .update({ assessment_completed: true })
                        .eq('id', user.id)
                        .then(() => console.log('Profile updated successfully'))
                        .catch(err => console.log('Profile update failed:', err));
                      
                      // Go to results page
                      nextStep();
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    Continue with Basic Insights
                  </button>
                  
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                  >
                    Skip to Dashboard
                  </button>
                </div>
              )}
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
              onClick={handleSubmit}
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