'use client';

import { useOnboarding } from '../../contexts/OnboardingContext';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { SparklesIcon, LightBulbIcon, ArrowRightIcon, TrophyIcon } from '@heroicons/react/24/outline';

export default function AiResults() {
  const { ai, basics } = useOnboarding();
  const { user } = useAuth();

  if (!ai) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading your results...</p>
      </div>
    );
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Growth Champion':
        return 'bg-emerald-500 text-white border-emerald-400';
      case 'Resilient Builder':
        return 'bg-blue-500 text-white border-blue-400';
      case 'Balanced Explorer':
        return 'bg-purple-500 text-white border-purple-400';
      case 'Emerging Mindset':
        return 'bg-orange-500 text-white border-orange-400';
      case 'Overwhelmed — Needs Support':
        return 'bg-rose-500 text-white border-rose-400';
      default:
        return 'bg-gray-500 text-white border-gray-400';
    }
  };

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'Growth Champion':
        return '🏆';
      case 'Resilient Builder':
        return '💪';
      case 'Balanced Explorer':
        return '🔍';
      case 'Emerging Mindset':
        return '🌱';
      case 'Overwhelmed — Needs Support':
        return '🤗';
      default:
        return '✨';
    }
  };

  const progressPercentage = Math.round((ai.score / 30) * 100);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white text-4xl mb-4">
          <SparklesIcon className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Congratulations, {basics.name}! 🎉
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Your personalized well-being insights are ready. Here's what we discovered about your mindset and recommendations for your growth journey.
        </p>
      </div>

      <div className="space-y-8">
        {/* Score and Category Badge */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-200">
          <div className="text-center">
            <div className={`inline-flex items-center px-6 py-3 rounded-full text-lg font-bold mb-4 ${getCategoryColor(ai.category)}`}>
              <span className="text-2xl mr-3">{getCategoryEmoji(ai.category)}</span>
              {ai.category}
            </div>
            <div className="mb-6">
              <div className="text-4xl font-bold text-gray-800 mb-2">
                {ai.score} / 30
              </div>
              <p className="text-gray-600 mb-4">Your Well-being Score</p>
              <div className="w-full bg-gray-200 rounded-full h-4 max-w-md mx-auto">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">{progressPercentage}% of maximum score</p>
            </div>
          </div>
        </div>

        {/* Insights Section */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <LightBulbIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Your Insights</h3>
              <p className="text-gray-600">Understanding your well-being mindset</p>
            </div>
          </div>
          <div className="space-y-4">
            {ai.insights.map((insight, index) => (
              <div key={index} className="flex items-start p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-0.5 flex-shrink-0">
                  {index + 1}
                </div>
                <p className="text-gray-700 leading-relaxed">{insight}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations Section */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
              <TrophyIcon className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Your Growth Plan</h3>
              <p className="text-gray-600">Actionable steps for your well-being journey</p>
            </div>
          </div>
          <div className="space-y-4">
            {ai.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-0.5 flex-shrink-0">
                  {index + 1}
                </div>
                <p className="text-gray-700 leading-relaxed">{recommendation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Your Elmora Journey Begins Now! 🚀
          </h3>
          <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
            You're all set up! Your personalized dashboard awaits with tools and features tailored to support your growth mindset and well-being goals.
          </p>
          
          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={async () => {
                  try {
                    // Mark assessment as completed in database
                    if (user) {
                      await supabase
                        .from('profiles')
                        .update({ assessment_completed: true })
                        .eq('id', user.id);
                      console.log('Assessment marked as completed in database');
                    }
                  } catch (error) {
                    console.error('Error updating assessment status:', error);
                  }
                  
                  // Also mark as completed in localStorage as backup
                  if (user) {
                    localStorage.setItem(`onboarding_completed_${user.id}`, 'true');
                    console.log('Assessment marked as completed in localStorage');
                  }
                  
                  // Force navigation to dashboard with replace to prevent back button issues
                  window.location.replace('/dashboard');
                }}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-400/50 shadow-lg"
              >
                Go to My Dashboard
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
            <h4 className="font-semibold text-gray-800 mb-3">💾 Your Data is Safe</h4>
            <p className="text-sm text-gray-600">
              Your assessment results are securely stored and will always be available in your profile. 
              You can retake the assessment anytime to track your growth.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
            <h4 className="font-semibold text-gray-800 mb-3">📈 Track Your Progress</h4>
            <p className="text-sm text-gray-600">
              Use your dashboard to set goals, track daily well-being, and see how you're growing. 
              Your insights will help guide your journey.
            </p>
          </div>
        </div>
      </div>

      {/* Fun celebration animation */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-4 h-4 bg-yellow-300 rounded-full animate-bounce animation-delay-1000 opacity-60" />
        <div className="absolute top-20 right-20 w-3 h-3 bg-pink-300 rounded-full animate-bounce animation-delay-2000 opacity-60" />
        <div className="absolute bottom-32 left-20 w-5 h-5 bg-purple-300 rounded-full animate-bounce animation-delay-3000 opacity-60" />
        <div className="absolute bottom-40 right-10 w-4 h-4 bg-blue-300 rounded-full animate-bounce animation-delay-4000 opacity-60" />
      </div>
    </div>
  );
}