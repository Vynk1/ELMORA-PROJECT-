import React, { useState } from 'react';
import TodoList from '../components/TodoList';
import { type MoodType } from '../components/MoodColorSwitcher';

interface IndexProps {
  currentMood: MoodType;
  onMoodChange: (mood: MoodType) => void;
}

const Index: React.FC<IndexProps> = ({ currentMood, onMoodChange }) => {
  const [showMoodSelector, setShowMoodSelector] = useState(true);
  const [completionPercentage, setCompletionPercentage] = useState(0);

  const moods = [
    { 
      type: 'sad' as MoodType, 
      label: 'Feeling Sad', 
      description: 'It\'s okay to not be okay',
      color: 'from-blue-400 to-purple-400',
      emoji: '🌧️'
    },
    { 
      type: 'mid' as MoodType, 
      label: 'Mid Mood', 
      description: 'Just getting by today',
      color: 'from-yellow-400 to-orange-400',
      emoji: '⛅'
    },
    { 
      type: 'amazing' as MoodType, 
      label: 'Feeling Amazing', 
      description: 'Ready to take on the world!',
      color: 'from-green-400 to-blue-400',
      emoji: '☀️'
    }
  ];

  const handleMoodSelection = (mood: MoodType) => {
    onMoodChange(mood);
    setShowMoodSelector(false);
  };

  const getMoodGradient = () => {
    switch (currentMood) {
      case 'sad':
        return 'from-blue-50 to-purple-50';
      case 'mid':
        return 'from-yellow-50 to-orange-50';
      case 'amazing':
        return 'from-green-50 to-blue-50';
      default:
        return 'from-pink-50 to-blue-50';
    }
  };

  if (showMoodSelector) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${getMoodGradient()} flex items-center justify-center p-4`}>
        <div className="max-w-2xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-light text-foreground mb-4">
              What's your mood today?
            </h1>
            <p className="text-lg text-muted-foreground">
              Your mood helps us personalize your experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {moods.map((mood) => (
              <button
                key={mood.type}
                onClick={() => handleMoodSelection(mood.type)}
                className={`
                  bg-gradient-to-br ${mood.color}
                  p-8 rounded-3xl text-white
                  gentle-hover mood-transition
                  transform hover:scale-105
                  shadow-lg hover:shadow-xl
                  border border-white/20
                `}
              >
                <div className="text-4xl mb-4">{mood.emoji}</div>
                <h3 className="text-xl font-medium mb-2">{mood.label}</h3>
                <p className="text-sm opacity-90">{mood.description}</p>
              </button>
            ))}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => setShowMoodSelector(false)}
              className="text-muted-foreground hover:text-foreground gentle-hover"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getMoodGradient()}`}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Welcome section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-light text-foreground mb-4">
            Welcome back! 
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Let's make today a little brighter, one task at a time
          </p>
          
          {/* Current mood display */}
          <div className="inline-flex items-center space-x-2 bg-white/80 rounded-2xl px-6 py-3 backdrop-blur-sm">
            <span className="text-sm text-muted-foreground">Today's mood:</span>
            <span className="text-lg">
              {moods.find(m => m.type === currentMood)?.emoji}
            </span>
            <span className="text-sm font-medium text-foreground">
              {moods.find(m => m.type === currentMood)?.label}
            </span>
            <button
              onClick={() => setShowMoodSelector(true)}
              className="text-xs text-primary hover:text-primary/80 ml-2"
            >
              Change
            </button>
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Todo list - takes up 2 columns */}
          <div className="lg:col-span-2">
            <TodoList onCompletionChange={setCompletionPercentage} />
          </div>

          {/* Side panel */}
          <div className="space-y-6">
            {/* Daily progress */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-border">
              <h3 className="text-lg font-medium text-foreground mb-4">Today's Progress</h3>
              <div className="text-center">
                <div className="text-3xl font-light text-primary mb-2">
                  {completionPercentage}%
                </div>
                <p className="text-sm text-muted-foreground">
                  {completionPercentage >= 70 
                    ? '🎉 Earning reward points!' 
                    : `${70 - completionPercentage}% more for rewards`
                  }
                </p>
              </div>
            </div>

            {/* Quick actions */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-border">
              <h3 className="text-lg font-medium text-foreground mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-xl hover:bg-muted gentle-hover flex items-center space-x-3">
                  <span>🎁</span>
                  <span className="text-sm">View Rewards</span>
                </button>
                <button className="w-full text-left p-3 rounded-xl hover:bg-muted gentle-hover flex items-center space-x-3">
                  <span>👥</span>
                  <span className="text-sm">Find Friends</span>
                </button>
                <button className="w-full text-left p-3 rounded-xl hover:bg-muted gentle-hover flex items-center space-x-3">
                  <span>💌</span>
                  <span className="text-sm">Send Encouragement</span>
                </button>
              </div>
            </div>

            {/* Motivation quote */}
            <div className="bg-gradient-to-br from-soft-pink to-soft-purple rounded-3xl p-6 text-white">
              <div className="text-center">
                <div className="text-2xl mb-2">💜</div>
                <p className="text-sm font-medium mb-2">
                  "Small steps every day lead to big changes one day."
                </p>
                <p className="text-xs opacity-80">Keep going, you're doing great!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
