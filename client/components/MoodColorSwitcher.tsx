import React, { useState } from 'react';

export type MoodType = 'sad' | 'mid' | 'amazing';

interface MoodColorSwitcherProps {
  currentMood: MoodType;
  onMoodChange: (mood: MoodType) => void;
}

const MoodColorSwitcher: React.FC<MoodColorSwitcherProps> = ({ currentMood, onMoodChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const moods = [
    { 
      type: 'sad' as MoodType, 
      label: 'Sad', 
      color: 'bg-mood-sad',
      emoji: '🌧️'
    },
    { 
      type: 'mid' as MoodType, 
      label: 'Mid Mood', 
      color: 'bg-mood-mid',
      emoji: '⛅'
    },
    { 
      type: 'amazing' as MoodType, 
      label: 'Amazing', 
      color: 'bg-mood-amazing',
      emoji: '☀️'
    }
  ];

  const currentMoodData = moods.find(mood => mood.type === currentMood);

  return (
    <div className="relative">
      {/* Current mood button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          ${currentMoodData?.color} 
          text-white px-4 py-2 rounded-2xl 
          flex items-center space-x-2 
          gentle-hover mood-transition
          shadow-lg border-2 border-white/20
        `}
      >
        <span className="text-sm">{currentMoodData?.emoji}</span>
        <span className="text-sm font-medium">{currentMoodData?.label}</span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-2xl shadow-xl border border-border overflow-hidden z-50 min-w-[140px]">
          {moods.map((mood) => (
            <button
              key={mood.type}
              onClick={() => {
                onMoodChange(mood.type);
                setIsOpen(false);
              }}
              className={`
                w-full px-4 py-3 text-left flex items-center space-x-3
                hover:bg-muted transition-colors
                ${mood.type === currentMood ? 'bg-accent' : ''}
              `}
            >
              <div className={`w-4 h-4 rounded-full ${mood.color}`}></div>
              <span className="text-sm font-medium text-foreground">{mood.label}</span>
              <span className="text-sm">{mood.emoji}</span>
            </button>
          ))}
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default MoodColorSwitcher;
