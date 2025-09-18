/**
 * PomodoroCard Component
 * 
 * Enhanced Pomodoro Timer with Focus Music Player for Elmora Tasks
 * Features: 25/5 min cycles, progress visualization, ambient music, plant growth integration
 */

import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { 
  useReducedMotion,
  useIsDesktop,
  EffectWrapper 
} from '../../utils/reactBitsLoader';
import CountUp from '../effects/CountUp';

// Create simple fallback components for unavailable effects
const VariableProximity: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;
const TrueFocus: React.FC<{ children: React.ReactNode; scale?: number; glowColor?: string; disabled?: boolean }> = ({ children }) => <>{children}</>;
const ClickSpark: React.FC<{ children: React.ReactNode; color?: string; size?: number }> = ({ children }) => <>{children}</>;
import '../../styles/pomodoro.css';

// Types
interface PomodoroState {
  timeRemaining: number; // in seconds
  isRunning: boolean;
  currentPhase: 'focus' | 'break';
  sessionCount: number;
  totalFocusTime: number; // total accumulated focus time in minutes
}

interface MusicTrack {
  id: string;
  name: string;
  src: string;
  duration?: number;
}

interface PomodoroCardProps {
  onFocusSessionComplete: (sessionData: { duration: number; timestamp: Date }) => void;
  onProgressUpdate: (progress: number) => void;
  currentMood?: 'sad' | 'mid' | 'amazing' | 'content' | 'calm';
}

