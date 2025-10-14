import React, { useState, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateHealthReport } from '../lib/supabaseApi';

// Lazy load effects
const ScrollReveal = lazy(() => import('../components/effects/ScrollReveal'));
const ScrollFloat = lazy(() => import('../components/effects/ScrollFloat'));
const DecryptedText = lazy(() => import('../components/effects/DecryptedText'));

const QUESTIONS = [
  {
    id: 1,
    question: "When you make a mistake or face a setback, how do you typically respond?",
    placeholder: "Share your thoughts on how you handle setbacks...",
    icon: "🎯"
  },
  {
    id: 2,
    question: "When someone offers you critical feedback, what is your usual reaction?",
    placeholder: "Describe your response to receiving feedback...",
    icon: "💬"
  },
  {
    id: 3,
    question: "When you feel angry or upset, how do you typically react?",
    placeholder: "Tell us about how you manage difficult emotions...",
    icon: "😤"
  },
  {
    id: 4,
    question: "When you're under a lot of stress or have many tasks to do, how do you handle it?",
    placeholder: "Share your stress management approach...",
    icon: "⚡"
  },
  {
    id: 5,
    question: "Which statement best describes your view of your personal abilities?",
    placeholder: "Express your beliefs about your abilities and potential...",
    icon: "💪"
  },
  {
    id: 6,
    question: "When something important doesn't go the way you hoped (like not getting a job or failing a test), how do you usually react?",
    placeholder: "Describe how you cope with disappointment...",
    icon: "🎲"
  },
  {
    id: 7,
    question: "When you receive praise or a compliment for something you did, how do you feel or respond?",
    placeholder: "Share how you receive positive feedback...",
    icon: "⭐"
  }
];

const HealthAssessment: React.FC = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(7).fill(''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleMotionChange);
    
    return () => mediaQuery.removeEventListener('change', handleMotionChange);
  }, []);

  const handleAnswerChange = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
    setError(null);
  };

  const handleNext = () => {
    if (!answers[currentQuestion]?.trim()) {
      setError('Please provide an answer before continuing');
      return;
    }
    
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (!answers[currentQuestion]?.trim()) {
      setError('Please answer this question before submitting');
      return;
    }

    // Check all answers are filled
    const emptyAnswers = answers.filter(a => !a || !a.trim());
    if (emptyAnswers.length > 0) {
      setError('Please answer all questions before submitting');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Generate report
      const reportData = await generateHealthReport(answers);
      
      // Navigate to report page with the data
      navigate('/ai-report', { 
        state: { 
          report: reportData.report,
          reportId: reportData.reportId,
          timestamp: reportData.timestamp
        }
      });
    } catch (err: any) {
      console.error('Error generating report:', err);
      setError(err.message || 'Failed to generate report. Please try again.');
      setLoading(false);
    }
  };

  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;
  const currentQ = QUESTIONS[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <Suspense fallback={
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-light text-gray-800 mb-4">
              Mental Wellbeing Assessment
            </h1>
          </div>
        }>
          <ScrollReveal duration={0.6} disabled={prefersReducedMotion}>
            <div className="text-center mb-12">
              <div className="text-6xl mb-4">🧠</div>
              <h1 className="text-4xl md:text-5xl font-light text-gray-800 mb-4">
                Mental Wellbeing Assessment
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Take a few minutes to reflect on your mental health. Your honest responses will help us provide personalized insights.
              </p>
            </div>
          </ScrollReveal>
        </Suspense>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Question {currentQuestion + 1} of {QUESTIONS.length}
            </span>
            <span className="text-sm font-medium text-purple-600">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-3 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <Suspense fallback={
          <div className="bg-white rounded-3xl p-8 shadow-2xl mb-8">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">{currentQ.icon}</div>
              <h2 className="text-2xl md:text-3xl font-medium text-gray-800 mb-6">
                {currentQ.question}
              </h2>
            </div>
          </div>
        }>
          <ScrollFloat 
            duration={0.7} 
            delay={0.1} 
            disabled={prefersReducedMotion}
            key={currentQuestion}
          >
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl mb-8 border-2 border-purple-100">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4 animate-bounce">{currentQ.icon}</div>
                <Suspense fallback={
                  <h2 className="text-2xl md:text-3xl font-medium text-gray-800 mb-6">
                    {currentQ.question}
                  </h2>
                }>
                  {!prefersReducedMotion ? (
                    <DecryptedText
                      text={currentQ.question}
                      className="text-2xl md:text-3xl font-medium text-gray-800 mb-6"
                    />
                  ) : (
                    <h2 className="text-2xl md:text-3xl font-medium text-gray-800 mb-6">
                      {currentQ.question}
                    </h2>
                  )}
                </Suspense>
              </div>

              {/* Answer Input */}
              <div className="mb-6">
                <textarea
                  value={answers[currentQuestion]}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  placeholder={currentQ.placeholder}
                  rows={6}
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all resize-none text-gray-700 placeholder-gray-400"
                />
                <div className="flex justify-between items-center mt-2 px-2">
                  <span className="text-sm text-gray-500">
                    {answers[currentQuestion]?.length || 0} characters
                  </span>
                  {answers[currentQuestion]?.trim() && (
                    <span className="text-sm text-green-600 font-medium">✓ Answer saved</span>
                  )}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-xl">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  className={`flex-1 py-4 rounded-2xl font-medium transition-all ${
                    currentQuestion === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-md'
                  }`}
                >
                  ← Previous
                </button>

                {currentQuestion < QUESTIONS.length - 1 ? (
                  <button
                    onClick={handleNext}
                    disabled={!answers[currentQuestion]?.trim()}
                    className={`flex-1 py-4 rounded-2xl font-medium transition-all ${
                      answers[currentQuestion]?.trim()
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:scale-105'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={loading || !answers[currentQuestion]?.trim()}
                    className={`flex-1 py-4 rounded-2xl font-medium transition-all ${
                      loading || !answers[currentQuestion]?.trim()
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg hover:scale-105'
                    }`}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Generating Report...
                      </span>
                    ) : (
                      '✓ Submit Assessment'
                    )}
                  </button>
                )}
              </div>
            </div>
          </ScrollFloat>
        </Suspense>

        {/* Question Navigator */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {QUESTIONS.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => setCurrentQuestion(idx)}
              disabled={loading}
              className={`w-10 h-10 rounded-full font-medium transition-all ${
                idx === currentQuestion
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white scale-110 shadow-lg'
                  : answers[idx]?.trim()
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-white text-gray-400 hover:bg-gray-100 border-2 border-gray-200'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        {/* Info Card */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-100">
          <div className="flex items-start space-x-4">
            <div className="text-3xl">💡</div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Be Honest and Thoughtful</h3>
              <p className="text-gray-600 text-sm">
                There are no right or wrong answers. The more honest and detailed your responses, 
                the more accurate and helpful your personalized report will be. Your responses are 
                private and secure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthAssessment;
