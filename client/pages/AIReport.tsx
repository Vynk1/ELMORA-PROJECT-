import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Lazy load effect components
const ScrollReveal = lazy(() => import('../components/effects/ScrollReveal'));
const ScrollFloat = lazy(() => import('../components/effects/ScrollFloat'));
const TrueFocus = lazy(() => import('../components/effects/TrueFocus'));
const DecryptedText = lazy(() => import('../components/effects/DecryptedText'));
const CountUp = lazy(() => import('../components/effects/CountUp'));

interface PsychologicalTrait {
  score: number;
  analysis: string;
  strengths: string[];
  concerns: string[];
}

interface Recommendation {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

interface AreaOfConcern {
  area: string;
  severity: 'mild' | 'moderate' | 'severe';
  description: string;
  indicators: string[];
}

interface Resource {
  type: string;
  name: string;
  description: string;
  link?: string;
}

interface AIReportData {
  overallStatus: {
    summary: string;
    wellbeingScore: number;
    riskLevel: 'low' | 'moderate' | 'high';
  };
  psychologicalTraits: {
    resilience: PsychologicalTrait;
    emotionalRegulation: PsychologicalTrait;
    stressManagement: PsychologicalTrait;
    growthMindset: PsychologicalTrait;
    selfEsteem: PsychologicalTrait;
    emotionalIntelligence: PsychologicalTrait;
  };
  detailedAnalysis: {
    copingStrategies: string;
    emotionalPatterns: string;
    behavioralTendencies: string;
    cognitivePatterns: string;
  };
  areasOfConcern: AreaOfConcern[];
  recommendations: {
    immediate: Recommendation[];
    shortTerm: Recommendation[];
    longTerm: Recommendation[];
    professionalHelp: {
      recommended: boolean;
      reason?: string;
      type?: string;
    };
  };
  resources: Resource[];
  positiveAspects: string[];
}

const AIReport: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [report, setReport] = useState<AIReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'traits' | 'recommendations' | 'resources'>('overview');

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleMotionChange);
    
    return () => mediaQuery.removeEventListener('change', handleMotionChange);
  }, []);

  // Load report from location state or fetch from API
  useEffect(() => {
    const loadReport = async () => {
      try {
        setLoading(true);
        
        // Check if report data was passed via navigation state
        if (location.state && location.state.report) {
          setReport(location.state.report);
          setLoading(false);
          return;
        }

        // If report ID is in URL params, fetch from API
        const searchParams = new URLSearchParams(location.search);
        const reportId = searchParams.get('id');
        
        if (reportId) {
          const response = await fetch(`${import.meta.env.VITE_SERVER_URL || 'http://localhost:3000'}/api/report/${reportId}`);
          const data = await response.json();
          
          if (data.success) {
            setReport(data.data.report);
          } else {
            setError('Failed to load report');
          }
        } else {
          setError('No report data available');
        }
      } catch (err) {
        console.error('Error loading report:', err);
        setError('Failed to load report');
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, [location]);

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'moderate': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-400 bg-red-50';
      case 'medium': return 'border-yellow-400 bg-yellow-50';
      case 'low': return 'border-green-400 bg-green-50';
      default: return 'border-gray-400 bg-gray-50';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'severe': return 'text-red-700 bg-red-100';
      case 'moderate': return 'text-orange-700 bg-orange-100';
      case 'mild': return 'text-yellow-700 bg-yellow-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-400 to-emerald-500';
    if (score >= 60) return 'from-blue-400 to-cyan-500';
    if (score >= 40) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-pink-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Loading your report...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md text-center shadow-lg">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Report Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'Unable to load the report'}</p>
          <Link
            to="/dashboard"
            className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-2xl font-medium hover:shadow-lg transition-all"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <Suspense fallback={
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-light text-gray-800 mb-4">
              Your Mental Wellbeing Report
            </h1>
          </div>
        }>
          <ScrollReveal duration={0.6} disabled={prefersReducedMotion}>
            <div className="text-center mb-12">
              <div className="text-6xl mb-4">🧠</div>
              <h1 className="text-4xl md:text-5xl font-light text-gray-800 mb-4">
                Your Mental Wellbeing Report
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                A comprehensive analysis of your psychological profile and personalized recommendations
              </p>
            </div>
          </ScrollReveal>
        </Suspense>

        {/* Overall Status Card */}
        <Suspense fallback={
          <div className="bg-white rounded-3xl p-8 mb-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Overall Wellbeing</h2>
          </div>
        }>
          <ScrollFloat duration={0.7} delay={0.1} disabled={prefersReducedMotion}>
            <div className="bg-white rounded-3xl p-8 mb-8 shadow-lg border-2 border-purple-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Overall Wellbeing</h2>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${getRiskLevelColor(report.overallStatus.riskLevel)}`}>
                  {report.overallStatus.riskLevel.toUpperCase()} RISK
                </span>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Score Circle */}
                <div className="flex flex-col items-center">
                  <div className="relative w-48 h-48">
                    <svg className="transform -rotate-90 w-48 h-48">
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="none"
                        className="text-gray-200"
                      />
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 88}`}
                        strokeDashoffset={`${2 * Math.PI * 88 * (1 - report.overallStatus.wellbeingScore / 100)}`}
                        className={`${getScoreColor(report.overallStatus.wellbeingScore)} transition-all duration-1000`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <Suspense fallback={
                        <span className={`text-4xl font-bold ${getScoreColor(report.overallStatus.wellbeingScore)}`}>
                          {report.overallStatus.wellbeingScore}
                        </span>
                      }>
                        <CountUp
                          end={report.overallStatus.wellbeingScore}
                          duration={2000}
                          className={`text-4xl font-bold ${getScoreColor(report.overallStatus.wellbeingScore)}`}
                          disabled={prefersReducedMotion}
                        />
                      </Suspense>
                      <span className="text-gray-500 text-sm">out of 100</span>
                    </div>
                  </div>
                  <p className="text-center text-gray-600 mt-4 font-medium">Wellbeing Score</p>
                </div>

                {/* Summary */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Summary</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {report.overallStatus.summary}
                  </p>
                </div>
              </div>
            </div>
          </ScrollFloat>
        </Suspense>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white rounded-2xl p-2 shadow-md">
          {[
            { key: 'overview', label: 'Overview', icon: '📊' },
            { key: 'traits', label: 'Psychological Traits', icon: '🧩' },
            { key: 'recommendations', label: 'Recommendations', icon: '💡' },
            { key: 'resources', label: 'Resources', icon: '📚' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 min-w-[150px] px-4 py-3 rounded-xl font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              {/* Detailed Analysis */}
              <Suspense fallback={<div className="bg-white rounded-3xl p-8 shadow-lg">Loading...</div>}>
                <ScrollFloat duration={0.7} delay={0.2} disabled={prefersReducedMotion}>
                  <div className="bg-white rounded-3xl p-8 shadow-lg">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                      <span className="text-3xl mr-3">🔍</span>
                      Detailed Analysis
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                      {Object.entries(report.detailedAnalysis).map(([key, value], idx) => (
                        <div key={key} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6">
                          <h3 className="text-lg font-semibold text-gray-800 mb-3 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </h3>
                          <p className="text-gray-700 leading-relaxed">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollFloat>
              </Suspense>

              {/* Areas of Concern */}
              {report.areasOfConcern && report.areasOfConcern.length > 0 && (
                <Suspense fallback={<div className="bg-white rounded-3xl p-8 shadow-lg">Loading...</div>}>
                  <ScrollFloat duration={0.7} delay={0.3} disabled={prefersReducedMotion}>
                    <div className="bg-white rounded-3xl p-8 shadow-lg">
                      <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                        <span className="text-3xl mr-3">⚠️</span>
                        Areas of Concern
                      </h2>
                      <div className="space-y-4">
                        {report.areasOfConcern.map((concern, idx) => (
                          <div key={idx} className="border-l-4 border-orange-400 bg-orange-50 rounded-r-2xl p-6">
                            <div className="flex items-start justify-between mb-3">
                              <h3 className="text-lg font-semibold text-gray-800">{concern.area}</h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(concern.severity)}`}>
                                {concern.severity.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-gray-700 mb-3">{concern.description}</p>
                            {concern.indicators && concern.indicators.length > 0 && (
                              <div className="mt-3">
                                <p className="text-sm font-medium text-gray-600 mb-2">Indicators:</p>
                                <ul className="list-disc list-inside space-y-1">
                                  {concern.indicators.map((indicator, i) => (
                                    <li key={i} className="text-sm text-gray-600">{indicator}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </ScrollFloat>
                </Suspense>
              )}

              {/* Positive Aspects */}
              {report.positiveAspects && report.positiveAspects.length > 0 && (
                <Suspense fallback={<div className="bg-white rounded-3xl p-8 shadow-lg">Loading...</div>}>
                  <ScrollFloat duration={0.7} delay={0.4} disabled={prefersReducedMotion}>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 shadow-lg border-2 border-green-200">
                      <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                        <span className="text-3xl mr-3">✨</span>
                        Your Strengths
                      </h2>
                      <div className="grid md:grid-cols-2 gap-4">
                        {report.positiveAspects.map((aspect, idx) => (
                          <div key={idx} className="flex items-start space-x-3 bg-white rounded-xl p-4">
                            <span className="text-2xl">💪</span>
                            <p className="text-gray-700 flex-1">{aspect}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </ScrollFloat>
                </Suspense>
              )}
            </>
          )}

          {/* Psychological Traits Tab */}
          {activeTab === 'traits' && (
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(report.psychologicalTraits).map(([traitName, trait], idx) => (
                <Suspense key={traitName} fallback={
                  <div className="bg-white rounded-3xl p-6 shadow-lg">Loading...</div>
                }>
                  <ScrollFloat duration={0.6} delay={idx * 0.1} disabled={prefersReducedMotion}>
                    <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-gray-800 capitalize">
                          {traitName.replace(/([A-Z])/g, ' $1').trim()}
                        </h3>
                        <Suspense fallback={
                          <span className={`text-2xl font-bold ${getScoreColor(trait.score)}`}>
                            {trait.score}
                          </span>
                        }>
                          <CountUp
                            end={trait.score}
                            duration={1500}
                            className={`text-2xl font-bold ${getScoreColor(trait.score)}`}
                            disabled={prefersReducedMotion}
                          />
                        </Suspense>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                        <div
                          className={`h-3 rounded-full bg-gradient-to-r ${getScoreGradient(trait.score)} transition-all duration-1000`}
                          style={{ width: `${trait.score}%` }}
                        />
                      </div>

                      <p className="text-gray-600 mb-4 leading-relaxed">{trait.analysis}</p>

                      {trait.strengths && trait.strengths.length > 0 && (
                        <div className="mb-3">
                          <p className="text-sm font-semibold text-green-700 mb-2">✓ Strengths:</p>
                          <ul className="space-y-1">
                            {trait.strengths.map((strength, i) => (
                              <li key={i} className="text-sm text-gray-600 flex items-start">
                                <span className="text-green-500 mr-2">•</span>
                                {strength}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {trait.concerns && trait.concerns.length > 0 && (
                        <div>
                          <p className="text-sm font-semibold text-orange-700 mb-2">⚠ Areas to Address:</p>
                          <ul className="space-y-1">
                            {trait.concerns.map((concern, i) => (
                              <li key={i} className="text-sm text-gray-600 flex items-start">
                                <span className="text-orange-500 mr-2">•</span>
                                {concern}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </ScrollFloat>
                </Suspense>
              ))}
            </div>
          )}

          {/* Recommendations Tab */}
          {activeTab === 'recommendations' && (
            <>
              {/* Immediate Recommendations */}
              {report.recommendations.immediate && report.recommendations.immediate.length > 0 && (
                <Suspense fallback={<div className="bg-white rounded-3xl p-8 shadow-lg">Loading...</div>}>
                  <ScrollFloat duration={0.7} delay={0.1} disabled={prefersReducedMotion}>
                    <div className="bg-white rounded-3xl p-8 shadow-lg">
                      <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                        <span className="text-3xl mr-3">🚀</span>
                        Immediate Actions
                      </h2>
                      <div className="space-y-4">
                        {report.recommendations.immediate.map((rec, idx) => (
                          <div key={idx} className={`border-l-4 rounded-r-2xl p-6 ${getPriorityColor(rec.priority)}`}>
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-lg font-semibold text-gray-800">{rec.title}</h3>
                              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-white">
                                {rec.priority}
                              </span>
                            </div>
                            <p className="text-gray-700">{rec.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </ScrollFloat>
                </Suspense>
              )}

              {/* Short-term Recommendations */}
              {report.recommendations.shortTerm && report.recommendations.shortTerm.length > 0 && (
                <Suspense fallback={<div className="bg-white rounded-3xl p-8 shadow-lg">Loading...</div>}>
                  <ScrollFloat duration={0.7} delay={0.2} disabled={prefersReducedMotion}>
                    <div className="bg-white rounded-3xl p-8 shadow-lg">
                      <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                        <span className="text-3xl mr-3">📅</span>
                        Short-term Goals (1-3 months)
                      </h2>
                      <div className="space-y-4">
                        {report.recommendations.shortTerm.map((rec, idx) => (
                          <div key={idx} className={`border-l-4 rounded-r-2xl p-6 ${getPriorityColor(rec.priority)}`}>
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-lg font-semibold text-gray-800">{rec.title}</h3>
                              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-white">
                                {rec.priority}
                              </span>
                            </div>
                            <p className="text-gray-700">{rec.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </ScrollFloat>
                </Suspense>
              )}

              {/* Long-term Recommendations */}
              {report.recommendations.longTerm && report.recommendations.longTerm.length > 0 && (
                <Suspense fallback={<div className="bg-white rounded-3xl p-8 shadow-lg">Loading...</div>}>
                  <ScrollFloat duration={0.7} delay={0.3} disabled={prefersReducedMotion}>
                    <div className="bg-white rounded-3xl p-8 shadow-lg">
                      <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                        <span className="text-3xl mr-3">🌟</span>
                        Long-term Development
                      </h2>
                      <div className="space-y-4">
                        {report.recommendations.longTerm.map((rec, idx) => (
                          <div key={idx} className={`border-l-4 rounded-r-2xl p-6 ${getPriorityColor(rec.priority)}`}>
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-lg font-semibold text-gray-800">{rec.title}</h3>
                              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-white">
                                {rec.priority}
                              </span>
                            </div>
                            <p className="text-gray-700">{rec.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </ScrollFloat>
                </Suspense>
              )}

              {/* Professional Help */}
              {report.recommendations.professionalHelp && report.recommendations.professionalHelp.recommended && (
                <Suspense fallback={<div className="bg-white rounded-3xl p-8 shadow-lg">Loading...</div>}>
                  <ScrollFloat duration={0.7} delay={0.4} disabled={prefersReducedMotion}>
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 shadow-lg border-2 border-blue-200">
                      <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                        <span className="text-3xl mr-3">🏥</span>
                        Professional Support Recommended
                      </h2>
                      <div className="bg-white rounded-2xl p-6">
                        <p className="text-gray-700 mb-4">{report.recommendations.professionalHelp.reason}</p>
                        {report.recommendations.professionalHelp.type && (
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-gray-700">Suggested type:</span>
                            <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                              {report.recommendations.professionalHelp.type}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </ScrollFloat>
                </Suspense>
              )}
            </>
          )}

          {/* Resources Tab */}
          {activeTab === 'resources' && report.resources && report.resources.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {report.resources.map((resource, idx) => (
                <Suspense key={idx} fallback={
                  <div className="bg-white rounded-2xl p-6 shadow-lg">Loading...</div>
                }>
                  <ScrollFloat duration={0.6} delay={idx * 0.1} disabled={prefersReducedMotion}>
                    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all h-full flex flex-col">
                      <div className="text-3xl mb-3">
                        {resource.type === 'book' && '📚'}
                        {resource.type === 'app' && '📱'}
                        {resource.type === 'technique' && '🧘'}
                        {resource.type === 'exercise' && '💪'}
                      </div>
                      <span className="text-xs font-semibold text-purple-600 uppercase mb-2">{resource.type}</span>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{resource.name}</h3>
                      <p className="text-gray-600 text-sm mb-4 flex-1">{resource.description}</p>
                      {resource.link && (
                        <a
                          href={resource.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl text-sm font-medium hover:shadow-md transition-all text-center"
                        >
                          Learn More →
                        </a>
                      )}
                    </div>
                  </ScrollFloat>
                </Suspense>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <Suspense fallback={
          <div className="mt-12 flex flex-wrap gap-4 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-2xl font-medium shadow-lg">
              Download Report
            </button>
          </div>
        }>
          <ScrollFloat duration={0.7} delay={0.5} disabled={prefersReducedMotion}>
            <div className="mt-12 flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => window.print()}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-2xl font-medium hover:shadow-lg transition-all"
              >
                📄 Download Report
              </button>
              <Link
                to="/meditation"
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-medium hover:shadow-lg transition-all"
              >
                🧘 Start Meditation
              </Link>
              <Link
                to="/journal"
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl font-medium hover:shadow-lg transition-all"
              >
                📖 Journal Your Thoughts
              </Link>
              <Link
                to="/dashboard"
                className="px-8 py-4 bg-white text-gray-700 rounded-2xl font-medium hover:shadow-lg transition-all border-2 border-gray-200"
              >
                ← Back to Dashboard
              </Link>
            </div>
          </ScrollFloat>
        </Suspense>

        {/* Footer Note */}
        <div className="mt-12 text-center text-gray-600 text-sm">
          <p className="mb-2">
            This report is generated by AI and should be used as a guide for self-reflection.
          </p>
          <p>
            For professional mental health support, please consult with a qualified healthcare provider.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIReport;
