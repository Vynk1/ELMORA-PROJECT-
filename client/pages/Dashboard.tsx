import React, { useState, useCallback, lazy, Suspense, useEffect } from "react";
import { Link } from "react-router-dom";
import { type MoodType } from "../components/MoodColorSwitcher";
import { useTaskContext } from "../contexts/TaskContext";
import QuickAdd from "../components/QuickAdd";
import AIPersonalizationPanel from "../components/AIPersonalizationPanel";
import WellnessTrends from "../components/WellnessTrends";
import DailyCheckIn from "../components/modals/DailyCheckIn";
import { CheckCircle2, Sparkles, Heart, BarChart3, Brain, ListTodo, BookOpen, Target, Users2 } from "lucide-react";

// Lazy load custom effect components for performance
const VariableProximity = lazy(() => import('../components/effects/VariableProximity'));
const TextTrail = lazy(() => import('../components/effects/TextTrail'));
const DecryptedText = lazy(() => import('../components/effects/DecryptedText'));
const CountUp = lazy(() => import('../components/effects/CountUp'));
const ScrollFloat = lazy(() => import('../components/effects/ScrollFloat'));

interface DashboardProps {
  currentMood: MoodType;
  userPoints: number;
  onPointsUpdate: (points: number) => void;
  userId?: string; // Add userId for wellness tracking
}

