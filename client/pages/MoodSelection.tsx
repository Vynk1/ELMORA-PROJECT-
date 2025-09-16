import React, { useState } from "react";
import { type MoodType } from "../components/MoodColorSwitcher";
import MoodColorPicker, {
  type MoodColors,
} from "../components/MoodColorPicker";

interface MoodSelectionProps {
  onMoodSelection: (mood: MoodType, colors?: MoodColors) => void;
}

const MoodSelection: React.FC<MoodSelectionProps> = ({ onMoodSelection }) => {
  const [step, setStep] = useState<"mood" | "colors">("mood");
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);

  const moods = [
    {
      type: "sad" as MoodType,
      label: "Feeling Sad",
      description:
        "It's okay to not be okay. Let's take it one step at a time.",
      gradient: "from-slate-800 via-gray-800 to-black",
      textColor: "text-white",
      emoji: "🌧️",
      buttonStyle: "bg-gray-700 hover:bg-gray-600 text-white",
    },
    {
      type: "mid" as MoodType,
      label: "Mid Mood",
      description: "Just getting by today. That's perfectly fine.",
      gradient: "from-amber-200 via-yellow-300 to-orange-300",
      textColor: "text-gray-800",
      emoji: "⛅",
      buttonStyle: "bg-amber-400 hover:bg-amber-500 text-gray-900",
    },
    {
      type: "amazing" as MoodType,
      label: "Feeling Amazing",
      description: "Ready to take on the world! Let's make today count.",
      gradient: "from-emerald-400 via-teal-400 to-cyan-400",
      textColor: "text-white",
      emoji: "☀️",
      buttonStyle: "bg-emerald-500 hover:bg-emerald-600 text-white",
    },
  ];

  // Step 1: Mood Selection
  if (step === "mood") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-light text-gray-800 mb-6">
              How are you feeling today?
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your mood helps us personalize your experience and provide the
              right support for you
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {moods.map((mood) => (
              <div
                key={mood.type}
                className={`
                  bg-gradient-to-br ${mood.gradient}
                  rounded-3xl p-8 text-center
                  transform hover:scale-105 transition-all duration-300
                  shadow-2xl hover:shadow-3xl
                  border border-white/30
                  cursor-pointer group
                `}
                onClick={() => {
                  setSelectedMood(mood.type);
                  setStep("colors");
                }}
              >
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {mood.emoji}
                </div>

                <h3 className={`text-2xl font-medium mb-4 ${mood.textColor}`}>
                  {mood.label}
                </h3>

                <p
                  className={`text-sm mb-8 ${mood.textColor} opacity-90 leading-relaxed`}
                >
                  {mood.description}
                </p>

                <button
                  className={`
                  ${mood.buttonStyle}
                  px-8 py-3 rounded-2xl font-medium
                  transform hover:scale-105 transition-all duration-200
                  shadow-lg hover:shadow-xl
                  border border-white/20
                `}
                >
                  Choose This Mood
                </button>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => onMoodSelection("mid")}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Color Selection
  if (step === "colors" && selectedMood) {
    return (
      <MoodColorPicker
        onComplete={(colors) => onMoodSelection(selectedMood, colors)}
      />
    );
  }

  return null;
};

export default MoodSelection;
