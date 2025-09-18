import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import { TaskProvider } from "./contexts/TaskContext";
import LoadingScreen from "./components/LoadingScreen";
import MoodSelection from "./pages/MoodSelection";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
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
import ElmoraChat from "./components/ElmoraChat";
import { type MoodType } from "./components/MoodColorSwitcher";
import { type MoodColors } from "./components/MoodColorPicker";

function App() {
  return (
    <AppProvider>
      <TaskProvider>
        <AppContent />
      </TaskProvider>
    </AppProvider>
  );
}

function AppContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasSelectedMood, setHasSelectedMood] = useState(false);
  const [currentMood, setCurrentMood] = useState<MoodType>("mid");
  const [userPoints, setUserPoints] = useState(0);
  const [moodColors, setMoodColors] = useState<MoodColors | null>(null);

  // Simulate loading time
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

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

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!hasSelectedMood) {
    return <MoodSelection onMoodSelection={handleMoodSelection} />;
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Header
          currentMood={currentMood}
          onMoodChange={setCurrentMood}
          onSignOut={handleSignOut}
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        
        {/* Elmora Chat - Available on all pages after mood selection */}
        <ElmoraChat
          currentMood={currentMood}
          userPoints={userPoints}
          onPointsUpdate={handlePointsUpdate}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
