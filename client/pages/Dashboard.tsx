import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { type MoodType } from "../components/MoodColorSwitcher";
import QuickAdd from "../components/QuickAdd";

interface DashboardProps {
  currentMood: MoodType;
  userPoints: number;
  onPointsUpdate: (points: number) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  currentMood,
  userPoints,
  onPointsUpdate,
}) => {
  const [streakDays, setStreakDays] = useState(3);
  const [quickTasks, setQuickTasks] = useState<string[]>([]);

  const handleTaskAdded = (task: string, category: string) => {
    setQuickTasks((prev) => [...prev, task]);
    // Award points for adding tasks
    onPointsUpdate(userPoints + 2);
    console.log(`Added task: ${task} (${category})`);
  };

  const getMoodContent = () => {
    switch (currentMood) {
      case "sad":
        return {
          greeting: "Take it one step at a time",
          message: "You're not alone in this journey. Small steps count.",
          gradient: "from-gray-800 via-slate-700 to-gray-900",
          cardBg: "bg-gray-800/50",
          textColor: "text-gray-100",
        };
      case "mid":
        return {
          greeting: "Let's make today a little better",
          message: "Progress, not perfection. You're doing great.",
          gradient: "from-amber-400 via-yellow-400 to-orange-400",
          cardBg: "bg-amber-100/70",
          textColor: "text-amber-900",
        };
      case "amazing":
        return {
          greeting: "Ready to conquer the day!",
          message: "Your energy is contagious! Let's make magic happen.",
          gradient: "from-emerald-400 via-teal-400 to-cyan-400",
          cardBg: "bg-emerald-100/70",
          textColor: "text-emerald-900",
        };
    }
  };

  const moodContent = getMoodContent();

  const quickActions = [
    {
      title: "Daily Check-in",
      description: "Track your mood and energy",
      icon: "✨",
      link: "/checkin",
      color: "from-purple-400 to-pink-400",
    },
    {
      title: "My Tasks",
      description: "View and manage your daily tasks",
      icon: "📝",
      link: "/tasks",
      color: "from-blue-400 to-cyan-400",
    },
    {
      title: "Meditation",
      description: "Start a mindfulness session",
      icon: "🧘",
      link: "/meditation",
      color: "from-green-400 to-emerald-400",
    },
    {
      title: "Journal",
      description: "Write about your day",
      icon: "📖",
      link: "/journal",
      color: "from-indigo-400 to-purple-400",
    },
    {
      title: "Goals",
      description: "Track your progress",
      icon: "🎯",
      link: "/goals",
      color: "from-orange-400 to-red-400",
    },
    {
      title: "Find Friends",
      description: "Connect with like-minded people",
      icon: "👥",
      link: "/friends",
      color: "from-pink-400 to-rose-400",
    },
  ];

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${moodContent.gradient} pt-4`}
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="text-center mb-12">
          <h1
            className={`text-4xl md:text-6xl font-light mb-4 ${moodContent.textColor}`}
          >
            {moodContent.greeting}
          </h1>
          <p
            className={`text-lg md:text-xl ${moodContent.textColor} opacity-90 max-w-2xl mx-auto`}
          >
            {moodContent.message}
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div
            className={`${moodContent.cardBg} backdrop-blur-sm rounded-3xl p-6 text-center border border-white/20`}
          >
            <div className={`text-3xl font-bold ${moodContent.textColor} mb-1`}>
              {userPoints}
            </div>
            <div className={`text-sm ${moodContent.textColor} opacity-80`}>
              Total Points
            </div>
          </div>

          <div
            className={`${moodContent.cardBg} backdrop-blur-sm rounded-3xl p-6 text-center border border-white/20`}
          >
            <div className={`text-3xl font-bold ${moodContent.textColor} mb-1`}>
              {streakDays}
            </div>
            <div className={`text-sm ${moodContent.textColor} opacity-80`}>
              Day Streak
            </div>
          </div>

          <div
            className={`${moodContent.cardBg} backdrop-blur-sm rounded-3xl p-6 text-center border border-white/20`}
          >
            <div className={`text-3xl font-bold ${moodContent.textColor} mb-1`}>
              12
            </div>
            <div className={`text-sm ${moodContent.textColor} opacity-80`}>
              Friends Connected
            </div>
          </div>

          <div
            className={`${moodContent.cardBg} backdrop-blur-sm rounded-3xl p-6 text-center border border-white/20`}
          >
            <div className={`text-3xl font-bold ${moodContent.textColor} mb-1`}>
              7
            </div>
            <div className={`text-sm ${moodContent.textColor} opacity-80`}>
              Goals Active
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2
            className={`text-2xl font-light ${moodContent.textColor} mb-8 text-center`}
          >
            What would you like to do today?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className={`
                  bg-gradient-to-br ${action.color}
                  rounded-3xl p-8 text-white text-center
                  transform hover:scale-105 transition-all duration-300
                  shadow-lg hover:shadow-xl
                  border border-white/20
                `}
              >
                <div className="text-4xl mb-4">{action.icon}</div>
                <h3 className="text-xl font-medium mb-2">{action.title}</h3>
                <p className="text-sm opacity-90">{action.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Inspiration Section */}
        <div
          className={`${moodContent.cardBg} backdrop-blur-sm rounded-3xl p-8 text-center border border-white/20 mb-8`}
        >
          <div className="text-4xl mb-4">💜</div>
          <h3 className={`text-xl font-medium ${moodContent.textColor} mb-3`}>
            Daily Affirmation
          </h3>
          <p
            className={`${moodContent.textColor} opacity-90 text-lg leading-relaxed max-w-2xl mx-auto`}
          >
            {currentMood === "sad"
              ? "It's okay to not be okay. You are worthy of love and support, especially from yourself."
              : currentMood === "mid"
                ? "Every small step forward is progress. You're doing better than you think."
                : "You have the power to create positive change in your life and inspire others around you."}
          </p>
        </div>

        {/* Two column layout for bottom section */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Quick Add Tasks */}
          <div>
            <QuickAdd onTaskAdded={handleTaskAdded} />
          </div>

          {/* Recent Activity Preview */}
          <div
            className={`${moodContent.cardBg} backdrop-blur-sm rounded-3xl p-8 border border-white/20`}
          >
            <h3 className={`text-xl font-medium ${moodContent.textColor} mb-6`}>
              Recent Activity
            </h3>
            <div className="space-y-4">
              {[
                {
                  icon: "✅",
                  text: "Completed 8 of 10 daily tasks",
                  time: "2 hours ago",
                },
                {
                  icon: "🧘",
                  text: "Finished 10-minute meditation",
                  time: "4 hours ago",
                },
                {
                  icon: "📖",
                  text: "Wrote a journal entry",
                  time: "1 day ago",
                },
                {
                  icon: "💌",
                  text: "Sent encouragement to a friend",
                  time: "1 day ago",
                },
                ...quickTasks.slice(-2).map((task, index) => ({
                  icon: "📝",
                  text: `Added task: ${task}`,
                  time: "Just now",
                })),
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <span className="text-2xl">{activity.icon}</span>
                  <div className="flex-1">
                    <p className={`${moodContent.textColor} opacity-90`}>
                      {activity.text}
                    </p>
                    <p
                      className={`text-sm ${moodContent.textColor} opacity-60`}
                    >
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link
                to="/profile"
                className={`inline-block px-6 py-3 bg-white/20 ${moodContent.textColor} rounded-2xl font-medium hover:bg-white/30 transition-colors`}
              >
                View Full Activity
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
