import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  getDailyAffirmation, 
  getWellnessInsights, 
  getMoodRecommendations,
  getProgressSummary 
} from '../lib/supabaseApi';
import { type MoodType } from './MoodColorSwitcher';

interface AIPersonalizationPanelProps {
  currentMood?: MoodType;
}

interface Insight {
  title: string;
  message: string;
  type: 'strength' | 'improvement' | 'habit';
  icon: string;
}

interface Recommendation {
  activity: string;
  description: string;
  duration: string;
  icon: string;
}

interface ProgressData {
  summary: string;
  trend: 'improving' | 'stable' | 'needs attention';
  encouragement: string;
  stats: {
    totalJournals: number;
    totalMeditations: number;
    streakDays: number;
  };
}

const AIPersonalizationPanel: React.FC<AIPersonalizationPanelProps> = ({ currentMood }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'affirmation' | 'insights' | 'recommendations' | 'progress'>('affirmation');
  const [affirmation, setAffirmation] = useState('');
  const [insights, setInsights] = useState<Insight[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      loadTabData();
    }
  }, [activeTab, user]);

  const loadTabData = async () => {
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      switch (activeTab) {
        case 'affirmation':
          if (!affirmation) {
            const data = await getDailyAffirmation();
            setAffirmation(data.affirmation);
          }
          break;
        
        case 'insights':
          if (insights.length === 0) {
            const data = await getWellnessInsights();
            setInsights(data.insights);
          }
          break;
        
        case 'recommendations':
          const recData = await getMoodRecommendations(currentMood || 'content');
          setRecommendations(recData.recommendations);
          break;
        
        case 'progress':
          if (!progressData) {
            const data = await getProgressSummary();
            setProgressData(data);
          }
          break;
      }
    } catch (err: any) {
      console.error('Error loading AI data:', err);
      setError(err.message || 'Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    // Clear current tab data and reload
    switch (activeTab) {
      case 'affirmation':
        setAffirmation('');
        break;
      case 'insights':
        setInsights([]);
        break;
      case 'recommendations':
        setRecommendations([]);
        break;
      case 'progress':
        setProgressData(null);
        break;
    }
    loadTabData();
  };

  const tabs = [
    { id: 'affirmation', label: 'Affirmation', icon: '✨' },
    { id: 'insights', label: 'Insights', icon: '💡' },
    { id: 'recommendations', label: 'For You', icon: '🎯' },
    { id: 'progress', label: 'Progress', icon: '📈' }
  ];

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'strength':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'improvement':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'habit':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getTrendBadgeColor = (trend: string) => {
    switch (trend) {
      case 'improving':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'stable':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'needs attention':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold">🧠 AI Personalized for You</h3>
            <p className="text-sm opacity-90 mt-1">
              Insights powered by your wellness data
            </p>
          </div>
          <button
            onClick={refreshData}
            disabled={loading}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2"
            title="Refresh"
          >
            <span className={loading ? 'animate-spin' : ''}>↻</span>
            <span className="text-sm font-medium">Refresh</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
              activeTab === tab.id
                ? 'bg-white text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-purple-600 hover:bg-white/50'
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6 min-h-[300px]">
        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your personalized content...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            <p className="font-medium">⚠️ Error</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Affirmation Tab */}
            {activeTab === 'affirmation' && (
              <div className="text-center py-8 animate-fadeIn">
                <span className="text-6xl mb-6 block">🌟</span>
                <blockquote className="text-xl md:text-2xl font-medium text-gray-800 italic mb-6 max-w-2xl mx-auto leading-relaxed">
                  "{affirmation || 'Loading your daily affirmation...'}"
                </blockquote>
                <p className="text-sm text-gray-500">
                  Daily affirmation • {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            )}

            {/* Insights Tab */}
            {activeTab === 'insights' && (
              <div className="space-y-4 animate-fadeIn">
                {insights.length === 0 && !loading && (
                  <p className="text-gray-500 text-center py-8">
                    Complete your health assessment to receive personalized insights.
                  </p>
                )}
                {insights.map((insight, idx) => (
                  <div
                    key={idx}
                    className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-5 border border-purple-100 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start space-x-4">
                      <span className="text-3xl flex-shrink-0">{insight.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-lg text-gray-800">{insight.title}</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeBadgeColor(insight.type)}`}>
                            {insight.type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">{insight.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Recommendations Tab */}
            {activeTab === 'recommendations' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="bg-purple-50 rounded-lg p-3 mb-4 border border-purple-200">
                  <p className="text-sm text-gray-700">
                    💜 Based on your current mood: <strong className="text-purple-700 capitalize">{currentMood || 'content'}</strong>
                  </p>
                </div>
                
                {recommendations.length === 0 && !loading && (
                  <p className="text-gray-500 text-center py-8">
                    Complete your health assessment to receive personalized recommendations.
                  </p>
                )}
                
                {recommendations.map((rec, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-xl p-5 border-2 border-purple-200 hover:border-purple-400 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-start space-x-4">
                      <span className="text-3xl flex-shrink-0">{rec.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-gray-800 mb-2">{rec.activity}</h4>
                        <p className="text-sm text-gray-700 mb-3 leading-relaxed">{rec.description}</p>
                        <div className="flex items-center text-xs text-purple-600 font-medium">
                          <span>⏱️</span>
                          <span className="ml-1">{rec.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Progress Tab */}
            {activeTab === 'progress' && progressData && (
              <div className="space-y-6 animate-fadeIn">
                {/* Journey Summary */}
                <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl p-6 border border-purple-200">
                  <h4 className="text-lg font-bold text-gray-800 mb-3">Your Wellness Journey</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">{progressData.summary}</p>
                  <div className="flex items-center space-x-2">
                    <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getTrendBadgeColor(progressData.trend)}`}>
                      {progressData.trend === 'improving' && '📈'} 
                      {progressData.trend === 'stable' && '➡️'} 
                      {progressData.trend === 'needs attention' && '⚠️'}
                      {' '}
                      <span className="capitalize">{progressData.trend}</span>
                    </span>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-purple-50 rounded-lg p-4 text-center border border-purple-200">
                    <div className="text-3xl font-bold text-purple-600 mb-1">
                      {progressData.stats.totalJournals}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">Journal Entries</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-200">
                    <div className="text-3xl font-bold text-blue-600 mb-1">
                      {progressData.stats.totalMeditations}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">Meditations</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center border border-green-200 col-span-2 md:col-span-1">
                    <div className="text-3xl font-bold text-green-600 mb-1">
                      {progressData.stats.streakDays}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">Day Streak</div>
                  </div>
                </div>

                {/* Encouragement */}
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl p-6 text-center">
                  <p className="text-lg font-medium leading-relaxed">
                    💫 {progressData.encouragement}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'progress' && !progressData && !loading && (
              <p className="text-gray-500 text-center py-8">
                Complete your health assessment to see your progress tracking.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AIPersonalizationPanel;