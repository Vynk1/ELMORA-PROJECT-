import React, { useState, useEffect } from "react";

interface AICheckInProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: {
    mood: string;
    energy: number;
    gratitude: string;
    aiInsight: string;
  }) => void;
}

const AICheckIn: React.FC<AICheckInProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [selectedMood, setSelectedMood] = useState("");
  const [energyLevel, setEnergyLevel] = useState(5);
  const [gratitude, setGratitude] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [aiInsight, setAiInsight] = useState("");
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);

  const moodOptions = [
    { value: "excited", emoji: "🤩", label: "Excited", color: "bg-yellow-500" },
    { value: "happy", emoji: "😊", label: "Happy", color: "bg-green-500" },
    { value: "calm", emoji: "😌", label: "Calm", color: "bg-blue-500" },
    { value: "neutral", emoji: "😐", label: "Neutral", color: "bg-gray-500" },
    { value: "tired", emoji: "😴", label: "Tired", color: "bg-purple-500" },
    {
      value: "stressed",
      emoji: "😰",
      label: "Stressed",
      color: "bg-orange-500",
    },
    { value: "sad", emoji: "😢", label: "Sad", color: "bg-blue-700" },
    { value: "anxious", emoji: "😟", label: "Anxious", color: "bg-red-500" },
  ];

  const generateAIInsight = async () => {
    setIsGeneratingInsight(true);

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const insights = {
      excited:
        "Your excitement is wonderful! Channel this energy into creative projects or connect with friends who share your enthusiasm.",
      happy:
        "What a beautiful mood to start with! Consider doing something kind for yourself or others to amplify this positive energy.",
      calm: "This peaceful state is perfect for mindfulness. Try some deep breathing or gentle stretching to maintain this centeredness.",
      neutral:
        "Neutral days are opportunities. What small action could shift your day in a positive direction? Maybe a short walk or calling a friend?",
      tired:
        "Your body and mind need rest. Consider shorter, gentler goals today and prioritize self-care activities that restore your energy.",
      stressed:
        "I understand this feeling. Break down your tasks into smaller steps, take deep breaths, and remember that it's okay to ask for help.",
      sad: "It's brave to acknowledge these feelings. Be gentle with yourself today. Small acts of self-compassion can make a difference.",
      anxious:
        "Anxiety can feel overwhelming, but you're not alone. Focus on what you can control today and try grounding techniques like the 5-4-3-2-1 method.",
    };

    const energyInsights = {
      low: "Low energy days call for gentleness. Honor your needs and choose activities that feel manageable.",
      medium:
        "Moderate energy is perfect for balanced activities. Mix productivity with moments of joy.",
      high: "Great energy levels! This is a wonderful time to tackle meaningful goals or try something new.",
    };

    const energyCategory =
      energyLevel <= 3 ? "low" : energyLevel <= 7 ? "medium" : "high";

    const insight = `${insights[selectedMood as keyof typeof insights]} ${energyInsights[energyCategory]}

Based on your energy level of ${energyLevel}/10, I recommend:
${
  energyLevel <= 3
    ? "• Gentle self-care activities\n• Rest and relaxation\n• Asking for support if needed"
    : energyLevel <= 7
      ? "• Balanced work and rest\n• Moderate physical activity\n• Connecting with others"
      : "• Pursuing meaningful goals\n• Physical exercise\n• Creative projects"
}

Remember: ${gratitude ? `Your gratitude for "${gratitude}" shows a positive mindset that will serve you well today.` : "Practicing gratitude can shift your perspective positively."}`;

    setAiInsight(insight);
    setIsGeneratingInsight(false);
  };

  const handleNext = () => {
    console.log('handleNext called:', { currentStep, selectedMood, gratitude: gratitude.trim() });
    if (currentStep === 1 && selectedMood) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    } else if (currentStep === 3 && gratitude.trim()) {
      generateAIInsight();
      setCurrentStep(4);
    }
  };

  const handleComplete = () => {
    onComplete({
      mood: selectedMood,
      energy: energyLevel,
      gratitude: gratitude.trim(),
      aiInsight,
    });
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setSelectedMood("");
    setEnergyLevel(5);
    setGratitude("");
    setCurrentStep(1);
    setAiInsight("");
    setIsGeneratingInsight(false);
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={(e) => {
      if (e.target === e.currentTarget) {
        onClose();
        resetForm();
      }
    }}>
      <div className="bg-white rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-light text-gray-800 mb-2">
            ELMORA Daily Check-In
          </h2>
          <p className="text-gray-600">
            Let's understand how you're feeling today
          </p>
          <div className="flex justify-center mt-4 space-x-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`w-3 h-3 rounded-full ${
                  step <= currentStep ? "bg-primary" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Mood Selection */}
        {currentStep === 1 && (
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              How are you feeling right now?
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {moodOptions.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => setSelectedMood(mood.value)}
                  className={`
                    p-3 rounded-2xl text-center transition-all transform hover:scale-105
                    ${
                      selectedMood === mood.value
                        ? `${mood.color} text-white scale-105 shadow-lg`
                        : "bg-gray-100 hover:bg-gray-200"
                    }
                  `}
                >
                  <div className="text-2xl mb-1">{mood.emoji}</div>
                  <div className="text-xs font-medium">{mood.label}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Energy Level */}
        {currentStep === 2 && (
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              What's your energy level?{" "}
              <span className="text-primary font-bold">{energyLevel}/10</span>
            </h3>
            <div className="mb-6">
              <input
                type="range"
                min="1"
                max="10"
                value={energyLevel}
                onChange={(e) => setEnergyLevel(Number(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #ef4444 0%, #f59e0b 50%, #10b981 100%)`,
                }}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Exhausted</span>
                <span>Moderate</span>
                <span>Energized</span>
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-2xl">
              <p className="text-sm text-gray-600">
                {energyLevel <= 3 &&
                  "Low energy - that's okay! Today is about gentle self-care."}
                {energyLevel > 3 &&
                  energyLevel <= 7 &&
                  "Moderate energy - perfect for balanced activities."}
                {energyLevel > 7 &&
                  "High energy - great time to pursue your goals!"}
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Gratitude */}
        {currentStep === 3 && (
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              What are you grateful for today?
            </h3>
            <textarea
              value={gratitude}
              onChange={(e) => setGratitude(e.target.value)}
              placeholder="Even small things count... a warm cup of coffee, a text from a friend, or simply having a roof over your head."
              className="w-full p-4 border border-gray-200 rounded-2xl resize-none h-32 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <p className="text-xs text-gray-500 mt-2">
              Gratitude helps shift our perspective and improves mental
              well-being.
            </p>
          </div>
        )}

        {/* Step 4: AI Insight */}
        {currentStep === 4 && (
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Your Personalized Insight
            </h3>
            {isGeneratingInsight ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">
                  AI is analyzing your check-in...
                </p>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-2">🤖</span>
                  <span className="font-medium text-gray-800">
                    AI Wellness Coach
                  </span>
                </div>
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {aiInsight}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex space-x-3 mt-6">
          {currentStep > 1 && currentStep < 4 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-2xl font-medium hover:bg-gray-200 transition-colors"
            >
              Back
            </button>
          )}

          {currentStep < 3 && (
            <button
              onClick={handleNext}
              disabled={(currentStep === 1 && !selectedMood)}
              className="flex-1 py-3 px-4 bg-primary text-white rounded-2xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          )}

          {currentStep === 3 && (
            <button
              onClick={handleNext}
              disabled={!gratitude.trim()}
              className="flex-1 py-3 px-4 bg-primary text-white rounded-2xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Get AI Insight
            </button>
          )}

          {currentStep === 4 && !isGeneratingInsight && (
            <button
              onClick={handleComplete}
              className="flex-1 py-3 px-4 bg-primary text-white rounded-2xl font-medium hover:bg-primary/90 transition-colors"
            >
              Complete Check-In
            </button>
          )}

          <button
            onClick={() => {
              console.log('Cancel button clicked');
              onClose();
            }}
            className="px-4 py-3 text-gray-500 hover:text-gray-700 transition-colors font-medium"
            type="button"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AICheckIn;
