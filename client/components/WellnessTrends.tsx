import React, { useState, useEffect } from 'react';
import { BarChart3, Lightbulb, Link2, TrendingUp, TrendingDown, ArrowRight, Sparkles, AlertTriangle, Smile, Frown, Meh, Cloud, Zap, Battery, BedDouble, Brain } from 'lucide-react';

interface TrendData {
  energy_trend: {
    direction: 'improving' | 'declining' | 'stable';
    slope: number;
    average: number;
  };
  sleep_trend: {
    direction: 'improving' | 'declining' | 'stable';
    slope: number;
    average: number;
  };
  stress_trend: {
    direction: 'increasing' | 'decreasing' | 'stable';
    slope: number;
    average: number;
  };
  mood_pattern: {
    dominant: string;
    distribution: Record<string, number>;
    variety: number;
  };
  correlations: {
    sleep_energy: {
      strength: number;
      direction: 'positive' | 'negative';
      interpretation: string;
    };
    stress_energy: {
      strength: number;
      direction: 'positive' | 'negative';
      interpretation: string;
    };
  };
  summary: {
    total_days: number;
    best_energy_day: any;
    lowest_stress_day: any;
  };
}

interface CheckinInsights {
  insights: Array<{
    category: string;
    type: string;
    title: string;
    observation: string;
    impact: string;
    emoji: string;
  }>;
  recommendations: Array<{
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    category: string;
    emoji: string;
  }>;
  correlations: Array<{
    factor1: string;
    factor2: string;
    relationship: string;
    strength: string;
    insight: string;
  }>;
  data_summary: {
    total_checkins: number;
    consistency_rate: number;
    date_range: {
      from: string;
      to: string;
    };
  };
}

interface WellnessTrendsProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

