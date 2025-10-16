import React, { useState } from 'react';

interface CheckInData {
  mood: string;
  energyLevel: number;
  sleepQuality: number;
  stressLevel: number;
  physicalActivity: string;
  socialInteractions: string;
  emotions: string[];
  dailyGoalsProgress: string;
  productivityRating?: number;
  weatherImpact: string;
  gratitude?: string;
  notes?: string;
  challengesFaced?: string;
  winsCelebrated?: string;
  motivationLevel?: number;
  focusLevel?: number;
  overallSatisfaction?: number;
}

interface DailyCheckInProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: CheckInData) => void;
}

const DailyCheckIn: React.FC<DailyCheckInProps> = ({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState(1);
  const [selectedMood, setSelectedMood] = useState('');
  const [energyLevel, setEnergyLevel] = useState(5);
  const [sleepQuality, setSleepQuality] = useState(7);
  const [stressLevel, setStressLevel] = useState(3);
  const [physicalActivity, setPhysicalActivity] = useState('');
  const [socialInteractions, setSocialInteractions] = useState('');
  const [emotions, setEmotions] = useState<string[]>([]);
  const [dailyGoalsProgress, setDailyGoalsProgress] = useState('');
  const [productivityRating, setProductivityRating] = useState(5);
  const [weatherImpact, setWeatherImpact] = useState('');
  const [gratitude, setGratitude] = useState('');
  const [notes, setNotes] = useState('');
  const [challengesFaced, setChallengesFaced] = useState('');
  const [winsCelebrated, setWinsCelebrated] = useState('');
  const [motivationLevel, setMotivationLevel] = useState(5);
  const [focusLevel, setFocusLevel] = useState(5);
  const [overallSatisfaction, setOverallSatisfaction] = useState(5);

  const moodOptions = [
    { value: 'excited', emoji: '🤩', label: 'Excited' },
    { value: 'happy', emoji: '😊', label: 'Happy' },
    { value: 'calm', emoji: '😌', label: 'Calm' },
    { value: 'neutral', emoji: '😐', label: 'Neutral' },
    { value: 'tired', emoji: '😴', label: 'Tired' },
    { value: 'stressed', emoji: '😰', label: 'Stressed' },
    { value: 'sad', emoji: '😢', label: 'Sad' },
    { value: 'anxious', emoji: '😟', label: 'Anxious' },
    { value: 'frustrated', emoji: '😤', label: 'Frustrated' },
    { value: 'overwhelmed', emoji: '🤯', label: 'Overwhelmed' }
  ];

  const activityOptions = [
    { value: 'none', label: 'None', emoji: '🛋️' },
    { value: 'light', label: 'Light', emoji: '🚶' },
    { value: 'moderate', label: 'Moderate', emoji: '🏃' },
    { value: 'intense', label: 'Intense', emoji: '🏋️' }
  ];

  const socialOptions = [
    { value: 'none', label: 'None', emoji: '🏠' },
    { value: 'few', label: 'Few', emoji: '👥' },
    { value: 'moderate', label: 'Moderate', emoji: '👫' },
    { value: 'many', label: 'Many', emoji: '🎉' }
  ];

  const weatherOptions = [
    { value: 'positive', label: 'Positive', emoji: '☀️' },
    { value: 'neutral', label: 'Neutral', emoji: '⛅' },
    { value: 'negative', label: 'Negative', emoji: '🌧️' }
  ];

  const goalsOptions = [
    { value: 'not_started', label: 'Not Started', emoji: '⏸️' },
    { value: 'partial', label: 'In Progress', emoji: '⏳' },
    { value: 'completed', label: 'Completed', emoji: '✅' }
  ];

  const emotionOptions = [
    'motivated', 'focused', 'creative', 'grateful', 'confident',
    'peaceful', 'energetic', 'hopeful', 'proud', 'content',
    'worried', 'disappointed', 'lonely', 'restless', 'uncertain'
  ];

  const toggleEmotion = (emotion: string) => {
    setEmotions(prev => 
      prev.includes(emotion) 
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    );
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const canProceedStep1 = selectedMood && physicalActivity && socialInteractions;
  const canProceedStep2 = weatherImpact && dailyGoalsProgress;
  const canComplete = canProceedStep1 && canProceedStep2;

  const handleSubmit = () => {
    if (canComplete) {
      onComplete({
        mood: selectedMood,
        energyLevel,
        sleepQuality,
        stressLevel,
        physicalActivity,
        socialInteractions,
        emotions,
        dailyGoalsProgress,
        productivityRating,
        weatherImpact,
        gratitude: gratitude.trim() || undefined,
        notes: notes.trim() || undefined,
        challengesFaced: challengesFaced.trim() || undefined,
        winsCelebrated: winsCelebrated.trim() || undefined,
        motivationLevel,
        focusLevel,
        overallSatisfaction
      });
      onClose();
      resetForm();
    }
  };

  const resetForm = () => {
    setStep(1);
    setSelectedMood('');
    setEnergyLevel(5);
    setSleepQuality(7);
    setStressLevel(3);
    setPhysicalActivity('');
    setSocialInteractions('');
    setEmotions([]);
    setDailyGoalsProgress('');
    setProductivityRating(5);
    setWeatherImpact('');
    setGratitude('');
    setNotes('');
    setChallengesFaced('');
    setWinsCelebrated('');
    setMotivationLevel(5);
    setFocusLevel(5);
    setOverallSatisfaction(5);
  };

  if (!isOpen) return null;

  const renderSlider = (label: string, value: number, setter: (value: number) => void, min = 1, max = 10) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}: <span className="text-primary font-semibold">{value}/{max}</span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => setter(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-light text-gray-800 mb-2">Daily Check-In</h2>
          <p className="text-gray-600">Step {step} of 4: Share how you're feeling today</p>
          <div className="flex justify-center mt-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={`h-1 w-12 mx-1 rounded ${
                i <= step ? 'bg-primary' : 'bg-gray-200'
              }`} />
            ))}
          </div>
        </div>

        {/* Step 1: Mood, Energy, Sleep, Stress */}
        {step === 1 && (
          <div className="space-y-6">
            {/* Mood Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Current Mood *
              </label>
              <div className="grid grid-cols-3 gap-3">
                {moodOptions.map((mood) => (
                  <button
                    key={mood.value}
                    onClick={() => setSelectedMood(mood.value)}
                    className={`
                      p-3 rounded-xl text-center transition-all
                      ${selectedMood === mood.value
                        ? 'bg-primary text-white scale-105 shadow-lg'
                        : 'bg-gray-100 hover:bg-gray-200 hover:scale-105'
                      }
                    `}
                  >
                    <div className="text-xl mb-1">{mood.emoji}</div>
                    <div className="text-xs font-medium">{mood.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Wellness Metrics */}
            <div className="space-y-4">
              {renderSlider('Energy Level', energyLevel, setEnergyLevel)}
              {renderSlider('Sleep Quality', sleepQuality, setSleepQuality)}
              {renderSlider('Stress Level', stressLevel, setStressLevel)}
            </div>

            {/* Physical Activity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Physical Activity Today *
              </label>
              <div className="grid grid-cols-4 gap-2">
                {activityOptions.map((activity) => (
                  <button
                    key={activity.value}
                    onClick={() => setPhysicalActivity(activity.value)}
                    className={`
                      p-3 rounded-xl text-center transition-all
                      ${physicalActivity === activity.value
                        ? 'bg-primary text-white scale-105'
                        : 'bg-gray-100 hover:bg-gray-200'
                      }
                    `}
                  >
                    <div className="text-lg mb-1">{activity.emoji}</div>
                    <div className="text-xs">{activity.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Social Interactions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Social Interactions *
              </label>
              <div className="grid grid-cols-4 gap-2">
                {socialOptions.map((social) => (
                  <button
                    key={social.value}
                    onClick={() => setSocialInteractions(social.value)}
                    className={`
                      p-3 rounded-xl text-center transition-all
                      ${socialInteractions === social.value
                        ? 'bg-primary text-white scale-105'
                        : 'bg-gray-100 hover:bg-gray-200'
                      }
                    `}
                  >
                    <div className="text-lg mb-1">{social.emoji}</div>
                    <div className="text-xs">{social.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Goals, Weather, Emotions */}
        {step === 2 && (
          <div className="space-y-6">
            {/* Daily Goals */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Daily Goals Progress *
              </label>
              <div className="grid grid-cols-3 gap-3">
                {goalsOptions.map((goal) => (
                  <button
                    key={goal.value}
                    onClick={() => setDailyGoalsProgress(goal.value)}
                    className={`
                      p-4 rounded-xl text-center transition-all
                      ${dailyGoalsProgress === goal.value
                        ? 'bg-primary text-white scale-105 shadow-lg'
                        : 'bg-gray-100 hover:bg-gray-200'
                      }
                    `}
                  >
                    <div className="text-2xl mb-2">{goal.emoji}</div>
                    <div className="text-sm font-medium">{goal.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Weather Impact */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Weather Impact on Mood *
              </label>
              <div className="grid grid-cols-3 gap-3">
                {weatherOptions.map((weather) => (
                  <button
                    key={weather.value}
                    onClick={() => setWeatherImpact(weather.value)}
                    className={`
                      p-4 rounded-xl text-center transition-all
                      ${weatherImpact === weather.value
                        ? 'bg-primary text-white scale-105 shadow-lg'
                        : 'bg-gray-100 hover:bg-gray-200'
                      }
                    `}
                  >
                    <div className="text-2xl mb-2">{weather.emoji}</div>
                    <div className="text-sm font-medium">{weather.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Emotions Multi-select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Key Emotions (select all that apply)
              </label>
              <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                {emotionOptions.map((emotion) => (
                  <button
                    key={emotion}
                    onClick={() => toggleEmotion(emotion)}
                    className={`
                      p-2 rounded-lg text-sm transition-all
                      ${emotions.includes(emotion)
                        ? 'bg-primary text-white scale-105'
                        : 'bg-gray-100 hover:bg-gray-200'
                      }
                    `}
                  >
                    {emotion}
                  </button>
                ))}
              </div>
              {emotions.length > 0 && (
                <p className="text-xs text-gray-500 mt-2">
                  Selected: {emotions.join(', ')}
                </p>
              )}
            </div>

            {renderSlider('Productivity Rating', productivityRating, setProductivityRating)}
          </div>
        )}

        {/* Step 3: Additional Metrics */}
        {step === 3 && (
          <div className="space-y-4">
            {renderSlider('Motivation Level', motivationLevel, setMotivationLevel)}
            {renderSlider('Focus Level', focusLevel, setFocusLevel)}
            {renderSlider('Overall Satisfaction', overallSatisfaction, setOverallSatisfaction)}

            {/* Challenges */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Challenges Faced Today
              </label>
              <textarea
                value={challengesFaced}
                onChange={(e) => setChallengesFaced(e.target.value)}
                placeholder="What challenges did you face?"
                className="w-full p-3 border border-gray-200 rounded-xl resize-none h-20 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Wins */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wins to Celebrate
              </label>
              <textarea
                value={winsCelebrated}
                onChange={(e) => setWinsCelebrated(e.target.value)}
                placeholder="What went well today?"
                className="w-full p-3 border border-gray-200 rounded-xl resize-none h-20 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        )}

        {/* Step 4: Gratitude & Notes */}
        {step === 4 && (
          <div className="space-y-4">
            {/* Gratitude */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                What are you grateful for today? ✨
              </label>
              <textarea
                value={gratitude}
                onChange={(e) => setGratitude(e.target.value)}
                placeholder="I'm grateful for..."
                className="w-full p-4 border border-gray-200 rounded-xl resize-none h-24 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Additional Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Anything else on your mind?"
                className="w-full p-4 border border-gray-200 rounded-xl resize-none h-24 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Summary Preview */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Check-in Summary</h3>
              <div className="text-xs text-gray-600 space-y-1">
                <p><span className="font-medium">Mood:</span> {selectedMood}</p>
                <p><span className="font-medium">Energy:</span> {energyLevel}/10</p>
                <p><span className="font-medium">Sleep:</span> {sleepQuality}/10</p>
                <p><span className="font-medium">Stress:</span> {stressLevel}/10</p>
                <p><span className="font-medium">Goals:</span> {dailyGoalsProgress?.replace('_', ' ')}</p>
                {emotions.length > 0 && (
                  <p><span className="font-medium">Emotions:</span> {emotions.slice(0, 3).join(', ')}{emotions.length > 3 && '...'}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <div>
            {step > 1 && (
              <button
                onClick={prevStep}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                ← Previous
              </button>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            
            {step < 4 ? (
              <button
                onClick={nextStep}
                disabled={step === 1 ? !canProceedStep1 : step === 2 ? !canProceedStep2 : false}
                className="px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canComplete}
                className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Complete Check-In ✨
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyCheckIn;
