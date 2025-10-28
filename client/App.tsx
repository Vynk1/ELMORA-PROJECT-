import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import { TaskProvider } from "./contexts/TaskContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { supabase } from "./lib/supabase";
import LoadingScreen from "./components/LoadingScreen";
import MoodSelection from "./pages/MoodSelection";
import ErrorBoundary from "./components/ErrorBoundary";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Pomodoro from "./pages/Pomodoro";
import Rewards from "./pages/Rewards";
import Friends from "./pages/Friends";
import Notifications from "./pages/Notifications";
import Goals from "./pages/Goals";
import Journal from "./pages/Journal";
import Meditation from "./pages/Meditation";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Help from "./pages/Help";
import TestModal from "./pages/TestModal";
import CheckIn from "./pages/CheckIn";
import FlowerDemo from "./pages/FlowerDemo";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AIReport from "./pages/AIReport";
import HealthAssessment from "./pages/HealthAssessment";
import AdminAccess from "./components/AdminAccess.jsx";
import PersonalizedChat from "./components/PersonalizedChat";
import LoginForm from "./components/auth/LoginForm.jsx";
import SignUpForm from "./components/auth/SignUpForm.jsx";
import LandingPage from "./components/LandingPage.jsx";
import AuthCallback from "./pages/auth/Callback";
import UpdatePassword from "./pages/auth/UpdatePassword";
import OnboardingPage from "./pages/onboarding/index";
import { type MoodType } from "./components/MoodColorSwitcher";
import { type MoodColors } from "./components/MoodColorPicker";

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <AppProvider>
            <TaskProvider>
              <AppContent />
            </TaskProvider>
          </AppProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

// Protected route component that checks onboarding status
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    async function checkOnboardingStatus() {
      if (!user) {
        setCheckingOnboarding(false);
        return;
      }

      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('assessment_completed')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking onboarding status:', error);
        }

        // If no profile exists or assessment is NOT completed, user needs onboarding
        // PGRST116 means no rows returned (new user without profile)
        const isNewUser = error?.code === 'PGRST116' || !profile;
        const hasCompletedAssessment = profile?.assessment_completed === true;
        
        // Also check localStorage as backup
        const localStorageCompleted = localStorage.getItem(`onboarding_completed_${user.id}`) === 'true';
        
        // If either database or localStorage says completed, don't need onboarding
        const needsOnboard = (isNewUser || !hasCompletedAssessment) && !localStorageCompleted;
        
        console.log('Onboarding check:', {
          isNewUser,
          hasCompletedAssessment,
          localStorageCompleted,
          needsOnboard
        });
        
        setNeedsOnboarding(needsOnboard);
      } catch (error) {
        console.error('Error in protected route onboarding check:', error);
        // Default to not needing onboarding on error
        setNeedsOnboarding(false);
      } finally {
        setCheckingOnboarding(false);
      }
    }

    if (!authLoading) {
      checkOnboardingStatus();
    }
  }, [user, authLoading]);

  if (authLoading || checkingOnboarding) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (needsOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}

