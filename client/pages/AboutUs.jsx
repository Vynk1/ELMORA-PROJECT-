import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const AboutUs = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: '💭',
      title: 'Check in daily with mood and thoughts',
      description: 'Track your emotional patterns with mindful daily reflections'
    },
    {
      icon: '📝',
      title: 'Journal and receive AI-powered summaries',
      description: 'Get personalized affirmations and insights from your entries'
    },
    {
      icon: '🎯',
      title: 'Set mindful goals and track streaks',
      description: 'Build sustainable wellness habits with motivating progress tracking'
    },
    {
      icon: '🧘‍♀️',
      title: 'Meditate and practice guided breathing',
      description: 'Access curated mindfulness exercises tailored to your needs'
    },
    {
      icon: '🌱',
      title: 'Grow a virtual plant',
      description: 'Watch your digital garden flourish as your emotional wellness grows'
    },
    {
      icon: '💙',
      title: 'Connect with a safe community',
      description: 'Join a supportive network focused on growth and understanding'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-teal-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 relative overflow-hidden">
        {/* Subtle animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-pink-200/20 to-purple-200/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-gradient-to-br from-teal-200/20 to-pink-200/20 rounded-full blur-3xl animate-float animation-delay-3000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-purple-200/10 to-teal-200/10 rounded-full blur-2xl animate-float animation-delay-6000"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className={`transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            
            {/* Animated plant icon */}
            <div className="flex justify-center mb-6">
              <div className="text-6xl animate-float">🌱</div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-serif font-light text-gray-800 mb-6">
              <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
                About Elmora
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              At <strong className="text-purple-700">Elmora</strong>, we believe emotional well-being deserves the same attention as physical health.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className={`text-center mb-16 transform transition-all duration-1000 delay-300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto">
              Our mission is to make mindfulness and self-growth simple, friendly, and supported by AI. 🌿
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 hover:scale-105 transform ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${600 + index * 100}ms` }}
              >
                <div className="text-4xl mb-4 text-center">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center text-sm leading-relaxed">
                  {feature.description}
                </p>
                <div className="flex justify-center mt-4">
                  <div className="w-12 h-1 bg-gradient-to-r from-pink-400 to-teal-400 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-100/50 to-pink-100/50">
        <div className="max-w-4xl mx-auto text-center">
          <div className={`transform transition-all duration-1000 delay-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8">
              We combine <strong className="text-purple-700">psychology</strong>, <strong className="text-teal-700">AI insights</strong>, and <strong className="text-pink-700">gamified motivation</strong> to help people understand themselves better and build sustainable mental wellness habits.
            </p>
            
            {/* Privacy Message */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/50">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="text-2xl">🔒</span>
                <h3 className="text-xl font-semibold text-gray-800">Your Privacy Matters</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Elmora protects every user's privacy — all personal reflections remain confidential, processed securely, and never shared. <br />
                <strong className="text-purple-700">Your growth stays yours.</strong>
              </p>
            </div>

            {/* Vision */}
            <div className="text-center">
              <h2 className="text-3xl font-serif font-light text-gray-800 mb-4">
                <span className="bg-gradient-to-r from-pink-600 to-teal-600 bg-clip-text text-transparent">
                  Our Vision
                </span>
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                To build a world where technology supports human emotion — with empathy, privacy, and joy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className={`transform transition-all duration-1000 delay-1200 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-gray-800 mb-6">
              Ready to begin your journey?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Join thousands of people discovering emotional wellness with Elmora
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-teal-500 text-white font-semibold rounded-full text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:from-pink-400 hover:via-purple-400 hover:to-teal-400 focus:outline-none focus:ring-4 focus:ring-purple-400/50 group"
            >
              <span>Join Elmora</span>
              <span className="text-xl group-hover:animate-bounce">🌱</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-purple-900/90 to-teal-900/90 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl">🌸</span>
            <span className="font-bold text-xl">Elmora</span>
          </div>
          <p className="text-white/80 mb-6">
            Where Technology Meets Empathy 🌸
          </p>
          <div className="flex justify-center gap-8 text-sm">
            <Link to="/" className="text-white/70 hover:text-white transition-colors hover:underline">
              Home
            </Link>
            <a href="#" className="text-white/70 hover:text-white transition-colors hover:underline">
              Contact
            </a>
            <a href="#" className="text-white/70 hover:text-white transition-colors hover:underline">
              Privacy
            </a>
            <a href="#" className="text-white/70 hover:text-white transition-colors hover:underline">
              Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;