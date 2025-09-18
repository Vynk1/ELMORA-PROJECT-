import React, { useState, lazy, Suspense, useEffect } from "react";

// Lazy load effect components
const RotatingText = lazy(() => import('../components/effects/RotatingText'));
const Magnet = lazy(() => import('../components/effects/Magnet'));
const ClickSpark = lazy(() => import('../components/effects/ClickSpark'));
const FallingText = lazy(() => import('../components/effects/FallingText'));
const ScrollReveal = lazy(() => import('../components/effects/ScrollReveal'));

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  category: "interests" | "personality" | "lifestyle" | "values";
}

interface UserMatch {
  id: string;
  name: string;
  avatar: string;
  matchPercentage: number;
  commonInterests: string[];
  location: string;
  bio: string;
  lastActive: string;
}

const Friends: React.FC = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [currentStep, setCurrentStep] = useState<
    "welcome" | "quiz" | "results" | "matches"
  >("welcome");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [matches, setMatches] = useState<UserMatch[]>([]);
  const [requestSent, setRequestSent] = useState<{[key: string]: boolean}>({});
  const [sparkTrigger, setSparkTrigger] = useState(0);

  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: "What's your favorite way to spend a weekend?",
      options: [
        "Reading a book",
        "Outdoor adventures",
        "Social gatherings",
        "Creative projects",
      ],
      category: "lifestyle",
    },
    {
      id: 2,
      question: "Which activity helps you relax the most?",
      options: [
        "Meditation/Yoga",
        "Listening to music",
        "Exercise/Sports",
        "Watching movies",
      ],
      category: "interests",
    },
    {
      id: 3,
      question: "How do you prefer to communicate with friends?",
      options: [
        "Face-to-face conversations",
        "Text messages",
        "Voice/Video calls",
        "Social media",
      ],
      category: "personality",
    },
    {
      id: 4,
      question: "What motivates you most in life?",
      options: [
        "Personal growth",
        "Helping others",
        "Achievement",
        "Adventure",
      ],
      category: "values",
    },
    {
      id: 5,
      question: "Which environment do you thrive in?",
      options: [
        "Quiet and peaceful",
        "Busy and energetic",
        "Natural settings",
        "Cozy indoor spaces",
      ],
      category: "personality",
    },
    {
      id: 6,
      question: "How do you handle stress?",
      options: [
        "Talk to friends/family",
        "Spend time alone",
        "Exercise or physical activity",
        "Creative expression",
      ],
      category: "personality",
    },
    {
      id: 7,
      question: "What's most important in a friendship?",
      options: [
        "Trust and loyalty",
        "Fun and laughter",
        "Deep conversations",
        "Shared experiences",
      ],
      category: "values",
    },
    {
      id: 8,
      question: "Which hobby interests you most?",
      options: [
        "Cooking/Baking",
        "Photography",
        "Music/Instruments",
        "Gardening",
      ],
      category: "interests",
    },
    {
      id: 9,
      question: "How do you like to learn new things?",
      options: [
        "Reading and research",
        "Hands-on experience",
        "Group discussions",
        "Online courses",
      ],
      category: "lifestyle",
    },
    {
      id: 10,
      question: "What's your ideal social gathering size?",
      options: [
        "One-on-one",
        "Small group (3-5)",
        "Medium group (6-10)",
        "Large gatherings",
      ],
      category: "personality",
    },
  ];

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleMotionChange);
    
    return () => mediaQuery.removeEventListener('change', handleMotionChange);
  }, []);

  const generateMatches = () => {
    // Simulate matching algorithm based on answers
    const potentialMatches: UserMatch[] = [
      {
        id: "1",
        name: "Sarah Chen",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        matchPercentage: 92,
        commonInterests: ["Meditation", "Reading", "Creative projects"],
        location: "San Francisco, CA",
        bio: "Love mindfulness, books, and meaningful conversations. Always looking to grow!",
        lastActive: "2 hours ago",
      },
      {
        id: "2",
        name: "Alex Rivera",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
        matchPercentage: 88,
        commonInterests: ["Exercise", "Outdoor adventures", "Music"],
        location: "Denver, CO",
        bio: "Fitness enthusiast who loves hiking and discovering new music genres.",
        lastActive: "1 day ago",
      },
      {
        id: "3",
        name: "Maya Patel",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maya",
        matchPercentage: 85,
        commonInterests: ["Cooking", "Personal growth", "Deep conversations"],
        location: "Austin, TX",
        bio: "Passionate about cooking, personal development, and authentic connections.",
        lastActive: "5 hours ago",
      },
      {
        id: "4",
        name: "Jordan Kim",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan",
        matchPercentage: 82,
        commonInterests: ["Photography", "Creative expression", "Small groups"],
        location: "Portland, OR",
        bio: "Photographer and creative soul. Love intimate gatherings and art discussions.",
        lastActive: "3 hours ago",
      },
      {
        id: "5",
        name: "Taylor Brooks",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor",
        matchPercentage: 79,
        commonInterests: ["Helping others", "Social gatherings", "Trust"],
        location: "Chicago, IL",
        bio: "Community volunteer who values loyalty and enjoys bringing people together.",
        lastActive: "6 hours ago",
      },
    ];
    setMatches(potentialMatches);
    setCurrentStep("matches");
  };

  const handleAnswer = (answer: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion]: answer }));

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setCurrentStep("results");
      setTimeout(() => {
        generateMatches();
      }, 2000);
    }
  };

  const sendFriendRequest = (userId: string) => {
    setRequestSent(prev => ({ ...prev, [userId]: true }));
    setSparkTrigger(prev => prev + 1);
    // Here you would typically call an API to send the friend request
  };

  const skipUser = (userId: string) => {
    setMatches((prev) => prev.filter((match) => match.id !== userId));
  };

  // Welcome Step
  if (currentStep === "welcome") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center">
          <div className="text-6xl mb-8">👥</div>
          <h1 className="text-4xl font-light text-gray-800 mb-6">
            Find Your Tribe
          </h1>
          <div className="text-lg text-gray-600 mb-6 leading-relaxed">
            Connect with like-minded people who share your interests and values.
            Our thoughtful matching process helps you find meaningful
            friendships based on compatibility and shared goals.
          </div>
          <div className="text-primary font-medium mb-8">
            <Suspense fallback="Share • Support • Grow">
              <RotatingText 
                texts={['Share', 'Support', 'Grow']} 
                interval={2500} 
                disabled={prefersReducedMotion}
                className="text-primary"
              />
            </Suspense>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-lg mb-8">
            <h2 className="text-xl font-medium text-gray-800 mb-4">
              How it works:
            </h2>
            <div className="space-y-4 text-left">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">📝</span>
                <div>
                  <h3 className="font-medium text-gray-800">
                    Answer 10 questions
                  </h3>
                  <p className="text-sm text-gray-600">
                    Help us understand your personality and interests
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-2xl">🔍</span>
                <div>
                  <h3 className="font-medium text-gray-800">Get matched</h3>
                  <p className="text-sm text-gray-600">
                    We'll find people with similar values and goals
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-2xl">💬</span>
                <div>
                  <h3 className="font-medium text-gray-800">Connect safely</h3>
                  <p className="text-sm text-gray-600">
                    Send friend requests and start meaningful conversations
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setCurrentStep("quiz")}
            className="bg-primary text-white px-8 py-4 rounded-2xl font-medium text-lg hover:bg-primary/90 transition-colors"
          >
            Start Personality Quiz
          </button>
        </div>
      </div>
    );
  }

  // Quiz Step
  if (currentStep === "quiz") {
    const question = quizQuestions[currentQuestion];
    const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>
                Question {currentQuestion + 1} of {quizQuestions.length}
              </span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <h2 className="text-2xl font-light text-gray-800 mb-8 text-center">
              {question.question}
            </h2>

            <div className="space-y-4">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className="w-full p-4 text-left bg-gray-50 hover:bg-primary hover:text-white rounded-2xl transition-colors border border-gray-200 hover:border-primary"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Results Step
  if (currentStep === "results") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-50 to-purple-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-6 animate-bounce">🎉</div>
          <h1 className="text-3xl font-light text-gray-800 mb-4">
            Perfect! We're finding your matches...
          </h1>
          <p className="text-gray-600 mb-8">
            Analyzing your responses to find the best compatible friends for
            you.
          </p>

          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
            <div
              className="w-3 h-3 bg-primary rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-3 h-3 bg-primary rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  // Matches Step
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 pt-4">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light text-gray-800 mb-4">
            Your Friend Matches
          </h1>
          <p className="text-lg text-gray-600">
            We found {matches.length} people who share your interests and values
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {matches.map((match) => (
            <Suspense key={match.id} fallback={
              <div className="bg-white rounded-3xl p-6 shadow-lg">
                <div className="flex items-start space-x-4 mb-4">
                  <img
                    src={match.avatar}
                    alt={match.name}
                    className="w-16 h-16 rounded-full bg-gray-200"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-medium text-gray-800">
                      {match.name}
                    </h3>
                    <p className="text-sm text-gray-600">{match.location}</p>
                    <p className="text-xs text-gray-500">
                      Active {match.lastActive}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {match.matchPercentage}%
                    </div>
                    <div className="text-xs text-gray-600">Match</div>
                  </div>
                </div>
              </div>
            }>
              <ScrollReveal duration={0.6} delay={0.1} disabled={prefersReducedMotion}>
                <Magnet strength={0.15} disabled={prefersReducedMotion}>
                  <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex items-start space-x-4 mb-4">
                      <img
                        src={match.avatar}
                        alt={match.name}
                        className="w-16 h-16 rounded-full bg-gray-200"
                      />
                      <div className="flex-1">
                        <h3 className="text-xl font-medium text-gray-800">
                          {match.name}
                        </h3>
                        <p className="text-sm text-gray-600">{match.location}</p>
                        <p className="text-xs text-gray-500">
                          Active {match.lastActive}
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {match.matchPercentage}%
                        </div>
                        <div className="text-xs text-gray-600">Match</div>
                      </div>
                    </div>

              <p className="text-gray-700 mb-4 text-sm">{match.bio}</p>

              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-800 mb-2">
                  Common Interests:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {match.commonInterests.map((interest, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

                    <div className="flex space-x-3">
                      <Suspense fallback={
                        <button
                          onClick={() => sendFriendRequest(match.id)}
                          className="flex-1 bg-primary text-white py-3 rounded-2xl font-medium hover:bg-primary/90 transition-colors"
                        >
                          {requestSent[match.id] ? 'Request Sent!' : 'Send Request'}
                        </button>
                      }>
                        <ClickSpark 
                          trigger={sparkTrigger} 
                          disabled={prefersReducedMotion}
                          color="#10b981"
                        >
                          <button
                            onClick={() => sendFriendRequest(match.id)}
                            disabled={requestSent[match.id]}
                            className={`flex-1 py-3 rounded-2xl font-medium transition-colors ${
                              requestSent[match.id] 
                                ? 'bg-green-500 text-white cursor-not-allowed'
                                : 'bg-primary text-white hover:bg-primary/90'
                            }`}
                          >
                            {requestSent[match.id] ? 'Request Sent! ✓' : 'Send Request'}
                          </button>
                        </ClickSpark>
                      </Suspense>
                      <button
                        onClick={() => skipUser(match.id)}
                        className="px-6 py-3 bg-gray-100 text-gray-600 rounded-2xl hover:bg-gray-200 transition-colors"
                      >
                        Skip
                      </button>
                    </div>
                  </div>
                </Magnet>
              </ScrollReveal>
            </Suspense>
          ))}
        </div>

        {matches.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              No more matches for now
            </h3>
            <p className="text-gray-600 mb-6">
              Check back later for new potential friends!
            </p>
            <button
              onClick={() => {
                setCurrentStep("welcome");
                setCurrentQuestion(0);
                setAnswers({});
              }}
              className="bg-primary text-white px-6 py-3 rounded-2xl font-medium hover:bg-primary/90"
            >
              Retake Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Friends;