const Dashboard: React.FC<DashboardProps> = ({
  currentMood,
  userPoints,
  onPointsUpdate,
  userId = '550e8400-e29b-41d4-a716-446655440000', // Default UUID for demo purposes
}) => {
  const { todos, completionPercentage } = useTaskContext();
  const [streakDays, setStreakDays] = useState(3);
  const [recentlyAddedTasks, setRecentlyAddedTasks] = useState<{task: string, timestamp: Date}[]>([]);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [showCTAMicrocopy, setShowCTAMicrocopy] = useState(false);
  
  // Modal states for new components
  const [showWellnessTrends, setShowWellnessTrends] = useState(false);
  const [showDailyCheckIn, setShowDailyCheckIn] = useState(false);
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  // Additional stats for enhanced dashboard
  const [minutesMeditated, setMinutesMeditated] = useState(127);
  const [tasksCompleted, setTasksCompleted] = useState(89);
  const [friendsConnected, setFriendsConnected] = useState(12);
  const [goalsActive, setGoalsActive] = useState(7);

  // Check for reduced motion preference and screen size
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const desktopQuery = window.matchMedia('(min-width: 768px)');
    
    setPrefersReducedMotion(mediaQuery.matches);
    setIsDesktop(desktopQuery.matches);
    
    const handleMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    const handleDesktopChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    
    mediaQuery.addEventListener('change', handleMotionChange);
    desktopQuery.addEventListener('change', handleDesktopChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange);
      desktopQuery.removeEventListener('change', handleDesktopChange);
    };
  }, []);

  // Check if user has completed today's check-in
  useEffect(() => {
    const checkTodayStatus = async () => {
      try {
        const response = await fetch(`/api/checkin/today/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setHasCheckedInToday(data.hasCheckedInToday);
        }
      } catch (error) {
        console.error('Error checking today\'s check-in status:', error);
      }
    };

    if (userId) {
      checkTodayStatus();
    }
  }, [userId]);

  const handleTaskAdded = (task: string, category: string) => {
    // Keep track of recently added tasks for display
    setRecentlyAddedTasks((prev) => [{
      task,
      timestamp: new Date()
    }, ...prev.slice(0, 2)]);  // Keep only the 3 most recent
    
    // Award points for adding tasks
    onPointsUpdate(userPoints + 2);
    console.log(`Added task: ${task} (${category})`);
  };

  const handleCheckinComplete = async (data: any) => {
    try {
      const response = await fetch('/api/checkin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          ...data
        })
      });

      if (response.ok) {
        const result = await response.json();
        setHasCheckedInToday(true);
        onPointsUpdate(userPoints + 10); // Award points for check-in
        
        // Show insights if available
        if (result.insights && result.insights.insights.length > 0) {
          // Could show a success modal with insights here
          console.log('Check-in insights:', result.insights);
        }
      }
    } catch (error) {
      console.error('Error saving check-in:', error);
    }
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
      case "content":
        return {
          greeting: "Feeling balanced and ready",
          message: "You're in a great headspace. Let's build on this momentum.",
          gradient: "from-blue-400 via-indigo-400 to-purple-400",
          cardBg: "bg-blue-100/70",
          textColor: "text-blue-900",
        };
      case "calm":
        return {
          greeting: "Peaceful and centered",
          message: "Your calm energy is a strength. Use it mindfully.",
          gradient: "from-green-300 via-blue-300 to-indigo-300",
          cardBg: "bg-green-100/70",
          textColor: "text-green-900",
        };
      default:
        // Default fallback for any unhandled mood states
        return {
          greeting: "Welcome back",
          message: "Ready to make today meaningful? Let's take it step by step.",
          gradient: "from-purple-400 via-pink-400 to-red-400",
          cardBg: "bg-purple-100/70",
          textColor: "text-purple-900",
        };
    }
  };

  const moodContent = getMoodContent() || {
    greeting: "Welcome back",
    message: "Ready to make today meaningful? Let's take it step by step.",
    gradient: "from-purple-400 via-pink-400 to-red-400",
    cardBg: "bg-purple-100/70",
    textColor: "text-purple-900",
  };

  const quickActions = [
    {
      title: hasCheckedInToday ? "Check-in Complete ✓" : "Daily Check-in",
      description: hasCheckedInToday ? "Already completed today" : "Track your comprehensive wellness",
      icon: hasCheckedInToday ? CheckCircle2 : Sparkles,
      action: () => setShowDailyCheckIn(true),
      color: hasCheckedInToday ? "from-green-400 to-emerald-400" : "from-purple-400 to-pink-400",
      disabled: hasCheckedInToday,
    },
    {
      title: "Wellness Analytics",
      description: "View your wellness trends and insights",
      icon: BarChart3,
      action: () => setShowWellnessTrends(true),
      color: "from-blue-400 to-indigo-400",
    },
    {
      title: "AI Wellbeing Report",
      description: "Get personalized mental health insights",
      icon: Brain,
      link: "/health-assessment",
      color: "from-indigo-400 to-purple-400",
    },
    {
      title: "My Tasks",
      description: "View and manage your daily tasks",
      icon: ListTodo,
      link: "/tasks",
      color: "from-blue-400 to-cyan-400",
    },
    {
      title: "Meditation",
      description: "Start a mindfulness session",
      icon: Sparkles,
      link: "/meditation",
      color: "from-green-400 to-emerald-400",
    },
    {
      title: "Journal",
      description: "Write about your day",
      icon: BookOpen,
      link: "/journal",
      color: "from-indigo-400 to-purple-400",
    },
    {
      title: "Goals",
      description: "Track your progress",
      icon: Target,
      link: "/goals",
      color: "from-orange-400 to-red-400",
    },
    {
      title: "Find Friends",
      description: "Connect with like-minded people",
      icon: Users2,
      link: "/friends",
      color: "from-pink-400 to-rose-400",
    },
  ];

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${moodContent.gradient} pt-4`}
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Enhanced Hero Section */}
        <div className="text-center mb-12 relative">
          {/* Main Headline with VariableProximity Effect */}
          <div className="mb-6">
            {!prefersReducedMotion && isDesktop ? (
              <Suspense fallback={
                <h1 className={`text-4xl md:text-6xl font-light ${moodContent.textColor}`}>
                  Ready to conquer the day?
                </h1>
              }>
                <VariableProximity
                  label="Ready to conquer the day?"
                  radius={100}
                  className={`text-4xl md:text-6xl font-light ${moodContent.textColor} cursor-default`}
                />
              </Suspense>
            ) : (
              <h1 className={`text-4xl md:text-6xl font-light ${moodContent.textColor}`}>
                Ready to conquer the day?
              </h1>
            )}
          </div>

          {/* Subheadline with TextTrail Effect */}
          <div className="mb-8">
            {!prefersReducedMotion ? (
              <Suspense fallback={
                <p className={`text-lg md:text-xl ${moodContent.textColor} opacity-90 max-w-2xl mx-auto`}>
                  Small steps. Kind progress. Daily care.
                </p>
              }>
                <TextTrail
                  text="Small steps. Kind progress. Daily care."
                  speed={0.9}
                  stagger={0.06}
                  className={`text-lg md:text-xl ${moodContent.textColor} opacity-90 max-w-2xl mx-auto`}
                />
              </Suspense>
            ) : (
              <p className={`text-lg md:text-xl ${moodContent.textColor} opacity-90 max-w-2xl mx-auto`}>
                Small steps. Kind progress. Daily care.
              </p>
            )}
          </div>

          {/* Primary CTA with DecryptedText Microcopy */}
          <div className="mb-8">
            <button
              onClick={() => setShowDailyCheckIn(true)}
              disabled={hasCheckedInToday}
              className={`
                inline-block px-8 py-4 bg-white/20 ${moodContent.textColor} 
                rounded-2xl font-medium hover:bg-white/30 transition-all duration-300
                transform hover:scale-105 shadow-lg hover:shadow-xl
                border border-white/30
                ${hasCheckedInToday ? 'opacity-75 cursor-not-allowed transform-none hover:scale-100' : ''}
              `}
              onMouseEnter={() => setShowCTAMicrocopy(true)}
              onMouseLeave={() => setShowCTAMicrocopy(false)}
              onFocus={() => setShowCTAMicrocopy(true)}
              onBlur={() => setShowCTAMicrocopy(false)}
            >
              <div className="flex flex-col items-center space-y-1">
                <span className="text-lg">
                  {hasCheckedInToday ? 'Already checked in today ✓' : 'Check in now'}
                </span>
                <div className="h-4 min-w-[120px]">
                  {showCTAMicrocopy && !hasCheckedInToday && !prefersReducedMotion ? (
                    <Suspense fallback={
                      <span className="text-sm opacity-80">Takes 2 minutes.</span>
                    }>
                      <DecryptedText
                        text="Takes 2 minutes."
                        className="text-sm opacity-80"
                      />
                    </Suspense>
                  ) : showCTAMicrocopy && !hasCheckedInToday ? (
                    <span className="text-sm opacity-80">Takes 2 minutes.</span>
                  ) : hasCheckedInToday ? (
                    <span className="text-sm opacity-80">Come back tomorrow!</span>
                  ) : null}
                </div>
              </div>
            </button>
          </div>

          {/* Spline Placeholder for Plant Mascot */}
          <div 
            id="spline-hero-placeholder" 
            data-spline="plant-mascot"
            className="absolute top-0 right-0 w-32 h-32 pointer-events-none opacity-50"
            style={{ transform: 'translate(50%, -25%)' }}
          >
            {/* Reserved slot for Spline 3D plant mascot */}
          </div>

          {/* Interactive Progress Orb */}
          <div 
            id="spline-progress-orb" 
            data-spline="progress-orb"
            className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-16 h-16 pointer-events-none opacity-60"
            data-completion={completionPercentage}
          >
            {/* Reserved slot for Spline 3D progress orb */}
          </div>
        </div>

        {/* Enhanced Stats Overview with CountUp Animations */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Suspense fallback={
            <div className={`${moodContent.cardBg} backdrop-blur-sm rounded-3xl p-6 text-center border border-white/20`}>
              <div className={`text-3xl font-bold ${moodContent.textColor} mb-1`}>{userPoints}</div>
              <div className={`text-sm ${moodContent.textColor} opacity-80`}>Total Points</div>
            </div>
          }>
            <ScrollFloat duration={0.6} delay={0.1} disabled={prefersReducedMotion}>
              <div className={`${moodContent.cardBg} backdrop-blur-sm rounded-3xl p-6 text-center border border-white/20`}>
                <div className={`text-3xl font-bold ${moodContent.textColor} mb-1`} aria-live="polite">
                  <CountUp 
                    end={userPoints} 
                    duration={1500} 
                    disabled={prefersReducedMotion}
                    className={moodContent.textColor}
                  />
                </div>
                <div className={`text-sm ${moodContent.textColor} opacity-80`}>
                  Total Points
                </div>
              </div>
            </ScrollFloat>
          </Suspense>

          <Suspense fallback={
            <div className={`${moodContent.cardBg} backdrop-blur-sm rounded-3xl p-6 text-center border border-white/20`}>
              <div className={`text-3xl font-bold ${moodContent.textColor} mb-1`}>{streakDays}</div>
              <div className={`text-sm ${moodContent.textColor} opacity-80`}>Day Streak</div>
            </div>
          }>
            <ScrollFloat duration={0.6} delay={0.2} disabled={prefersReducedMotion}>
              <div className={`${moodContent.cardBg} backdrop-blur-sm rounded-3xl p-6 text-center border border-white/20`}>
                <div className={`text-3xl font-bold ${moodContent.textColor} mb-1`} aria-live="polite">
                  <CountUp 
                    end={streakDays} 
                    duration={1200} 
                    disabled={prefersReducedMotion}
                    className={moodContent.textColor}
                  />
                </div>
                <div className={`text-sm ${moodContent.textColor} opacity-80`}>
                  Day Streak
                </div>
              </div>
            </ScrollFloat>
          </Suspense>

          <Suspense fallback={
            <div className={`${moodContent.cardBg} backdrop-blur-sm rounded-3xl p-6 text-center border border-white/20`}>
              <div className={`text-3xl font-bold ${moodContent.textColor} mb-1`}>{minutesMeditated}</div>
              <div className={`text-sm ${moodContent.textColor} opacity-80`}>Minutes Meditated</div>
            </div>
          }>
            <ScrollFloat duration={0.6} delay={0.3} disabled={prefersReducedMotion}>
              <div className={`${moodContent.cardBg} backdrop-blur-sm rounded-3xl p-6 text-center border border-white/20`}>
                <div className={`text-3xl font-bold ${moodContent.textColor} mb-1`} aria-live="polite">
                  <CountUp 
                    end={minutesMeditated} 
                    duration={1800} 
                    disabled={prefersReducedMotion}
                    className={moodContent.textColor}
                  />
                </div>
                <div className={`text-sm ${moodContent.textColor} opacity-80`}>
                  Minutes Meditated
                </div>
              </div>
            </ScrollFloat>
          </Suspense>

          <Suspense fallback={
            <div className={`${moodContent.cardBg} backdrop-blur-sm rounded-3xl p-6 text-center border border-white/20`}>
              <div className={`text-3xl font-bold ${moodContent.textColor} mb-1`}>{tasksCompleted}</div>
              <div className={`text-sm ${moodContent.textColor} opacity-80`}>Tasks Completed</div>
            </div>
          }>
            <ScrollFloat duration={0.6} delay={0.4} disabled={prefersReducedMotion}>
              <div className={`${moodContent.cardBg} backdrop-blur-sm rounded-3xl p-6 text-center border border-white/20`}>
                <div className={`text-3xl font-bold ${moodContent.textColor} mb-1`} aria-live="polite">
                  <CountUp 
                    end={tasksCompleted} 
                    duration={2000} 
                    disabled={prefersReducedMotion}
                    className={moodContent.textColor}
                  />
                </div>
                <div className={`text-sm ${moodContent.textColor} opacity-80`}>
                  Tasks Completed
                </div>
              </div>
            </ScrollFloat>
          </Suspense>
        </div>

        {/* Wellness Trends Quick Access */}
        <div className="text-center mb-8">
          <button
            onClick={() => setShowWellnessTrends(true)}
            className={`
              inline-flex items-center space-x-2 px-6 py-3 
              bg-white/10 ${moodContent.textColor} rounded-2xl 
              font-medium hover:bg-white/20 transition-all duration-300
              transform hover:scale-105 border border-white/20
            `}
          >
            <BarChart3 className="w-5 h-5" strokeWidth={2} />
            <span>View Wellness Analytics</span>
          </button>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2
            className={`text-2xl font-light ${moodContent.textColor} mb-8 text-center`}
          >
            What would you like to do today?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => {
              const ActionComponent = action.link ? Link : 'button';
              const actionProps = action.link 
                ? { to: action.link } 
                : { onClick: action.action, disabled: action.disabled };
              
              return (
                <ActionComponent
                  key={index}
                  {...actionProps}
                  className={`
                    bg-gradient-to-br ${action.color}
                    rounded-3xl p-8 text-white text-center
                    transform hover:scale-105 transition-all duration-300
                    shadow-lg hover:shadow-xl
                    border border-white/20
                    ${action.disabled ? 'opacity-75 cursor-not-allowed transform-none hover:scale-100' : ''}
                    ${!action.link ? 'w-full' : ''}
                  `}
                >
                  <action.icon className="w-12 h-12 mb-4 mx-auto" strokeWidth={2} />
                  <h3 className="text-xl font-medium mb-2">{action.title}</h3>
                  <p className="text-sm opacity-90">{action.description}</p>
                </ActionComponent>
              );
            })}
          </div>
        </div>

        {/* Inspiration Section */}
        <div
          className={`${moodContent.cardBg} backdrop-blur-sm rounded-3xl p-8 text-center border border-white/20 mb-8`}
        >
          <Heart className="w-12 h-12 mx-auto mb-4 fill-current" strokeWidth={2} />
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

        {/* AI Personalization Panel */}
        <div className="mb-8">
          <AIPersonalizationPanel currentMood={currentMood} />
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
                  icon: CheckCircle2,
                  text: "Completed 8 of 10 daily tasks",
                  time: "2 hours ago",
                },
                {
                  icon: Sparkles,
                  text: "Finished 10-minute meditation",
                  time: "4 hours ago",
                },
                {
                  icon: BookOpen,
                  text: "Wrote a journal entry",
                  time: "1 day ago",
                },
                {
                  icon: Heart,
                  text: "Sent encouragement to a friend",
                  time: "1 day ago",
                },
                ...recentlyAddedTasks.map((item, index) => ({
                  icon: ListTodo,
                  text: `Added task: ${item.task}`,
                  time: "Just now",
                })),
              ].map((activity, index) => {
                const ActivityIcon = activity.icon;
                return (
                <div key={index} className="flex items-center space-x-4">
                  <ActivityIcon className="w-6 h-6" strokeWidth={2} />
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
              );})}
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

      {/* Modal Components */}
      <WellnessTrends
        userId={userId}
        isOpen={showWellnessTrends}
        onClose={() => setShowWellnessTrends(false)}
      />

      <DailyCheckIn
        isOpen={showDailyCheckIn}
        onClose={() => setShowDailyCheckIn(false)}
        onComplete={handleCheckinComplete}
      />
    </div>
  );
};

export default Dashboard;
