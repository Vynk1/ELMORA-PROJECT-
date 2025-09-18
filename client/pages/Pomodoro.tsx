import React, { useState, useCallback } from 'react';
import { type MoodType } from '../components/MoodColorSwitcher';
import PomodoroCard from '../components/tasks/PomodoroCard';
import { useTaskContext } from '../contexts/TaskContext';

interface PomodoroProps {
  currentMood: MoodType;
  userPoints: number;
  onPointsUpdate: (points: number) => void;
}

const Pomodoro: React.FC<PomodoroProps> = ({ 
  currentMood, 
  userPoints, 
  onPointsUpdate 
}) => {
  const { addTodo } = useTaskContext();
  const [focusSessionsCompleted, setFocusSessionsCompleted] = useState(0);
  const [plantGrowthProgress, setPlantGrowthProgress] = useState(0);
  const [totalFocusTime, setTotalFocusTime] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);

  // Get mood-specific styling
  const getMoodColors = () => {
    switch (currentMood) {
      case 'sad':
        return {
          bg: "from-gray-800 via-slate-700 to-gray-900",
          cardBg: "bg-gray-800/50",
          textColor: "text-gray-100",
          accentColor: "text-gray-300"
        };
      case 'mid':
        return {
          bg: "from-amber-400 via-yellow-400 to-orange-400",
          cardBg: "bg-amber-100/70",
          textColor: "text-amber-900",
          accentColor: "text-amber-800"
        };
      case 'amazing':
        return {
          bg: "from-emerald-400 via-teal-400 to-cyan-400",
          cardBg: "bg-emerald-100/70",
          textColor: "text-emerald-900",
          accentColor: "text-emerald-800"
        };
      case 'content':
        return {
          bg: "from-blue-400 via-indigo-400 to-purple-400",
          cardBg: "bg-blue-100/70",
          textColor: "text-blue-900",
          accentColor: "text-blue-800"
        };
      case 'calm':
        return {
          bg: "from-green-300 via-blue-300 to-indigo-300",
          cardBg: "bg-green-100/70",
          textColor: "text-green-900",
          accentColor: "text-green-800"
        };
      default:
        return {
          bg: "from-purple-400 via-pink-400 to-red-400",
          cardBg: "bg-purple-100/70",
          textColor: "text-purple-900",
          accentColor: "text-purple-800"
        };
    }
  };

  const colors = getMoodColors();

  // Handle focus session completion
  const handleFocusSessionComplete = useCallback((sessionData: { duration: number; timestamp: Date }) => {
    // Add a special "Focus Session" task as completed
    addTodo(
      `🧘 Focus Session - ${sessionData.duration} min (${sessionData.timestamp.toLocaleTimeString()})`,
      'wellness',
      true // Mark as completed
    );
    
    // Update session counter and related stats
    setFocusSessionsCompleted(prev => prev + 1);
    setTotalFocusTime(prev => prev + sessionData.duration);
    setCurrentStreak(prev => prev + 1);
    
    // Award points
    const sessionBonus = 10;
    const streakBonus = Math.floor(currentStreak / 5) * 5; // Bonus every 5 sessions
    const totalPoints = sessionBonus + streakBonus;
    
    onPointsUpdate(userPoints + totalPoints);
    
    // Show success message
    setTimeout(() => {
      const streakMessage = streakBonus > 0 ? ` +${streakBonus} streak bonus!` : '';
      alert(`🎉 Focus session complete! +${totalPoints} points earned!${streakMessage}`);
    }, 500);
  }, [addTodo, userPoints, onPointsUpdate, currentStreak]);

  // Handle plant growth progress updates
  const handleProgressUpdate = useCallback((progress: number) => {
    setPlantGrowthProgress(progress);
    
    // Send message to any listening Spline components
    window.dispatchEvent(new CustomEvent('plantGrowthUpdate', {
      detail: { progress, timestamp: Date.now() }
    }));
  }, []);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${colors.bg}`}>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className={`text-4xl font-light mb-4 ${colors.textColor}`}>
            🍅 Pomodoro Focus
          </h1>
          <p className={`text-lg ${colors.textColor} opacity-90 mb-6`}>
            Stay focused with the Pomodoro Technique and ambient sounds
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className={`${colors.cardBg} backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20`}>
              <div className={`text-2xl font-bold ${colors.textColor} mb-1`}>
                {focusSessionsCompleted}
              </div>
              <div className={`text-xs ${colors.accentColor}`}>
                Sessions Today
              </div>
            </div>
            
            <div className={`${colors.cardBg} backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20`}>
              <div className={`text-2xl font-bold ${colors.textColor} mb-1`}>
                {totalFocusTime}min
              </div>
              <div className={`text-xs ${colors.accentColor}`}>
                Total Focus Time
              </div>
            </div>
            
            <div className={`${colors.cardBg} backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20`}>
              <div className={`text-2xl font-bold ${colors.textColor} mb-1`}>
                {currentStreak}
              </div>
              <div className={`text-xs ${colors.accentColor}`}>
                Current Streak
              </div>
            </div>
            
            <div className={`${colors.cardBg} backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20`}>
              <div className={`text-2xl font-bold ${colors.textColor} mb-1`}>
                {plantGrowthProgress}%
              </div>
              <div className={`text-xs ${colors.accentColor}`}>
                Plant Growth
              </div>
            </div>
          </div>
        </div>

        {/* Main Pomodoro Card */}
        <div className="max-w-2xl mx-auto">
          <PomodoroCard 
            onFocusSessionComplete={handleFocusSessionComplete}
            onProgressUpdate={handleProgressUpdate}
            currentMood={currentMood}
          />
        </div>

        {/* Additional Features Section */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Focus Tips */}
            <div className={`${colors.cardBg} backdrop-blur-sm rounded-3xl p-6 border border-white/20`}>
              <h3 className={`text-lg font-medium ${colors.textColor} mb-4 flex items-center`}>
                💡 Focus Tips
              </h3>
              <div className="space-y-3">
                <div className={`text-sm ${colors.textColor} opacity-90 flex items-start space-x-2`}>
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>Eliminate distractions before starting your session</span>
                </div>
                <div className={`text-sm ${colors.textColor} opacity-90 flex items-start space-x-2`}>
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>Keep a notebook nearby for capturing quick thoughts</span>
                </div>
                <div className={`text-sm ${colors.textColor} opacity-90 flex items-start space-x-2`}>
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>Use break time to stretch, hydrate, or breathe</span>
                </div>
                <div className={`text-sm ${colors.textColor} opacity-90 flex items-start space-x-2`}>
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>Start with easier tasks to build momentum</span>
                </div>
              </div>
            </div>

            {/* Session History */}
            <div className={`${colors.cardBg} backdrop-blur-sm rounded-3xl p-6 border border-white/20`}>
              <h3 className={`text-lg font-medium ${colors.textColor} mb-4 flex items-center`}>
                📊 Today's Progress
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className={`text-sm ${colors.textColor} opacity-90`}>Focus Sessions</span>
                  <span className={`text-sm font-medium ${colors.textColor}`}>
                    {focusSessionsCompleted}/8 goal
                  </span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((focusSessionsCompleted / 8) * 100, 100)}%` }}
                  />
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <span className={`text-sm ${colors.textColor} opacity-90`}>Focus Time</span>
                  <span className={`text-sm font-medium ${colors.textColor}`}>
                    {totalFocusTime}/200min goal
                  </span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((totalFocusTime / 200) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pomodoro Technique Info */}
        <div className="max-w-2xl mx-auto mt-8">
          <div className={`${colors.cardBg} backdrop-blur-sm rounded-3xl p-6 border border-white/20 text-center`}>
            <h3 className={`text-lg font-medium ${colors.textColor} mb-3`}>
              🍅 The Pomodoro Technique
            </h3>
            <p className={`text-sm ${colors.textColor} opacity-90 mb-4`}>
              Work in focused 25-minute intervals, followed by 5-minute breaks. 
              This method helps maintain concentration and prevents burnout.
            </p>
            <div className="flex justify-center items-center space-x-4 text-xs">
              <div className={`flex items-center space-x-1 ${colors.textColor} opacity-80`}>
                <span className="w-3 h-3 bg-emerald-500 rounded-full"></span>
                <span>25min Focus</span>
              </div>
              <div className={`flex items-center space-x-1 ${colors.textColor} opacity-80`}>
                <span className="w-3 h-3 bg-amber-500 rounded-full"></span>
                <span>5min Break</span>
              </div>
              <div className={`flex items-center space-x-1 ${colors.textColor} opacity-80`}>
                <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                <span>15min Long Break</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pomodoro;