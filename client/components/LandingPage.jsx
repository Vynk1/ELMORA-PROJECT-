import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navbar />
      
      {/* Dynamic Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-teal-800">
        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-teal-400/30 to-pink-400/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-purple-400/30 rounded-full blur-3xl animate-float animation-delay-3000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-purple-400/10 to-teal-400/20 rounded-full blur-2xl animate-float animation-delay-6000"></div>
        
        {/* Subtle particle effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-float"></div>
          <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-pink-300/30 rounded-full animate-float animation-delay-2000"></div>
          <div className="absolute top-1/2 left-3/4 w-3 h-3 bg-teal-300/20 rounded-full animate-float animation-delay-4000"></div>
          <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-purple-300/25 rounded-full animate-float animation-delay-5000"></div>
        </div>
        
        {/* Gradient overlay for text visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/60"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className={`text-center max-w-4xl mx-auto transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          
          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light mb-6 text-white leading-tight text-shadow-lg">
            <span className="block font-serif bg-gradient-to-r from-white via-pink-100 to-teal-100 bg-clip-text text-transparent drop-shadow-2xl">
              Emotional Wellness
            </span>
            <span className="block font-serif bg-gradient-to-r from-teal-200 via-purple-200 to-pink-200 bg-clip-text text-transparent drop-shadow-2xl mt-2">
              Redefined
            </span>
          </h1>

          {/* Subtext */}
          <p className={`text-lg md:text-xl lg:text-2xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed font-light transform transition-all duration-1000 delay-300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            Where technology meets empathy. Discover mindful growth, AI-powered insights, and a supportive community designed for your emotional well-being.
          </p>

          {/* CTA Button */}
          <div className={`transform transition-all duration-1000 delay-600 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <Link
              to="/login"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-teal-500 via-purple-500 to-pink-500 text-white font-semibold rounded-full text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:from-teal-400 hover:via-purple-400 hover:to-pink-400 focus:outline-none focus:ring-4 focus:ring-purple-400/50 group"
            >
              <span>Start Your Journey</span>
              <span className="text-2xl group-hover:animate-bounce">🌿</span>
            </Link>
          </div>

          {/* Additional Info */}
          <div className={`mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto transform transition-all duration-1000 delay-900 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <div className="text-center">
              <div className="text-3xl mb-2">🧘‍♀️</div>
              <h3 className="text-white font-semibold mb-1">Mindful Check-ins</h3>
              <p className="text-white/70 text-sm">Daily mood tracking with AI insights</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🌱</div>
              <h3 className="text-white font-semibold mb-1">Growth Tracking</h3>
              <p className="text-white/70 text-sm">Visualize your emotional progress</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">💙</div>
              <h3 className="text-white font-semibold mb-1">Safe Community</h3>
              <p className="text-white/70 text-sm">Connect with supportive peers</p>
            </div>
          </div>
        </div>
      </div>

      {/* About Us Section */}
      <section className="relative z-10 py-20 px-4 bg-gradient-to-r from-purple-900/20 to-teal-900/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="text-6xl animate-float">🌱</div>
            </div>
            <h2 className="text-5xl font-serif font-light text-white mb-6">
              <span className="bg-gradient-to-r from-pink-200 via-purple-200 to-teal-200 bg-clip-text text-transparent drop-shadow-2xl">
                About Elmora
              </span>
            </h2>
            <p className="text-xl text-white/90 leading-relaxed max-w-3xl mx-auto">
              At <strong className="text-purple-200">Elmora</strong>, we believe emotional well-being deserves the same attention as physical health. Our mission is to make mindfulness and self-growth simple, friendly, and supported by AI. 🌿
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-4xl mb-4 text-center">💭</div>
              <h3 className="text-lg font-semibold text-white mb-3 text-center">
                Check in daily with mood and thoughts
              </h3>
              <p className="text-white/70 text-center text-sm leading-relaxed">
                Track your emotional patterns with mindful daily reflections
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-4xl mb-4 text-center">📝</div>
              <h3 className="text-lg font-semibold text-white mb-3 text-center">
                Journal and receive AI-powered summaries
              </h3>
              <p className="text-white/70 text-center text-sm leading-relaxed">
                Get personalized affirmations and insights from your entries
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-4xl mb-4 text-center">🎯</div>
              <h3 className="text-lg font-semibold text-white mb-3 text-center">
                Set mindful goals and track streaks
              </h3>
              <p className="text-white/70 text-center text-sm leading-relaxed">
                Build sustainable wellness habits with motivating progress tracking
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-4xl mb-4 text-center">🧘‍♀️</div>
              <h3 className="text-lg font-semibold text-white mb-3 text-center">
                Meditate and practice guided breathing
              </h3>
              <p className="text-white/70 text-center text-sm leading-relaxed">
                Access curated mindfulness exercises tailored to your needs
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-4xl mb-4 text-center">🌱</div>
              <h3 className="text-lg font-semibold text-white mb-3 text-center">
                Grow a virtual plant
              </h3>
              <p className="text-white/70 text-center text-sm leading-relaxed">
                Watch your digital garden flourish as your emotional wellness grows
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-4xl mb-4 text-center">💙</div>
              <h3 className="text-lg font-semibold text-white mb-3 text-center">
                Connect with a safe community
              </h3>
              <p className="text-white/70 text-center text-sm leading-relaxed">
                Join a supportive network focused on growth and understanding
              </p>
            </div>
          </div>

          {/* Philosophy Section */}
          <div className="text-center mt-16">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 max-w-4xl mx-auto">
              <p className="text-lg text-white/90 leading-relaxed mb-8">
                We combine <strong className="text-purple-200">psychology</strong>, <strong className="text-teal-200">AI insights</strong>, and <strong className="text-pink-200">gamified motivation</strong> to help people understand themselves better and build sustainable mental wellness habits.
              </p>
              
              {/* Privacy Message */}
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="text-2xl">🔒</span>
                <h3 className="text-xl font-semibold text-white">Your Privacy Matters</h3>
              </div>
              <p className="text-white/80 leading-relaxed mb-8">
                Elmora protects every user's privacy — all personal reflections remain confidential, processed securely, and never shared. <br />
                <strong className="text-purple-200">Your growth stays yours.</strong>
              </p>

              {/* Vision */}
              <h3 className="text-2xl font-serif font-light text-white mb-4">
                <span className="bg-gradient-to-r from-pink-200 to-teal-200 bg-clip-text text-transparent">
                  Our Vision
                </span>
              </h3>
              <p className="text-lg text-white/90 leading-relaxed">
                To build a world where technology supports human emotion — with empathy, privacy, and joy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-black/20 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-2xl">🌸</span>
              <span className="text-white font-semibold text-lg">Elmora</span>
            </div>
            <p className="text-white/60 text-sm mb-4">
              Where Technology Meets Empathy 🌸
            </p>
            <div className="flex justify-center gap-8 text-sm">
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
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;