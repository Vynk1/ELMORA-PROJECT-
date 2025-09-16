import React, { useState } from "react";

export interface MoodColors {
  sad: string;
  mid: string;
  amazing: string;
}

interface MoodColorPickerProps {
  onComplete: (colors: MoodColors) => void;
}

const MoodColorPicker: React.FC<MoodColorPickerProps> = ({ onComplete }) => {
  const [selectedColors, setSelectedColors] = useState<MoodColors>({
    sad: "#374151", // Default gray
    mid: "#f59e0b", // Default amber
    amazing: "#10b981", // Default emerald
  });

  const [currentMood, setCurrentMood] = useState<"sad" | "mid" | "amazing">(
    "sad",
  );

  const colorOptions = [
    // Blues & Grays for Sad
    { color: "#1f2937", name: "Dark Gray" },
    { color: "#374151", name: "Cool Gray" },
    { color: "#4b5563", name: "Medium Gray" },
    { color: "#1e3a8a", name: "Deep Blue" },
    { color: "#1e40af", name: "Royal Blue" },
    { color: "#2563eb", name: "Bright Blue" },
    { color: "#3730a3", name: "Indigo" },
    { color: "#5b21b6", name: "Purple" },

    // Warm colors for Mid
    { color: "#f59e0b", name: "Amber" },
    { color: "#d97706", name: "Orange" },
    { color: "#ea580c", name: "Deep Orange" },
    { color: "#dc2626", name: "Red" },
    { color: "#be123c", name: "Rose" },
    { color: "#a21caf", name: "Fuchsia" },
    { color: "#7c2d12", name: "Brown" },
    { color: "#65a30d", name: "Lime" },

    // Bright colors for Amazing
    { color: "#10b981", name: "Emerald" },
    { color: "#059669", name: "Forest Green" },
    { color: "#0d9488", name: "Teal" },
    { color: "#0891b2", name: "Cyan" },
    { color: "#0284c7", name: "Sky Blue" },
    { color: "#7c3aed", name: "Violet" },
    { color: "#c026d3", name: "Magenta" },
    { color: "#e11d48", name: "Pink" },
    { color: "#f97316", name: "Bright Orange" },
    { color: "#eab308", name: "Yellow" },
    { color: "#84cc16", name: "Lime Green" },
  ];

  const moods = [
    {
      key: "sad" as const,
      label: "When I'm Feeling Down",
      description: "Choose colors that feel comforting and gentle",
      emoji: "🌧️",
    },
    {
      key: "mid" as const,
      label: "When I'm Doing Okay",
      description: "Pick colors that feel balanced and neutral",
      emoji: "⛅",
    },
    {
      key: "amazing" as const,
      label: "When I'm Feeling Great",
      description: "Select colors that energize and inspire you",
      emoji: "☀️",
    },
  ];

  const handleColorSelect = (color: string) => {
    setSelectedColors((prev) => ({
      ...prev,
      [currentMood]: color,
    }));
  };

  const handleNext = () => {
    const currentIndex = moods.findIndex((mood) => mood.key === currentMood);
    if (currentIndex < moods.length - 1) {
      setCurrentMood(moods[currentIndex + 1].key);
    } else {
      onComplete(selectedColors);
    }
  };

  const handlePrevious = () => {
    const currentIndex = moods.findIndex((mood) => mood.key === currentMood);
    if (currentIndex > 0) {
      setCurrentMood(moods[currentIndex - 1].key);
    }
  };

  const currentMoodData = moods.find((mood) => mood.key === currentMood)!;
  const currentIndex = moods.findIndex((mood) => mood.key === currentMood);
  const isLastStep = currentIndex === moods.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-center space-x-2 mb-4">
            {moods.map((mood, index) => (
              <div
                key={mood.key}
                className={`
                  w-3 h-3 rounded-full transition-colors
                  ${index <= currentIndex ? "bg-primary" : "bg-gray-300"}
                `}
              />
            ))}
          </div>
          <p className="text-center text-gray-600">
            Step {currentIndex + 1} of {moods.length}
          </p>
        </div>

        {/* Current Selection Preview */}
        <div className="text-center mb-8">
          <div
            className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white shadow-lg"
            style={{ backgroundColor: selectedColors[currentMood] }}
          />
          <div className="text-4xl mb-2">{currentMoodData.emoji}</div>
          <h1 className="text-3xl font-light text-gray-800 mb-2">
            {currentMoodData.label}
          </h1>
          <p className="text-lg text-gray-600">{currentMoodData.description}</p>
        </div>

        {/* Color Grid */}
        <div className="bg-white rounded-3xl p-8 shadow-lg mb-8">
          <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-4">
            {colorOptions.map((option) => (
              <button
                key={option.color}
                onClick={() => handleColorSelect(option.color)}
                className={`
                  w-12 h-12 rounded-2xl border-4 transition-all transform hover:scale-110
                  ${
                    selectedColors[currentMood] === option.color
                      ? "border-gray-800 scale-110 shadow-lg"
                      : "border-gray-200 hover:border-gray-400"
                  }
                `}
                style={{ backgroundColor: option.color }}
                title={option.name}
              />
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              Preview your selections:
            </p>
            <div className="flex space-x-2">
              {Object.entries(selectedColors).map(([mood, color]) => (
                <div
                  key={mood}
                  className={`
                    w-8 h-8 rounded-full border-2
                    ${currentMood === mood ? "border-gray-800" : "border-gray-300"}
                  `}
                  style={{ backgroundColor: color }}
                  title={mood}
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleNext}
            className="px-6 py-3 bg-primary text-white rounded-2xl font-medium hover:bg-primary/90 transition-colors"
          >
            {isLastStep ? "Complete Setup" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoodColorPicker;
