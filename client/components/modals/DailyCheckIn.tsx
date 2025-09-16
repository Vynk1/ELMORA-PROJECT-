import React, { useState } from 'react';

interface DailyCheckInProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: { mood: string; energy: number; gratitude: string }) => void;
}

const DailyCheckIn: React.FC<DailyCheckInProps> = ({ isOpen, onClose, onComplete }) => {
  const [selectedMood, setSelectedMood] = useState('');
  const [energyLevel, setEnergyLevel] = useState(5);
  const [gratitude, setGratitude] = useState('');

  const moodOptions = [
    { value: 'excited', emoji: '🤩', label: 'Excited' },
    { value: 'happy', emoji: '😊', label: 'Happy' },
    { value: 'calm', emoji: '😌', label: 'Calm' },
    { value: 'neutral', emoji: '😐', label: 'Neutral' },
    { value: 'tired', emoji: '😴', label: 'Tired' },
    { value: 'stressed', emoji: '😰', label: 'Stressed' },
    { value: 'sad', emoji: '😢', label: 'Sad' },
    { value: 'anxious', emoji: '😟', label: 'Anxious' }
  ];

  const handleSubmit = () => {
    if (selectedMood && gratitude.trim()) {
      onComplete({
        mood: selectedMood,
        energy: energyLevel,
        gratitude: gratitude.trim()
      });
      onClose();
      // Reset form
      setSelectedMood('');
      setEnergyLevel(5);
      setGratitude('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-light text-gray-800 mb-2">Daily Check-In</h2>
          <p className="text-gray-600">How are you feeling today?</p>
        </div>

        {/* Mood Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Current Mood
          </label>
          <div className="grid grid-cols-4 gap-3">
            {moodOptions.map((mood) => (
              <button
                key={mood.value}
                onClick={() => setSelectedMood(mood.value)}
                className={`
                  p-3 rounded-2xl text-center transition-all
                  ${selectedMood === mood.value
                    ? 'bg-primary text-white scale-105'
                    : 'bg-gray-100 hover:bg-gray-200'
                  }
                `}
              >
                <div className="text-2xl mb-1">{mood.emoji}</div>
                <div className="text-xs">{mood.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Energy Level */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Energy Level: {energyLevel}/10
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={energyLevel}
            onChange={(e) => setEnergyLevel(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>

        {/* Gratitude */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            What are you grateful for today?
          </label>
          <textarea
            value={gratitude}
            onChange={(e) => setGratitude(e.target.value)}
            placeholder="I'm grateful for..."
            className="w-full p-4 border border-gray-200 rounded-2xl resize-none h-24 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-2xl font-medium hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedMood || !gratitude.trim()}
            className="flex-1 py-3 px-4 bg-primary text-white rounded-2xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Complete Check-In
          </button>
        </div>
      </div>
    </div>
  );
};

export default DailyCheckIn;