function AppContent() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [hasSelectedMood, setHasSelectedMood] = useState(false);
  const [currentMood, setCurrentMood] = useState<MoodType>("mid");
  const [userPoints, setUserPoints] = useState(0);
  const [moodColors, setMoodColors] = useState<MoodColors | null>(null);

  // Simulate loading time and auto-bypass in development
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Reduced loading time for development

    return () => clearTimeout(timer);
  }, []);

  // Auto-select mood (bypassed for all environments)
  useEffect(() => {
    if (!isLoading) {
      setHasSelectedMood(true);
      setCurrentMood('content');
    }
  }, [isLoading]);

  // Apply mood-based body class for global theming
  useEffect(() => {
    document.body.className = `mood-${currentMood} mood-transition`;
  }, [currentMood]);

  const handleMoodSelection = (mood: MoodType, colors?: MoodColors) => {
    setCurrentMood(mood);
    if (colors) {
      setMoodColors(colors);
    }
    setHasSelectedMood(true);
  };

  const handleSignOut = () => {
    setHasSelectedMood(false);
    setCurrentMood("mid");
  };

  const handlePointsUpdate = (points: number) => {
    setUserPoints(points);
  };

  // Show loading screen while auth is loading or app is initializing
  if (authLoading || isLoading) {
    return <LoadingScreen />;
  }

  // Debug info in development
  if (import.meta.env.DEV) {
    console.log('App State:', {
      isLoading,
      hasSelectedMood,
      currentMood,
      userPoints
    });
  }

  // Mood selection disabled - automatically set to 'content'
  // if (!hasSelectedMood) {
  //   return <MoodSelection onMoodSelection={handleMoodSelection} />;
  // }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/" 
          element={isAuthenticated ? (
            <ProtectedRoute>
              <Navigate to="/dashboard" replace />
            </ProtectedRoute>
          ) : (
            <LandingPage />
          )} 
        />
        
        {/* Public Auth Routes */}
        <Route 
          path="/login" 
          element={isAuthenticated ? (
            <ProtectedRoute>
              <Navigate to="/dashboard" replace />
            </ProtectedRoute>
          ) : (
            <LoginForm />
          )} 
        />
        <Route 
          path="/signup" 
          element={isAuthenticated ? (
            <ProtectedRoute>
              <Navigate to="/dashboard" replace />
            </ProtectedRoute>
          ) : (
            <SignUpForm />
          )} 
        />
        
        {/* OAuth Callback Route */}
        <Route path="/auth/callback" element={<AuthCallback />} />
        
        {/* Password Reset Route */}
        <Route path="/auth/update-password" element={<UpdatePassword />} />
        
        {/* Onboarding Route */}
        <Route 
          path="/onboarding" 
          element={isAuthenticated ? <OnboardingPage /> : <Navigate to="/login" replace />} 
        />
        
        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <ProtectedRoute>
                <AuthenticatedApp
                  currentMood={currentMood}
                  setCurrentMood={setCurrentMood}
                  hasSelectedMood={hasSelectedMood}
                  handleMoodSelection={handleMoodSelection}
                  handleSignOut={handleSignOut}
                  userPoints={userPoints}
                  handlePointsUpdate={handlePointsUpdate}
                />
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

// Authenticated App Component with all protected routes
interface AuthenticatedAppProps {
  currentMood: MoodType;
  setCurrentMood: (mood: MoodType) => void;
  hasSelectedMood: boolean;
  handleMoodSelection: (mood: MoodType, colors?: MoodColors) => void;
  handleSignOut: () => void;
  userPoints: number;
  handlePointsUpdate: (points: number) => void;
}

function AuthenticatedApp({
  currentMood,
  setCurrentMood,
  hasSelectedMood,
  handleMoodSelection,
  handleSignOut,
  userPoints,
  handlePointsUpdate
}: AuthenticatedAppProps) {
  const { signOut } = useAuth();

  const handleAuthSignOut = async () => {
    try {
      await signOut();
      handleSignOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Mood selection disabled - automatically set to 'content'
  // if (!hasSelectedMood) {
  //   return <MoodSelection onMoodSelection={handleMoodSelection} />;
  // }

  return (
    <div className="min-h-screen bg-background">
      <Header
        currentMood={currentMood}
        onMoodChange={setCurrentMood}
        onSignOut={handleAuthSignOut}
      />
      <main className="w-full">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/dashboard"
            element={
              <Dashboard
                currentMood={currentMood}
                userPoints={userPoints}
                onPointsUpdate={handlePointsUpdate}
              />
            }
          />
          <Route
            path="/tasks"
            element={
              <Tasks
                currentMood={currentMood}
                userPoints={userPoints}
                onPointsUpdate={handlePointsUpdate}
              />
            }
          />
          <Route
            path="/pomodoro"
            element={
              <Pomodoro
                currentMood={currentMood}
                userPoints={userPoints}
                onPointsUpdate={handlePointsUpdate}
              />
            }
          />
          <Route
            path="/rewards"
            element={
              <Rewards
                userPoints={userPoints}
                onPointsUpdate={handlePointsUpdate}
              />
            }
          />
          <Route path="/friends" element={<Friends />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/meditation" element={<Meditation />} />
          <Route path="/goals" element={<Goals />} />
          <Route 
            path="/checkin" 
            element={
              <CheckIn 
                currentMood={currentMood}
                userPoints={userPoints}
                onPointsUpdate={handlePointsUpdate}
              />
            } 
          />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/help" element={<Help />} />
          <Route path="/test-modal" element={<TestModal />} />
          <Route path="/flower-demo" element={<FlowerDemo />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/health-assessment" element={<HealthAssessment />} />
          <Route path="/ai-report" element={<AIReport />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      
      {/* Personalized Chat - Available on all pages after mood selection */}
      <PersonalizedChat
        currentMood={currentMood}
      />
      
      {/* Admin Access Component - Shows admin dashboard button for admin users */}
      <AdminAccess />
    </div>
  );
}

export default App;