const WellnessTrends: React.FC<WellnessTrendsProps> = ({ userId, isOpen, onClose }) => {
  const [trends, setTrends] = useState<TrendData | null>(null);
  const [insights, setInsights] = useState<CheckinInsights | null>(null);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState<'week' | 'month' | 'quarter'>('week');
  const [activeTab, setActiveTab] = useState<'trends' | 'insights' | 'correlations'>('trends');

  useEffect(() => {
    if (isOpen && userId) {
      fetchData();
    }
  }, [isOpen, userId, period]);

  const fetchData = async () => {
    setLoading(true);
    console.log('🔄 Fetching wellness data for user:', userId, 'period:', period);
    
    try {
      // Fetch trends
      console.log('📊 Fetching trends...');
      const trendsResponse = await fetch(`/api/checkin/trends/${userId}?period=${period}`);
      console.log('Trends response status:', trendsResponse.status);
      
      if (trendsResponse.ok) {
        const trendsData = await trendsResponse.json();
        console.log('✅ Trends data received:', trendsData);
        setTrends(trendsData.trends);
        setCurrentStreak(trendsData.current_streak || 0);
      } else {
        console.error('❌ Trends API error:', trendsResponse.status, await trendsResponse.text());
      }

      // Fetch insights
      console.log('💡 Fetching insights...');
      const insightsResponse = await fetch(`/api/checkin/insights/${userId}?days=${period === 'week' ? 7 : period === 'month' ? 30 : 90}`);
      console.log('Insights response status:', insightsResponse.status);
      
      if (insightsResponse.ok) {
        const insightsData = await insightsResponse.json();
        console.log('✅ Insights data received:', insightsData);
        setInsights(insightsData);
      } else {
        console.error('❌ Insights API error:', insightsResponse.status, await insightsResponse.text());
      }
    } catch (error) {
      console.error('💥 Error fetching wellness data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (direction: string, isStress = false) => {
    if (isStress) {
      return direction === 'decreasing' ? TrendingDown : direction === 'increasing' ? TrendingUp : ArrowRight;
    }
    return direction === 'improving' ? TrendingUp : direction === 'declining' ? TrendingDown : ArrowRight;
  };

  const getMoodIcon = (mood: string) => {
    const moodIcons: Record<string, any> = {
      excited: Sparkles,
      happy: Smile,
      calm: Cloud,
      neutral: Meh,
      tired: Battery,
      stressed: AlertTriangle,
      sad: Frown,
      anxious: Brain,
      frustrated: AlertTriangle,
      overwhelmed: AlertTriangle
    };
    return moodIcons[mood] || Meh;
  };

  const renderProgressBar = (value: number, max: number = 10, color = 'bg-primary') => (
    <div className="flex items-center space-x-2">
      <div className="flex-1 bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full ${color}`}
          style={{ width: `${(value / max) * 100}%` }}
        />
      </div>
      <span className="text-sm font-medium text-gray-600">{value.toFixed(1)}</span>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-light text-gray-800 mb-2">Wellness Analytics</h2>
            <p className="text-gray-600">Your personal wellness insights and trends</p>
          </div>
          <div className="flex items-center space-x-3">
            {/* Period Selector */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              {['week', 'month', 'quarter'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p as any)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                    period === p
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
          {[
            { key: 'trends', label: 'Trends', icon: BarChart3 },
            { key: 'insights', label: 'Insights', icon: Lightbulb },
            { key: 'correlations', label: 'Correlations', icon: Link2 }
          ].map((tab) => {
            const TabIcon = tab.icon;
            return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-md font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <TabIcon className="w-5 h-5" strokeWidth={2} />
              <span>{tab.label}</span>
            </button>
          );})}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600">Analyzing your wellness data...</p>
              </div>
            </div>
          ) : (
            <>
              {/* No Data Message */}
              {!trends && !insights && (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <BarChart3 className="w-16 h-16 mb-4 text-gray-400" strokeWidth={2} />
                  <h3 className="text-xl font-medium text-gray-800 mb-2">No Wellness Data Yet</h3>
                  <p className="text-gray-600 mb-4 max-w-md">
                    Complete a few daily check-ins to see your personalized wellness analytics and trends.
                  </p>
                  <button 
                    onClick={onClose}
                    className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
                  >
                    Start Your First Check-in
                  </button>
                </div>
              )}
              
              {/* Trends Tab */}
              {activeTab === 'trends' && trends && (
                <div className="space-y-6">
                  {/* Stats Overview */}
                  <div className="grid grid-cols-4 gap-4">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">{currentStreak}</div>
                      <div className="text-sm text-blue-800">Day Streak</div>
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">{trends.summary.total_days}</div>
                      <div className="text-sm text-green-800">Total Days</div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 text-center">
                      {React.createElement(getMoodIcon(trends.mood_pattern.dominant), { className: "w-6 h-6 mx-auto", strokeWidth: 2 })}
                      <div className="text-sm text-purple-800 capitalize">{trends.mood_pattern.dominant}</div>
                    </div>
                    <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-amber-600">{trends.mood_pattern.variety}</div>
                      <div className="text-sm text-amber-800">Mood Variety</div>
                    </div>
                  </div>

                  {/* Wellness Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Energy Trend */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-800">Energy Level</h3>
                        {React.createElement(getTrendIcon(trends.energy_trend.direction), { className: "w-5 h-5 text-blue-600", strokeWidth: 2 })}
                      </div>
                      {renderProgressBar(trends.energy_trend.average, 10, 'bg-blue-500')}
                      <p className="text-xs text-gray-600 mt-2">
                        {trends.energy_trend.direction.charAt(0).toUpperCase() + trends.energy_trend.direction.slice(1)} trend
                      </p>
                    </div>

                    {/* Sleep Trend */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-800">Sleep Quality</h3>
                        {React.createElement(getTrendIcon(trends.sleep_trend.direction), { className: "w-5 h-5 text-indigo-600", strokeWidth: 2 })}
                      </div>
                      {renderProgressBar(trends.sleep_trend.average, 10, 'bg-indigo-500')}
                      <p className="text-xs text-gray-600 mt-2">
                        {trends.sleep_trend.direction.charAt(0).toUpperCase() + trends.sleep_trend.direction.slice(1)} trend
                      </p>
                    </div>

                    {/* Stress Trend */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-800">Stress Level</h3>
                        {React.createElement(getTrendIcon(trends.stress_trend.direction, true), { className: "w-5 h-5 text-red-600", strokeWidth: 2 })}
                      </div>
                      {renderProgressBar(trends.stress_trend.average, 10, 
                        trends.stress_trend.direction === 'decreasing' ? 'bg-green-500' : 'bg-red-500')}
                      <p className="text-xs text-gray-600 mt-2">
                        {trends.stress_trend.direction.charAt(0).toUpperCase() + trends.stress_trend.direction.slice(1)} trend
                      </p>
                    </div>
                  </div>

                  {/* Mood Distribution */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-medium text-gray-800 mb-4">Mood Distribution</h3>
                    <div className="grid grid-cols-5 gap-3">
                      {Object.entries(trends.mood_pattern.distribution).map(([mood, count]) => {
                        const MoodIcon = getMoodIcon(mood);
                        return (
                        <div key={mood} className="text-center">
                          <MoodIcon className="w-8 h-8 mx-auto mb-1" strokeWidth={2} />
                          <div className="text-sm font-medium text-gray-700 capitalize">{mood}</div>
                          <div className="text-xs text-gray-500">{count} days</div>
                        </div>
                      );})}
                    </div>
                  </div>
                </div>
              )}

              {/* Insights Tab */}
              {activeTab === 'insights' && (
                <div className="space-y-6">
                  {!insights || (insights.insights && insights.insights.length === 0) ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                      <Lightbulb className="w-16 h-16 mb-4 text-yellow-500" strokeWidth={2} />
                      <h3 className="text-xl font-medium text-gray-800 mb-2">Building Your Insights</h3>
                      <p className="text-gray-600 mb-4 max-w-md">
                        Complete more daily check-ins to unlock AI-powered insights and personalized recommendations.
                      </p>
                      <div className="text-sm text-gray-500">
                        You need at least 3-5 check-ins for meaningful analysis.
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Data Summary */}
                      <div className="bg-primary/5 rounded-xl p-4">
                        <h3 className="font-medium text-gray-800 mb-2">Data Summary</h3>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Total Check-ins: </span>
                            <span className="font-semibold">{insights.data_summary.total_checkins}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Consistency: </span>
                            <span className="font-semibold">{insights.data_summary.consistency_rate}%</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Period: </span>
                            <span className="font-semibold">
                              {insights.data_summary.date_range.from} to {insights.data_summary.date_range.to}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* AI Insights */}
                      <div>
                        <h3 className="font-medium text-gray-800 mb-4">AI-Powered Insights</h3>
                        <div className="space-y-4">
                          {insights.insights.map((insight, index) => (
                            <div key={index} className="border border-gray-200 rounded-xl p-4">
                              <div className="flex items-start space-x-3">
                                <span className="text-2xl">{insight.emoji}</span>
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-800 mb-1">{insight.title}</h4>
                                  <p className="text-sm text-gray-600 mb-2">{insight.observation}</p>
                                  <p className="text-sm text-primary font-medium">{insight.impact}</p>
                                  <div className="flex items-center space-x-2 mt-2">
                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                      {insight.category}
                                    </span>
                                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                      {insight.type}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recommendations */}
                      {insights.recommendations.length > 0 && (
                        <div>
                          <h3 className="font-medium text-gray-800 mb-4">Personalized Recommendations</h3>
                          <div className="space-y-3">
                            {insights.recommendations.map((rec, index) => (
                              <div key={index} className={`border-l-4 pl-4 py-2 ${
                                rec.priority === 'high' ? 'border-red-400 bg-red-50' :
                                rec.priority === 'medium' ? 'border-yellow-400 bg-yellow-50' :
                                'border-green-400 bg-green-50'
                              }`}>
                                <div className="flex items-start space-x-2">
                                  <span className="text-lg">{rec.emoji}</span>
                                  <div className="flex-1">
                                    <h4 className="font-medium text-gray-800">{rec.title}</h4>
                                    <p className="text-sm text-gray-600">{rec.description}</p>
                                    <div className="flex items-center space-x-2 mt-1">
                                      <span className="text-xs bg-white/70 px-2 py-1 rounded">
                                        {rec.priority} priority
                                      </span>
                                      <span className="text-xs bg-white/70 px-2 py-1 rounded">
                                        {rec.category}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Correlations Tab */}
              {activeTab === 'correlations' && trends && insights && (
                <div className="space-y-6">
                  <h3 className="font-medium text-gray-800 mb-4">Wellness Correlations</h3>
                  
                  {/* Sleep-Energy Correlation */}
                  <div className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="flex items-center space-x-1">
                        <BedDouble className="w-6 h-6 text-indigo-600" strokeWidth={2} />
                        <Zap className="w-6 h-6 text-blue-600" strokeWidth={2} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">Sleep Quality ↔ Energy Level</h4>
                        <p className="text-sm text-gray-600">{trends.correlations.sleep_energy.interpretation}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        {renderProgressBar(trends.correlations.sleep_energy.strength, 1, 
                          trends.correlations.sleep_energy.direction === 'positive' ? 'bg-green-500' : 'bg-red-500')}
                      </div>
                      <span className="ml-4 text-sm font-medium">
                        {(trends.correlations.sleep_energy.strength * 100).toFixed(0)}% correlation
                      </span>
                    </div>
                  </div>

                  {/* Stress-Energy Correlation */}
                  <div className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="flex items-center space-x-1">
                        <AlertTriangle className="w-6 h-6 text-orange-600" strokeWidth={2} />
                        <Zap className="w-6 h-6 text-blue-600" strokeWidth={2} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">Stress Level ↔ Energy Level</h4>
                        <p className="text-sm text-gray-600">{trends.correlations.stress_energy.interpretation}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        {renderProgressBar(trends.correlations.stress_energy.strength, 1, 
                          trends.correlations.stress_energy.direction === 'positive' ? 'bg-red-500' : 'bg-green-500')}
                      </div>
                      <span className="ml-4 text-sm font-medium">
                        {(trends.correlations.stress_energy.strength * 100).toFixed(0)}% correlation
                      </span>
                    </div>
                  </div>

                  {/* AI-Discovered Correlations */}
                  {insights.correlations.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-800 mb-3">AI-Discovered Patterns</h4>
                      <div className="space-y-3">
                        {insights.correlations.map((corr, index) => (
                          <div key={index} className="bg-gray-50 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-gray-800 capitalize">
                                {corr.factor1} ↔ {corr.factor2}
                              </span>
                              <span className={`text-sm px-2 py-1 rounded ${
                                corr.strength === 'strong' ? 'bg-green-100 text-green-700' :
                                corr.strength === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {corr.strength} {corr.relationship}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{corr.insight}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 pt-4 mt-6">
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">
              Based on your last {trends?.summary.total_days || 0} check-ins
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WellnessTrends;