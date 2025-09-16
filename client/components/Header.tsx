import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { type MoodType } from "./MoodColorSwitcher";
import AICheckIn from "./modals/AICheckIn";
import SendEncouragement from "./modals/SendEncouragement";
import ViewProgress from "./modals/ViewProgress";
import { useApp } from "../contexts/AppContext";
import { t, type Language } from "../utils/translations";

interface HeaderProps {
  currentMood: MoodType;
  onMoodChange: (mood: MoodType) => void;
  onSignOut: () => void;
}

const Header: React.FC<HeaderProps> = ({
  currentMood,
  onMoodChange,
  onSignOut,
}) => {
  const location = useLocation();
  const { state } = useApp();
  const [showDailyCheckIn, setShowDailyCheckIn] = useState(false);
  const [showSendEncouragement, setShowSendEncouragement] = useState(false);
  const [showViewProgress, setShowViewProgress] = useState(false);

  const handleDailyCheckIn = (data: {
    mood: string;
    energy: number;
    gratitude: string;
    aiInsight: string;
  }) => {
    console.log("AI Daily check-in completed:", data);
    alert(
      `${t("checkInComplete", state.language as Language)} 🎉\n\nAI Insight: ${data.aiInsight.substring(0, 100)}...`,
    );
  };

  const handleSendEncouragement = (data: {
    recipient: string;
    message: string;
    template?: string;
  }) => {
    console.log("Encouragement sent:", data);
    alert(`${t("success", state.language as Language)} 💜`);
  };

  const navigation = [
    {
      name: t("home", state.language as Language),
      href: "/dashboard",
      icon: "🏠",
    },
    {
      name: t("tasks", state.language as Language),
      href: "/tasks",
      icon: "📝",
    },
    {
      name: t("journal", state.language as Language),
      href: "/journal",
      icon: "📖",
    },
    {
      name: t("meditation", state.language as Language),
      href: "/meditation",
      icon: "🧘",
    },
    {
      name: t("goals", state.language as Language),
      href: "/goals",
      icon: "🎯",
    },
    {
      name: t("friends", state.language as Language),
      href: "/friends",
      icon: "👥",
    },
    {
      name: t("rewards", state.language as Language),
      href: "/rewards",
      icon: "🎁",
    },
  ];

  const moods = [
    {
      type: "sad" as MoodType,
      label: "Sad",
      color: "bg-gray-600",
      emoji: "🌧️",
    },
    {
      type: "mid" as MoodType,
      label: "Mid",
      color: "bg-amber-500",
      emoji: "⛅",
    },
    {
      type: "amazing" as MoodType,
      label: "Amazing",
      color: "bg-emerald-500",
      emoji: "☀️",
    },
  ];

  const currentMoodData = moods.find((mood) => mood.type === currentMood);

  return (
    <>
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">E</span>
              </div>
              <span className="text-2xl font-light text-primary">ELMORA</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`
                    flex items-center space-x-1 px-3 py-2 rounded-xl text-sm font-medium
                    transition-colors hover:bg-gray-100
                    ${
                      location.pathname === item.href
                        ? "text-primary bg-primary/10"
                        : "text-gray-600 hover:text-gray-900"
                    }
                  `}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Quick Actions */}
              <div className="hidden md:flex items-center space-x-2">
                <button
                  onClick={() => setShowDailyCheckIn(true)}
                  className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-xl transition-colors"
                  title={t("dailyCheckIn", state.language as Language)}
                >
                  ✨
                </button>
                <button
                  onClick={() => setShowSendEncouragement(true)}
                  className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-xl transition-colors"
                  title="Send Encouragement"
                >
                  💌
                </button>
                <button
                  onClick={() => setShowViewProgress(true)}
                  className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-xl transition-colors"
                  title="View Progress"
                >
                  📊
                </button>
              </div>

              {/* Mood Switcher */}
              <div className="flex items-center space-x-2 bg-gray-100 rounded-2xl px-3 py-2">
                <span className="text-sm text-gray-600">Mood:</span>
                <div className="flex space-x-1">
                  {moods.map((mood) => (
                    <button
                      key={mood.type}
                      onClick={() => onMoodChange(mood.type)}
                      className={`
                        w-6 h-6 rounded-full border-2 transition-all
                        ${
                          currentMood === mood.type
                            ? "border-gray-800 scale-110"
                            : "border-gray-300 hover:border-gray-500"
                        }
                        ${mood.color}
                      `}
                      title={`Switch to ${mood.label} mood`}
                    />
                  ))}
                </div>
              </div>

              {/* Settings */}
              <Link
                to="/settings"
                className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-xl transition-colors"
              >
                ⚙️
              </Link>

              {/* Profile */}
              <Link
                to="/profile"
                className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                V
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200">
          <div className="flex overflow-x-auto py-2 px-4">
            {navigation.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`
                  flex flex-col items-center px-3 py-2 rounded-xl text-xs min-w-max
                  ${
                    location.pathname === item.href
                      ? "text-primary bg-primary/10"
                      : "text-gray-600"
                  }
                `}
              >
                <span className="text-lg mb-1">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* Modals */}
      <AICheckIn
        isOpen={showDailyCheckIn}
        onClose={() => setShowDailyCheckIn(false)}
        onComplete={handleDailyCheckIn}
      />
      <SendEncouragement
        isOpen={showSendEncouragement}
        onClose={() => setShowSendEncouragement(false)}
        onSend={handleSendEncouragement}
      />
      <ViewProgress
        isOpen={showViewProgress}
        onClose={() => setShowViewProgress(false)}
      />
    </>
  );
};

export default Header;
