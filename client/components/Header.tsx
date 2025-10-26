import React, { useState, Suspense, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { type MoodType } from "./MoodColorSwitcher";
import AICheckIn from "./modals/AICheckIn";
import SendEncouragement from "./modals/SendEncouragement";
import ViewProgress from "./modals/ViewProgress";
import { useApp } from "../contexts/AppContext";
import { useAuth } from "../contexts/AuthContext";
import { t, type Language } from "../utils/translations";
import { Home, ListTodo, Timer, BookOpen, Sparkles, Target, Users2, Gift, Settings as SettingsIcon, LogOut, BarChart3, Mail, CloudRain, CloudSun, Sun } from "lucide-react";
import { 
  VariableProximity, 
  GlareHover, 
  Magnet, 
  ClickSpark, 
  LogoLoop, 
  useReducedMotion, 
  useIsDesktop, 
  EffectWrapper 
} from "../utils/reactBitsLoader";
import "../styles/topbar.css";

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
  const { user } = useAuth();
  const [showDailyCheckIn, setShowDailyCheckIn] = useState(false);
  const [showSendEncouragement, setShowSendEncouragement] = useState(false);
  const [showViewProgress, setShowViewProgress] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [profileHovered, setProfileHovered] = useState(false);
  
  // Performance and accessibility hooks
  const reducedMotion = useReducedMotion();
  const isDesktop = useIsDesktop();
  const shouldShowEffects = !reducedMotion && isDesktop;

  const handleDailyCheckIn = (data: {
    mood: string;
    energy: number;
    gratitude: string;
    aiInsight: string;
  }) => {
    console.log("AI Daily check-in completed:", data);
    alert(
      `${t("checkInComplete", state.language as Language)}\n\nAI Insight: ${data.aiInsight.substring(0, 100)}...`,
    );
  };

  const handleSendEncouragement = (data: {
    recipient: string;
    message: string;
    template?: string;
  }) => {
    console.log("Encouragement sent:", data);
    alert(`${t("success", state.language as Language)}`);
  };

  const navigation = [
    {
      name: t("home", state.language as Language),
      href: "/dashboard",
      icon: Home,
    },
    {
      name: t("tasks", state.language as Language),
      href: "/tasks",
      icon: ListTodo,
    },
    {
      name: "Pomodoro",
      href: "/pomodoro",
      icon: Timer,
    },
    {
      name: t("journal", state.language as Language),
      href: "/journal",
      icon: BookOpen,
    },
    {
      name: t("meditation", state.language as Language),
      href: "/meditation",
      icon: Sparkles,
    },
    {
      name: t("goals", state.language as Language),
      href: "/goals",
      icon: Target,
    },
    {
      name: t("friends", state.language as Language),
      href: "/friends",
      icon: Users2,
    },
    {
      name: t("rewards", state.language as Language),
      href: "/rewards",
      icon: Gift,
    },
  ];

  const moods = [
    {
      type: "sad" as MoodType,
      label: "Sad",
      color: "bg-gray-600",
      icon: CloudRain,
    },
    {
      type: "mid" as MoodType,
      label: "Mid",
      color: "bg-amber-500",
      icon: CloudSun,
    },
    {
      type: "amazing" as MoodType,
      label: "Amazing",
      color: "bg-emerald-500",
      icon: Sun,
    },
  ];

  const currentMoodData = moods.find((mood) => mood.type === currentMood);

  /**
   * SPLINE INTEGRATION NOTES:
   * - Spline placeholder is ready at #spline-topbar-placeholder
   * - Use data-spline="plant-mini" attribute for 3D plant model
   * - Add data-progress attribute if progress visualization needed
   * - Mount Spline component in this placeholder when ready:
   *   const splinePlaceholder = document.getElementById('spline-topbar-placeholder');
   *   if (splinePlaceholder) {
   *     // Mount Spline component here
   *   }
   * 
   * ACCESSIBILITY NOTES:
   * - All navigation links have proper aria-labels
   * - Mood toggles use aria-pressed for state
   * - Mobile hamburger has aria-expanded
   * - Profile button indicates popup with aria-haspopup
   * - Keyboard navigation works throughout
   * 
   * TESTING CHECKLIST:
   * - [ ] Tab through all interactive elements
   * - [ ] Test with screen reader (aria-labels read correctly)
   * - [ ] Verify prefers-reduced-motion disables effects
   * - [ ] Check mobile responsiveness
   * - [ ] Validate color contrast in different moods
   */

  return (
    <>
      <header id="elmora-topbar" className="elmora-topbar" role="banner">
        <div className="elmora-left">
          {/* Logo area with Spline placeholder */}
          <Link to="/dashboard" className="elmora-logo">
            <div 
              id="spline-topbar-placeholder" 
              data-spline="plant-mini" 
              aria-hidden="true"
            />
            <Suspense fallback={<span className="elmora-logo-text">ELMORA</span>}>
              <EffectWrapper
                condition={shouldShowEffects}
                fallback={<span className="elmora-logo-text">ELMORA</span>}
              >
                <VariableProximity>
                  <span className="elmora-logo-text">ELMORA</span>
                </VariableProximity>
              </EffectWrapper>
            </Suspense>
          </Link>

          {/* Primary Navigation */}
          <nav className={`elmora-nav ${mobileNavOpen ? 'mobile-active' : ''}`} role="navigation" aria-label="Main navigation">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              
              return (
                <Suspense key={item.href} fallback={
                  <Link
                    to={item.href}
                    className={`top-nav-link ${isActive ? 'active' : ''}`}
                    onClick={() => setMobileNavOpen(false)}
                  >
                    <Magnet disabled={true}>
                      <item.icon className="nav-icon w-5 h-5" aria-hidden="true" strokeWidth={2} />
                    </Magnet>
                    <span className="nav-label">{item.name}</span>
                  </Link>
                }>
                  <EffectWrapper
                    condition={shouldShowEffects}
                    fallback={
                      <Link
                        to={item.href}
                        className={`top-nav-link ${isActive ? 'active' : ''}`}
                        onClick={() => setMobileNavOpen(false)}
                      >
                        <item.icon className="nav-icon w-5 h-5" aria-hidden="true" strokeWidth={2} />
                        <span className="nav-label">{item.name}</span>
                      </Link>
                    }
                  >
                    <GlareHover>
                      <Link
                        to={item.href}
                        className={`top-nav-link ${isActive ? 'active' : ''}`}
                        onClick={() => setMobileNavOpen(false)}
                      >
                        <Magnet>
                          <item.icon className="nav-icon w-5 h-5" aria-hidden="true" strokeWidth={2} />
                        </Magnet>
                        <span className="nav-label">{item.name}</span>
                      </Link>
                    </GlareHover>
                  </EffectWrapper>
                </Suspense>
              );
            })}
          </nav>
        </div>

        <div className="elmora-right">
          {/* Mobile hamburger */}
          <button 
            className="mobile-hamburger"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            aria-expanded={mobileNavOpen}
            aria-label="Toggle navigation menu"
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>

          {/* Quick Actions */}
          <div className="hidden md:flex items-center space-x-2">
            <button
              onClick={() => setShowDailyCheckIn(true)}
              className="quick-action"
              title={t("dailyCheckIn", state.language as Language)}
              aria-label={t("dailyCheckIn", state.language as Language)}
            >
              <Sparkles className="w-5 h-5" strokeWidth={2} />
            </button>
            <button
              onClick={() => setShowSendEncouragement(true)}
              className="quick-action"
              title="Send Encouragement"
              aria-label="Send encouragement to friends"
            >
              <Mail className="w-5 h-5" strokeWidth={2} />
            </button>
            <button
              onClick={() => setShowViewProgress(true)}
              className="quick-action"
              title="View Progress"
              aria-label="View your progress"
            >
              <BarChart3 className="w-5 h-5" strokeWidth={2} />
            </button>
          </div>

          {/* Mood Toggle with ClickSpark effects */}
          <div className="mood-toggle" role="tablist" aria-label="Mood selector">
            <span className="mood-label">Mood:</span>
            {moods.map((mood) => {
              const isActive = currentMood === mood.type;
              
              return (
                <Suspense key={mood.type} fallback={
                  <button
                    onClick={() => onMoodChange(mood.type)}
                    className={`mood-pill ${mood.type}`}
                    aria-pressed={isActive}
                    aria-label={`Switch to ${mood.label} mood`}
                    title={mood.label}
                  />
                }>
                  <EffectWrapper
                    condition={shouldShowEffects}
                    fallback={
                      <button
                        onClick={() => onMoodChange(mood.type)}
                        className={`mood-pill ${mood.type}`}
                        aria-pressed={isActive}
                        aria-label={`Switch to ${mood.label} mood`}
                        title={mood.label}
                      />
                    }
                  >
                    <ClickSpark color={mood.color.replace('bg-', '#')} size={8}>
                      <button
                        onClick={() => onMoodChange(mood.type)}
                        className={`mood-pill ${mood.type}`}
                        aria-pressed={isActive}
                        aria-label={`Switch to ${mood.label} mood`}
                        title={mood.label}
                      />
                    </ClickSpark>
                  </EffectWrapper>
                </Suspense>
              );
            })}
          </div>

          {/* Settings */}
          <Link
            to="/settings"
            className="quick-action"
            aria-label="Open settings"
          >
            <SettingsIcon className="w-5 h-5" strokeWidth={2} />
          </Link>

          {/* Sign Out Button */}
          <button
            onClick={onSignOut}
            className="quick-action sign-out-btn"
            title="Sign Out"
            aria-label="Sign out of account"
          >
            <LogOut className="w-5 h-5" strokeWidth={2} />
          </button>

          {/* Profile Avatar with LogoLoop effect */}
          <Suspense fallback={
            <Link to="/profile">
              <button id="profile-btn" aria-haspopup="true" aria-expanded="false" aria-label="Open profile menu">
                <span className="avatar">{user?.email?.charAt(0).toUpperCase() || 'U'}</span>
              </button>
            </Link>
          }>
            <Link to="/profile">
              <EffectWrapper
                condition={shouldShowEffects && profileHovered}
                fallback={
                  <button 
                    id="profile-btn" 
                    aria-haspopup="true" 
                    aria-expanded="false" 
                    aria-label="Open profile menu"
                    onMouseEnter={() => setProfileHovered(true)}
                    onMouseLeave={() => setProfileHovered(false)}
                  >
                    <span className="avatar">{user?.email?.charAt(0).toUpperCase() || 'U'}</span>
                  </button>
                }
              >
                <LogoLoop>
                  <button 
                    id="profile-btn" 
                    aria-haspopup="true" 
                    aria-expanded="false" 
                    aria-label="Open profile menu"
                    onMouseEnter={() => setProfileHovered(true)}
                    onMouseLeave={() => setProfileHovered(false)}
                  >
                    <span className="avatar">{user?.email?.charAt(0).toUpperCase() || 'U'}</span>
                  </button>
                </LogoLoop>
              </EffectWrapper>
            </Link>
          </Suspense>
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
