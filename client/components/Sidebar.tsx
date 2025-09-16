import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { type MoodType } from './MoodColorSwitcher';
import DailyCheckIn from './modals/DailyCheckIn';
import SendEncouragement from './modals/SendEncouragement';
import ViewProgress from './modals/ViewProgress';

interface SidebarProps {
  currentMood: MoodType;
  onMoodChange: (mood: MoodType) => void;
  onSignOut: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentMood, onMoodChange, onSignOut }) => {
  const location = useLocation();
  const [showDailyCheckIn, setShowDailyCheckIn] = useState(false);
  const [showSendEncouragement, setShowSendEncouragement] = useState(false);
  const [showViewProgress, setShowViewProgress] = useState(false);

  const handleDailyCheckIn = (data: { mood: string; energy: number; gratitude: string }) => {
    console.log('Daily check-in completed:', data);
    // Here you would typically save this data to your backend
    alert(`Thank you for checking in! Mood: ${data.mood}, Energy: ${data.energy}/10`);
  };

  const handleSendEncouragement = (data: { recipient: string; message: string; template?: string }) => {
    console.log('Encouragement sent:', data);
    // Here you would typically send this to your backend/notification system
    alert(`Encouragement sent successfully! 💜`);
  };

  const mainNavigation = [
    { name: 'Home', href: '/dashboard', icon: '🏠' },
    { name: 'My Tasks', href: '/tasks', icon: '📝' },
    { name: 'Rewards', href: '/rewards', icon: '🎁' },
    { name: 'Friends', href: '/friends', icon: '👥' },
    { name: 'Notifications', href: '/notifications', icon: '🔔' },
    { name: 'Journal', href: '/journal', icon: '📖' },
    { name: 'Meditation', href: '/meditation', icon: '🧘' },
    { name: 'Goals', href: '/goals', icon: '🎯' },
  ];

  const bottomNavigation = [
    { name: 'Settings', href: '/settings', icon: '⚙️' },
    { name: 'Profile', href: '/profile', icon: '👤' },
    { name: 'Help', href: '/help', icon: '❓' },
  ];

  const moods = [
    { type: 'sad' as MoodType, label: 'Sad', color: 'bg-gray-600', emoji: '🌧️' },
    { type: 'mid' as MoodType, label: 'Mid', color: 'bg-amber-500', emoji: '⛅' },
    { type: 'amazing' as MoodType, label: 'Amazing', color: 'bg-emerald-500', emoji: '☀️' },
  ];

  const currentMoodData = moods.find(mood => mood.type === currentMood);

  return (
    <div className="w-64 h-screen bg-card border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white text-xl font-bold">E</span>
          </div>
          <span className="text-2xl font-light text-primary">ELMORA</span>
        </div>
      </div>

      {/* Current Mood */}
      <div className="p-6 border-b border-border">
        <div className="text-sm text-muted-foreground mb-2">Current Mood</div>
        <div className="flex items-center space-x-3 mb-3">
          <div className={`w-4 h-4 rounded-full ${currentMoodData?.color}`}></div>
          <span className="font-medium text-foreground">{currentMoodData?.label}</span>
          <span>{currentMoodData?.emoji}</span>
        </div>
        <div className="flex space-x-1">
          {moods.map((mood) => (
            <button
              key={mood.type}
              onClick={() => onMoodChange(mood.type)}
              className={`
                w-6 h-6 rounded-full border-2 transition-all
                ${currentMood === mood.type
                  ? 'border-primary scale-110'
                  : 'border-muted-foreground/30 hover:border-primary/50'
                }
                ${mood.color}
              `}
              title={`Switch to ${mood.label} mood`}
            />
          ))}
        </div>
        <button
          onClick={() => onSignOut()}
          className="text-xs text-muted-foreground hover:text-primary transition-colors mt-2"
        >
          Back to Mood Selection
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2 mb-8">
          {mainNavigation.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`
                flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium
                transition-colors gentle-hover
                ${location.pathname === item.href
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }
              `}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="border-t border-border pt-4">
          <div className="text-xs font-medium text-muted-foreground mb-3 px-4">QUICK ACTIONS</div>
          <div className="space-y-2">
            <button
              onClick={() => setShowDailyCheckIn(true)}
              className="w-full text-left px-4 py-2 rounded-xl hover:bg-muted gentle-hover flex items-center space-x-3 text-sm text-muted-foreground hover:text-foreground"
            >
              <span>✨</span>
              <span>Daily Check-in</span>
            </button>
            <button
              onClick={() => setShowSendEncouragement(true)}
              className="w-full text-left px-4 py-2 rounded-xl hover:bg-muted gentle-hover flex items-center space-x-3 text-sm text-muted-foreground hover:text-foreground"
            >
              <span>💌</span>
              <span>Send Encouragement</span>
            </button>
            <button
              onClick={() => setShowViewProgress(true)}
              className="w-full text-left px-4 py-2 rounded-xl hover:bg-muted gentle-hover flex items-center space-x-3 text-sm text-muted-foreground hover:text-foreground"
            >
              <span>📊</span>
              <span>View Progress</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Bottom Navigation */}
      <div className="p-4 border-t border-border">
        <div className="space-y-2">
          {bottomNavigation.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`
                flex items-center space-x-3 px-4 py-2 rounded-xl text-sm
                transition-colors gentle-hover
                ${location.pathname === item.href
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }
              `}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Modals */}
      <DailyCheckIn
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
    </div>
  );
};

export default Sidebar;
