'use client';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingProvider, useOnboarding } from '../../contexts/OnboardingContext';
import { ONBOARDING_STEPS } from '../../types/onboarding';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

// Import step components (we'll create these next)
import Assessment10 from '../../components/onboarding/Assessment10';
import ProfileBasics from '../../components/onboarding/ProfileBasics';
import ProfilePhoto from '../../components/onboarding/ProfilePhoto';
import ReviewAndSubmit from '../../components/onboarding/ReviewAndSubmit';
import AiResults from '../../components/onboarding/AiResults';

// Progress bar component
function ProgressBar({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  const progress = ((currentStep + 1) / totalSteps) * 100;
  
  return (
    <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
      <div 
        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
      <div className="flex justify-between mt-2 text-sm text-gray-600">
        <span>Step {currentStep + 1} of {totalSteps}</span>
        <span>{Math.round(progress)}% Complete</span>
      </div>
    </div>
  );
}

// Step header component
function StepHeader({ stepName, stepNumber }: { stepName: string; stepNumber: number }) {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-bold text-lg mb-4">
        {stepNumber}
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        {stepName}
      </h1>
      <p className="text-gray-600 max-w-2xl mx-auto">
        {stepNumber === 1 && "Let's understand your well-being mindset with a quick assessment."}
        {stepNumber === 2 && "Tell us a bit about yourself to personalize your experience."}
        {stepNumber === 3 && "Add a profile photo to complete your Elmora profile."}
        {stepNumber === 4 && "Review your information before we generate your insights."}
        {stepNumber === 5 && "Here are your personalized well-being insights and recommendations."}
      </p>
    </div>
  );
}

// Sign out button component
function SignOutButton() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-white/60 rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/20 disabled:opacity-50"
      title="Sign out and return to login"
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      )}
      <span className="text-sm font-medium">Exit</span>
    </button>
  );
}

// Main onboarding content component
function OnboardingContent() {
  const { currentStep } = useOnboarding();
  const stepComponents = [
    Assessment10,
    ProfileBasics,
    ProfilePhoto,
    ReviewAndSubmit,
    AiResults,
  ];
  
  const CurrentStepComponent = stepComponents[currentStep];
  const stepName = ONBOARDING_STEPS[currentStep];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000" />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {/* Header with brand and sign out */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌸</span>
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent text-xl font-semibold tracking-wide">Elmora</span>
          </div>
          <SignOutButton />
        </div>
        
        {/* Progress bar */}
        <ProgressBar currentStep={currentStep} totalSteps={ONBOARDING_STEPS.length} />
        
        {/* Step content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 md:p-12">
          <StepHeader stepName={stepName} stepNumber={currentStep + 1} />
          <CurrentStepComponent />
        </div>
      </div>
    </div>
  );
}

// Auth guard component
function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkOnboardingStatus() {
      if (loading) return;
      
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        // Check if user has already completed onboarding
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('assessment_completed')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking onboarding status:', error);
        }

        // Also check localStorage as backup
        const localStorageCompleted = localStorage.getItem(`onboarding_completed_${user.id}`) === 'true';

        // If assessment is already completed (in DB or localStorage), redirect to dashboard
        if (profile?.assessment_completed === true || localStorageCompleted) {
          console.log('Onboarding already completed, redirecting to dashboard');
          navigate('/dashboard', { replace: true });
          return;
        }

        setChecking(false);
      } catch (error) {
        console.error('Error in onboarding guard:', error);
        setChecking(false);
      }
    }

    checkOnboardingStatus();
  }, [user, loading, navigate]);

  if (loading || checking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Router will handle redirect
  }

  return <>{children}</>;
}

// Main page component
export default function OnboardingPage() {
  return (
    <OnboardingGuard>
      <OnboardingProvider>
        <OnboardingContent />
      </OnboardingProvider>
    </OnboardingGuard>
  );
}