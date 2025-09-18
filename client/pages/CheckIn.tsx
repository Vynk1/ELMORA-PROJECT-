import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AICheckIn from '../components/modals/AICheckIn';
import DailyCheckIn from '../components/modals/DailyCheckIn';
import { type MoodType } from '../components/MoodColorSwitcher';

interface CheckInProps {
  currentMood?: MoodType;
  onPointsUpdate?: (points: number) => void;
  userPoints?: number;
}

const CheckIn: React.FC<CheckInProps> = ({ 
  currentMood = 'mid', 
  onPointsUpdate, 
  userPoints = 0 
}) => {
  const navigate = useNavigate();
  const [showAICheckIn, setShowAICheckIn] = useState(false);
  const [showBasicCheckIn, setShowBasicCheckIn] = useState(false);

  const getMoodContent = () => {
    switch (currentMood) {
      case 'sad':
        return {
          gradient: 'from-gray-800 via-slate-700 to-gray-900',
          cardBg: 'bg-gray-800/50',
          textColor: 'text-gray-100',
        };
      case 'mid':
        return {
          gradient: 'from-amber-400 via-yellow-400 to-orange-400',
          cardBg: 'bg-amber-100/70',
          textColor: 'text-amber-900',
        };
      case 'amazing':
        return {
          gradient: 'from-emerald-400 via-teal-400 to-cyan-400',
          cardBg: 'bg-emerald-100/70',
          textColor: 'text-emerald-900',
        };
      default:
        return {
          gradient: 'from-purple-400 via-pink-400 to-red-400',
          cardBg: 'bg-purple-100/70',
          textColor: 'text-purple-900',
        };
    }
  };

  const moodContent = getMoodContent();

  const handleAICheckInComplete = (data: {
    mood: string;
    energy: number;
    gratitude: string;
    aiInsight: string;
  }) => {
    console.log('AI Check-in completed:', data);
    // Award points for completing AI check-in
    if (onPointsUpdate) {
      onPointsUpdate(userPoints + 10);
    }
    // Show success message or redirect
    alert('AI Check-in completed! +10 points earned 🌟');
    navigate('/dashboard');
  };

  const handleBasicCheckInComplete = (data: {
    mood: string;
    energy: number;
    gratitude: string;
  }) => {
    console.log('Basic check-in completed:', data);
    // Award points for completing basic check-in
    if (onPointsUpdate) {
      onPointsUpdate(userPoints + 5);
    }
    // Show success message or redirect
    alert('Daily check-in completed! +5 points earned ✨');
    navigate('/dashboard');
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${moodContent.gradient} pt-4`}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <button
            onClick={() => navigate('/dashboard')}
            className={`inline-flex items-center space-x-2 ${moodContent.textColor} opacity-80 hover:opacity-100 transition-opacity mb-6`}
          >
            <span>←</span>
            <span>Back to Dashboard</span>
          </button>
          
          <h1 className={`text-4xl md:text-5xl font-light mb-4 ${moodContent.textColor}`}>
            Daily Check-In
          </h1>
          <p className={`text-lg md:text-xl ${moodContent.textColor} opacity-90 max-w-2xl mx-auto`}>
            Take a moment to connect with yourself. How are you feeling today?
          </p>
        </div>

        {/* Check-in Options */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* AI Enhanced Check-in */}
          <div className={`${moodContent.cardBg} backdrop-blur-sm rounded-3xl p-8 border border-white/20`}>
            <div className="text-center">
              <div className="text-6xl mb-6">🤖</div>
              <h2 className={`text-2xl font-medium ${moodContent.textColor} mb-4`}>
                AI-Enhanced Check-In
              </h2>
              <p className={`${moodContent.textColor} opacity-80 mb-6 leading-relaxed`}>
                Get personalized insights and recommendations based on your mood, energy, and gratitude. 
                Our AI wellness coach will provide tailored guidance for your day.
              </p>
              <div className="space-y-3 mb-6">
                <div className={`flex items-center space-x-3 ${moodContent.textColor} opacity-70`}>
                  <span className="text-lg">✨</span>
                  <span className="text-sm">Personalized AI insights</span>
                </div>
                <div className={`flex items-center space-x-3 ${moodContent.textColor} opacity-70`}>
                  <span className="text-lg">📊</span>
                  <span className="text-sm">Mood and energy tracking</span>
                </div>
                <div className={`flex items-center space-x-3 ${moodContent.textColor} opacity-70`}>
                  <span className="text-lg">🎯</span>
                  <span className="text-sm">Tailored recommendations</span>
                </div>
                <div className={`flex items-center space-x-3 ${moodContent.textColor} opacity-70`}>
                  <span className="text-lg">💎</span>
                  <span className="text-sm">10 points reward</span>
                </div>
              </div>
              <button
                onClick={() => setShowAICheckIn(true)}
                className="w-full py-4 px-6 bg-white/20 hover:bg-white/30 text-white rounded-2xl font-medium transition-colors backdrop-blur-sm border border-white/30"
              >
                Start AI Check-In
              </button>
            </div>
          </div>

          {/* Basic Check-in */}
          <div className={`${moodContent.cardBg} backdrop-blur-sm rounded-3xl p-8 border border-white/20`}>
            <div className="text-center">
              <div className="text-6xl mb-6">📝</div>
              <h2 className={`text-2xl font-medium ${moodContent.textColor} mb-4`}>
                Quick Check-In
              </h2>
              <p className={`${moodContent.textColor} opacity-80 mb-6 leading-relaxed`}>
                A simple and fast way to track your daily mood and gratitude. 
                Perfect when you want to log your feelings quickly.
              </p>
              <div className="space-y-3 mb-6">
                <div className={`flex items-center space-x-3 ${moodContent.textColor} opacity-70`}>
                  <span className="text-lg">⚡</span>
                  <span className="text-sm">Quick and simple</span>
                </div>
                <div className={`flex items-center space-x-3 ${moodContent.textColor} opacity-70`}>
                  <span className="text-lg">😊</span>
                  <span className="text-sm">Mood tracking</span>
                </div>
                <div className={`flex items-center space-x-3 ${moodContent.textColor} opacity-70`}>
                  <span className="text-lg">🙏</span>
                  <span className="text-sm">Gratitude practice</span>
                </div>
                <div className={`flex items-center space-x-3 ${moodContent.textColor} opacity-70`}>
                  <span className="text-lg">⭐</span>
                  <span className="text-sm">5 points reward</span>
                </div>
              </div>
              <button
                onClick={() => setShowBasicCheckIn(true)}
                className="w-full py-4 px-6 bg-white/20 hover:bg-white/30 text-white rounded-2xl font-medium transition-colors backdrop-blur-sm border border-white/30"
              >
                Start Quick Check-In
              </button>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className={`${moodContent.cardBg} backdrop-blur-sm rounded-3xl p-8 border border-white/20 text-center`}>
          <div className="text-4xl mb-4">💜</div>
          <h3 className={`text-xl font-medium ${moodContent.textColor} mb-4`}>
            Why Daily Check-Ins Matter
          </h3>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div>
              <div className="text-3xl mb-2">🧠</div>
              <h4 className={`font-medium ${moodContent.textColor} mb-2`}>Mental Awareness</h4>
              <p className={`text-sm ${moodContent.textColor} opacity-80`}>
                Build self-awareness by regularly checking in with your emotions and mental state.
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">📈</div>
              <h4 className={`font-medium ${moodContent.textColor} mb-2`}>Track Progress</h4>
              <p className={`text-sm ${moodContent.textColor} opacity-80`}>
                Monitor your emotional patterns and see your wellness journey over time.
              </p>
            </div>
            <div>
              <div className="text-3xl mb-2">🌱</div>
              <h4 className={`font-medium ${moodContent.textColor} mb-2`}>Build Habits</h4>
              <p className={`text-sm ${moodContent.textColor} opacity-80`}>
                Develop consistent self-care practices that support your mental well-being.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AICheckIn
        isOpen={showAICheckIn}
        onClose={() => setShowAICheckIn(false)}
        onComplete={handleAICheckInComplete}
      />
      <DailyCheckIn
        isOpen={showBasicCheckIn}
        onClose={() => setShowBasicCheckIn(false)}
        onComplete={handleBasicCheckInComplete}
      />
    </div>
  );
};

export default CheckIn;