const PomodoroCard: React.FC<PomodoroCardProps> = ({ 
  onFocusSessionComplete, 
  onProgressUpdate,
  currentMood = 'content'
}) => {
  // Performance and accessibility hooks
  const reducedMotion = useReducedMotion();
  const isDesktop = useIsDesktop();
  const shouldShowEffects = !reducedMotion && isDesktop;

  // Pomodoro state
  const [pomodoroState, setPomodoroState] = useState<PomodoroState>({
    timeRemaining: 25 * 60, // 25 minutes in seconds
    isRunning: false,
    currentPhase: 'focus',
    sessionCount: 0,
    totalFocusTime: 0
  });

  // Music player state
  const [musicState, setMusicState] = useState({
    isPlaying: false,
    currentTrackIndex: 0,
    volume: 0.7,
    isLoading: true,
    hasError: false,
    isReady: false
  });

  // UI state
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);
  const [lastCompletedPhase, setLastCompletedPhase] = useState<'focus' | 'break' | null>(null);

  // Refs
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Music tracks - Rain atmosphere is the primary track
  const musicTracks: MusicTrack[] = [
    {
      id: 'rain',
      name: 'Dark Atmosphere with Rain',
      src: '/music/rain.mp3',
      duration: 352 // 5:52 duration in seconds
    },
    {
      id: 'lofi',
      name: 'Lofi Study Beats',
      src: '/music/lofi1.mp3'
    },
    {
      id: 'ocean',
      name: 'Ocean Waves',
      src: '/music/ocean.mp3'
    }
  ];

  // Get mood-specific styling
  const getMoodColors = () => {
    switch (currentMood) {
      case 'sad':
        return {
          gradient: 'from-gray-200 via-slate-100 to-gray-200',
          cardBg: 'bg-gray-50/80',
          textPrimary: 'text-gray-800',
          textSecondary: 'text-gray-600',
          accentColor: 'text-gray-700',
          buttonActive: 'bg-gray-600',
          progressColor: '#6b7280'
        };
      case 'mid':
        return {
          gradient: 'from-amber-100 via-yellow-50 to-orange-100',
          cardBg: 'bg-amber-50/80',
          textPrimary: 'text-amber-900',
          textSecondary: 'text-amber-700',
          accentColor: 'text-amber-800',
          buttonActive: 'bg-amber-500',
          progressColor: '#f59e0b'
        };
      case 'amazing':
        return {
          gradient: 'from-emerald-100 via-teal-50 to-cyan-100',
          cardBg: 'bg-emerald-50/80',
          textPrimary: 'text-emerald-900',
          textSecondary: 'text-emerald-700',
          accentColor: 'text-emerald-800',
          buttonActive: 'bg-emerald-500',
          progressColor: '#10b981'
        };
      case 'calm':
        return {
          gradient: 'from-blue-100 via-indigo-50 to-purple-100',
          cardBg: 'bg-blue-50/80',
          textPrimary: 'text-blue-900',
          textSecondary: 'text-blue-700',
          accentColor: 'text-blue-800',
          buttonActive: 'bg-blue-500',
          progressColor: '#3b82f6'
        };
      default:
        return {
          gradient: 'from-purple-100 via-pink-50 to-rose-100',
          cardBg: 'bg-purple-50/80',
          textPrimary: 'text-purple-900',
          textSecondary: 'text-purple-700',
          accentColor: 'text-purple-800',
          buttonActive: 'bg-purple-500',
          progressColor: '#8b5cf6'
        };
    }
  };

  const colors = getMoodColors();

  // Timer logic
  const startTimer = useCallback(() => {
    if (intervalRef.current) return;

    setPomodoroState(prev => ({ ...prev, isRunning: true }));
    
    // Auto-play music when starting focus session
    if (pomodoroState.currentPhase === 'focus' && !musicState.isPlaying) {
      setMusicState(prev => ({ ...prev, isPlaying: true }));
    }

    // Send Spline message
    if (window.postMessage) {
      window.postMessage({
        type: 'pomodoro',
        state: pomodoroState.currentPhase,
        remaining: pomodoroState.timeRemaining
      }, '*');
    }

    intervalRef.current = setInterval(() => {
      setPomodoroState(prev => {
        if (prev.timeRemaining <= 1) {
          // Timer completed
          if (prev.currentPhase === 'focus') {
            // Focus session completed
            onFocusSessionComplete({
              duration: 25,
              timestamp: new Date()
            });
            
            setLastCompletedPhase('focus');
            setShowCompletionMessage(true);
            
            // Update plant growth
            const newProgress = Math.min(100, prev.sessionCount * 20);
            onProgressUpdate(newProgress);
            
            // Send plant growth message
            if (window.postMessage) {
              window.postMessage({
                type: 'updateProgress',
                value: newProgress
              }, '*');
            }
            
            // Switch to break
            return {
              ...prev,
              timeRemaining: 5 * 60, // 5 minute break
              currentPhase: 'break',
              sessionCount: prev.sessionCount + 1,
              totalFocusTime: prev.totalFocusTime + 25,
              isRunning: false
            };
          } else {
            // Break completed, back to focus
            setLastCompletedPhase('break');
            setShowCompletionMessage(true);
            
            return {
              ...prev,
              timeRemaining: 25 * 60, // 25 minute focus
              currentPhase: 'focus',
              isRunning: false
            };
          }
        }
        
        return {
          ...prev,
          timeRemaining: prev.timeRemaining - 1
        };
      });
    }, 1000);
  }, [pomodoroState.currentPhase, musicState.isPlaying, onFocusSessionComplete, onProgressUpdate]);

  const pauseTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setPomodoroState(prev => ({ ...prev, isRunning: false }));
    
    // Pause music during break
    if (pomodoroState.currentPhase === 'break') {
      setMusicState(prev => ({ ...prev, isPlaying: false }));
    }
  }, [pomodoroState.currentPhase]);

  const resetTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setPomodoroState({
      timeRemaining: 25 * 60,
      isRunning: false,
      currentPhase: 'focus',
      sessionCount: 0,
      totalFocusTime: 0
    });
    
    setMusicState(prev => ({ ...prev, isPlaying: false }));
    setShowCompletionMessage(false);
  }, []);

  // Music player controls
  const toggleMusic = useCallback(() => {
    setMusicState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  }, []);

  const nextTrack = useCallback(() => {
    setMusicState(prev => ({
      ...prev,
      currentTrackIndex: (prev.currentTrackIndex + 1) % musicTracks.length
    }));
  }, [musicTracks.length]);

  // Audio initialization and management
  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      audio.volume = musicState.volume;
      
      // Initialize audio with proper loading
      if (!musicState.isReady && !musicState.hasError) {
        audio.load();
      }
    }
  }, [musicState.currentTrackIndex]);

  // Handle play/pause
  useEffect(() => {
    if (audioRef.current && musicState.isReady) {
      const audio = audioRef.current;
      audio.volume = musicState.volume;
      
      if (musicState.isPlaying) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log(`🎵 Now playing: ${musicTracks[musicState.currentTrackIndex]?.name}`);
            })
            .catch((error) => {
              console.warn('Audio playback failed:', error);
              setMusicState(prev => ({ ...prev, isPlaying: false, hasError: true }));
              
              if (error.name === 'NotAllowedError') {
                console.warn('Audio playback blocked by browser. User interaction required.');
              }
            });
        }
      } else {
        audio.pause();
      }
    }
  }, [musicState.isPlaying, musicState.isReady, musicState.volume, musicState.currentTrackIndex, musicTracks]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Hide completion message after 3 seconds
  useEffect(() => {
    if (showCompletionMessage) {
      const timeout = setTimeout(() => {
        setShowCompletionMessage(false);
        setLastCompletedPhase(null);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [showCompletionMessage]);

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return {
      minutes: mins,
      seconds: secs,
      display: `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    };
  };

  const timeFormatted = formatTime(pomodoroState.timeRemaining);
  const totalSeconds = pomodoroState.currentPhase === 'focus' ? 25 * 60 : 5 * 60;
  const progressPercentage = ((totalSeconds - pomodoroState.timeRemaining) / totalSeconds) * 100;

  return (
    <div className={`bg-gradient-to-r ${colors.gradient} rounded-3xl p-6 shadow-lg border border-white/20 backdrop-blur-sm mb-8`}>
      {/* Spline Orb Placeholder */}
      <div className="flex justify-center mb-4">
        <div 
          id="spline-pomodoro-orb" 
          data-spline="pomodoro-orb"
          data-phase={pomodoroState.currentPhase}
          data-remaining={pomodoroState.timeRemaining}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg flex items-center justify-center"
          aria-hidden="true"
        >
          <div className={`text-2xl ${pomodoroState.isRunning ? 'animate-pulse' : ''}`}>
            {pomodoroState.currentPhase === 'focus' ? '🌱' : '☕'}
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="text-center mb-6">
        <Suspense fallback={<h2 className={`text-2xl font-light ${colors.textPrimary} mb-2`}>🌱 Focus Session</h2>}>
          <EffectWrapper
            condition={shouldShowEffects}
            fallback={<h2 className={`text-2xl font-light ${colors.textPrimary} mb-2`}>🌱 Focus Session</h2>}
          >
            <VariableProximity>
              <h2 className={`text-2xl font-light ${colors.textPrimary} mb-2`}>🌱 Focus Session</h2>
            </VariableProximity>
          </EffectWrapper>
        </Suspense>
        
        <div className={`text-sm ${colors.textSecondary} mb-1`}>
          {pomodoroState.currentPhase === 'focus' ? 'Focus Time' : 'Break Time'}
        </div>
        
        <div className={`text-xs ${colors.textSecondary}`}>
          Session {pomodoroState.sessionCount + 1} • Total: {pomodoroState.totalFocusTime}min focused
        </div>
      </div>

      {/* Circular Progress Timer */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          {/* Progress Circle */}
          <svg width="200" height="200" className={`transform -rotate-90 progress-circle ${pomodoroState.isRunning ? 'active' : ''}`}>
            <circle
              cx="100"
              cy="100"
              r="85"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="100"
              cy="100"
              r="85"
              stroke={colors.progressColor}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 85}`}
              strokeDashoffset={`${2 * Math.PI * 85 * (1 - progressPercentage / 100)}`}
              className={`transition-all duration-1000 ${pomodoroState.isRunning ? 'opacity-100 pomodoro-timer-active' : 'opacity-70'}`}
            />
          </svg>
          
          {/* Timer Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Suspense fallback={
              <div className={`text-4xl font-bold ${colors.textPrimary} mb-1`}>
                {timeFormatted.display}
              </div>
            }>
              <TrueFocus 
                scale={pomodoroState.isRunning ? 1.05 : 1.0}
                disabled={reducedMotion}
              >
                <div className={`text-4xl font-bold ${colors.textPrimary} mb-1 timer-display ${pomodoroState.isRunning ? 'running' : ''}`} aria-live="polite">
                  {shouldShowEffects ? (
                    <div className="flex items-center space-x-2">
                      <CountUp end={timeFormatted.minutes} duration={0} disabled={reducedMotion} />
                      <span>:</span>
                      <CountUp end={timeFormatted.seconds} duration={0} disabled={reducedMotion} />
                    </div>
                  ) : (
                    timeFormatted.display
                  )}
                </div>
              </TrueFocus>
            </Suspense>
            
            <div className={`text-xs ${colors.textSecondary} uppercase tracking-wide phase-indicator ${pomodoroState.currentPhase}`}>
              {pomodoroState.currentPhase}
            </div>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex justify-center space-x-4 mb-6">
        <Suspense fallback={
          <button
            onClick={pomodoroState.isRunning ? pauseTimer : startTimer}
            className={`px-6 py-3 ${colors.buttonActive} text-white rounded-2xl font-medium transition-all hover:shadow-lg`}
          >
            {pomodoroState.isRunning ? '⏸️ Pause' : '▶️ Start'}
          </button>
        }>
          <EffectWrapper
            condition={shouldShowEffects}
            fallback={
              <button
                onClick={pomodoroState.isRunning ? pauseTimer : startTimer}
                className={`px-6 py-3 ${colors.buttonActive} text-white rounded-2xl font-medium transition-all hover:shadow-lg`}
              >
                {pomodoroState.isRunning ? '⏸️ Pause' : '▶️ Start'}
              </button>
            }
          >
            <ClickSpark color={colors.progressColor} size={12}>
              <button
                onClick={pomodoroState.isRunning ? pauseTimer : startTimer}
                className={`px-6 py-3 ${colors.buttonActive} text-white rounded-2xl font-medium pomodoro-button focus:outline-none focus:ring-4 focus:ring-opacity-50`}
                aria-label={pomodoroState.isRunning ? 'Pause timer' : 'Start timer'}
              >
                {pomodoroState.isRunning ? '⏸️ Pause' : '▶️ Start'}
              </button>
            </ClickSpark>
          </EffectWrapper>
        </Suspense>

        <button
          onClick={resetTimer}
          className={`px-4 py-3 bg-white/20 ${colors.textPrimary} rounded-2xl font-medium transition-all hover:bg-white/30 focus:outline-none focus:ring-4 focus:ring-opacity-50`}
          aria-label="Reset timer"
        >
          🔄 Reset
        </button>
      </div>

      {/* Mini Music Player */}
      <div className={`${colors.cardBg} rounded-2xl p-4 backdrop-blur-sm border border-white/30`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleMusic}
              disabled={musicState.isLoading || musicState.hasError}
              className={`w-10 h-10 ${colors.buttonActive} text-white rounded-full flex items-center justify-center music-player-button focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                musicState.isLoading || musicState.hasError ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              aria-label={
                musicState.isLoading ? 'Loading music...' :
                musicState.hasError ? 'Music unavailable' :
                musicState.isPlaying ? 'Pause focus music' : 'Play focus music'
              }
            >
              {musicState.isLoading ? '⏳' : 
               musicState.hasError ? '⚠️' :
               musicState.isPlaying ? '⏸️' : '▶️'}
            </button>
            
            <div>
              <div className={`text-sm font-medium ${colors.textPrimary}`}>
                Focus Music
              </div>
              <div className={`text-xs ${colors.textSecondary}`}>
                {musicState.isLoading ? 'Loading...' :
                 musicState.hasError ? 'Music file not found' :
                 musicTracks[musicState.currentTrackIndex]?.name || 'No track selected'}
              </div>
              
              {/* Music status indicator */}
              {musicState.isReady && !musicState.hasError && (
                <div className={`text-xs ${colors.accentColor} flex items-center space-x-1 mt-1`}>
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  <span>Ready</span>
                </div>
              )}
            </div>
          </div>
          
          <button
            onClick={nextTrack}
            className={`p-2 ${colors.textSecondary} hover:${colors.textPrimary} transition-colors focus:outline-none`}
            aria-label="Next track"
          >
            ⏭️
          </button>
        </div>
        
        {/* Volume Control - Always visible */}
        <div className="mt-3 flex items-center space-x-2">
          <span className={`text-xs ${colors.textSecondary}`}>
            {musicState.volume === 0 ? '🔇' : musicState.volume < 0.5 ? '🔉' : '🔊'}
          </span>
          <div className="flex-1 relative">
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={musicState.volume}
              onChange={(e) => {
                const newVolume = parseFloat(e.target.value);
                setMusicState(prev => ({ ...prev, volume: newVolume }));
                if (audioRef.current) {
                  audioRef.current.volume = newVolume;
                }
              }}
              className="w-full h-2 bg-white/30 rounded-full appearance-none cursor-pointer volume-slider"
              style={{
                background: `linear-gradient(to right, ${colors.progressColor} 0%, ${colors.progressColor} ${musicState.volume * 100}%, rgba(255,255,255,0.3) ${musicState.volume * 100}%, rgba(255,255,255,0.3) 100%)`
              }}
              aria-label="Volume control"
            />
          </div>
          <span className={`text-xs ${colors.textSecondary} min-w-[2.5rem] text-right font-mono`}>
            {Math.round(musicState.volume * 100)}%
          </span>
        </div>
      </div>

      {/* Motivational Text with TextTrail Effect */}
      <div className="text-center mt-6">
        <div className={`text-sm ${colors.textSecondary} italic motivational-text`}>
          Stay focused — one step closer to growth.
        </div>
      </div>

      {/* Completion Toast */}
      {showCompletionMessage && (
        <div className={`fixed top-4 right-4 ${colors.cardBg} rounded-2xl p-4 shadow-lg border border-white/30 z-50 completion-toast`}>
          <div className={`font-medium ${colors.textPrimary} mb-1`}>
            {lastCompletedPhase === 'focus' ? '🎉 Focus Session Complete!' : '☕ Break Time Over!'}
          </div>
          <div className={`text-sm ${colors.textSecondary}`}>
            {lastCompletedPhase === 'focus' 
              ? 'Nice work — you completed a focus session!' 
              : 'Time to get back to focused work!'
            }
          </div>
        </div>
      )}

      {/* Hidden Audio Element with Enhanced Error Handling */}
      <audio
        ref={audioRef}
        src={musicTracks[musicState.currentTrackIndex]?.src}
        loop
        preload="auto"
        onError={(e) => {
          const error = e.currentTarget.error;
          console.error('Audio loading error:', {
            error: error,
            code: error?.code,
            message: error?.message,
            currentTrack: musicTracks[musicState.currentTrackIndex],
            src: musicTracks[musicState.currentTrackIndex]?.src
          });
          setMusicState(prev => ({ 
            ...prev, 
            hasError: true, 
            isLoading: false, 
            isReady: false,
            isPlaying: false 
          }));
        }}
        onLoadStart={() => {
          console.log('🎵 Loading audio:', musicTracks[musicState.currentTrackIndex]?.name);
          setMusicState(prev => ({ 
            ...prev, 
            isLoading: true, 
            hasError: false, 
            isReady: false 
          }));
        }}
        onCanPlay={() => {
          console.log('✅ Audio ready to play:', musicTracks[musicState.currentTrackIndex]?.name);
          setMusicState(prev => ({ 
            ...prev, 
            isReady: true, 
            isLoading: false,
            hasError: false
          }));
        }}
        onLoadedData={() => {
          console.log('📁 Audio data loaded:', musicTracks[musicState.currentTrackIndex]?.name);
        }}
        onPlay={() => {
          console.log('▶️ Audio started playing');
        }}
        onPause={() => {
          console.log('⏸️ Audio paused');
        }}
        onEnded={() => {
          console.log('🔄 Audio ended, will loop');
        }}
      />
    </div>
  );
};

export default PomodoroCard;