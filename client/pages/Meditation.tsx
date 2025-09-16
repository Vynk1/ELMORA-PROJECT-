import React, { useState, useEffect } from 'react';

interface MeditationSession {
  id: string;
  title: string;
  duration: number; // in minutes
  type: 'breathing' | 'mindfulness' | 'body-scan' | 'loving-kindness' | 'guided';
  description: string;
  audioUrl?: string;
}

const Meditation: React.FC = () => {
  const [selectedSession, setSelectedSession] = useState<MeditationSession | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<'prepare' | 'meditate' | 'complete'>('prepare');

  const sessions: MeditationSession[] = [
    {
      id: '1',
      title: 'Quick Breathing Exercise',
      duration: 5,
      type: 'breathing',
      description: 'A simple 4-7-8 breathing technique to calm your mind and reduce stress.'
    },
    {
      id: '2',
      title: 'Mindful Moment',
      duration: 10,
      type: 'mindfulness',
      description: 'Practice present-moment awareness and let go of distracting thoughts.'
    },
    {
      id: '3',
      title: 'Body Scan Relaxation',
      duration: 15,
      type: 'body-scan',
      description: 'Release tension by focusing attention on different parts of your body.'
    },
    {
      id: '4',
      title: 'Loving-Kindness Practice',
      duration: 12,
      type: 'loving-kindness',
      description: 'Cultivate compassion for yourself and others through guided intentions.'
    },
    {
      id: '5',
      title: 'Deep Relaxation',
      duration: 20,
      type: 'guided',
      description: 'A comprehensive guided meditation for deep relaxation and stress relief.'
    }
  ];

  const typeIcons = {
    'breathing': '🫁',
    'mindfulness': '🧘',
    'body-scan': '🪶',
    'loving-kindness': '💝',
    'guided': '🎧'
  };

  const typeColors = {
    'breathing': 'bg-blue-100 text-blue-800',
    'mindfulness': 'bg-green-100 text-green-800',
    'body-scan': 'bg-purple-100 text-purple-800',
    'loving-kindness': 'bg-pink-100 text-pink-800',
    'guided': 'bg-orange-100 text-orange-800'
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsPlaying(false);
            setCurrentPhase('complete');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPlaying, timeRemaining]);

  const startSession = (session: MeditationSession) => {
    setSelectedSession(session);
    setTimeRemaining(session.duration * 60);
    setCurrentPhase('prepare');
  };

  const startMeditation = () => {
    setCurrentPhase('meditate');
    setIsPlaying(true);
  };

  const pauseResume = () => {
    setIsPlaying(!isPlaying);
  };

  const endSession = () => {
    setSelectedSession(null);
    setIsPlaying(false);
    setTimeRemaining(0);
    setCurrentPhase('prepare');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const MeditationPlayer = () => {
    if (!selectedSession) return null;

    return (
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center z-50">
        <div className="max-w-md w-full mx-4 text-white text-center">
          {currentPhase === 'prepare' && (
            <div className="space-y-8">
              <div className="text-6xl mb-4">{typeIcons[selectedSession.type]}</div>
              <h2 className="text-2xl font-light mb-4">{selectedSession.title}</h2>
              <p className="text-white/80 mb-8">{selectedSession.description}</p>
              <div className="text-4xl font-light mb-8">{selectedSession.duration} minutes</div>
              <div className="space-y-4">
                <button
                  onClick={startMeditation}
                  className="w-full py-4 bg-white/20 backdrop-blur-sm rounded-2xl font-medium hover:bg-white/30 transition-colors"
                >
                  Begin Meditation
                </button>
                <button
                  onClick={endSession}
                  className="w-full py-3 text-white/60 hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {currentPhase === 'meditate' && (
            <div className="space-y-8">
              <div className="text-4xl mb-4">{typeIcons[selectedSession.type]}</div>
              <h2 className="text-xl font-light mb-8">{selectedSession.title}</h2>
              
              {/* Breathing Circle Animation */}
              <div className="relative flex items-center justify-center mb-8">
                <div className={`
                  w-32 h-32 rounded-full border-4 border-white/30 flex items-center justify-center
                  ${isPlaying ? 'animate-pulse' : ''}
                `}>
                  <div className={`
                    w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm
                    ${isPlaying ? 'animate-ping' : ''}
                  `} />
                </div>
              </div>

              <div className="text-3xl font-light mb-4">{formatTime(timeRemaining)}</div>
              
              <div className="text-white/80 mb-8">
                {selectedSession.type === 'breathing' && 'Focus on your breath...'}
                {selectedSession.type === 'mindfulness' && 'Notice the present moment...'}
                {selectedSession.type === 'body-scan' && 'Scan your body from head to toe...'}
                {selectedSession.type === 'loving-kindness' && 'Send love to yourself and others...'}
                {selectedSession.type === 'guided' && 'Follow along with the guidance...'}
              </div>

              <div className="space-y-4">
                <button
                  onClick={pauseResume}
                  className="w-full py-4 bg-white/20 backdrop-blur-sm rounded-2xl font-medium hover:bg-white/30 transition-colors"
                >
                  {isPlaying ? 'Pause' : 'Resume'}
                </button>
                <button
                  onClick={endSession}
                  className="w-full py-3 text-white/60 hover:text-white transition-colors"
                >
                  End Session
                </button>
              </div>
            </div>
          )}

          {currentPhase === 'complete' && (
            <div className="space-y-8">
              <div className="text-6xl mb-4">✨</div>
              <h2 className="text-2xl font-light mb-4">Meditation Complete</h2>
              <p className="text-white/80 mb-8">
                Well done! You've completed your {selectedSession.duration}-minute meditation session.
              </p>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8">
                <div className="text-4xl mb-2">+5</div>
                <div className="text-sm text-white/80">Mindfulness Points Earned</div>
              </div>
              <button
                onClick={endSession}
                className="w-full py-4 bg-white/20 backdrop-blur-sm rounded-2xl font-medium hover:bg-white/30 transition-colors"
              >
                Return to Sessions
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100">
      <div className="p-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light text-gray-800 mb-4">Meditation</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find peace and clarity through guided meditation practices
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <div className="text-2xl font-bold text-purple-600 mb-1">23</div>
            <div className="text-sm text-gray-600">Sessions Completed</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <div className="text-2xl font-bold text-blue-600 mb-1">156</div>
            <div className="text-sm text-gray-600">Minutes Meditated</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <div className="text-2xl font-bold text-green-600 mb-1">7</div>
            <div className="text-sm text-gray-600">Day Streak</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <div className="text-2xl font-bold text-orange-600 mb-1">12</div>
            <div className="text-sm text-gray-600">This Week</div>
          </div>
        </div>

        {/* Session Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group"
              onClick={() => startSession(session)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="text-3xl">{typeIcons[session.type]}</div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${typeColors[session.type]}`}>
                  {session.duration} min
                </span>
              </div>

              <h3 className="text-lg font-medium text-gray-800 mb-2 group-hover:text-primary transition-colors">
                {session.title}
              </h3>

              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                {session.description}
              </p>

              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${typeColors[session.type]}`}>
                  {session.type.replace('-', ' ')}
                </span>
                <button className="text-primary hover:text-primary/80 transition-colors">
                  Start →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Daily Tip */}
        <div className="mt-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl p-8 text-white text-center">
          <div className="text-3xl mb-4">💡</div>
          <h3 className="text-xl font-medium mb-3">Today's Meditation Tip</h3>
          <p className="text-white/90 max-w-2xl mx-auto">
            Remember that meditation is a practice, not a performance. Be gentle with yourself 
            and focus on the process rather than achieving a perfect state of mind.
          </p>
        </div>
      </div>

      <MeditationPlayer />
    </div>
  );
};

export default Meditation;
